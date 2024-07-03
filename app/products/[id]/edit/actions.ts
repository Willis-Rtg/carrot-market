"use server";

import db from "@/lib/db";
import { productUpdateSchema } from "./schema";
import fs from "fs/promises";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function updateProduct(formData: FormData) {
  console.log("update");
  const data: any = {
    id: +formData.get("id")!,
    photos: [],
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
  };

  console.log(formData);

  for (let i = 0; i < 15; i++) {
    if (formData.get(`photo-${i}`) != null) {
      data.photos = [...data.photos, formData.get(`photo-${i}`)];
    }
  }
  const validData = productUpdateSchema.safeParse(data);

  console.log(validData.data?.photos);

  if (!validData.success) {
    return validData.error.flatten();
  }

  validData.data.photos.forEach(async (photo: File | string) => {
    if (photo instanceof File) {
      const photoData = await photo.arrayBuffer();
      await fs.appendFile(`./public/${photo.name}`, Buffer.from(photoData));
    }
  });

  const session = await getSession();

  await db.photo.deleteMany({
    where: {
      productId: validData.data.id,
    },
  });

  const update = await db.product.update({
    where: {
      userId: session.id,
      id: validData.data?.id,
    },
    data: {
      title: validData.data?.title,
      price: +validData.data?.price!,
      description: validData.data?.description,
      photos: {
        create: validData.data?.photos.map((photo: any) => {
          if (photo instanceof File) {
            return {
              url: `/${photo.name}`,
            };
          } else {
            return {
              url: `${photo}`,
            };
          }
        }),
      },
    },
    select: {
      id: true,
    },
  });

  if (update) {
    revalidatePath("/home");
    revalidatePath(`/products/${update.id}`);
    redirect(`/products/${update.id}`);
  }
}
