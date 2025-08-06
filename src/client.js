import { createClient } from "@supabase/supabase-js";

const URL = import.meta.env.VITE_SUPABASE_URL;
const API_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);

export const supabase = createClient(URL, API_KEY);
