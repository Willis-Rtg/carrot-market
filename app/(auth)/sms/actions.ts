"use server";
import { z } from "zod";
import validator from "validator";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import crypto from "crypto";
import { saveSession } from "@/lib/session";
import twilio from "twilio";

async function tokenExists(token: number) {
  const exists = await db.sMSToken.findUnique({
    where: {
      token,
    },
    select: {
      id: true,
    },
  });
  return !!exists;
}

const phoneSchema = z
  .string()
  .trim()
  .transform((phone) => `+${phone}`)
  .refine(
    (phone) => validator.isMobilePhone(phone, "ko-KR"),
    "Wrong phone number format."
  );

const tokenSchema = z.coerce.number().min(100000).max(999999);
// .refine(tokenExists, "This token does not exists");

interface IPrevState {
  vertification_token: boolean;
  error?: {
    formErrors: string[];
  };
}

async function getToken() {
  const token = Number(crypto.randomInt(100000, 999999));
  const exists = await db.sMSToken.findUnique({
    where: {
      token,
    },
    select: {
      id: true,
    },
  });
  if (exists) {
    return getToken();
  } else {
    return token;
  }
}

export async function smsLogin(prevState: IPrevState, smsData: FormData) {
  const phone_number = smsData.get("phone_number");
  const vertification_token = smsData.get("vertification_token");

  const phone_valided = phoneSchema.safeParse(phone_number);
  if (!prevState.vertification_token) {
    if (!phone_valided.success) {
      return {
        vertification_token: false,
        error: phone_valided.error.flatten(),
      };
    } else {
      await db.sMSToken.deleteMany({
        where: {
          user: {
            phone: phone_valided.data,
          },
        },
      });
      const token = await getToken();
      await db.sMSToken.create({
        data: {
          token,
          user: {
            connectOrCreate: {
              where: {
                phone: phone_valided.data,
              },
              create: {
                username: crypto.randomBytes(10).toString("hex"),
                phone: phone_valided.data,
              },
            },
          },
        },
      });
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      await client.messages.create({
        body: `Your Karrot vertification token is :${token}`,
        from: process.env.TWILIO_PHONE_NUMBER!,
        // to: process.env.MY_PHONE_NUMBER!,
        to: phone_valided.data,
      });

      return {
        vertification_token: true,
      };
    }
  } else {
    const token_valided = await tokenSchema.safeParseAsync(vertification_token);
    if (!token_valided.success) {
      return {
        vertification_token: true,
        error: token_valided.error.flatten(),
      };
    } else {
      const token = await db.sMSToken.findUnique({
        where: {
          token: token_valided.data,
          user: {
            phone: phone_valided.data,
          },
        },
        select: {
          id: true,
          userId: true,
        },
      });
      if (token) {
        await saveSession({ id: token.userId });
        await db.sMSToken.delete({
          where: {
            id: token.id,
          },
        });
        redirect("/profile");
      } else {
        return {
          vertification_token: true,
          error: {
            formErrors: ["This token does not exists"],
          },
        };
      }
    }
  }
}
