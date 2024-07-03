"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updatePost } from "./actions";
import { TZPost, postSchema } from "../../add/schema";
import { TPost } from "../schema";

export default function PostEditClient({ post }: { post: TPost }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<TZPost>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post?.title,
      description: post?.description || undefined,
    },
  });
  const onSubmit = handleSubmit(async (data: TZPost) => {
    const formData = new FormData();
    formData.append("id", post?.id + "");
    formData.append("title", data.title);
    formData.append("description", data.description);
    try {
      await updatePost(formData);
    } catch (e) {
      console.log(e);
    }
  });
  return (
    <div className="p-5 flex flex-col gap-5">
      <h2 className="text-xl">포스트 작성</h2>
      <form action={() => onSubmit()} className="flex flex-col gap-5">
        <Input
          {...register("title")}
          placeholder="제목"
          // errors={state?.fieldErrors.title}
        />
        <textarea
          {...register("description")}
          className="bg-neutral-900 rounded-lg border-0 ring-1 ring-white focus:ring-orange-500 focus:ring-2 transition-shadow placeholder:text-neutral-400 w-full"
          placeholder="내용"
        />
        {/* {state?.fieldErrors.description && ( */}
        {/* <span>{state?.fieldErrors.description}</span> */}
        {/* )} */}
        <Button text="작성하기" />
      </form>
    </div>
  );
}
