import React from 'react';
import { X } from 'lucide-react';

const ExpandedDot = ({ dot, isExpanded, onClose }) => {
  return (
    <div 
      className={`expanded-dot-content absolute inset-0 p-16 overflow-auto flex flex-col items-center justify-center text-center transition-opacity duration-300 ${
        isExpanded ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <button
        onClick={onClose}
        className="close-button absolute top-8 right-8 text-white hover:text-gray-300"
      >
        <X size={24} />
      </button>
      <div className="text-white max-w-2xl">
        <h2 className="text-3xl font-bold mb-4">{dot.dateTime} {dot.author}</h2>
        {dot.image && (
          <div className="mb-4">
            <img
              src={dot.image}
              alt={dot.message}
              className="max-w-full max-h-[50vh] rounded-lg object-contain mx-auto"
            />
          </div>
        )}
        <p className="text-xl">{dot.message}</p>
      </div>
    </div>
  );
};

export default ExpandedDot;