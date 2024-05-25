"use server";
import {
  PASSWORD_REGEX_ERR_MSG,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
} from "@/lib/constants";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { z } from "zod";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

async function checkEmail(email: string) {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  return Boolean(user);
}

const loginSchema = z.object({
  email: z
    .string()
    .email()
    .toLowerCase()
    .refine(checkEmail, "Email is not exist"),
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH)
    .max(PASSWORD_MAX_LENGTH)
    .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERR_MSG),
});

export async function login(prevState: any, loginData: FormData) {
  // await new Promise((resolve) => setTimeout(resolve, 2000));

  const data = {
    email: loginData.get("email"),
    password: loginData.get("password"),
  };

  const result = await loginSchema.safeParseAsync(data);

  if (!result.success) {
    return result.error.flatten();
  } else {
    const user = await db.user.findUnique({
      where: {
        email: result.data.email,
      },
      select: {
        id: true,
        password: true,
      },
    });
    const ok = await bcrypt.compare(result.data.password, user?.password!);

    if (ok) {
      const session = await getSession();
      session.id = user!.id!;
      await session.save();
      redirect("/profile");
    } else {
      return {
        fieldErrors: {
          password: ["Wrong password"],
          email: [],
        },
      };
    }
  }
}
