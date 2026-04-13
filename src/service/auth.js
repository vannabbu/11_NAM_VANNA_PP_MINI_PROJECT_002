"use server"

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