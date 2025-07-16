import { DataSource } from 'typeorm';
import { User } from '../users/user.entity';
import { Post } from '../posts/post.entity'; // ✅ include Post entity
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Post], // ✅ Post added here
  synchronize: false,
});

async function seedAdmin() {
  await AppDataSource.initialize();

  const userRepo = AppDataSource.getRepository(User);

  const existing = await userRepo.findOneBy({ email: 'admin@example.com' });
  if (existing) {
    console.log('⚠️ Admin already exists.');
    return;
  }

  const hashed = await bcrypt.hash('admin123', 10);
  const admin = userRepo.create({
    name: 'Super Admin',
    email: 'admin@example.com',
    password: hashed,
    role: 'admin',
    isBlocked: false,
  });

  await userRepo.save(admin);
  console.log('✅ Admin inserted successfully.');
}

seedAdmin().catch((err) => {
  console.error('❌ Error seeding admin:', err);
});
