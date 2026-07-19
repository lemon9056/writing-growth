// created_at 목록(ISO 문자열)을 받아서, 오늘부터 거꾸로 며칠 연속으로 글을 썼는지 계산
// (같은 날 여러 번 썼어도 하루로 취급)
export function calculateStreak(
  createdAtList: string[],
  today: Date = new Date()
): number {
  const toDayKey = (date: Date) =>
    `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

  const daysWithEntry = new Set(
    createdAtList.map((createdAt) => toDayKey(new Date(createdAt)))
  );

  let streak = 0;
  const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  while (daysWithEntry.has(toDayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}
