import React, { useState, useEffect } from 'react';
import { Lock, X } from 'lucide-react';

const InteractiveDots = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dots, setDots] = useState([]);
  const [selectedDot, setSelectedDot] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

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
      // Delay setting isExpanded to true
      const timer = setTimeout(() => setIsExpanded(true), 500);
      return () => clearTimeout(timer);
    } else {
      setIsExpanded(false);
    }
  }, [selectedDot]);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === 'dogbless') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  const handleDotClick = (dot) => {
    setSelectedDot(dot);
  };

  const handleClose = () => {
    setIsExpanded(false);
    // Delay unsetting selectedDot to allow fade-out animation
    setTimeout(() => setSelectedDot(null), 300);
  };

  const getRandomColor = () => {
    return `hsl(${Math.random() * 360}, 100%, 75%)`;
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
    <div className="relative h-screen bg-black overflow-hidden">
      {dots.map((dot) => (
        <div
          key={dot.id}
          className={`absolute rounded-full cursor-pointer transform transition-all duration-500 ease-in-out ${
            selectedDot && selectedDot.id === dot.id
              ? 'w-[90vmin] h-[90vmin] cursor-default'
              : 'w-12 h-12 hover:scale-125 hover:z-10'
          }`}
          style={{
            left: selectedDot && selectedDot.id === dot.id
              ? 'calc(50% - 45vmin)'
              : `calc(${dot.x}% - 1.5rem)`,
            top: selectedDot && selectedDot.id === dot.id
              ? 'calc(50% - 45vmin)'
              : `calc(${dot.y}% - 1.5rem)`,
            backgroundColor: dot.color,
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
            zIndex: selectedDot && selectedDot.id === dot.id ? 50 : 'auto'
          }}
          onClick={() => !selectedDot && handleDotClick(dot)}
        >
          {selectedDot && selectedDot.id === dot.id && (
            <div className={`absolute inset-0 p-16 overflow-auto flex flex-col items-center justify-center text-center transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
              <button
                onClick={handleClose}
                className="absolute top-8 right-8 text-white hover:text-gray-300"
              >
                <X size={24} />
              </button>
              <div className="text-white max-w-2xl">
                <h2 className="text-3xl font-bold mb-4">{selectedDot.dateTime} {selectedDot.author}</h2>
                <p className="text-xl">{selectedDot.message}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default InteractiveDots;