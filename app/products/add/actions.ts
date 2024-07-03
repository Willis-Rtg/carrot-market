"use server";

import fs from "fs/promises";
import { getSession } from "@/lib/session";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import { productSchema } from "./schema";
import { revalidatePath } from "next/cache";

export async function uploadProduct(formData: FormData) {
  const data: any = {
    photos: [],
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
  };

  for (let i = 0; i < 15; i++) {
    if (formData.get(`photo-${i}`) != null) {
      data.photos = [...data.photos, formData.get(`photo-${i}`)];
    }
  }
  console.log(data.photos);

  const validData = productSchema.safeParse(data);

  if (!validData.success) {
    return validData.error.flatten();
  }

  validData.data.photos.forEach(async (photo: File) => {
    const photoData = await photo.arrayBuffer();
    await fs.appendFile(`./public/${photo.name}`, Buffer.from(photoData));
  });

  const session = await getSession();

  if (session.id) {
    const product = await db.product.create({
      data: {
        photos: {
          createMany: {
            data: await validData.data.photos.map((photo: any) => {
              return {
                url: `/${photo.name}`,
              };
            }),
          },
        },
        title: validData.data.title,
        price: +validData.data.price,
        description: validData.data.description,
        user: {
          connect: {
            id: session.id,
          },
        },
      },
      include: {
        photos: true,
      },
    });
    if (!!product) {
      revalidatePath("/home");
      revalidatePath(`/products/${product.id}`);
      redirect(`/products/${product.id}`);
    }
  }

  // if (session.id) {
  //   const product = await db.product.create({
  //     data: {
  //       title: validData.data.title,
  //       price: +validData.data.price,
  //       description: validData.data.description,
  //       user: {
  //         connect: {
  //           id: session.id,
  //         },
  //       },
  //       photo: {
  //         createMany: {
  //           data: [
  //             {
  //               url: `/${validData.data.photos.name}`,
  //             },
  //           ],
  //         },
  //       },
  //     },
  //   });
  //   redirect(`/products/${product.id}`);
  // }
}
