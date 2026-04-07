import { createClient } from '@supabase/supabase-js'

// الرابط تجدينه في خانة Project URL بموقع Supabase
const supabaseUrl = 'https://etfwakdjcmuhkzensdlr.supabase.co'

// المفتاح الطويل تجدينه في خانة anon public
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0Zndha2RqY211aGt6ZW5zZGxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMjc0MTcsImV4cCI6MjA5MDkwMzQxN30.v7eJZSKO8zNYEACaAfXnasOEZQW6FyrCiMmuUpywTTo' 

export const supabase = createClient(supabaseUrl, supabaseAnonKey)