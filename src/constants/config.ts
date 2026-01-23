// src/constants/config.ts

// Scene Configuration
export const SCENE_TYPES = {
  COGNITIVE: 'cognitive',
  NEURAL: 'neural',
  QUANTUM: 'quantum'
} as const;

export type SceneType = typeof SCENE_TYPES[keyof typeof SCENE_TYPES];

// Color Palette
export const COLORS = {
  CYAN: '#00ffff',
  MAGENTA: '#ff00ff',
  YELLOW: '#ffff00',
  WHITE: '#ffffff',
  COGNITIVE: '#00ffff',
  NEURAL: '#ff00ff',
  QUANTUM: '#ffff00'
} as const;

// Node Configuration
export const NODE_CONFIG = {
  MIN_SIZE: 0.1,
  MAX_SIZE: 0.6,
  SIZE_RANGE: 0.5,
  BASE_INTENSITY: 20,
  CONNECTIONS_PER_NODE: 3,
  RING_SIZE_MULTIPLIER: 2.0,
  RING_WIDTH: 0.2
} as const;

// Animation Timing
export const ANIMATION = {
  GROUP_ROTATION_SPEED: 0.1,
  NODE_SCALE_SPEED: 2.0,
  NODE_SCALE_AMPLITUDE: 0.2,
  RING_PULSE_SPEED: 3.0,
  RING_PULSE_AMPLITUDE: 0.2,
  PARTICLE_ROTATION_SPEED: 0.05,
  GRID_FLOAT_SPEED: 0.5,
  GRID_FLOAT_AMPLITUDE: 0.2
} as const;

// Intensity Configuration
export const INTENSITY = {
  MIN: 1,
  MAX: 8,
  DEFAULT: 3,
  NODES_PER_UNIT: 20,
  PARTICLES_PER_UNIT: 2000
} as const;

// Performance Configuration
export const PERFORMANCE = {
  TARGET_FPS: 60,
  PIXEL_RATIO_MIN: 1,
  PIXEL_RATIO_MAX: 3,
  PARTICLE_UPDATE_INTERVAL: 10,
  CAMERA_FOV: 75,
  CAMERA_NEAR: 0.1,
  CAMERA_FAR: 1000
} as const;

// UI Configuration
export const UI = {
  NODE_LABEL_OFFSET: 0.5,
  TOAST_DURATION: 3000,
  METRICS_UPDATE_INTERVAL: 1000
} as const;
