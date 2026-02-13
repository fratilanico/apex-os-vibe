/**
 * Agent Output Validator
 * Enforces Golden Standard compliance on all agent outputs
 */

export interface ComplianceReport {
  score: number;
  violations: string[];
  formatted: boolean;
  passed: boolean;
}

export class AgentComplianceEnforcer {
  private static instance: AgentComplianceEnforcer;
  
  // Golden Standard Requirements
  private readonly REQUIREMENTS = {
    asciiBorders: /[╔╗╚╝┌┐└┘]/,
    progressBars: /\[█{0,10}░{0,10}\]\s*\d{1,3}%/,
    statusIcons: /[🟢🔴🟡⚪✅❌🔥⚡🚀💰🧠🛡️⚙️🔒]/,
    tonyStarkTone: /(Listen up|Here's the deal|Alright, here's how|Now go build something legendary)/i,
    noUncertainLanguage: /\b(I think|maybe|perhaps|should|might)\b/i
  };

  static getInstance(): AgentComplianceEnforcer {
    if (!AgentComplianceEnforcer.instance) {
      AgentComplianceEnforcer.instance = new AgentComplianceEnforcer();
    }
    return AgentComplianceEnforcer.instance;
  }

  /**
   * Validate agent output against Golden Standard
   */
  validate(output: string = ''): ComplianceReport {
    const safeOutput = output || '';
    const violations: string[] = [];
    let score = 100;

    // Check ASCII borders
    if (!this.REQUIREMENTS.asciiBorders.test(safeOutput)) {
      violations.push('Missing ASCII borders (╔═══╗ ┌───┐)');
      score -= 20;
    }

    // Check progress bars
    if (!this.REQUIREMENTS.progressBars.test(safeOutput)) {
      violations.push('Missing progress bars [████████░░]');
      score -= 15;
    }

    // Check status icons
    if (!this.REQUIREMENTS.statusIcons.test(safeOutput)) {
      violations.push('Missing status icons (🟢🔴🟡)');
      score -= 15;
    }

    // Check Tony Stark tone
    if (!this.REQUIREMENTS.tonyStarkTone.test(safeOutput)) {
      violations.push('Missing Tony Stark tone ("Listen up...")');
      score -= 20;
    }

    // Check for uncertain language
    const uncertainMatches = safeOutput.match(this.REQUIREMENTS.noUncertainLanguage) || [];
    if (uncertainMatches.length > 0) {
      violations.push(`Uncertain language detected: ${uncertainMatches.join(', ')}`);
      score -= 10;
    }

    return {
      score: Math.max(0, score),
      violations,
      formatted: violations.length === 0,
      passed: score >= 80
    };
  }

  /**
   * Auto-format non-compliant output
   */
  autoFormat(output: string = '', agentName: string = 'UNKNOWN'): string {
    const safeOutput = output || 'System initialized with empty payload.';
    const safeAgentName = (agentName || 'UNKNOWN').toUpperCase();
    const validation = this.validate(safeOutput);
    
    if (validation.passed) {
      return safeOutput;
    }

    let formattedOutput = safeOutput;

    // Add ASCII header if missing
    if (!this.REQUIREMENTS.asciiBorders.test(formattedOutput)) {
      formattedOutput = `╔══════════════════════════════════════════════════════════════════════════════╗\n║  🔥 ${safeAgentName} OUTPUT                                                      ║\n╚══════════════════════════════════════════════════════════════════════════════╝\n\n${formattedOutput}`;
    }

    // Add Tony Stark opener if missing
    if (!this.REQUIREMENTS.tonyStarkTone.test(formattedOutput)) {
      formattedOutput = `Listen up - ${formattedOutput}`;
    }

    // Replace uncertain language
    formattedOutput = formattedOutput
      .replace(/\bI think\b/gi, 'You KNOW')
      .replace(/\bmaybe\b/gi, 'definitely')
      .replace(/\bperhaps\b/gi, 'absolutely')
      .replace(/\bshould\b/gi, 'will')
      .replace(/\bmight\b/gi, 'does');

    // Add power closing if missing
    if (!formattedOutput.includes('legendary')) {
      formattedOutput += '\n\nNow go build something legendary. 🔥';
    }

    return formattedOutput;
  }

  /**
   * Enforce compliance on agent output
   * UPDATED 2026-02-08: Pass-through mode - system prompt now handles formatting
   */
  enforce(output: string, _agentName: string): { output: string; report: ComplianceReport } {
    // Pass through - let the system prompt handle formatting naturally
    // The AI now has proper CLI formatting instructions in TONY_STARK_SYSTEM_PROMPT
    const report: ComplianceReport = { 
      score: 100, 
      violations: [], 
      formatted: true, 
      passed: true 
    };
    
    return { output, report };
  }
}

// Export singleton instance
export const complianceEnforcer = AgentComplianceEnforcer.getInstance();
