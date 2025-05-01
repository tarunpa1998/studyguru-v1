import bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB connection string
const uri = process.env.DATABASE_URL;

async function createAdminUser() {
  // Admin user credentials
  const adminCredentials = {
    username: 'admin',
    password: 'admin123', // Will be hashed
    isAdmin: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  adminCredentials.password = await bcrypt.hash(adminCredentials.password, salt);

  console.log('Connecting to MongoDB...');
  
  // Connect to MongoDB
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const database = client.db();
    const users = database.collection('users');
    
    // Check if admin user already exists
    const existingUser = await users.findOne({ username: adminCredentials.username });
    
    if (existingUser) {
      console.log('Admin user already exists. Updating to ensure admin privileges...');
      await users.updateOne(
        { username: adminCredentials.username },
        { $set: { isAdmin: true } }
      );
      console.log('Admin user updated successfully');
    } else {
      // Create new admin user
      const result = await users.insertOne(adminCredentials);
      console.log(`Admin user created with ID: ${result.insertedId}`);
    }
    
    console.log('\nAdmin Login Credentials:');
    console.log('Username:', adminCredentials.username);
    console.log('Password: admin123'); // Show the original password
    console.log('\nYou can now login to the admin dashboard with these credentials.\n');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Execute the function
createAdminUser();