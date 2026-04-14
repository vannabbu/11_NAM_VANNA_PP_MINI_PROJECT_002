"use server";

import { auth } from '../../auth.js';

const getBaseUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!baseUrl) {
    throw new Error("Missing NEXT_PUBLIC_BASE_URL environment variable");
  }
  return baseUrl;
};

async function getHeaders() {
  const session = await auth();
  const token = session?.user?.payload?.token; 

  if (token) {
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`, 
    };
  }
  return { "Content-Type": "application/json" };
}

export async function fetchBestSellers() {
  const baseUrl = getBaseUrl();
  const headers = await getHeaders();

  try {
    const res = await fetch(`${baseUrl}/products/top-selling`, {
      method: "GET",
      headers, 
      next: { revalidate: 60 } 
    });

    const data = await res.json();

    if (!res.ok) {
      if (res.status === 401) {
        console.error("Auth Error: Check if this endpoint is public on your backend.");
        return [];
      }
      throw new Error(data?.message || `Error: ${res.status}`);
    }

    return data.payload || []; 
  } catch (error) {
    console.error("fetchBestSellers failed:", error);
    return []; 
  }
}

export async function fetchProducts() {
  const baseUrl = getBaseUrl();
  const headers = await getHeaders();

  try {
    const res = await fetch(`${baseUrl}/products`, {
      method: "GET",
      headers, 
      next: { revalidate: 60 } 
    });

    const data = await res.json();

    if (!res.ok) {
      if (res.status === 401) {
        console.error("Auth Error: Backend requires a token for this route.");
        return []; 
      }
      throw new Error(data?.message || `Error: ${res.status}`);
    }

    return data.payload || []; 
  } catch (error) {
    console.error("fetchProducts failed:", error);
    return []; 
  }
}