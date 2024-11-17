import React from 'react';
import { Clock, Shuffle } from 'lucide-react';

const ModeToggle = ({ isChronological, onToggle }) => {
  return (
    <button
      onClick={onToggle}
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
  );
};

export default ModeToggle;