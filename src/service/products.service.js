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

export async function deleteProduct(productId) {
  // 1. Safety Check: Ensure we aren't sending "4" or an empty string
  if (!productId || productId.length < 36) {
    console.error("Invalid UUID for deletion:", productId);
    return null;
  }

  const baseUrl = getBaseUrl();
  const headers = await getHeaders();

  try {
    const res = await fetch(`${baseUrl}/products/${productId}`, {
      method: "DELETE",
      headers,
    });

    // 2. Handle Success: Spring Boot usually returns 204 (No Content) for DELETE
    if (res.status === 204 || res.ok) {
      console.log(`Product ${productId} deleted successfully.`);
      return { success: true };
    }

    // 3. Handle Errors
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({})); // Catch empty bodies
      
      if (res.status === 401) {
        console.error("Auth Error: Check if you are logged in.");
        return null;
      }
      
      throw new Error(errorData?.message || `Error: ${res.status}`);
    }

  } catch (error) {
    console.error("deleteProduct failed:", error.message);
    return null; 
  }
}

export async function createProduct(formData) {
  const baseUrl = getBaseUrl();
  const headers = await getHeaders();

  
  const payload = {
    name: formData.name,
    description: formData.description,
    imageUrl: formData.imageUrl || "https://placeholder.com/img.png",
    price: Number(formData.price), 
    categoryId: "4a0cc85d-cf4c-474b-b408-1e053eac72f8", 
    colors: Array.isArray(formData.colors) ? formData.colors : [],
    sizes: Array.isArray(formData.sizes) ? formData.sizes : []
  };

  console.log("Sending to server:", JSON.stringify(payload, null, 2));

  try {
    const res = await fetch(`${baseUrl}/products`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload), 
    });

    if (!res.ok) {
    const errorData = await res.json();
    
    
    console.error("FULL SERVER ERROR:", errorData); 
    
   
    const errorMessage = errorData.detail || errorData.message || JSON.stringify(errorData);
    throw new Error(errorMessage);
}

    const result = await res.json();
    
  
    return result;

  } catch (error) {
    console.error("createProduct failed:", error.message);
    throw error; 
  }
}