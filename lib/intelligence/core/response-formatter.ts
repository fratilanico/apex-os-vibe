/**
 * Response Formatter - Persona-Aware Output Generation
 * APEX OS Intelligence Layer v2.0
 */

import { 
  IntelligenceResponse, 
  UserPersona, 
  UserProfile,
  ConversationMessage 
} from '../types';

export class ResponseFormatter {
  
  async formatResponse(
    response: IntelligenceResponse,
    persona: UserPersona,
    profile: UserProfile,
    _conversationHistory: ConversationMessage[]
  ): Promise<IntelligenceResponse> {
    
    let formattedText = response.text;

    // GOLDEN STANDARD: Strictly surgical responses. No generic follow-ups unless explicitly useful.
    // If response already has a dashboard, we don't add more clutter.
    if (formattedText.includes('╔════')) {
      return {
        ...response,
        text: formattedText,
        formattedForPersona: true
      };
    }

    // Apply persona-specific formatting
    switch (persona) {
      case 'founder':
        formattedText = this.formatForFounder(formattedText, profile);
        break;
      case 'developer':
        formattedText = this.formatForDeveloper(formattedText, profile);
        break;
      case 'investor':
        formattedText = this.formatForInvestor(formattedText, profile);
        break;
      case 'student':
        formattedText = this.formatForStudent(formattedText, profile);
        break;
      case 'enterprise':
        formattedText = this.formatForEnterprise(formattedText, profile);
        break;
      case 'researcher':
        formattedText = this.formatForResearcher(formattedText, profile);
        break;
    }

    return {
      ...response,
      text: formattedText,
      formattedForPersona: true
    };
  }

  private formatForFounder(text: string, _profile: UserProfile): string {
    return text; // Prompt handles it
  }

  private formatForDeveloper(text: string, _profile: UserProfile): string {
    return text; // Prompt handles it
  }

  private formatForInvestor(text: string, _profile: UserProfile): string {
    return text; // Prompt handles it
  }

  private formatForStudent(text: string, _profile: UserProfile): string {
    return text; // Prompt handles it
  }

  private formatForEnterprise(text: string, _profile: UserProfile): string {
    return text; // Prompt handles it
  }

  private formatForResearcher(text: string, _profile: UserProfile): string {
    return text; // Prompt handles it
  }
}
