import { createClient } from "@supabase/supabase-js";

// 여러 곳에서 매번 새로 만들지 않고, 앱 전체에서 이 클라이언트 하나를 공유해서 씀
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
