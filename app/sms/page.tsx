"use client";
import Button from "@/components/button";
import Input from "@/components/input";
import { useFormState } from "react-dom";
import { smsLogin } from "./actions";

const initialState = {
  vertification_code: false,
  error: undefined,
};

export default function SMSLogin() {
  const [state, dispatch] = useFormState(smsLogin, initialState);

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS Login</h1>
        <h2 className="text-xl">Verfiy youe phone number</h2>
      </div>
      <form className="flex flex-col gap-3" action={dispatch}>
        {!state?.vertification_code ? (
          <Input
            key="phone_number"
            name="phone_number"
            type="number"
            placeholder="Phone number"
            required
            errors={state?.error?.formErrors}
          />
        ) : (
          <Input
            key="vertification_code"
            name="vertification_code"
            type="number"
            placeholder="Vertification code"
            required
            errors={state?.error?.formErrors}
            min={100000}
            max={999999}
          />
        )}
        <Button
          text={state.vertification_code ? "Verify" : "Send vertification SMS"}
        />
      </form>
    </div>
  );
}
