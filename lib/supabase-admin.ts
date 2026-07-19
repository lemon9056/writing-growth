import { createClient } from "@supabase/supabase-js";

// 관리자 권한(Service Role) 클라이언트. RLS를 무시하고 모든 사용자의 데이터에 접근할 수 있어서
// 주간 다이제스트 발송 같은 서버 전용 작업에서만 쓰고, 클라이언트 컴포넌트에서는 절대 import하면 안 됨
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// auth.admin.listUsers는 한 번에 최대 perPage명만 돌려주므로, 페이지를 넘기며 전체 사용자를 모음
export async function listAllUsers() {
  const users: { id: string; email?: string }[] = [];
  let page = 1;
  const perPage = 200;

  while (true) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error) throw error;

    users.push(...data.users);

    if (data.users.length < perPage) break;
    page += 1;
  }

  return users;
}
