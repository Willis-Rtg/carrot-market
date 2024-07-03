"use client";

import { formatToTimeAgo } from "@/lib/utils";
import {
  EyeIcon,
  HandThumbUpIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { HandThumbUpIcon as HandThumbUpOutlineIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { addComment, addOfComment, disLikePost, likePost } from "./actions";
import { useOptimistic, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { TPost } from "./schema";
import Button from "@/components/button";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/solid";
import Input from "@/components/input";
import { useForm } from "react-hook-form";

interface IPostDetailClientProps {
  post: TPost;
  likeStatus?: {
    isLiked: boolean;
    likeCount: number;
  };
}

export default function PostDetailClient({
  post,
  likeStatus,
}: IPostDetailClientProps) {
  const [likeState, reducer] = useOptimistic(
    likeStatus,
    (prevState, action: any) => {
      return {
        isLiked: !prevState?.isLiked,
        likeCount: prevState?.isLiked
          ? prevState.likeCount - 1
          : prevState?.likeCount! + 1,
      };
    }
  );
  const onLikeState = async () => {
    reducer(undefined);
    if (likeState?.isLiked) {
      await disLikePost(post!.id);
    } else {
      await likePost(post!.id);
    }
  };
  const router = useRouter();

  const commentRef = useRef<HTMLTextAreaElement>(null);
  const ofCommentRef = useRef<HTMLInputElement>(null);

  function toggleOfComment(e: any) {
    e.preventDefault();
    const ofComment = e.currentTarget.parentNode.parentNode.nextSibling;
    if (ofComment.style.display === "flex") {
      ofComment.style.display = "none";
    } else {
      ofComment.style.display = "flex";
    }
  }

  function onOfComment(e: any) {
    const ofComment = e.target.parentNode.parentNode;

    ofComment.style.display = "none";
  }

  const { register } = useForm();
  const [ofComment, setOfComment] = useState<string>("");

  return (
    <div className="p-5 flex flex-col gap-5">
      <div className="flex gap-3 items-center">
        <div className="relative size-14">
          {post?.user.avatar ? (
            <Image
              className="object-cover rounded-full"
              fill
              src={post.user.avatar!}
              alt={post.user.username}
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <div>
          <div className="font-semibold">{post?.user.username}</div>
          <div>{formatToTimeAgo(post?.created_at || new Date())}</div>
        </div>
      </div>
      <h2 className="text-4xl">{post?.title}</h2>
      <p>{post?.description}</p>
      <div className="flex items-center gap-2 text-neutral-400">
        <EyeIcon className="size-6" />
        조회수
        <span>{post?.views}</span>
      </div>
      <div
        // action={likeState?.isLiked ? disLikePost : likePost}
        className="flex justify-between items-center"
      >
        <input name="postId" type="hidden" value={post?.id} />
        <button
          className={`px-3 py-1.5 flex items-center justify-center gap-1 border-2 rounded-full border-neutral-500 ${
            likeState?.isLiked
              ? "bg-orange-500 text-white border-orange-500"
              : "hover:bg-neutral-700"
          }`}
          onClick={onLikeState}
        >
          {likeState?.isLiked ? (
            <>
              <HandThumbUpIcon className="size-10" />
              <span>{likeState?.likeCount}</span>
            </>
          ) : (
            <>
              <HandThumbUpOutlineIcon className="size-10" />
              <span>공감하기 ({likeState?.likeCount})</span>
            </>
          )}
        </button>
        <button
          className="bg-orange-500 px-4 py-3 rounded-xl"
          onClick={() => router.push(`/posts/${post?.id}/edit`)}
        >
          수정하기
        </button>
      </div>
      <form
        action={(formData) => {
          if (commentRef.current) {
            commentRef.current.value = "";
          }
          addComment(formData);
        }}
      >
        <input type="hidden" name="postId" value={post?.id} />
        <textarea
          ref={commentRef}
          name="payload"
          className="bg-neutral-900 w-full border-0 ring-1 ring-orange-500 focus:ring-2 focus:ring-orange-500"
          placeholder="댓글을 써주세요."
        />
        <Button text="작성하기" />
      </form>
      <div className="flex flex-col gap-4">
        {post?.comments.map((comment) => (
          <div key={comment.id} className="flex flex-col items-end gap-2">
            <div className="flex items-center justify-center gap-5 bg-neutral-800 p-3 rounded-xl w-full">
              <div className="flex flex-col items-center gap-1">
                {comment.user.avatar ? (
                  <div className="relative size-10">
                    <Image
                      className="rounded-full"
                      fill
                      src={comment.user.avatar}
                      alt={comment.user.username}
                    />
                  </div>
                ) : (
                  <UserIcon className="size-9" />
                )}
                <span className="text-xs">{comment.user.username}</span>
              </div>
              <p className="flex-1">{comment.payload}</p>
              <div className="flex flex-col relative items-end gap-1">
                <div className="py-3" />
                <XMarkIcon className="size-4 absolute -top-1 right-0" />
                <span className="text-sm">
                  {formatToTimeAgo(comment.created_at)}
                </span>
                <ChatBubbleLeftEllipsisIcon
                  onClick={toggleOfComment}
                  className="size-5"
                />
              </div>
            </div>
            <div className="hidden flex-col w-10/12">
              <form
                action={(formData) => {
                  addOfComment(formData);
                  setOfComment("");
                }}
                className="flex gap-2 "
              >
                <input name={"postId"} type="hidden" value={post.id} />
                <input name={"commentId"} type="hidden" value={comment.id} />
                <Input
                  {...register("ofComment")}
                  // name="ofComment"
                  ref={ofCommentRef}
                  value={ofComment}
                  onChange={(e) => {
                    e.preventDefault();
                    setOfComment(e.target.value);
                  }}
                />
                <button
                  className="bg-orange-500 px-3 py-2 rounded-lg w-1/6"
                  onClick={onOfComment}
                >
                  작성
                </button>
              </form>
            </div>
            {comment.comments.map((ofComment, index) => (
              <div
                key={index}
                className="flex items-center justify-center gap-5 bg-neutral-800 px-3 py-1 rounded-xl w-10/12"
              >
                <div className="flex flex-col items-center gap-1">
                  {ofComment.user.avatar ? (
                    <div className="relative size-10">
                      <Image
                        className="rounded-full"
                        fill
                        src={ofComment.user.avatar}
                        alt={ofComment.user.username}
                      />
                    </div>
                  ) : (
                    <UserIcon className="size-9" />
                  )}
                  <span className="text-xs">{ofComment.user.username}</span>
                </div>
                <p className="flex-1">{ofComment.payload}</p>
                <div className="flex flex-col relative items-end gap-1">
                  <div className="py-3" />
                  <XMarkIcon className="size-4 absolute -top-1 right-0" />
                  <span className="text-sm">
                    {formatToTimeAgo(ofComment.created_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
