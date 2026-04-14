
export default function headerToken(session) {
  const token = session?.user?.token || session?.user?.accessToken;
  
  if (!token) return {};

  return {
    "Authorization": `Bearer ${token}`, 
    "Content-Type": "application/json",
  };
}