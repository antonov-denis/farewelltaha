import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export async function loadItems() {
  const { data, error } = await supabase.from("items").select("*");
  if (error) throw error;
  return data;
}
