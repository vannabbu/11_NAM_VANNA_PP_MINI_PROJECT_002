"use client";

import { HeroUIProvider } from "@heroui/react";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { CartProvider } from "./cart-context";

export default function Provider({ children }) {
  return (
    <SessionProvider>
      <CartProvider>
        <HeroUIProvider>{children}</HeroUIProvider>
      </CartProvider>
    </SessionProvider>
  );
}
