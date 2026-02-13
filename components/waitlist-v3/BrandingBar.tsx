import React from 'react';
import { ChromaticLogo } from '../ui/ChromaticLogo';

export const BrandingBar: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-16 bg-black/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto h-full px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer hover:opacity-80 transition-opacity -ml-4 md:-ml-6">
            <ChromaticLogo type="apex" size="sm" className="scale-[0.55] md:scale-[0.6] origin-left" />
          </div>
        </div>
      </div>
    </div>
  );
};
