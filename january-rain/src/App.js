import React, { useState, useEffect, useRef } from 'react';
import Authentication from './Authentication';
import ExpandedDot from './ExpandedDot';
import ModeToggle from './ModeToggle';
import { calculateDotPositions } from './utils';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dots, setDots] = useState([]);
  const [selectedDot, setSelectedDot] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isChronological, setIsChronological] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchDots = async () => {
      try {
        const response = await fetch('/static/data.json');
        const data = await response.json();
        const sortedData = [...data].sort((a, b) => 
          new Date(a.dateTime) - new Date(b.dateTime)
        );
        
        const processedDots = calculateDotPositions(sortedData);
        setDots(processedDots);
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedDot]);

  const handleDotClick = (dot, event) => {
    event.stopPropagation();
    
    if (selectedDot && selectedDot.id !== dot.id) {
      setIsExpanded(false);
      setTimeout(() => setSelectedDot(dot), 300);
    } else if (!selectedDot) {
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

  if (!isAuthenticated) {
    return <Authentication onAuthenticate={setIsAuthenticated} />;
  }

  return (
    <div ref={containerRef} className="relative h-screen bg-black overflow-hidden">
      <ModeToggle isChronological={isChronological} onToggle={handleToggleMode} />

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
        const position = isChronological ? dot.chronological : dot.random;
        
        return (
          <div
            key={dot.id}
            className={`dot absolute rounded-full cursor-pointer transform transition-all duration-500 ease-in-out ${
              isSelected
                ? 'w-[90vmin] h-[90vmin] cursor-default'
                : 'w-12 h-12 hover:scale-125 hover:z-10'
            }`}
            style={{
              left: isSelected ? 'calc(50% - 45vmin)' : `calc(${position.x}% - 1.5rem)`,
              top: isSelected ? 'calc(50% - 45vmin)' : `calc(${position.y}% - 1.5rem)`,
              backgroundColor: dot.color,
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
              zIndex: isSelected ? 50 : 'auto'
            }}
            onClick={(e) => handleDotClick(dot, e)}
          >
            {isSelected && (
              <ExpandedDot 
                dot={dot} 
                isExpanded={isExpanded} 
                onClose={handleClose} 
              />
            )}
            
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

export default App;