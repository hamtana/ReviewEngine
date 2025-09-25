import { useState } from "react";
import { BsStar, BsStarFill } from "react-icons/bs";

export default function StarRating({ maxStars = 5, onRate }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handleClick = (value) => {
    setRating(value);
    if (onRate) onRate(value);
  };

  return (
    <div className="flex gap-2 text-3xl">
      {[...Array(maxStars)].map((_, i) => {
        const value = i + 1;
        const isActive = (hover || rating) >= value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => handleClick(value)}
            onMouseEnter={() => setHover(value)}
            onMouseLeave={() => setHover(0)}
            className="transition-colors duration-200"
          >
            {isActive ? (
              <BsStarFill size="120" className="text-yellow-400" />
            ) : (
              <BsStar size="120" className="text-gray-300" />
            )}
          </button>
        );
      })}
    </div>
  );
}

