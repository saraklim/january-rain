import React, { useState, useEffect, useRef } from 'react';
import Authentication from './Authentication';
import ExpandedDot from './ExpandedDot';
import ModeToggle from './ModeToggle';
import FadeInText from './components/FadeInText';  
import { calculateDotPositions } from './utils';

const ChronologicalPath = ({ dots }) => {
  const margin = 10;
  const rowHeight = 15;
  const numRows = Math.ceil(dots.length / 8);
  
  return (
    <div className="absolute inset-0" style={{ zIndex: 0 }}>
      {Array.from({ length: numRows }).map((_, rowIndex) => {
        const isEvenRow = rowIndex % 2 === 0;
        const y = margin + (rowIndex * rowHeight);
        const isLastRow = rowIndex === numRows - 1;
        
        return (
          <div 
            key={rowIndex}
            style={{
              position: 'absolute',
              left: `calc(${margin}% - 0.0rem)`,
              top: `calc(${y}% - 0rem)`,
              width: `calc(${100 - (2 * margin)}% + 0rem)`,
              // Only add vertical height if it's not the last row
              height: !isLastRow ? `calc(${rowHeight}%)` : '0',
              // Left vertical line for odd rows that aren't the last row
              borderLeft: !isEvenRow && !isLastRow ? '2px solid rgba(255, 255, 255, 0.15)' : 'none',
              // Right vertical line for even rows that aren't the last row
              borderRight: isEvenRow && !isLastRow ? '2px solid rgba(255, 255, 255, 0.15)' : 'none',
              borderTop: '2px solid rgba(255, 255, 255, 0.15)'
            }}
          />
        );
      })}
    </div>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showDots, setShowDots] = useState(false);  // New state for controlling dots visibility
  const [dots, setDots] = useState([]);
  const [selectedDot, setSelectedDot] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isChronological, setIsChronological] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchDots = async () => {
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/static/data.json`);
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
  const handleTransitionClick = () => {
    setShowDots(true);
  };

  if (!isAuthenticated) {
    return <Authentication onAuthenticate={setIsAuthenticated} />;
  }

  if (!showDots) {
    return (
      <div 
      className="flex items-center justify-center h-screen bg-black text-white cursor-pointer"
      onClick={handleTransitionClick}
    >
      <div className="text-center max-w-2xl px-8">
        <FadeInText delay={500}>
          <h1 className="text-3xl mb-12 font-light">
            Welcome Niall, you have been successfully authenticated.
          </h1>
        </FadeInText>
        <FadeInText delay={2000}>
          <p className="text-xl mb-16 text-gray-300 leading-relaxed">
            What you'll find inside is a compilation of our pinned messages over the years 
            (or at least the ones I remembered), and a few other miscellaneous bits. Enjoy &lt;3
          </p>
        </FadeInText>
        <FadeInText delay={3500}>
          <p className="text-gray-400 text-lg">
            Click anywhere to begin
          </p>
        </FadeInText>
      </div>
    </div>
    );
  }

  return (
    <div ref={containerRef} className="relative h-screen bg-black overflow-hidden">
      <ModeToggle isChronological={isChronological} onToggle={handleToggleMode} />

      {isChronological && <ChronologicalPath dots={dots} />}

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
              zIndex: isSelected ? 50 : 2  // Added explicit z-index for dots
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