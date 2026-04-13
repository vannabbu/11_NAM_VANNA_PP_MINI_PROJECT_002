const headerToken = (session) => {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session?.user?.token}`,
  };
};
export default headerToken;