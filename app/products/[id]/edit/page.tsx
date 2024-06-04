"use client";
import Button from "@/components/button";
import Input from "@/components/input";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PhotoIcon,
} from "@heroicons/react/24/solid";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TProduct, productSchema } from "../../add/schema";
import { useSlide } from "@/app/hook/useSlide";
import { uploadProduct } from "../../add/actions";

export default function AddProduct() {
  const [previews, setPreviews] = useState<string[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);
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
  } = useForm<TProduct>({
    resolver: zodResolver(productSchema),
  });

  const dispatchIntercepter = handleSubmit((data: TProduct) => {
    console.log("hello");
    if (photos.length <= 0) {
      return;
    }
    const photosArr = Array.from(photos || []);

    const formData = new FormData();
    photosArr.forEach((photo, index) => {
      formData.append(`photo-${index}`, photo);
    });
    formData.append("title", data.title);
    formData.append("price", data.price);
    formData.append("description", data.description);

    return uploadProduct(formData);
  });

  // const [state, dispatch] = useFormState(dispatchIntercepter, null);

  const onValid = () => {
    dispatchIntercepter();
  };

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
        <Input
          {...register("title")}
          type="text"
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
        <Button text="작성 완료" />
      </form>
    </div>
  );
}
