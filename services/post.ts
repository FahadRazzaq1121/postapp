const baseURL = import.meta.env.VITE_API_KEY;
import { getToken } from "../getAuth";
const fetchPosts = async (page: number, limit: number, search?: string) => {
  const response = await fetch(
    `${baseURL}/post?page=${page}&limit=${limit}&search=${search}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      cache: "no-cache",
    }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error fetching profiles");
  }

  return await response.json();
};

export { fetchPosts };
