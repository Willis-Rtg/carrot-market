"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { createPost } from "./actions";
import { useFormState } from "react-dom";

export default function PostAddClinet() {
  const [state, dispatch] = useFormState(createPost, null);

  return (
    <div className="p-5 flex flex-col gap-5">
      <h2 className="text-xl">포스트 작성</h2>
      <form className="flex flex-col gap-5" action={dispatch}>
        <Input
          name="title"
          placeholder="제목"
          errors={state?.fieldErrors.title}
        />
        <textarea
          name="description"
          className="bg-neutral-900 rounded-lg border-0 ring-1 ring-white focus:ring-orange-500 focus:ring-2 transition-shadow placeholder:text-neutral-400 w-full"
          placeholder="내용"
        />
        {state?.fieldErrors.description && (
          <span>{state?.fieldErrors.description}</span>
        )}
        <Button text="작성하기" />
      </form>
    </div>
  );
}
