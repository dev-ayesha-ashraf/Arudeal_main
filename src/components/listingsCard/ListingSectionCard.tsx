import React from "react";
import { useNavigate } from "react-router-dom";

interface ListingSectionCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  onClick?: (productId: string, linkUrl?: string) => void; 
}

export const ListingSectionCard: React.FC<ListingSectionCardProps> = ({
  id,
  title,
  description,
  price,
  image,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/listing-detail/${id}`); 
  };

  return (
    <div
      className="bg-white shadow rounded-lg p-4 cursor-pointer hover:shadow-md transition w-[250px] h-[300px] flex flex-col justify-between"
      onClick={handleClick}
    >
      <div className="flex flex-col justify-between h-full">
        <div>
          <img
            src={image || "/no-image.jpg"}
            alt={title}
            className="w-full h-[160px] object-cover rounded"
          />
          <div className="mt-2">
            <h3 className="text-lg font-semibold truncate">{title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px]">
              {description}
            </p>
          </div>
        </div>
        <div className="mt-2 text-primary font-bold">AWG {price}</div>
      </div>
    </div>
  );
};
