import React, { useState, useEffect, useRef } from 'react';
import { Lock, X } from 'lucide-react';

const InteractiveDots = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dots, setDots] = useState([]);
  const [selectedDot, setSelectedDot] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchDots = async () => {
      try {
        const response = await fetch('/static/data.json');
        const data = await response.json();
        const newDots = data.map(dot => ({
          ...dot,
          x: Math.random() * 90 + 5,
          y: Math.random() * 90 + 5,
          color: getRandomColor()
        }));
        setDots(newDots);
      } catch (error) {
        console.error('Error fetching dot data:', error);
      }
    };

    fetchDots();
  }, []);

  useEffect(() => {
    if (selectedDot) {
      const timer = setTimeout(() => setIsExpanded(true), 500);
      return () => clearTimeout(timer);
    } else {
      setIsExpanded(false);
    }
  }, [selectedDot]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only handle clicks if a dot is selected
      if (!selectedDot) return;

      // Check if the click target is within any dot
      const isClickInsideDot = event.target.closest('.dot');
      // Check if the click target is within the expanded dot content
      const isClickInsideContent = event.target.closest('.expanded-dot-content');
      // Check if the click is on the close button
      const isClickOnCloseButton = event.target.closest('.close-button');

      // If clicking outside everything (not on a dot and not on expanded content),
      // close the expanded dot
      if (!isClickInsideDot && !isClickInsideContent && !isClickOnCloseButton) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedDot]);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === 'dogbless') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  const handleDotClick = (dot, event) => {
    event.stopPropagation();
    
    if (selectedDot && selectedDot.id !== dot.id) {
      // If clicking a different dot while one is expanded,
      // smoothly transition to the new dot
      setIsExpanded(false);
      setTimeout(() => {
        setSelectedDot(dot);
      }, 300);
    } else if (!selectedDot) {
      // If no dot is currently selected, expand the clicked dot
      setSelectedDot(dot);
    }
  };

  const handleClose = () => {
    setIsExpanded(false);
    setTimeout(() => setSelectedDot(null), 300);
  };

  const getRandomColor = () => {
    return `hsl(${Math.random() * 360}, 100%, 75%)`;
  };

  const renderExpandedContent = (dot) => {
    return (
      <div 
        className={`expanded-dot-content absolute inset-0 p-16 overflow-auto flex flex-col items-center justify-center text-center transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}
      >
        <button
          onClick={handleClose}
          className="close-button absolute top-8 right-8 text-white hover:text-gray-300"
        >
          <X size={24} />
        </button>
        <div className="text-white max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">{dot.dateTime} {dot.author}</h2>
          {dot.image ? (
            <div className="mb-4">
              <img
                src={dot.image}
                alt={dot.message}
                className="max-w-full max-h-[50vh] rounded-lg object-contain mx-auto"
              />
            </div>
          ) : null}
          <p className="text-xl">{dot.message}</p>
        </div>
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <form onSubmit={handlePasswordSubmit} className="bg-white p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <Lock className="mr-2" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="border p-2 rounded"
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Submit
          </button>
        </form>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative h-screen bg-black overflow-hidden">
      {dots.map((dot) => {
        const isSelected = selectedDot && selectedDot.id === dot.id;
        return (
          <div
            key={dot.id}
            className={`dot expanded-dot-content absolute rounded-full cursor-pointer transform transition-all duration-500 ease-in-out ${
              isSelected
                ? 'w-[90vmin] h-[90vmin] cursor-default'
                : 'w-12 h-12 hover:scale-125 hover:z-10'
            }`}
            style={{
              left: isSelected
                ? 'calc(50% - 45vmin)'
                : `calc(${dot.x}% - 1.5rem)`,
              top: isSelected
                ? 'calc(50% - 45vmin)'
                : `calc(${dot.y}% - 1.5rem)`,
              backgroundColor: dot.color,
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
              zIndex: isSelected ? 50 : 'auto'
            }}
            onClick={(e) => handleDotClick(dot, e)}
          >
            {isSelected && renderExpandedContent(dot)}
          </div>
        );
      })}
    </div>
  );
};

export default InteractiveDots;