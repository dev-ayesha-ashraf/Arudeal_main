import React from "react";

interface BikeCardProps {
  title: string;
  price: number;
  description: string;
  image: string;
}

const BikeCard: React.FC<BikeCardProps> = ({ title, price, description, image }) => {
  return (
    <div className="h-[75%] text-yellow-400 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300 border-2 border-yellow-400 group">
      <div className="relative h-[60%]">
        <img
          src={image || "/no-image.jpg"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute top-2 right-2 bg-yellow-400 text-black text-sm px-3 py-1 rounded-full shadow-md">
          AWG {price}
        </span>
      </div>

      <div className="p-5 h-[30%]">
        <h2 className="text-2xl font-bold mb-2 transition">{title}</h2>
        <p className="text-black text-sm leading-relaxed transition">
          {description}
        </p>
        <button className="mt-4 w-full bg-yellow-400 text-black font-semibold py-2 rounded-lg hover:bg-gray-600 hover:text-white transition">
          View Bike
        </button>
      </div>
    </div>
  );
};

export default BikeCard;
