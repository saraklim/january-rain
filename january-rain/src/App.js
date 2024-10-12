import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';

const InteractiveDots = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dots, setDots] = useState([]);
  const [selectedDot, setSelectedDot] = useState(null);

  useEffect(() => {
    // Generate random dots
    const newDots = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      content: `Content for dot ${i + 1}`
    }));
    setDots(newDots);
  }, []);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // Replace 'your-password' with the actual password
    if (password === 'your-password') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  const handleDotClick = (dot) => {
    setSelectedDot(dot);
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
    <div className="relative h-screen bg-black">
      {dots.map((dot) => (
        <div
          key={dot.id}
          className="absolute w-4 h-4 bg-white rounded-full cursor-pointer transform transition-transform hover:scale-150"
          style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
          onClick={() => handleDotClick(dot)}
        />
      ))}
      {selectedDot && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80">
          <div className="bg-white p-6 rounded-lg max-w-md">
            <h2 className="text-xl font-bold mb-2">Dot {selectedDot.id + 1}</h2>
            <p>{selectedDot.content}</p>
            <button
              onClick={() => setSelectedDot(null)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveDots;