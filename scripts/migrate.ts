import { config } from 'dotenv';
import connectToDatabase from '../utils/mongodb';
import User from '../models/User';
import { createClient } from '@supabase/supabase-js';

config();

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_KEY || ''
);

async function migrateUsers() {
  try {
    console.log('🚀 Starting migration...');
    
    // Connect to MongoDB
    await connectToDatabase();
    console.log('✅ Connected to MongoDB');

    // Get all users from Supabase
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*');

    if (error) {
      throw error;
    }

    console.log(`📦 Found ${profiles.length} users to migrate`);

    // Migrate each user
    for (const profile of profiles) {
      const { data: authUser } = await supabase.auth.admin.getUserById(profile.id);
      
      if (!authUser?.user) continue;

      const newUser = new User({
        email: authUser.user.email,
        userType: profile.user_type,
        fullName: profile.full_name,
        phone: profile.phone,
        avatarUrl: profile.avatar_url,
        createdAt: profile.created_at
      });

      await newUser.save();
      console.log(`✅ Migrated user: ${profile.full_name}`);
    }

    console.log('✨ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    process.exit();
  }
}

migrateUsers();