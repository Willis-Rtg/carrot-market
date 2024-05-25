"use client";
import { useFormStatus } from "react-dom";

interface IBtnProps {
  text: string;
}

export default function Button({ text }: IBtnProps) {
  const { pending } = useFormStatus();
  return (
    <button
      className="primary-btn py-2 disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed"
      disabled={pending}
    >
      {pending ? "로딩 중..." : text}
    </button>
  );
}
