"use client";
import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSlide } from "@/app/hook/useSlide";
import { TProductDetail, getProduct } from "../actions";
import { notFound } from "next/navigation";
import { TProductUpdate, productUpdateSchema } from "./schema";
import { updateProduct } from "./actions";

export default function AddProduct({ params }: { params: { id: number } }) {
  if (isNaN(Number(params.id))) {
    return notFound();
  }
  const [product, setProduct] = useState<TProductDetail>();
  const [previews, setPreviews] = useState<string[]>([]);
  const [photos, setPhotos] = useState<File[] | string[]>([]);
  const onChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    console.log(files);
    if (!files?.length) {
      return;
    }
    const photoArr = Array.from(files);
    setPreviews([]);

    photoArr.forEach((file) => {
      if (file.size > 4 * 1024 * 1024) {
        alert("4MB 미만의 사진을 올려주세요.");
        return (event.target.value = "");
      }
      const url = URL.createObjectURL(file);

      setPreviews((prev) => [...prev, url]);
    });
    setPhotos(photoArr);
    setValue("photos", photoArr);
  };

  const Slide = useSlide(previews);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TProductUpdate>({
    resolver: zodResolver(productUpdateSchema),
    defaultValues: async () => {
      const product = await getProduct(Number(params.id));
      return {
        id: +product?.id!,
        title: product?.title!,
        price: product?.price! + "",
        description: product?.description!,
        photos: product?.photos.map((photo) => photo.url)!,
      };
    },
  });

  const dispatchIntercepter = handleSubmit((data: TProductUpdate) => {
    if (photos.length <= 0) {
      return;
    }
    const formData = new FormData();
    photos.forEach((photo, index) => {
      formData.append(`photo-${index}`, photo);
    });

    formData.append("id", data.id + "");
    formData.append("title", data.title);
    formData.append("price", data.price);
    formData.append("description", data.description);

    console.log(errors);
    return updateProduct(formData);
  });

  // const [state, dispatch] = useFormState(dispatchIntercepter, null);

  const onValid = () => {
    dispatchIntercepter();
  };

  useEffect(() => {
    (async () => {
      setProduct(await getProduct(+params.id));
    })();
  }, []);

  useEffect(() => {
    if (product) {
      (async () => {
        setPreviews(product!.photos.map((photo) => photo.url));
        setPhotos(product.photos.map((photo) => photo.url));
      })();
    }
  }, [product]);

  return (
    <div>
      <form
        action={onValid}
        // onSubmit={handleSubmit(onValid)}
        className="flex flex-col gap-5 p-5"
      >
        <label
          htmlFor="photos"
          className="relative aspect-square border-neutral-300 border-dashed flex flex-col justify-center items-center cursor-pointer rounded-md"
          style={{
            borderWidth: previews.length === 0 ? "2px" : 0,
          }}
        >
          {previews.length === 0 ? (
            <>
              <PhotoIcon className="w-20" />
              <span className="text-neutral-400 text-sm">
                사진을 추가해주세요.
              </span>
            </>
          ) : (
            <>
              <Slide.Wrapper>
                {previews.map((preview, index) => (
                  <div key={index} className="relative aspect-square">
                    <Image className="object-cover" fill src={preview} alt="" />
                  </div>
                ))}
              </Slide.Wrapper>
            </>
          )}
          {errors.photos?.message && (
            <span className="text-red-500">{errors.photos?.message}</span>
          )}
        </label>
        <input
          id="photos"
          className="hidden"
          name="photos"
          type="file"
          onChange={onChangeImage}
          multiple
        />
        <input type="hidden" />
        <Input
          {...register("title")}
          type="text"
          onChange={(e) => e.target.value}
          placeholder="제목"
          errors={[errors.title?.message || ""]}
        />
        <Input
          {...register("price")}
          type="number"
          placeholder="가격"
          errors={[errors.price?.message || ""]}
        />
        <Input
          {...register("description")}
          type="text"
          placeholder="자세한 설명"
          errors={[errors.description?.message || ""]}
        />
        <Button text="수정 완료" />
      </form>
    </div>
  );
}
