'use client'

import { Button } from "@heroui/react";
import React from "react";
import { useCart } from "../app/cart-context";

export default function ButtonAddComponent({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <Button
      isIconOnly
      aria-label="Add to cart"
      className={`size-11 rounded-full bg-lime-400 text-xl font-light text-gray-900 shadow-sm transition hover:bg-lime-300 active:scale-95}`}
      onClick={handleAddToCart}
    >
      +
    </Button>
  );
}
