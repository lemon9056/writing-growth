import { Resend } from "resend";
import { supabaseAdmin, listAllUsers } from "@/lib/supabase-admin";
import { buildDigestEmail } from "@/lib/weekly-digest";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function GET(request: Request) {
  // Vercel Cron이 요청을 보낼 때 CRON_SECRET을 Authorization 헤더로 함께 보내줌.
  // 이 값이 없거나 다르면 외부에서 임의로 호출한 것으로 보고 거부함
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const users = await listAllUsers();

  for (const user of users) {
    if (!user.email) continue;

    const { data: entries } = await supabaseAdmin
      .from("entries")
      .select("topic, content, created_at")
      .eq("user_id", user.id)
      .gte("created_at", sevenDaysAgo.toISOString())
      .order("created_at", { ascending: true });

    const { subject, html } = buildDigestEmail(entries ?? []);

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: user.email,
      subject,
      html,
    });
  }

  return Response.json({ ok: true, sentTo: users.length });
}
