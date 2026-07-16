"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const TOPIC = "어린 시절 가장 기억에 남는 순간을 떠올려 써보세요";

type Entry = {
  id: number;
  topic: string;
  content: string;
  created_at: string;
};

export default function Home() {
  const [entry, setEntry] = useState("");
  // 저장 결과를 사용자에게 보여주기 위한 상태
  const [message, setMessage] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);

  const fetchEntries = async () => {
    const { data, error } = await supabase
      .from("entries")
      .select("id, topic, content, created_at")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setEntries(data);
    }
  };

  // 페이지가 처음 열릴 때 한 번, 지난 글 목록을 불러옴
  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSave = async () => {
    const { error } = await supabase
      .from("entries")
      .insert({ topic: TOPIC, content: entry });

    if (error) {
      setMessage("저장에 실패했습니다. 다시 시도해주세요.");
      return;
    }

    setMessage("저장되었습니다");
    setEntry("");
    fetchEntries();
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-10 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          오늘의 글쓰기 주제
        </h1>
        <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          {TOPIC}
        </p>
      </div>
      <div className="mt-6 w-full max-w-md">
        <textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          rows={8}
          placeholder="이곳에 글을 써보세요..."
          className="w-full resize-none rounded-2xl border border-zinc-200 bg-white p-6 text-base leading-7 text-zinc-900 shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-600 dark:focus:border-zinc-600"
        />
        <button
          onClick={handleSave}
          className="mt-4 w-full rounded-full bg-zinc-900 px-5 py-3 text-base font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          저장하기
        </button>
        {message && (
          <p className="mt-3 text-center text-sm text-zinc-600 dark:text-zinc-400">
            {message}
          </p>
        )}
      </div>
      <div className="mt-10 w-full max-w-md">
        <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          지난 글 목록
        </h2>
        {entries.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
            아직 작성한 글이 없어요
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-3">
            {entries.map((item) => (
              <li
                key={item.id}
                className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                  {new Date(item.created_at).toLocaleDateString("ko-KR")}
                </p>
                <p className="mt-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {item.topic}
                </p>
                <p className="mt-2 whitespace-pre-wrap text-base leading-7 text-zinc-900 dark:text-zinc-50">
                  {item.content}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
