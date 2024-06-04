"use client";

import { useSlide } from "@/app/hook/useSlide";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import {
  TProductDetail,
  deleteProduct,
  getCachedProduct,
  getIsOwner,
  getProduct,
} from "./actions";
import Image from "next/image";
import { UserIcon } from "@heroicons/react/24/solid";
import { formatToWon } from "@/lib/utils";
import Link from "next/link";

export function ProductInfo({ id }: { id: number }) {
  const [product, setProduct] = useState<TProductDetail>();
  const [isOwner, setIsOwner] = useState<boolean>();

  const Slide = useSlide(
    product?.photo.map((photo: { url: string }) => photo.url)!
  );

  const [_, dispatch] = useFormState<any, FormData>(deleteProduct, id);

  useEffect(() => {
    (async () => {
      const product = await getCachedProduct(id);
      setProduct(product);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setIsOwner(await getIsOwner(product?.userId!));
    })();
  }, [product]);

  return (
    <>
      <div className="relative aspect-square">
        <Slide.Wrapper>
          {product?.photo.map((photo: { url: string }, index) => (
            <div key={index} className="relative aspect-square">
              <Image key={index} fill src={photo.url} alt={product.title} />
            </div>
          ))}
        </Slide.Wrapper>
      </div>
      <div className="p-3 flex gap-5 items-center border-b border-neutral-700">
        <div className="">
          <div className="relative size-12 overflow-hidden rounded-full">
            {product?.user.avatar ? (
              <Image
                fill
                className="object-cover"
                src={product.user.avatar}
                alt={product.user.username}
              />
            ) : (
              <UserIcon />
            )}
          </div>
          <h3>{product?.user.username}</h3>
        </div>
      </div>
      <div className="p-5">
        <h1 className="text-2xl font-semibold">{product?.title}</h1>
        <p>{product?.description}</p>
      </div>
      <div className="fixed bottom-0 flex justify-between items-center max-w-screen-sm w-full bg-neutral-700 p-5 rounded-t-md">
        <span className="text-xl font-semibold">
          {formatToWon(product?.price || 0)}원
        </span>
        {isOwner ? (
          <form action={dispatch}>
            <button className="bg-red-500 px-3 py-1.5 text-white rounded-md">
              삭제하기
            </button>
          </form>
        ) : (
          <Link
            className="bg-orange-500 px-3 py-1.5 text-white rounded-md"
            href="/chat"
          >
            채팅하기
          </Link>
        )}
      </div>
    </>
  );
}
