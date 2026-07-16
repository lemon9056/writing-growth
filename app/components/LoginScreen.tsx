"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSendLink = async () => {
    // 이메일로 매직 링크를 보내고, 사용자가 그 링크를 눌러 접속하면 로그인 처리됨
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });

    if (error) {
      setMessage("링크 전송에 실패했습니다. 다시 시도해주세요.");
      return;
    }

    setMessage("메일함을 확인해주세요");
  };

  return (
    <div className="mt-14 w-full max-w-md rounded-[2rem] bg-white p-10 shadow-[0_25px_60px_-15px_rgba(74,55,40,0.35)]">
      <h2 className="font-serif text-xl font-bold text-[#4A3728]">로그인</h2>
      <p className="mt-2 text-sm text-[#4A3728]/70">
        이메일로 로그인 링크를 보내드릴게요
      </p>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="mt-6 w-full rounded-2xl border border-[#F6D9C4] bg-white px-5 py-3 text-base text-[#4A3728] outline-none placeholder:text-[#4A3728]/40 focus:border-[#E8735A]"
      />
      <button
        onClick={handleSendLink}
        className="mt-4 w-full rounded-2xl bg-[#E8735A] px-5 py-3 text-base font-medium text-white transition-colors hover:bg-[#df6249]"
      >
        로그인 링크 받기
      </button>
      {message && (
        <p className="mt-3 text-center text-sm text-[#4A3728]/70">
          {message}
        </p>
      )}
    </div>
  );
}
