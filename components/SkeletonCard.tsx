import React from 'react';

const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-200 animate-pulse">
      {/* Gradient preview skeleton */}
      <div className="h-40 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%] animate-shimmer"></div>
      
      {/* Content skeleton */}
      <div className="p-5 space-y-3">
        {/* Title skeleton */}
        <div className="h-6 bg-slate-200 rounded w-3/4"></div>
        
        {/* Description skeleton */}
        <div className="h-4 bg-slate-200 rounded w-full"></div>
        <div className="h-4 bg-slate-200 rounded w-2/3"></div>
        
        {/* Color chips skeleton */}
        <div className="flex gap-2 pt-2">
          <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
          <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
          <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
