import React from 'react';
import { X } from 'lucide-react';

const ExpandedDot = ({ dot, isExpanded, onClose }) => {
  const formattedDateTime = new Date(dot.dateTime).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div 
      className={`expanded-dot-content absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
        isExpanded ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="relative w-full h-full max-w-[90vw] p-4 flex items-center justify-center">
        <div className="relative w-full max-w-lg bg-gray-900/80 rounded-lg p-4 max-h-[80vh] flex flex-col">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-white hover:text-gray-300 transition-colors z-10"
          >
            <X size={24} />
          </button>

          {/* Author - top right */}
          <div className="absolute top-4 right-10 text-white/90 z-10">
            <p className="text-sm font-medium">{dot.author}</p>
          </div>

          {/* Main content - centered with scroll */}
          <div className="flex-grow overflow-y-auto mt-8 mb-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
            {dot.image ? (
              <div className="flex justify-center">
                <img
                  src={`${process.env.PUBLIC_URL}${dot.image}`}
                  alt={dot.message}
                  className="rounded-lg object-contain max-h-[40vh] w-auto max-w-full"
                />
              </div>
            ) : (
              <div className="px-4">
                <p className="text-xl font-medium text-left text-white break-words">
                  {dot.message.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      {index < dot.message.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
              </div>
            )}
          </div>

          {/* Footer section - date and comments */}
          <div className="mt-4 pt-2 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-white/75">
              <p className="text-sm">{formattedDateTime}</p>
              {dot.comment && (
                <div className="text-sm italic">
                  {dot.comment}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpandedDot;