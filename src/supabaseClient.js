import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mkdzisojegscprekkegt.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzOTIwMzQ1OCwiZXhwIjoxOTU0Nzc5NDU4fQ.LB18cVC8OhXviax-2c3zRMdmEew9qy_SvKGQsMY6ces";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
