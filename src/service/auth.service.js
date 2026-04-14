
"use server"
export async function loginService(req) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!baseUrl) {
    throw new Error("Missing NEXT_PUBLIC_BASE_URL environment variable");
  }

  const user = {
    email: req.email,
    password: req.password,
  };
  try {
    const res = await fetch(`${baseUrl}/auths/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const data = await res.json();
    console.log("login response", data);

    if (!res.ok) {
      const errorMessage = data?.message || data?.error || `HTTP ${res.status}`;
      throw new Error(errorMessage);
    }

    if (data?.error === "unauthorized") {
      throw new Error("User does not exist!");
    }
    return data;
  } catch (error) {
    console.log("loginService error", error);
    throw error;
  }
}


export async function registerService(data) {
 
  const fullName = data.name || ""; 
  const email = data.email;
  const password = data.password;
  const birthdate = data.birthdate;


  const nameParts = fullName.trim().split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "User";

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auths/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        firstName, 
        lastName, 
        email, 
        password, 
        birthDate: birthdate
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      return { error: result.message || "Registration failed" };
    }

    return { success: true };
  } catch (err) {
    return { error: "Connection to server failed" };
  }
}
