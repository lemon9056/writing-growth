type DigestEntry = {
  topic: string;
  content: string;
  created_at: string;
};

// 글 내용의 앞부분 50자만 미리보기로 보여줌 (줄바꿈은 공백으로 정리)
function previewContent(content: string): string {
  const cleaned = content.replace(/\s+/g, " ").trim();
  return cleaned.length > 50 ? `${cleaned.slice(0, 50)}...` : cleaned;
}

// 그 주에 쓴 글 목록을 받아서 다이제스트 이메일의 제목/본문(HTML)을 만듦
export function buildDigestEmail(entries: DigestEntry[]): {
  subject: string;
  html: string;
} {
  if (entries.length === 0) {
    return {
      subject: "이번 주는 쉬어가도 괜찮아요",
      html: `
        <p>이번 주엔 남긴 글이 없네요.</p>
        <p>바쁜 한 주를 보내셨을 수도 있죠. 다음 주엔 짧게라도 마음의 초고를 남겨보는 건 어떨까요?</p>
      `,
    };
  }

  const items = entries
    .map((entry) => {
      const date = new Date(entry.created_at).toLocaleDateString("ko-KR");
      return `<li><strong>${entry.topic}</strong> (${date})<br/>${previewContent(entry.content)}</li>`;
    })
    .join("");

  return {
    subject: `이번 주 ${entries.length}개의 글을 쓰셨어요`,
    html: `
      <p>이번 주 ${entries.length}개의 글을 쓰셨어요!</p>
      <ul>${items}</ul>
    `,
  };
}
