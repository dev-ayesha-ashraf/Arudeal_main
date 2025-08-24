import React from "react";
import { useNavigate } from "react-router-dom";

interface ListCardProps {
  id: string;
  title: string;
  price: number;
  description: string;
  image: string;
}

const ListCard: React.FC<ListCardProps> = ({ id, title, price, description, image }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/listing-detail/${id}`)}
      className="flex flex-col bg-white rounded-2xl shadow hover:shadow-lg transition border border-gray-200 group overflow-hidden cursor-pointer"
    >
      <div className="relative h-48 sm:h-56 md:h-60 lg:h-64">
        <img
          src={image || "/no-image.jpg"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute top-2 right-2 bg-yellow-400 text-black text-xs px-3 py-1 rounded-full shadow-md">
          AWG {price}
        </span>
      </div>
      <div className="flex flex-col justify-between p-4 flex-grow">
        <div>
          <h2 className="text-lg font-semibold text-black mb-1 truncate">{title}</h2>
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default ListCard;
