"use client";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { notFound, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Modal({ params }: { params: { id: number } }) {
  const id = Number(params.id);
  if (isNaN(id)) {
    notFound();
  }
  const router = useRouter();
  const onClose = () => {
    router.back();
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "scroll";
    };
  }, []);

  return (
    <div
      className="absolute w-full h-full bg-black bg-opacity-60 left-0 flex justify-center items-center z-50"
      style={{ top: `${window.scrollY}px` }}
    >
      <button onClick={onClose} className="absolute right-5 top-5">
        <XMarkIcon className="size-12" />
      </button>
      <div className="max-w-screen-sm w-full h-1/2 flex justify-center items-center">
        <div className="flex justify-center items-center rounded-md aspect-square text-neutral-200 bg-neutral-700 w-full">
          <PhotoIcon className="h-28" />
        </div>
      </div>
    </div>
  );
}
