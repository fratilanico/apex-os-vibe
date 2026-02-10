// ═══════════════════════════════════════════════════════════════════════════════
// DEVICE CAPABILITY DETECTOR
// Automatically adjusts performance based on device specs
// ═══════════════════════════════════════════════════════════════════════════════

export interface DeviceCapabilities {
  // Performance tier
  tier: 'low' | 'medium' | 'high' | 'premium';
  
  // Display
  refreshRate: number;
  screenWidth: number;
  screenHeight: number;
  devicePixelRatio: number;
  
  // Hardware
  memoryGB: number | null;
  cpuCores: number;
  
  // Browser capabilities
  webglSupported: boolean;
  webgl2Supported: boolean;
  
  // Performance metrics (measured)
  estimatedFPS: number;
}

// Performance configuration based on tier
export interface PerformanceConfig {
  // Animation settings
  targetFPS: number;
  frameSkip: number;
  useRAF: boolean; // requestAnimationFrame vs setInterval
  
  // Effect quality
  matrixRain: {
    enabled: boolean;
    density: 'low' | 'medium' | 'high' | 'ultra';
    charset: 'minimal' | 'standard' | 'full';
    glowIntensity: number;
  };
  
  glitchEffect: {
    enabled: boolean;
    intensity: 'subtle' | 'normal' | 'intense';
    frequency: number;
  };
  
  asciiParticles: {
    enabled: boolean;
    count: number;
    enableRotation: boolean;
    enableBlur: boolean;
  };
  
  scanlines: {
    enabled: boolean;
    opacity: number;
    animated: boolean;
  };
  
  // Particles and effects
  particleCount: number;
  enableBlurEffects: boolean;
  enableBackdropBlur: boolean;
  enableComplexAnimations: boolean;
}

// Configuration presets
export const PERFORMANCE_PRESETS: Record<DeviceCapabilities['tier'], PerformanceConfig> = {
  // Low-end: Budget phones, old tablets
  low: {
    targetFPS: 30,
    frameSkip: 2,
    useRAF: true,
    matrixRain: {
      enabled: true,
      density: 'low',
      charset: 'minimal', // Just 0-1
      glowIntensity: 0.2,
    },
    glitchEffect: {
      enabled: false, // Disabled to prevent flickering
      intensity: 'subtle',
      frequency: 0.1,
    },
    asciiParticles: {
      enabled: true,
      count: 3,
      enableRotation: false,
      enableBlur: false,
    },
    scanlines: {
      enabled: true,
      opacity: 0.15,
      animated: false,
    },
    particleCount: 5,
    enableBlurEffects: false,
    enableBackdropBlur: false,
    enableComplexAnimations: false,
  },
  
  // Medium: Standard phones, older tablets
  medium: {
    targetFPS: 30,
    frameSkip: 1,
    useRAF: true,
    matrixRain: {
      enabled: true,
      density: 'medium',
      charset: 'standard', // Numbers + some chars
      glowIntensity: 0.3,
    },
    glitchEffect: {
      enabled: true,
      intensity: 'subtle',
      frequency: 0.2,
    },
    asciiParticles: {
      enabled: true,
      count: 5,
      enableRotation: true,
      enableBlur: false,
    },
    scanlines: {
      enabled: true,
      opacity: 0.2,
      animated: false,
    },
    particleCount: 8,
    enableBlurEffects: true,
    enableBackdropBlur: true,
    enableComplexAnimations: true,
  },
  
  // High: Modern phones, standard tablets (60Hz)
  high: {
    targetFPS: 60,
    frameSkip: 1,
    useRAF: true,
    matrixRain: {
      enabled: true,
      density: 'high',
      charset: 'full', // Full Japanese + alphanumeric
      glowIntensity: 0.4,
    },
    glitchEffect: {
      enabled: true,
      intensity: 'normal',
      frequency: 0.3,
    },
    asciiParticles: {
      enabled: true,
      count: 8,
      enableRotation: true,
      enableBlur: true,
    },
    scanlines: {
      enabled: true,
      opacity: 0.25,
      animated: true,
    },
    particleCount: 12,
    enableBlurEffects: true,
    enableBackdropBlur: true,
    enableComplexAnimations: true,
  },
  
  // Premium: High-end tablets (120Hz), gaming phones
  premium: {
    targetFPS: 60, // Cap at 60 for battery, but smoother
    frameSkip: 1,
    useRAF: true,
    matrixRain: {
      enabled: true,
      density: 'ultra',
      charset: 'full',
      glowIntensity: 0.5,
    },
    glitchEffect: {
      enabled: true,
      intensity: 'intense',
      frequency: 0.4,
    },
    asciiParticles: {
      enabled: true,
      count: 15,
      enableRotation: true,
      enableBlur: true,
    },
    scanlines: {
      enabled: true,
      opacity: 0.3,
      animated: true,
    },
    particleCount: 20,
    enableBlurEffects: true,
    enableBackdropBlur: true,
    enableComplexAnimations: true,
  },
};

