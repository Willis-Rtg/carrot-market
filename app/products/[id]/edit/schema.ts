import { z } from "zod";

export const productUpdateSchema = z.object({
  id: z.number({ required_error: "Id is required" }),
  photos: z
    .custom<File[] | string[]>()
    .refine((files: File[] | string[]) => {
      return !(typeof files === "undefined" || files.length === 0);
    }, "Photos is reqruied.")
    .refine((files: File[] | any[]) => {
      if (!files) {
        return false;
      }
      if (!(files[0] instanceof File)) {
        return true;
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

export type TProductUpdate = z.infer<typeof productUpdateSchema>;
