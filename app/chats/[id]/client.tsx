"use client";

import { useEffect, useRef, useState } from "react";
import { TChatMessages, messageSchema } from "./schema";
import Image from "next/image";
import { formatToTimeAgo } from "@/lib/utils";
import { ArrowUpIcon } from "@heroicons/react/24/solid";
import { RealtimeChannel, createClient } from "@supabase/supabase-js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createMessage } from "./actions";

const SUPABASE_PUBLIC_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpdGZuZ2N5Ymd0a3Ric2N1Yml5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkwNTc1MzgsImV4cCI6MjAzNDYzMzUzOH0.PwWIQ8_5YkFE9IZtpgDtbHNMwUz6ypCnU11loDH9BK0";
const SUPABASE_URL = "https://titfngcybgtktbscubiy.supabase.co";
interface IChatRoomClientProps {
  initialMessages: TChatMessages;
  userId: number;
  chatRoomId: string;
  userProfile?: {
    username: string;
    avatar: string | null;
  } | null;
}

export default function ChatRoomClient({
  initialMessages,
  userId,
  chatRoomId,
  userProfile,
}: IChatRoomClientProps) {
  const [messages, setMessages] = useState(initialMessages);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<{ payload: string }>({ resolver: zodResolver(messageSchema) });
  const channel = useRef<RealtimeChannel>();

  async function onValid(data: { payload: string }) {
    const newMessage = {
      id: Date.now(),
      payload: data.payload,
      created_at: new Date(),
      user: {
        id: userId,
        username: userProfile!.username,
        avatar: userProfile!.avatar,
      },
    };
    setMessages((prev) => [...prev, newMessage]);
    channel.current?.send({
      type: "broadcast",
      event: "message",
      payload: {
        message: newMessage,
      },
    });
    setValue("payload", "");
    await createMessage({ payload: data.payload, chatRoomId });
  }

  useEffect(() => {
    const client = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
    channel.current = client.channel(`room-${chatRoomId}`);
    channel.current
      .on("broadcast", { event: "message" }, (payload) => {
        setMessages((prev) => [...prev, payload.payload.message]);
      })
      .subscribe();
    return () => {
      channel.current?.unsubscribe();
    };
  }, [chatRoomId]);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo({ top: ref.current?.scrollHeight });
  }, [messages]);
  return (
    <div
      ref={ref}
      className="p-5 flex flex-col gap-4 min-h-[85vh] justify-end pb-20"
    >
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-3 ${
            message.user.id === userId ? "self-end" : "self-startz"
          }`}
        >
          <div className="relative size-12">
            {message.user.id === userId ? null : (
              <Image
                fill
                className="rounded-full"
                src={message.user.avatar || ""}
                alt={message.user.username}
              />
            )}
          </div>
          <div
            className={`flex flex-col ${
              message.user.id === userId ? "items-end" : "items-start"
            }`}
          >
            <span
              className={`px-3 py-2 rounded-lg ${
                message.user.id === userId ? "bg-orange-500" : "bg-neutral-500 "
              }`}
            >
              {message.payload}
            </span>
            <span className="text-sm">
              {formatToTimeAgo(message.created_at)}
            </span>
          </div>
        </div>
      ))}
      <div className="fixed bottom-0 overflow-hidden justify-center w-full h-[9vh] bg-neutral-900 rounded-full">
        <form
          action={() => handleSubmit(onValid)()}
          // onSubmit={handleSubmit(onValid)}
          className="flex rounded-full border-0 ring-4 ring-white fixed bottom-5 w-full max-w-[590px] overflow-hidden has-[input:focus]:ring-orange-500 group"
        >
          <input
            type="text"
            className="bg-neutral-900 border-0 w-full focus:ring-0"
            {...register("payload")}
          />
          <button className="flex justify-center items-center bg-orange-500 rounded-full size-9 m-1 cursor-pointer">
            <ArrowUpIcon className="size-6 text-black group-has-[input:focus]:text-white" />
          </button>
        </form>
      </div>
    </div>
  );
}
