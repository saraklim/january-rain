import React, { useState, useEffect, useRef } from 'react';
import { Lock, X, Clock, Shuffle } from 'lucide-react';

const InteractiveDots = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dots, setDots] = useState([]);
  const [selectedDot, setSelectedDot] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isChronological, setIsChronological] = useState(false);
  const containerRef = useRef(null);

  const getRandomColor = () => {
    return `hsl(${Math.random() * 360}, 100%, 75%)`;
  };

  useEffect(() => {
    const fetchDots = async () => {
      try {
        const response = await fetch('/static/data.json');
        const data = await response.json();
        // Sort the data by dateTime
        const sortedData = [...data].sort((a, b) => 
          new Date(a.dateTime) - new Date(b.dateTime)
        );
        
        const newDots = sortedData.map((dot, index) => ({
          ...dot,
          color: getRandomColor(),
          // Store both random and chronological positions
          random: {
            x: Math.random() * 90 + 5,
            y: Math.random() * 90 + 5
          },
          // Chronological positions will be calculated later
          chronological: { x: 0, y: 0 }
        }));

        // Calculate chronological positions in a spiral
        const totalDots = newDots.length;
        const spiralTurns = Math.ceil(totalDots / 8); // Adjust number of turns
        const angleStep = (2 * Math.PI * spiralTurns) / totalDots;
        const radiusStep = 35 / totalDots; // Maximum radius of 35% of container

        newDots.forEach((dot, index) => {
          const angle = index * angleStep;
          const radius = (index + 1) * radiusStep;
          
          // Convert polar coordinates to Cartesian
          dot.chronological = {
            x: 50 + radius * Math.cos(angle), // Center at 50%
            y: 50 + radius * Math.sin(angle)  // Center at 50%
          };
        });

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
      if (!selectedDot) return;

      const isClickInsideDot = event.target.closest('.dot');
      const isClickInsideContent = event.target.closest('.expanded-dot-content');
      const isClickOnCloseButton = event.target.closest('.close-button');

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

  const handleToggleMode = () => {
    if (selectedDot) {
      handleClose();
    }
    setIsChronological(!isChronological);
  };

  const getDotPosition = (dot) => {
    return isChronological ? dot.chronological : dot.random;
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
      {/* Mode toggle button */}
      <button
        onClick={handleToggleMode}
        className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full flex items-center gap-2 transition-colors"
      >
        {isChronological ? (
          <>
            <Shuffle size={20} />
            <span>Random</span>
          </>
        ) : (
          <>
            <Clock size={20} />
            <span>Chronological</span>
          </>
        )}
      </button>

      {/* Time indicator for chronological mode */}
      {isChronological && !selectedDot && (
        <div className="absolute top-4 left-4 text-white/50 text-sm">
          <div className="flex items-center gap-2">
            <span>Oldest</span>
            <div className="w-24 h-0.5 bg-gradient-to-r from-white/50 to-transparent"></div>
          </div>
        </div>
      )}

      {dots.map((dot) => {
        const isSelected = selectedDot && selectedDot.id === dot.id;
        const position = getDotPosition(dot);
        
        return (
          <div
            key={dot.id}
            className={`dot absolute rounded-full cursor-pointer transform transition-all duration-500 ease-in-out ${
              isSelected
                ? 'w-[90vmin] h-[90vmin] cursor-default'
                : 'w-12 h-12 hover:scale-125 hover:z-10'
            }`}
            style={{
              left: isSelected
                ? 'calc(50% - 45vmin)'
                : `calc(${position.x}% - 1.5rem)`,
              top: isSelected
                ? 'calc(50% - 45vmin)'
                : `calc(${position.y}% - 1.5rem)`,
              backgroundColor: dot.color,
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
              zIndex: isSelected ? 50 : 'auto'
            }}
            onClick={(e) => handleDotClick(dot, e)}
          >
            {isSelected && renderExpandedContent(dot)}
            
            {/* Date tooltip for chronological mode */}
            {isChronological && !isSelected && (
              <div className="absolute opacity-0 hover:opacity-100 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap">
                {new Date(dot.dateTime).toLocaleDateString()}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default InteractiveDots;