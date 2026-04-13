
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

