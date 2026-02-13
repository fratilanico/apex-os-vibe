export type PillOption = 'matrix' | 'commander' | 'arcade' | 'dashboard' | 'story';

export interface AdminCommand {
  command: string;
  description: string;
  hidden: boolean;
  handler: (args: string[]) => string | string[];
}

// Admin state (in-memory only, resets on refresh)
let currentPillOption: PillOption = 'matrix';
let isAdminAuthenticated = false;
let adminSessionExpiry: number | null = null;

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'apex-admin-2026';
const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes

// Admin command registry
export const adminCommands: Record<string, AdminCommand> = {
  auth: {
    command: 'auth',
    description: 'Authenticate as admin',
    hidden: true,
    handler: (args: string[]) => {
      const password = args[0];
      if (!password) {
        return ['ERROR: Password required', 'Usage: auth <password>'];
      }
      
      if (password === ADMIN_PASSWORD) {
        isAdminAuthenticated = true;
        adminSessionExpiry = Date.now() + SESSION_DURATION;
        return [
          '✓ AUTHENTICATION SUCCESSFUL',
          '═══════════════════════════════',
          'Admin access granted.',
          'Session expires in 30 minutes.',
          '',
          'Available admin commands:',
          '  pill <option>     - Switch pill style',
          '  geek <effect>     - Toggle geek effects',
          '  status            - View system status',
          '  logout            - End admin session',
        ];
      }
      
      return ['✗ AUTHENTICATION FAILED', 'Invalid password.'];
    },
  },

  pill: {
    command: 'pill',
    description: 'Switch pill display option',
    hidden: true,
    handler: (args: string[]) => {
      if (!checkAuth()) {
        return ['ERROR: Authentication required', 'Use: auth <password>'];
      }

      const option = args[0] as PillOption;
      const validOptions: PillOption[] = ['matrix', 'commander', 'arcade', 'dashboard', 'story'];
      
      if (!option) {
        return [
          'Current pill option: ' + currentPillOption,
          '',
          'Available options:',
          ...validOptions.map(opt => `  ${opt}`),
          '',
          'Usage: pill <option>',
        ];
      }

      if (!validOptions.includes(option)) {
        return ['ERROR: Invalid pill option', `Valid options: ${validOptions.join(', ')}`];
      }

      currentPillOption = option;
      return [
        `✓ PILL OPTION CHANGED`,
        '═══════════════════════════════',
        `Active: ${option}`,
        '',
        'Refresh page to see changes.',
      ];
    },
  },

  geek: {
    command: 'geek',
    description: 'Toggle geek mode effects',
    hidden: true,
    handler: (args: string[]) => {
      if (!checkAuth()) {
        return ['ERROR: Authentication required', 'Use: auth <password>'];
      }

      const effect = args[0];
      const validEffects = [
        'matrixrain',
        'glitch',
        'ascii',
        'scanlines',
        'all',
        'none',
      ];

      if (!effect) {
        return [
          'GEEK MODE EFFECTS CONTROL',
          '═══════════════════════════════',
          '',
          'Available effects:',
          '  matrixrain    - Toggle Matrix rain',
          '  glitch        - Toggle glitch effects',
          '  ascii         - Toggle ASCII particles',
          '  scanlines     - Toggle CRT scanlines',
          '  all           - Enable all effects',
          '  none          - Disable all effects',
          '',
          'Usage: geek <effect>',
        ];
      }

      if (!validEffects.includes(effect)) {
        return ['ERROR: Invalid effect', `Valid effects: ${validEffects.join(', ')}`];
      }

      // Return commands that will be processed by the store
      return [
        `✓ GEEK EFFECT: ${effect.toUpperCase()}`,
        '═══════════════════════════════',
        `Command: toggle_${effect}`,
        '',
        'Effect will update in real-time.',
      ];
    },
  },

  status: {
    command: 'status',
    description: 'View system status',
    hidden: true,
    handler: () => {
      if (!checkAuth()) {
        return ['ERROR: Authentication required', 'Use: auth <password>'];
      }

      const timeLeft = adminSessionExpiry ? Math.max(0, adminSessionExpiry - Date.now()) : 0;
      const minutesLeft = Math.floor(timeLeft / 60000);
      const secondsLeft = Math.floor((timeLeft % 60000) / 1000);

      return [
        'SYSTEM STATUS',
        '═══════════════════════════════',
        `Pill Option: ${currentPillOption}`,
        `Admin Session: ${minutesLeft}m ${secondsLeft}s remaining`,
        '',
        'Active Effects:',
        '  ✓ Matrix Rain',
        '  ✓ Scanlines',
        '  ✓ Glitch Effects',
        '  ✓ ASCII Particles',
      ];
    },
  },

  logout: {
    command: 'logout',
    description: 'End admin session',
    hidden: true,
    handler: () => {
      isAdminAuthenticated = false;
      adminSessionExpiry = null;
      return [
        '✓ LOGGED OUT',
        '═══════════════════════════════',
        'Admin session terminated.',
      ];
    },
  },
};

// Check if admin is authenticated
function checkAuth(): boolean {
  if (!isAdminAuthenticated || !adminSessionExpiry) {
    return false;
  }
  
  if (Date.now() > adminSessionExpiry) {
    isAdminAuthenticated = false;
    adminSessionExpiry = null;
    return false;
  }
  
  return true;
}

// Process admin command
export function processAdminCommand(input: string): { isAdmin: boolean; response: string | string[] } {
  const parts = input.trim().toLowerCase().split(' ');
  const command = parts[0];
  const args = parts.slice(1);

  if (command === 'admin') {
    return {
      isAdmin: true,
      response: [
        'ADMIN PROTOCOL INITIATED',
        '═══════════════════════════════',
        'Authentication required.',
        '',
        'Use: auth <password>',
      ],
    };
  }

  if (command && adminCommands[command]) {
    return {
      isAdmin: true,
      response: adminCommands[command].handler(args),
    };
  }

  return { isAdmin: false, response: '' };
}

// Get current pill option
export function getCurrentPillOption(): PillOption {
  return currentPillOption;
}

// Set pill option (for external updates)
export function setPillOption(option: PillOption): void {
  currentPillOption = option;
}

export default adminCommands;
