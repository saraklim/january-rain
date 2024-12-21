// components/FadeInText.js
import React, { useState, useEffect } from 'react';

const FadeInText = ({ children, delay = 0 }) => {
  const [opacity, setOpacity] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setOpacity(1), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className="transition-opacity duration-1000"
      style={{ opacity }}
    >
      {children}
    </div>
  );
};

export default FadeInText;