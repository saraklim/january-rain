import React, { useState } from 'react';
import { Lock } from 'lucide-react';

const Authentication = ({ onAuthenticate }) => {
  const [password, setPassword] = useState('');

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === 'dogbless') {
      onAuthenticate(true);
    } else {
      alert('Incorrect password');
    }
  };

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
};

export default Authentication;