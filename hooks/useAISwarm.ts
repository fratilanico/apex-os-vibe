import { useOnboardingStore } from '../../stores/useOnboardingStore';
import { queryAI } from '../../lib/ai/globalAIService';

const useAISwarm = () => {
  const { addHistory, trackTerminalCommand, persona, isUnlocked, email } = useOnboardingStore();

  const querySwarm = async (message: string, history: any[]) => {
    const context = `Terminal Operator Session. Persona: ${persona}. Sync Level: ${isUnlocked ? 'TIER 1' : 'TIER 0'}.`;
    
    try {
      const response = await queryAI({
        message,
        history,
        userEmail: email || undefined,
        context
      });
      trackTerminalCommand(message, 'input', response.content, 'success');
      return response.content;
    } catch (error) {
      trackTerminalCommand(message, 'input', 'AI Query failed', 'error');
      return 'Communication error. Swarm link unstable.';
    }
  };

  return { querySwarm };
};

export default useAISwarm;
