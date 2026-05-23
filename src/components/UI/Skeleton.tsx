import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  circle?: boolean;
}

export default function Skeleton({ className, width, height, circle }: SkeletonProps) {
  return (
    <div 
      className={`skeleton rounded-lg ${className}`}
      style={{ 
        width: width, 
        height: height,
        borderRadius: circle ? '50%' : undefined 
      }}
    />
  );
}
