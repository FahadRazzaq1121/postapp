const BASE_URL = `http://localhost:8000/api/post`;
import {getToken} from "../getAuth"
const fetchPosts = async (
  page: number,
  limit: number,
  search?: string
) => {
  const response = await fetch(
    `${BASE_URL}?page=${page}&limit=${limit}&search=${search}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      cache: 'no-cache'
    }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error fetching profiles');
  }

  return await response.json();
};

export {  fetchPosts };
