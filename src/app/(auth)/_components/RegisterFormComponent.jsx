"use client";
import { useState } from "react";
import { Button } from "@heroui/react";
import { useForm } from "react-hook-form";
import { registerService } from "@/service/auth.service.js";
import { useRouter } from "next/navigation";

export default function RegisterFormComponent() {
   const router = useRouter();
    const [submitError, setSubmitError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      birthdate: "2000-11-02",
    },
  });

  const onSubmit = async (data) => {
    
    try{
       const result = await registerService(data);
       console.log("register RESULT:", result);
       if (result) {
        router.push("/login");
      } else {
        setSubmitError("register failed");
      }

      if (!result) {
        setSubmitError("register failed");
        return;
      }
    } catch (error) {
      console.log("register ERROR:", error);
      setSubmitError(error.message || "Something went wrong");
    }
    
  
  };

  return (
    <form
      className="mt-8 space-y-5"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Full name
        </label>
        <input
          type="text"
          {...register("name")}
          placeholder="Jane Doe"
          className="mt-1.5 w-full text-black rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-2"
        />
      </div>

      {/* Email */}
      <div>
        <label className="blockfont-medium text-gray-700">Email</label>
        <input
          type="email"
          {...register("email")}
          placeholder="you@example.com"
          className="mt-1.5 w-full text-black rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-2"
        />
      </div>

      {/* Password */}
      <div>
        <label className="block  text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          {...register("password")}
          placeholder="••••••••"
          className="mt-1.5 w-full text-black rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-2"
        />
      </div>

      {/* Birthdate */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Birthdate
        </label>
        <input
          type="date"
          {...register("birthdate", { value: "2000-11-02" })}
          className="mt-1.5 w-full rounded-xl text-black border border-gray-200 bg-white px-4 py-3 text-sm outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-2"
        />
      </div>

      <Button
        type="submit"
        variant="solid"
        className="w-full rounded-full bg-lime-400 py-3.5 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-lime-300"
      >
        Create account
      </Button>
    </form>
  );
}
