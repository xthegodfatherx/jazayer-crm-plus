
import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  readOnly?: boolean;
  onRating?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  readOnly = false, 
  onRating,
  size = 'md'
}) => {
  const [hoverRating, setHoverRating] = React.useState(0);

  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'h-3 w-3';
      case 'lg': return 'h-6 w-6';
      case 'md': 
      default: return 'h-5 w-5';
    }
  };

  const handleClick = (newRating: number) => {
    if (!readOnly && onRating) {
      onRating(newRating);
    }
  };

  const handleMouseOver = (newRating: number) => {
    if (!readOnly) {
      setHoverRating(newRating);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(0);
    }
  };

  return (
    <div 
      className="star-rating" 
      onMouseLeave={handleMouseLeave}
    >
      {[1, 2, 3].map((star) => (
        <Star
          key={star}
          className={cn(
            getSizeClass(),
            'cursor-pointer transition-colors duration-150',
            (hoverRating || rating) >= star 
              ? 'text-yellow-400 fill-yellow-400' 
              : 'text-gray-300',
            !readOnly && 'hover:text-yellow-500'
          )}
          onClick={() => handleClick(star)}
          onMouseOver={() => handleMouseOver(star)}
        />
      ))}
    </div>
  );
};

export default StarRating;
