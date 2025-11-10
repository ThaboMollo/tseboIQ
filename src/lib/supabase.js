import { createClient } from '@supabase/supabase-js'

// Supabase configuration - requires environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase configuration. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file')
  console.error('Current values:', { 
    url: supabaseUrl ? 'Set' : 'Missing', 
    key: supabaseAnonKey ? 'Set' : 'Missing' 
  })
}

// Create Supabase client with error handling
let supabaseClient = null

try {
  if (supabaseUrl && supabaseAnonKey) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storage: window.localStorage
      }
    })
    console.log('✅ Supabase client initialized successfully')
  } else {
    console.warn('⚠️ Supabase client not initialized - missing credentials')
  }
} catch (error) {
  console.error('❌ Failed to initialize Supabase client:', error)
  supabaseClient = null
}

export const supabase = supabaseClient

// Flag to check if Supabase is configured
export const isSupabaseConfigured = !!supabase

/**
 * Database schema for Supabase:
 * 
 * Table: candidates
 * - id: uuid (primary key)
 * - name: text
 * - email: text (unique)
 * - phone: text
 * - skills: text[] (array of skills)
 * - experience: integer (years)
 * - education: text
 * - cv_url: text
 * - created_at: timestamp
 * 
 * Table: employers
 * - id: uuid (primary key)
 * - company_name: text
 * - contact_email: text (unique)
 * - created_at: timestamp
 * 
 * Table: jobs
 * - id: uuid (primary key)
 * - employer_id: uuid (foreign key to employers)
 * - title: text
 * - description: text
 * - required_skills: text[] (array of skills)
 * - min_experience: integer
 * - created_at: timestamp
 * 
 * SQL to create tables:
 * 
 * CREATE TABLE candidates (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   name TEXT NOT NULL,
 *   email TEXT UNIQUE NOT NULL,
 *   phone TEXT,
 *   skills TEXT[] NOT NULL,
 *   experience INTEGER NOT NULL,
 *   education TEXT,
 *   cv_url TEXT,
 *   created_at TIMESTAMP DEFAULT NOW()
 * );
 * 
 * CREATE TABLE employers (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   company_name TEXT NOT NULL,
 *   contact_email TEXT UNIQUE NOT NULL,
 *   created_at TIMESTAMP DEFAULT NOW()
 * );
 * 
 * CREATE TABLE jobs (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   employer_id UUID REFERENCES employers(id) ON DELETE CASCADE,
 *   title TEXT NOT NULL,
 *   description TEXT NOT NULL,
 *   required_skills TEXT[] NOT NULL,
 *   min_experience INTEGER NOT NULL,
 *   created_at TIMESTAMP DEFAULT NOW()
 * );
 */
