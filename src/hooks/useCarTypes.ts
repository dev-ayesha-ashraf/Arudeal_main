import { useQuery } from "@tanstack/react-query";

const fetchTypes = async () => {
  const api_url = import.meta.env.VITE_API_CARS_LIST;
  const response = await fetch(`${api_url}/types/list-types`);
  if (!response.ok) {
    console.log(response);
    throw new Error("Failed to fetch types");
  }

  return response.json();
};

export const useTypes = () => {
  return useQuery({
    queryKey: ["types"],
    queryFn: fetchTypes,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
