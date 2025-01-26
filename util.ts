import { getToken } from "./getAuth";

export const fetchDataWrapper = async (
    url: string,
    options: RequestInit = {}
  ) => {
    const isFormData = options.body instanceof FormData;
    try {
      const res = await fetch(url, {
        method: options.method || "GET",
        headers: {
          ...(isFormData ? {} : { "Content-Type": "application/json" }),
          authorization: `Bearer ${getToken()}`,
          ...options.headers,
        },
        body: options.body ?? undefined,
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Error ${errorData?.message}`);
      }
  
      return await res.json();
    } catch (error) {
      throw error;
    }
  };