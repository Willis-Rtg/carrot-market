"use server";
import {
  PASSWORD_REGEX_ERR_MSG,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
} from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcrypt";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

const checkPassword = ({
  password,
  confirm_password,
}: {
  password: string;
  confirm_password: string;
}) => password === confirm_password;

const checkUsername = async (
  { username }: { username: string },
  ctx: z.RefinementCtx
) => {
  const user = await db.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
    },
  });
  if (user) {
    ctx.addIssue({
      code: "custom",
      message: "This username is already taken.",
      path: ["username"],
      fatal: true,
    });
    return z.NEVER;
  }
};
const checkEmail = async (
  { email }: { email: string },
  ctx: z.RefinementCtx
) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  if (user) {
    ctx.addIssue({
      code: "custom",
      message: "This email is already taken.",
      path: ["email"],
      fatal: true,
    });
    return z.NEVER;
  }
};

const dataSchema = z
  .object({
    username: z
      .string()
      .min(3, "Too short")
      .max(20, "Too long")
      .trim()
      .toLowerCase(),
    email: z.string().email().toLowerCase(),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, "Too short")
      .max(PASSWORD_MAX_LENGTH, "Too long")
      .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERR_MSG),
    confirm_password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, "Too short")
      .max(PASSWORD_MAX_LENGTH, "Too long"),
  })
  .superRefine(checkUsername)
  .superRefine(checkEmail)
  .refine(checkPassword, {
    message: "Both passwords must be the same",
    path: ["confirm_password"],
  });

export async function create_account(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  };
  const result = await dataSchema.safeParseAsync(data);

  if (!result.success) {
    return result.error.flatten();
  } else {
    const hashedpassword = bcrypt.hashSync(result.data.password, 12);

    const user = await db.user.create({
      data: {
        username: result.data.username,
        password: hashedpassword,
        email: result.data.email,
      },
      select: {
        id: true,
      },
    });
    const session = await getSession();
    session.id = user.id;
    await session.save();

    redirect("/profile");
  }
}
