"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "./admin.css";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  isBlocked: boolean;
  lastSeen: string | null;
}

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserPosts, setSelectedUserPosts] = useState<Post[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [postsLoading, setPostsLoading] = useState(false);

  const token = Cookies.get("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/users/admin/all", {
        headers,
      });
      setUsers(res.data);
    } catch {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const toggleBlockStatus = async (id: string) => {
    if (!confirm("Are you sure you want to change this user's block status?"))
      return;

    setActionLoading(`block-${id}`);
    try {
      await axios.patch(
        `http://localhost:5000/api/users/${id}/block`,
        {},
        { headers }
      );
      fetchUsers();
    } catch {
      setError("Failed to toggle block status");
    } finally {
      setActionLoading(null);
    }
  };

  const deleteUser = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    )
      return;

    setActionLoading(`delete-${id}`);
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, { headers });
      fetchUsers();
    } catch {
      setError("Failed to delete user");
    } finally {
      setActionLoading(null);
    }
  };

  const viewPosts = async (user: User) => {
    setSelectedUser(user);
    setPostsLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/posts/admin/user/${user.id}`,
        { headers }
      );
      setSelectedUserPosts(res.data);
    } catch {
      setError("Failed to load posts");
    } finally {
      setPostsLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedUser(null);
    setSelectedUserPosts([]);
    setError("");
  };

  const handleLogout = () => {
    Cookies.remove("token");
    window.location.href = "/login";
  };

  const clearError = () => {
    setError("");
  };

  return (
    <div className="admin-container">
      <div className="background-decoration">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <div className="admin-content">
        <header className="admin-header">
          <div className="header-content">
            <div className="header-icon">👑</div>
            <div className="header-text">
              <h1 className="admin-title">Admin Panel</h1>
              <p className="admin-subtitle">
                Manage users and monitor activity
              </p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <span className="logout-icon">🚪</span>
            Logout
          </button>
        </header>

        {error && (
          <div className="error-banner">
            <div className="error-content">
              <span className="error-icon">⚠️</span>
              <span className="error-text">{error}</span>
              <button className="error-close" onClick={clearError}>
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <div className="stat-number">{users.length}</div>
              <div className="stat-label">Total Users</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <div className="stat-number">
                {users.filter((u) => !u.isBlocked).length}
              </div>
              <div className="stat-label">Active Users</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">❌</div>
            <div className="stat-info">
              <div className="stat-number">
                {users.filter((u) => u.isBlocked).length}
              </div>
              <div className="stat-label">Blocked Users</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🟢</div>
            <div className="stat-info">
              <div className="stat-number">
                {users.filter((u) => !u.lastSeen).length}
              </div>
              <div className="stat-label">Online Now</div>
            </div>
          </div>
        </div>

        <div className="users-section">
          <div className="section-header">
            <h2>
              <span className="section-icon">👥</span>
              User Management
            </h2>
          </div>

          {loading ? (
            <div className="loading-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="user-card-skeleton">
                  <div className="skeleton-header"></div>
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line short"></div>
                  <div className="skeleton-actions"></div>
                </div>
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h3>No users found</h3>
              <p>There are no users in the system yet.</p>
            </div>
          ) : (
            <div className="users-grid">
              {users.map((user, index) => (
                <div
                  key={user.id}
                  className="user-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="user-header">
                    <div className="user-avatar">
                      {user.role === "admin" ? "👑" : "👤"}
                    </div>
                    <div className="user-info">
                      <h3 className="user-name">{user.name}</h3>
                      <p className="user-email">{user.email}</p>
                    </div>
                    <div className="user-status">
                      <span
                        className={`status-badge ${
                          user.isBlocked ? "blocked" : "active"
                        }`}
                      >
                        {user.isBlocked ? "❌ Blocked" : "✅ Active"}
                      </span>
                    </div>
                  </div>

                  <div className="user-details">
                    <div className="detail-item">
                      <span className="detail-icon">🏷️</span>
                      <span className="detail-label">Role:</span>
                      <span className={`role-badge ${user.role}`}>
                        {user.role}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">🌐</span>
                      <span className="detail-label">Status:</span>
                      <span
                        className={`online-status ${
                          user.lastSeen ? "offline" : "online"
                        }`}
                      >
                        {user.lastSeen ? "🔴 Offline" : "🟢 Online"}
                      </span>
                    </div>
                  </div>

                  <div className="user-actions">
                    <button
                      className={`action-btn ${
                        user.isBlocked ? "unblock" : "block"
                      }`}
                      onClick={() => toggleBlockStatus(user.id)}
                      disabled={actionLoading === `block-${user.id}`}
                    >
                      {actionLoading === `block-${user.id}` ? (
                        <>
                          <span className="loading-spinner small"></span>
                          {user.isBlocked ? "Unblocking..." : "Blocking..."}
                        </>
                      ) : (
                        <>
                          <span className="btn-icon">
                            {user.isBlocked ? "🔓" : "🔒"}
                          </span>
                          {user.isBlocked ? "Unblock" : "Block"}
                        </>
                      )}
                    </button>

                    <button
                      className="action-btn view"
                      onClick={() => viewPosts(user)}
                    >
                      <span className="btn-icon">📄</span>
                      View Posts
                    </button>

                    <button
                      className="action-btn delete"
                      onClick={() => deleteUser(user.id)}
                      disabled={actionLoading === `delete-${user.id}`}
                    >
                      {actionLoading === `delete-${user.id}` ? (
                        <>
                          <span className="loading-spinner small"></span>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <span className="btn-icon">🗑️</span>
                          Delete
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal for user posts */}
        {selectedUser && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title">
                  <span className="modal-icon">📚</span>
                  <div>
                    <h2>Posts by {selectedUser.name}</h2>
                    <p className="modal-subtitle">{selectedUser.email}</p>
                  </div>
                </div>
                <button className="modal-close" onClick={closeModal}>
                  ✕
                </button>
              </div>

              <div className="modal-body">
                {postsLoading ? (
                  <div className="posts-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading posts...</p>
                  </div>
                ) : selectedUserPosts.length === 0 ? (
                  <div className="empty-posts">
                    <div className="empty-icon">📝</div>
                    <h3>No posts yet</h3>
                    <p>This user hasn't created any posts.</p>
                  </div>
                ) : (
                  <div className="posts-list">
                    {selectedUserPosts.map((post, index) => (
                      <div
                        key={post.id}
                        className="post-item"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="post-header">
                          <h4 className="post-title">{post.title}</h4>
                          <div className="post-date">
                            <span className="date-icon">🕒</span>
                            {new Date(post.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </div>
                        </div>
                        <div className="post-content">
                          <p>{post.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
