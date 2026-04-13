"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { useForm } from "react-hook-form";
import { loginService } from "../../../service/auth.service";
import { useRouter } from "next/navigation";

export default function LoginFormComponent() {
  const [submitError, setSubmitError] = useState("");

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {

    try {
      setSubmitError("");

      const result = await loginService(data);
      console.log("LOGIN RESULT:", result);
      if (result) {
        router.push("/");
      } else {
        setSubmitError("Login failed");
      }

      if (!result) {
        setSubmitError("Login failed");
        return;
      }
    } catch (error) {
      console.log("LOGIN ERROR:", error);
      setSubmitError(error.message || "Something went wrong");
    }
  };

  
  return (
    <form
      className="mt-8 space-y-5"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <input
        id="login-email"
        type="email"
        autoComplete="email"
        {...register("email", { required: "Email is required" })}
        className="mt-1.5 w-full text-black rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none"
        placeholder="you@example.com"
      />

      <input
        id="login-password"
        type="password"
        autoComplete="current-password"
        {...register("password", { required: "Password is required" })}
        className="mt-1.5 w-full text-black rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none"
        placeholder="••••••••"
      />
      <button
        type="submit"
        className="w-full cursor-pointer rounded-full bg-lime-400 py-3.5 text-sm font-semibold text-gray-900"
      >
        Sign in
      </button>
    </form>
  );
}