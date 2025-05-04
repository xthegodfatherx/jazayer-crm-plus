
import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StarRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readOnly?: boolean;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating = 0,
  onChange,
  size = 'md',
  readOnly = false,
  className = '',
}) => {
  const maxRating = 5;
  
  const handleStarClick = (index: number) => {
    if (readOnly) return;
    const newRating = index + 1;
    if (onChange) {
      onChange(newRating);
    }
  };
  
  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'h-4 w-4';
      case 'lg': return 'h-6 w-6';
      default: return 'h-5 w-5';
    }
  };
  
  const sizeClass = getSizeClass();

  return (
    <div className={cn('flex', className)}>
      {[...Array(maxRating)].map((_, index) => (
        <button
          key={index}
          type="button"
          className={cn(
            'p-0.5 focus:outline-none transition-colors',
            readOnly ? 'cursor-default' : 'cursor-pointer'
          )}
          onClick={() => handleStarClick(index)}
          disabled={readOnly}
        >
          <Star
            fill={index < rating ? 'currentColor' : 'none'}
            className={cn(
              sizeClass,
              index < rating ? 'text-amber-400 dark:text-amber-300' : 'text-muted-foreground/30 dark:text-muted-foreground/50',
              !readOnly && 'hover:text-amber-400 dark:hover:text-amber-300'
            )}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
