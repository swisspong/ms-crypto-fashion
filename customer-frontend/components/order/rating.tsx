
import React, { useState } from 'react';

interface RatingProps {
  onChange: (rating: number) => void;
}

const Rating: React.FC<RatingProps> = ({ onChange }) => {
  const [rating, setRating] = useState(0);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    onChange(newRating);
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type='button'
          onClick={() => handleRatingChange(value)}
          className={`text-2xl focus:outline-none ${
            value <= rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

export default Rating;
