/**
 * Agent Output Middleware
 * Wraps all agent responses with Golden Standard compliance
 */

import { complianceEnforcer } from './complianceEnforcer';

/**
 * Wrap agent function with compliance enforcement
 */
export function withCompliance<T extends (...args: any[]) => any>(
  agentFunction: T,
  agentName: string
): T {
  return ((...args: any[]) => {
    // Execute original function
    const result = agentFunction(...args);
    
    // Handle promises
    if (result instanceof Promise) {
      return result.then((output: string) => {
        const { output: formatted, report } = complianceEnforcer.enforce(output, agentName);
        
        if (!report.passed) {
          console.warn(`⚠️  ${agentName} compliance score: ${report.score}%`);
          console.warn('Violations:', report.violations);
        }
        
        return formatted;
      });
    }
    
    // Handle synchronous results
    if (typeof result === 'string') {
      const { output: formatted, report } = complianceEnforcer.enforce(result, agentName);
      
      if (!report.passed) {
        console.warn(`⚠️  ${agentName} compliance score: ${report.score}%`);
      }
      
      return formatted;
    }
    
    return result;
  }) as T;
}

/**
 * Validate agent output without modifying
 */
export function validateAgentOutput(output: string, agentName: string) {
  return complianceEnforcer.validate(output);
}

/**
 * Format agent output to Golden Standard
 */
export function formatAgentOutput(output: string, agentName: string) {
  return complianceEnforcer.autoFormat(output, agentName);
}