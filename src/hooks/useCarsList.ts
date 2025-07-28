import { useQuery } from "@tanstack/react-query";

const fetchCars = async () => {
  const api_url = import.meta.env.VITE_API_CARS_LIST;
  const response = await fetch(`${api_url}/cars/list-cars`);
  console.log(response);

  if (!response.ok) {
    throw new Error("Failed to fetch cars");
  }

  return response.json();
};

export const useCars = () => {
  return useQuery({
    queryKey: ["cars"],
    queryFn: fetchCars,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
