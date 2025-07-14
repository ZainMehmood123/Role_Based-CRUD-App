"use client";

import type React from "react";

import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "./dashboard.css";

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const token = Cookies.get("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/posts/me", {
        headers,
      });
      setPosts(res.data);
    } catch (err) {
      setError("Failed to fetch posts");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!title || !content) {
      setError("Title and content are required.");
      setLoading(false);
      return;
    }

    try {
      if (editingPostId) {
        await axios.patch(
          `http://localhost:5000/api/posts/${editingPostId}`,
          { title, content },
          { headers }
        );
      } else {
        await axios.post(
          "http://localhost:5000/api/posts",
          { title, content },
          { headers }
        );
      }
      setTitle("");
      setContent("");
      setEditingPostId(null);
      fetchPosts();
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPostId(post.id);
    setTitle(post.title);
    setContent(post.content);
    // Scroll to form
    document
      .querySelector(".post-form")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    setDeleteLoading(id);
    try {
      await axios.delete(`http://localhost:5000/api/posts/${id}`, { headers });
      fetchPosts();
    } catch (err) {
      setError("Failed to delete post");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
    setTitle("");
    setContent("");
    setError("");
  };

  const handleLogout = () => {
    Cookies.remove("token");
    window.location.href = "/login";
  };

  return (
    <div className="dashboard-container">
      <div className="background-decoration">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <div className="dashboard-content">
        <header className="dashboard-header">
          <div className="header-content">
            <div className="header-icon">📝</div>
            <h1 className="dashboard-title">My Posts</h1>
            <p className="dashboard-subtitle">Create and manage your posts</p>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <span className="logout-icon">🚪</span>
            Logout
          </button>
        </header>

        <div className="form-card">
          <div className="form-header">
            <h2>
              {editingPostId ? (
                <>
                  <span className="form-icon">✏️</span>
                  Edit Post
                </>
              ) : (
                <>
                  <span className="form-icon">➕</span>
                  Create New Post
                </>
              )}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="post-form">
            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <div className="input-group">
              <div className="input-wrapper">
                <span className="input-icon">📄</span>
                <input
                  type="text"
                  placeholder="Enter post title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div className="input-group">
              <div className="input-wrapper">
                <span className="textarea-icon">📝</span>
                <textarea
                  placeholder="Write your post content..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="form-textarea"
                  rows={4}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    {editingPostId ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    {editingPostId ? (
                      <>
                        <span className="btn-icon">💾</span>
                        Update Post
                      </>
                    ) : (
                      <>
                        <span className="btn-icon">🚀</span>
                        Create Post
                      </>
                    )}
                  </>
                )}
              </button>

              {editingPostId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="cancel-btn"
                >
                  <span className="btn-icon">❌</span>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="posts-section">
          <div className="posts-header">
            <h2>
              <span className="section-icon">📚</span>
              Your Posts ({posts.length})
            </h2>
          </div>

          {posts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>No posts yet</h3>
              <p>Create your first post to get started!</p>
            </div>
          ) : (
            <div className="posts-grid">
              {posts.map((post, index) => (
                <div
                  key={post.id}
                  className="post-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="post-header">
                    <h3 className="post-title">{post.title}</h3>
                    <div className="post-date">
                      <span className="date-icon">🕒</span>
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>

                  <div className="post-content">
                    <p>{post.content}</p>
                  </div>

                  <div className="post-actions">
                    <button
                      onClick={() => handleEdit(post)}
                      className="edit-btn"
                      disabled={editingPostId === post.id}
                    >
                      <span className="btn-icon">✏️</span>
                      {editingPostId === post.id ? "Editing..." : "Edit"}
                    </button>

                    <button
                      onClick={() => handleDelete(post.id)}
                      className="delete-btn"
                      disabled={deleteLoading === post.id}
                    >
                      {deleteLoading === post.id ? (
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
      </div>
    </div>
  );
}
