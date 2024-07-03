import { Prisma } from "@prisma/client";
import { z } from "zod";
import { getProduct } from "../[id]/actions";

export const productSchema = z.object({
  photos: z
    .custom<File[]>()
    .refine(
      (files: File[]) => typeof files === "undefined" || !(files.length === 0),
      "Photos is reqruied."
    )
    .refine((files: File[]) => {
      if (!files) {
        return false;
      }
      const filesArr = Array.from(files);
      const excess = filesArr.filter((file) => file.size > 4 * 1024 * 1024);
      return !!excess;
    }, "4MB 미만의 사진을 올려주세요."),
  title: z
    .string({ required_error: "Title is required." })
    .refine((title) => !(title.length === 0), "Title is required."),
  price: z
    .string({ required_error: "Price is required." })
    .refine((price) => !(price.length === 0), "Price is required."),
  description: z
    .string({ required_error: "Description is required." })
    .refine(
      (description) => !(description.length === 0),
      "Description is required."
    ),
});

export type TProduct = z.infer<typeof productSchema>;

export type TPrismaProduct = Prisma.PromiseReturnType<typeof getProduct>;
