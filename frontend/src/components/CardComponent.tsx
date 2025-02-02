import React from "react";

interface Card {
    id: string;
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    address?: string;
}

const CardComponent: React.FC<{ card: Card}> = ({ card }) => {
    return (
        <div className="bg-white shadow-lg rounded-lg p-4 mb-2 hover:bg-gray-100">
        <div className="text-xs text-gray-500">ID: {card.id}</div>
        <div className="text-lg font-semibold text-gray-800">{card.first_name} {card.last_name}</div>
        <div className="text-md text-gray-700">📧 {card.email}</div>
        <div className="text-md text-gray-700">📞 {card.phone}</div>
        {card.address && <div className="text-sm text-gray-600">🏠 {card.address}</div>}
    </div>
  );
};

export default CardComponent;