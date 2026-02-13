export type TrajectoryId = 'BLUE' | 'RED';

type TrajectoryConfig = {
  label: string;
  defaultPrompts: string[];
};

// Minimal waitlist trajectory configuration.
// This exists to keep SpectacularTerminal deterministic and copy-paste safe.
export const TRAJECTORY_CONFIG: Record<TrajectoryId, TrajectoryConfig> = {
  BLUE: {
    label: 'BLUE PILL',
    defaultPrompts: [
      'What can I learn from Module 00: The Shift?',
      'Give me a 10-day plan to build my first AI workflow (beginner).',
      'What should I build first to get leverage with AI?',
    ],
  },
  RED: {
    label: 'RED PILL',
    defaultPrompts: [
      'Design a 10-day plan to deploy an AI agent system for my company.',
      'What are the first 3 workflows to automate with AI in a small business?',
      'Help me scope an agent swarm for customer support + ops.',
    ],
  },
};
