"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import LoginScreen from "@/app/components/LoginScreen";

const TOPIC = "어린 시절 가장 기억에 남는 순간을 떠올려 써보세요";

type Entry = {
  id: number;
  topic: string;
  content: string;
  created_at: string;
};

// 손으로 그린 듯한 반짝임(별) 낙서
function SparkleDoodle({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 2c.6 3.8 1.8 6.2 5 7.5-3.2 1.3-4.4 3.7-5 7.5-.6-3.8-1.8-6.2-5-7.5 3.2-1.3 4.4-3.7 5-7.5z" />
    </svg>
  );
}

// 손으로 그린 듯한 물결선 낙서
function SquiggleDoodle({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M2 9c4-8 8 8 12 0s8 8 12 0 8 8 12 0 8 8 12 0 8 8 12 0" />
    </svg>
  );
}

const cardStyle =
  "rounded-[2rem] bg-white shadow-[0_25px_60px_-15px_rgba(74,55,40,0.35)]";

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  // 로그인 여부를 아직 확인 중인 동안에는 로그인 화면을 잠깐이라도 보여주지 않기 위한 상태
  const [checkingSession, setCheckingSession] = useState(true);
  const [entry, setEntry] = useState("");
  const [message, setMessage] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);

  // 현재 로그인 상태를 확인하고, 로그인/로그아웃이 일어날 때마다 최신 상태로 갱신
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCheckingSession(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const fetchEntries = async (userId: string) => {
    const { data, error } = await supabase
      .from("entries")
      .select("id, topic, content, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setEntries(data);
    }
  };

  // 로그인된 사용자가 있으면 그 사용자의 지난 글 목록을 불러옴
  useEffect(() => {
    if (session) {
      fetchEntries(session.user.id);
    }
  }, [session]);

  const handleSave = async () => {
    if (!session) return;

    const { error } = await supabase
      .from("entries")
      .insert({ topic: TOPIC, content: entry, user_id: session.user.id });

    if (error) {
      setMessage("저장에 실패했습니다. 다시 시도해주세요.");
      return;
    }

    setMessage("저장되었습니다");
    setEntry("");
    fetchEntries(session.user.id);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (checkingSession) {
    return (
      <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-[#FBF3E7] to-[#F6D9C4]" />
    );
  }

  return (
    <div className="relative flex flex-col flex-1 items-center bg-gradient-to-br from-[#FBF3E7] to-[#F6D9C4] px-6 py-16 font-sans text-[#4A3728]">
      {session && (
        <button
          onClick={handleLogout}
          className="absolute right-6 top-6 text-xs text-[#4A3728]/50 hover:text-[#4A3728]"
        >
          로그아웃
        </button>
      )}

      <div className="relative">
        <SparkleDoodle className="absolute -left-8 -top-4 h-6 w-6 -rotate-12 text-[#E8735A]" />
        <h1 className="font-serif text-4xl font-bold text-[#4A3728]">
          마음의 초고
        </h1>
        <SquiggleDoodle className="absolute -bottom-4 left-1/2 h-4 w-16 -translate-x-1/2 text-[#E8735A]" />
      </div>

      {!session ? (
        <LoginScreen />
      ) : (
        <>
          <div className={`mt-14 w-full max-w-md p-10 ${cardStyle}`}>
            <h2 className="font-serif text-xl font-bold text-[#4A3728]">
              오늘의 글쓰기 주제
            </h2>
            <p className="mt-4 text-lg leading-8 text-[#4A3728]/80">{TOPIC}</p>
          </div>

          <div className="mt-6 w-full max-w-md">
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              rows={8}
              placeholder="이곳에 글을 써보세요..."
              className="w-full resize-none rounded-[2rem] border border-[#F6D9C4] bg-white p-6 text-base leading-7 text-[#4A3728] shadow-[0_20px_45px_-15px_rgba(74,55,40,0.25)] outline-none placeholder:text-[#4A3728]/40 focus:border-[#E8735A]"
            />
            <button
              onClick={handleSave}
              className="mt-4 w-full rounded-[2rem] bg-[#E8735A] px-5 py-3 text-base font-medium text-white shadow-[0_15px_30px_-10px_rgba(232,115,90,0.6)] transition-colors hover:bg-[#df6249]"
            >
              저장하기
            </button>
            {message && (
              <p className="mt-3 text-center text-sm text-[#4A3728]/70">
                {message}
              </p>
            )}
          </div>

          <div className="relative mt-14 w-full max-w-md">
            <SparkleDoodle className="absolute -right-3 -top-6 h-5 w-5 rotate-6 text-[#E8735A]/70" />
            <h2 className="font-serif text-lg font-bold text-[#4A3728]">
              지난 글 목록
            </h2>
            {entries.length === 0 ? (
              <p className="mt-4 text-sm text-[#4A3728]/60">
                아직 작성한 글이 없어요
              </p>
            ) : (
              <ul className="mt-4 flex flex-col gap-4">
                {entries.map((item) => (
                  <li key={item.id} className={`p-5 ${cardStyle}`}>
                    <p className="text-xs text-[#4A3728]/50">
                      {new Date(item.created_at).toLocaleDateString("ko-KR")}
                    </p>
                    <p className="mt-1 text-sm font-medium text-[#4A3728]/80">
                      {item.topic}
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-base leading-7 text-[#4A3728]">
                      {item.content}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
