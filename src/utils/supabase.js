import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ybtcioifjurxiotuwrwr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlidGNpb2lmanVyeGlvdHV3cndyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NzYwODQsImV4cCI6MjA5MDQ1MjA4NH0.fhJ_pMJ-rj7mdZOxOQSBlusU2mVRjJRzZTBl6k5S2As';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);