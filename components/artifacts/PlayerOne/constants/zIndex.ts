// Z-Index Constants for PlayerOne HUD
// Prevents z-index chaos and ensures proper layering

export const Z_INDEX = {
  // Base layers
  backdrop: 100,
  
  // HUD layers
  hud: 200,
  hudMaximized: 300,
  hudContent: 250,
  
  // Modal/Dialog layers
  modal: 400,
  modalContent: 410,
  
  // Tooltip/Popover layers
  tooltip: 500,
  popover: 510,
  
  // Emergency/Critical layers
  emergencyButton: 600,
  errorBoundary: 700,
  
  // Maximum layer - use sparingly
  maximum: 999,
} as const;

// Type for type safety
export type ZIndexLevel = keyof typeof Z_INDEX;

// Helper function to get z-index value
export const getZIndex = (level: ZIndexLevel): number => {
  return Z_INDEX[level];
};
