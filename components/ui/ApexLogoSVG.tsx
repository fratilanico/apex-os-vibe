import React from 'react';

export const ApexLogoSVG: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <svg 
      viewBox="0 0 400 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* A */}
      <rect x="10" y="10" width="60" height="15" fill="#3b82f6" rx="2" />
      <rect x="5" y="30" width="20" height="15" fill="#06b6d4" rx="2" />
      <rect x="55" y="30" width="20" height="15" fill="#06b6d4" rx="2" />
      <rect x="5" y="50" width="70" height="15" fill="#8b5cf6" rx="2" />
      <rect x="5" y="70" width="20" height="15" fill="#f43f5e" rx="2" />
      <rect x="55" y="70" width="20" height="15" fill="#f43f5e" rx="2" />
      <rect x="5" y="90" width="20" height="10" fill="#f59e0b" rx="1" />
      <rect x="55" y="90" width="20" height="10" fill="#f59e0b" rx="1" />
      
      {/* P */}
      <rect x="85" y="10" width="60" height="15" fill="#3b82f6" rx="2" />
      <rect x="85" y="30" width="20" height="15" fill="#06b6d4" rx="2" />
      <rect x="125" y="30" width="20" height="15" fill="#06b6d4" rx="2" />
      <rect x="85" y="50" width="60" height="15" fill="#8b5cf6" rx="2" />
      <rect x="85" y="70" width="20" height="15" fill="#f43f5e" rx="2" />
      <rect x="85" y="90" width="20" height="10" fill="#f59e0b" rx="1" />

      {/* E */}
      <rect x="155" y="10" width="60" height="15" fill="#3b82f6" rx="2" />
      <rect x="155" y="30" width="20" height="15" fill="#06b6d4" rx="2" />
      <rect x="155" y="50" width="50" height="15" fill="#8b5cf6" rx="2" />
      <rect x="155" y="70" width="20" height="15" fill="#f43f5e" rx="2" />
      <rect x="155" y="90" width="60" height="10" fill="#f59e0b" rx="1" />

      {/* X */}
      <rect x="225" y="10" width="20" height="15" fill="#3b82f6" rx="2" />
      <rect x="265" y="10" width="20" height="15" fill="#3b82f6" rx="2" />
      <rect x="235" y="30" width="20" height="15" fill="#06b6d4" rx="2" />
      <rect x="255" y="30" width="20" height="15" fill="#06b6d4" rx="2" />
      <rect x="245" y="50" width="20" height="15" fill="#8b5cf6" rx="2" />
      <rect x="235" y="70" width="20" height="15" fill="#f43f5e" rx="2" />
      <rect x="255" y="70" width="20" height="15" fill="#f43f5e" rx="2" />
      <rect x="225" y="90" width="20" height="10" fill="#f59e0b" rx="1" />
      <rect x="265" y="90" width="20" height="10" fill="#f59e0b" rx="1" />

      {/* OS */}
      <rect x="305" y="10" width="40" height="15" fill="#3b82f6" rx="2" />
      <rect x="355" y="10" width="40" height="15" fill="#3b82f6" rx="2" />
      <rect x="305" y="30" width="15" height="15" fill="#06b6d4" rx="2" />
      <rect x="330" y="30" width="15" height="15" fill="#06b6d4" rx="2" />
      <rect x="355" y="30" width="15" height="15" fill="#06b6d4" rx="2" />
      <rect x="305" y="50" width="15" height="15" fill="#8b5cf6" rx="2" />
      <rect x="330" y="50" width="15" height="15" fill="#8b5cf6" rx="2" />
      <rect x="355" y="50" width="40" height="15" fill="#8b5cf6" rx="2" />
      <rect x="305" y="70" width="15" height="15" fill="#f43f5e" rx="2" />
      <rect x="330" y="70" width="15" height="15" fill="#f43f5e" rx="2" />
      <rect x="380" y="70" width="15" height="15" fill="#f43f5e" rx="2" />
      <rect x="305" y="90" width="40" height="10" fill="#f59e0b" rx="1" />
      <rect x="355" y="90" width="40" height="10" fill="#f59e0b" rx="1" />
    </svg>
  );
};