// Detect refresh rate
export async function detectRefreshRate(): Promise<number> {
  return new Promise((resolve) => {
    // Method 1: Use navigator if available (Chrome 89+)
    if ('devicePixelRatio' in window) {
      // Estimate based on device type
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isTablet = /iPad|Android(?!.*Mobile)|Tablet/i.test(navigator.userAgent) || (window.innerWidth >= 768 && window.innerWidth <= 1366);
      
      // Most modern devices are 60Hz, gaming phones/tablets are 90-120Hz
      if (isTablet && window.devicePixelRatio >= 2) {
        // High-end tablet likely has 90-120Hz
        resolve(90);
        return;
      }
    }
    
    // Method 2: Measure actual frame rate
    let frames = 0;
    let startTime = performance.now();
    const duration = 1000; // Measure for 1 second
    
    function measure() {
      frames++;
      const elapsed = performance.now() - startTime;
      
      if (elapsed < duration) {
        requestAnimationFrame(measure);
      } else {
        const fps = Math.round((frames / elapsed) * 1000);
        // Round to common refresh rates
        if (fps >= 110) resolve(120);
        else if (fps >= 80) resolve(90);
        else if (fps >= 50) resolve(60);
        else if (fps >= 40) resolve(48);
        else resolve(30);
      }
    }
    
    requestAnimationFrame(measure);
  });
}

// Detect device memory
export function detectMemory(): number | null {
  if ('deviceMemory' in navigator) {
    return (navigator as any).deviceMemory;
  }
  return null;
}

// Detect WebGL capabilities
export function detectWebGL(): { supported: boolean; version: number } {
  try {
    const canvas = document.createElement('canvas');
    
    // Try WebGL2 first
    const gl2 = canvas.getContext('webgl2');
    if (gl2) return { supported: true, version: 2 };
    
    // Fallback to WebGL1
    const gl1 = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl1) return { supported: true, version: 1 };
    
    return { supported: false, version: 0 };
  } catch {
    return { supported: false, version: 0 };
  }
}

// Run performance benchmark
export async function runPerformanceBenchmark(): Promise<number> {
  return new Promise((resolve) => {
    const iterations = 1000;
    const startTime = performance.now();
    
    // Simulate some math operations
    let result = 0;
    for (let i = 0; i < iterations; i++) {
      result += Math.sin(i) * Math.cos(i);
    }
    
    const duration = performance.now() - startTime;
    
    // Score: Lower is better (faster)
    // < 1ms = Very fast (premium)
    // 1-5ms = Fast (high)
    // 5-15ms = Medium
    // > 15ms = Slow (low)
    
    if (duration < 1) resolve(100); // Premium
    else if (duration < 5) resolve(80); // High
    else if (duration < 15) resolve(60); // Medium
    else resolve(40); // Low
  });
}

// Main detection function
export async function detectDeviceCapabilities(): Promise<DeviceCapabilities> {
  const [refreshRate, benchmarkScore] = await Promise.all([
    detectRefreshRate(),
    runPerformanceBenchmark(),
  ]);
  
  const memoryGB = detectMemory();
  const webgl = detectWebGL();
  const cpuCores = navigator.hardwareConcurrency || 4;
  
  // Determine tier
  let tier: DeviceCapabilities['tier'] = 'medium';
  
  if (
    refreshRate >= 90 &&
    (memoryGB === null || memoryGB >= 6) &&
    benchmarkScore >= 80 &&
    cpuCores >= 6
  ) {
    tier = 'premium';
  } else if (
    refreshRate >= 60 &&
    (memoryGB === null || memoryGB >= 4) &&
    benchmarkScore >= 60 &&
    cpuCores >= 4
  ) {
    tier = 'high';
  } else if (
    (memoryGB === null || memoryGB >= 2) &&
    benchmarkScore >= 40
  ) {
    tier = 'medium';
  } else {
    tier = 'low';
  }
  
  return {
    tier,
    refreshRate,
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio,
    memoryGB,
    cpuCores,
    webglSupported: webgl.supported,
    webgl2Supported: webgl.version === 2,
    estimatedFPS: Math.min(refreshRate, tier === 'premium' ? 60 : tier === 'high' ? 60 : 30),
  };
}

// Get performance config for device
export async function getPerformanceConfig(): Promise<PerformanceConfig> {
  const capabilities = await detectDeviceCapabilities();
  return PERFORMANCE_PRESETS[capabilities.tier];
}

// Storage key for caching
const CAPABILITIES_CACHE_KEY = 'apex_device_capabilities';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function getCachedCapabilities(): Promise<DeviceCapabilities> {
  // Check cache
  const cached = localStorage.getItem(CAPABILITIES_CACHE_KEY);
  if (cached) {
    const { capabilities, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return capabilities;
    }
  }
  
  // Detect fresh
  const capabilities = await detectDeviceCapabilities();
  localStorage.setItem(CAPABILITIES_CACHE_KEY, JSON.stringify({
    capabilities,
    timestamp: Date.now(),
  }));
  
  return capabilities;
}

export default {
  detectDeviceCapabilities,
  getPerformanceConfig,
  getCachedCapabilities,
  PERFORMANCE_PRESETS,
};
