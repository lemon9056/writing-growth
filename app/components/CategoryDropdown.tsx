"use client";

import { useEffect, useRef, useState } from "react";
import { Feather, ChevronDown } from "lucide-react";

const cardStyle =
  "rounded-[14px] bg-white shadow-[0_8px_20px_-8px_rgba(74,55,40,0.25)]";

export default function CategoryDropdown({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // 드롭다운 바깥을 클릭하면 자동으로 닫히게 함
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center gap-2 px-3 py-1.5 text-xs text-[#4A3728] ${cardStyle}`}
      >
        <Feather className="h-3.5 w-3.5 text-[#E8735A]" />
        <span>{value}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-[#4A3728]/50 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <ul
          className={`absolute left-0 top-full z-10 mt-2 max-h-64 w-40 overflow-y-auto p-1 ${cardStyle}`}
        >
          {options.map((option) => (
            <li key={option}>
              <button
                type="button"
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className={`w-full rounded-lg px-3 py-1.5 text-left text-xs text-[#4A3728] hover:bg-[#F6D9C4]/40 ${
                  option === value ? "bg-[#F6D9C4]/60" : ""
                }`}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
