"use server";
import { z } from "zod";
import validator from "validator";
import { redirect } from "next/navigation";

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, "ko-KR"),
    "Wrong phone number format."
  );

const codeSchema = z.coerce.number().min(100000).max(999999);

interface IPrevState {
  vertification_code: boolean;
  error?: {
    formErrors: string[];
  };
}

export async function smsLogin(prevState: IPrevState, smsData: FormData) {
  const phone_number = smsData.get("phone_number");
  const vertification_code = smsData.get("vertification_code");

  if (!prevState.vertification_code) {
    const phone_valided = phoneSchema.safeParse(phone_number);
    if (!phone_valided.success) {
      return {
        vertification_code: false,
        error: phone_valided.error.flatten(),
      };
    } else {
      return {
        vertification_code: true,
      };
    }
  } else {
    const code_valided = codeSchema.safeParse(vertification_code);
    if (!code_valided.success) {
      return {
        vertification_code: true,
        error: code_valided.error.flatten(),
      };
    } else {
      redirect("/");
    }
  }
}
