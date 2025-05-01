import { db } from '../db';
import { users } from '@shared/schema';
import bcrypt from 'bcryptjs';
import connectToDatabase from '../lib/mongodb';
import { eq } from 'drizzle-orm';
import { log } from '../vite';

interface AdminUserOptions {
  username?: string;
  password?: string;
}

/**
 * Script to create an admin user in both PostgreSQL and MongoDB
 * 
 * @param {AdminUserOptions} options Optional parameters
 * @returns {Promise<{success: boolean, username: string, error?: any}>}
 */
async function createAdminUser(options: AdminUserOptions = {}) {
  const username = options.username || 'tarun';
  const password = options.password || 'Tarunlove@1998';
  const isAdmin = true;

  try {
    console.log('Starting admin user creation...');

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 1. Create user in PostgreSQL with Drizzle
    console.log('Creating user in PostgreSQL...');
    try {
      const existingUser = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.username, username)
      });

      if (existingUser) {
        console.log('User already exists in PostgreSQL, updating admin status');
        await db
          .update(users)
          .set({ isAdmin: true })
          .where(eq(users.username, username));
      } else {
        console.log('Inserting new admin user in PostgreSQL');
        await db.insert(users).values({
          username,
          password: hashedPassword,
          isAdmin
        });
      }
      console.log('PostgreSQL user created/updated successfully');
    } catch (pgError) {
      console.error('Error with PostgreSQL:', pgError);
    }

    // 2. Create user in MongoDB
    console.log('Creating user in MongoDB...');
    try {
      // Connect to MongoDB
      const conn = await connectToDatabase();
      if (!conn) {
        throw new Error('Failed to connect to MongoDB');
      }

      // Get the database and collection
      const mongoDb = conn.db();
      if (!mongoDb) {
        throw new Error('Failed to get MongoDB database');
      }
      
      const userCollection = mongoDb.collection('users');

      // Check if user already exists
      const existingMongoUser = await userCollection.findOne({ username });

      if (existingMongoUser) {
        console.log('User already exists in MongoDB, updating admin status');
        await userCollection.updateOne(
          { username },
          { $set: { isAdmin, password: hashedPassword } }
        );
      } else {
        console.log('Inserting new admin user in MongoDB');
        await userCollection.insertOne({
          username,
          password: hashedPassword,
          isAdmin,
          createdAt: new Date()
        });
      }
      console.log('MongoDB user created/updated successfully');
    } catch (mongoError) {
      console.error('Error with MongoDB:', mongoError);
    }

    console.log('Admin user creation process completed');
    return { success: true, username };
  } catch (error) {
    console.error('Error creating admin user:', error);
    return { success: false, error };
  }
}

// Execute if this file is run directly
if (require.main === module) {
  createAdminUser()
    .then((result) => {
      console.log('Result:', result);
      process.exit(0);
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

// Export for use in other files
export default createAdminUser;