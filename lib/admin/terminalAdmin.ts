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
        return [
          '╔════════════════════════════════════╗',
          '║     AUTHENTICATION REQUIRED        ║',
          '╚════════════════════════════════════╝',
          '',
          '> Awaiting credentials...',
          '> Usage: auth <access_key>',
        ];
      }
      
      if (password === ADMIN_PASSWORD) {
        isAdminAuthenticated = true;
        adminSessionExpiry = Date.now() + SESSION_DURATION;
        return [
          '╔════════════════════════════════════╗',
          '║    ✓ ACCESS GRANTED - LEVEL 5      ║',
          '╚════════════════════════════════════╝',
          '',
          '> Neural handshake complete.',
          '> Session active for 30 minutes.',
          '',
          'Available protocols:',
          '  pill <style>    - Switch visual theme',
          '  geek <effect>   - Toggle FX modules',
          '  status          - System diagnostics',
          '  logout          - Terminate session',
        ];
      }
      
      return [
        '╔════════════════════════════════════╗',
        '║     ✗ ACCESS DENIED                ║',
        '╚════════════════════════════════════╝',
        '',
        '> Invalid credentials.',
        '> Attempts logged.',
      ];
    },
  },

  pill: {
    command: 'pill',
    description: 'Switch pill display option',
    hidden: true,
    handler: (args: string[]) => {
      if (!checkAuth()) {
        return [
          '╔════════════════════════════════════╗',
          '║     ✗ UNAUTHORIZED                 ║',
          '╚════════════════════════════════════╝',
          '',
          '> Authentication required.',
          '> Use: auth <access_key>',
        ];
      }

      const option = args[0] as PillOption;
      const validOptions: PillOption[] = ['matrix', 'commander', 'arcade', 'dashboard', 'story'];
      
      if (!option) {
        return [
          `> Current visual theme: [${currentPillOption.toUpperCase()}]`,
          '',
          'Available themes:',
          '  matrix     - Classic terminal aesthetic',
          '  commander  - Military command interface', 
          '  arcade     - Retro gaming vibes',
          '  dashboard  - Analytics cockpit view',
          '  story      - Narrative journey mode',
          '',
          '> Usage: pill <theme>',
        ];
      }

      if (!validOptions.includes(option)) {
        return [
          '╔════════════════════════════════════╗',
          '║     ✗ INVALID THEME                ║',
          '╚════════════════════════════════════╝',
          '',
          `> "${option}" not found in registry.`,
          `> Valid themes: ${validOptions.join(', ')}`,
        ];
      }

      currentPillOption = option;
      return [
        '╔════════════════════════════════════╗',
        '║    ✓ VISUAL THEME UPDATED          ║',
        '╚════════════════════════════════════╝',
        '',
        `> Active theme: [${option.toUpperCase()}]`,
        '> Reload page to apply changes.',
      ];
    },
  },

  geek: {
    command: 'geek',
    description: 'Toggle geek mode effects',
    hidden: true,
    handler: (args: string[]) => {
      if (!checkAuth()) {
        return [
          '╔════════════════════════════════════╗',
          '║     ✗ UNAUTHORIZED                 ║',
          '╚════════════════════════════════════╝',
          '',
          '> Authentication required.',
          '> Use: auth <access_key>',
        ];
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
          '╔════════════════════════════════════╗',
          '║     FX MODULES CONTROL             ║',
          '╚════════════════════════════════════╝',
          '',
          'Available modules:',
          '  matrixrain    - Digital rain simulation',
          '  glitch        - Signal interference FX',
          '  ascii         - Character particle system',
          '  scanlines     - CRT monitor emulation',
          '  all           - Activate all modules',
          '  none          - Disable all modules',
          '',
          '> Usage: geek <module>',
        ];
      }

      if (!validEffects.includes(effect)) {
        return [
          '╔════════════════════════════════════╗',
          '║     ✗ UNKNOWN MODULE               ║',
          '╚════════════════════════════════════╝',
          '',
          `> Module "${effect}" not found.`,
          `> Available: ${validEffects.join(', ')}`,
        ];
      }

      // Show thematic output without exposing internal toggle commands
      const effectNames: Record<string, string> = {
        matrixrain: 'DIGITAL RAIN',
        glitch: 'SIGNAL INTERFERENCE',
        ascii: 'PARTICLE SYSTEM',
        scanlines: 'CRT EMULATION',
        all: 'ALL MODULES',
        none: 'ALL MODULES',
      };

      const action = effect === 'none' ? 'DEACTIVATED' : 'ACTIVATED';
      
      return [
        '╔════════════════════════════════════╗',
        `║    ✓ ${effectNames[effect]} ${action}`,
        '╚════════════════════════════════════╝',
        '',
        `> Module status: [${action}]`,
        '> Visual effects updating...',
      ];
    },
  },

  status: {
    command: 'status',
    description: 'View system status',
    hidden: true,
    handler: () => {
      if (!checkAuth()) {
        return [
          '╔════════════════════════════════════╗',
          '║     ✗ UNAUTHORIZED                 ║',
          '╚════════════════════════════════════╝',
          '',
          '> Authentication required.',
          '> Use: auth <access_key>',
        ];
      }

      const timeLeft = adminSessionExpiry ? Math.max(0, adminSessionExpiry - Date.now()) : 0;
      const minutesLeft = Math.floor(timeLeft / 60000);
      const secondsLeft = Math.floor((timeLeft % 60000) / 1000);

      return [
        '╔════════════════════════════════════╗',
        '║      SYSTEM DIAGNOSTICS            ║',
        '╚════════════════════════════════════╝',
        '',
        `> Visual Theme:     [${currentPillOption.toUpperCase()}]`,
        `> Session Time:     [${minutesLeft}m ${secondsLeft.toString().padStart(2, '0')}s]`,
        '',
        'Active FX Modules:',
        '  [■] Matrix Rain     - ONLINE',
        '  [■] Scanlines       - ONLINE',
        '  [■] Glitch FX       - ONLINE',
        '  [■] ASCII Particles - ONLINE',
        '',
        '> System status: OPTIMAL',
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
        '╔════════════════════════════════════╗',
        '║    ✓ SESSION TERMINATED            ║',
        '╚════════════════════════════════════╝',
        '',
        '> Neural link severed.',
        '> All admin privileges revoked.',
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
        '╔════════════════════════════════════╗',
        '║      ADMIN PROTOCOL INITIATED      ║',
        '╚════════════════════════════════════╝',
        '',
        '> Level 5 access required.',
        '',
        '> Use: auth <access_key>',
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
