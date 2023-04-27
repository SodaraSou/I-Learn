import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qgptupsnsftwpeqzarpr.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFncHR1cHNuc2Z0d3BlcXphcnByIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzQzMTQ0ODcsImV4cCI6MTk4OTg5MDQ4N30.w5ErqrSQvdVy9FrPNz1KM_lsOHzkxbeXLAQSmi0Mha8";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
