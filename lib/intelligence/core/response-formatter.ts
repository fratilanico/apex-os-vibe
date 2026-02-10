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
    conversationHistory: ConversationMessage[]
  ): Promise<IntelligenceResponse> {
    
    let formattedText = response.text;

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

    // Add contextual follow-up suggestions
    const followUps = this.generateFollowUps(response, persona, conversationHistory);
    if (followUps.length > 0) {
      formattedText += '\n\n---\n**Related:** ' + followUps.join(' | ');
    }

    return {
      ...response,
      text: formattedText,
      formattedForPersona: true
    };
  }

  private formatForFounder(text: string, _profile: UserProfile): string {
    // Add business context and ROI framing
    let formatted = text;

    // Add actionable takeaways section if long response
    if (text.length > 500) {
      const takeaways = this.extractTakeaways(text);
      if (takeaways.length > 0) {
        formatted += '\n\n## 🎯 Key Takeaways\n';
        takeaways.forEach((t, i) => {
          formatted += `${i + 1}. ${t}\n`;
        });
      }
    }

    // Add next steps for implementation
    formatted += '\n\n## 🚀 Next Steps\n';
    formatted += '1. Review the recommendations above\n';
    formatted += '2. Prioritize based on your current stage\n';
    formatted += '3. Schedule implementation sprint\n';

    return formatted;
  }

  private formatForDeveloper(text: string, _profile: UserProfile): string {
    // Ensure code blocks are properly formatted
    let formatted = text;

    // Add syntax highlighting hints
    formatted = formatted.replace(
      /```(\w+)?\n/g,
      (_match, lang) => `\`\`\`${lang || 'typescript'}\n`
    );

    // Add copy button markers for code blocks
    formatted = formatted.replace(
      /```([\s\S]*?)```/g,
      (_match, code) => `[COPY_CODE]\`\`\`${code}\`\`\`[/COPY_CODE]`
    );

    // Add implementation notes section
    if (text.includes('```')) {
      formatted += '\n\n## 💻 Implementation Notes\n';
      formatted += '- Copy code blocks using the copy button\n';
      formatted += '- Test in development environment first\n';
      formatted += '- Check console for any warnings\n';
    }

    return formatted;
  }

  private formatForInvestor(text: string, _profile: UserProfile): string {
    // Add metrics and financial framing
    let formatted = text;

    // Highlight numbers and metrics
    formatted = formatted.replace(
      /(\$[\d,]+(?:\.\d+)?(?:M|K|B)?|\d+%|\d+\.\d+x)/g,
      '**$1**'
    );

    // Add risk assessment section
    formatted += '\n\n## 📊 Risk Assessment\n';
    formatted += '- **Market Risk:** Consider competitive landscape\n';
    formatted += '- **Execution Risk:** Team capability alignment\n';
    formatted += '- **Financial Risk:** Cash runway impact\n';

    return formatted;
  }

  private formatForStudent(text: string, profile: UserProfile): string {
    // Simplify language and add learning aids
    let formatted = text;

    // Add difficulty indicator
    const difficulty = profile.expertiseLevel;
    formatted = `📚 **Difficulty:** ${difficulty.toUpperCase()}\n\n${formatted}`;

    // Add glossary for technical terms
    const technicalTerms = this.extractTechnicalTerms(text);
    if (technicalTerms.length > 0) {
      formatted += '\n\n## 📖 Key Terms\n';
      technicalTerms.forEach(term => {
        formatted += `- **${term}**\n`;
      });
    }

    // Add practice exercise
    formatted += '\n\n## ✏️ Practice\n';
    formatted += 'Try implementing this concept in a small project.\n';
    formatted += 'Share your results for feedback!\n';

    return formatted;
  }

  private formatForEnterprise(text: string, _profile: UserProfile): string {
    // Add compliance and security considerations
    let formatted = text;

    // Add enterprise warning boxes
    formatted = formatted.replace(
      /(security|compliance|gdpr|hipaa|sox)/gi,
      '⚠️ **$1** (Review with compliance team)'
    );

    // Add scaling considerations
    formatted += '\n\n## 🏢 Enterprise Considerations\n';
    formatted += '- **Compliance:** Review with legal team\n';
    formatted += '- **Security:** Ensure data protection\n';
    formatted += '- **Scalability:** Plan for growth\n';
    formatted += '- **Integration:** Check existing systems\n';

    return formatted;
  }

  private formatForResearcher(text: string, _profile: UserProfile): string {
    // Add citations and academic structure
    let formatted = text;

    // Format sources if present
    if (formatted.includes('Source:') || formatted.includes('Citation:')) {
      formatted = formatted.replace(
        /Source:\s*(.+?)(?=\n|$)/g,
        '📚 $&'
      );
    }

    // Add methodology section
    formatted += '\n\n## 🔬 Methodology\n';
    formatted += 'Data sources and analysis methods are documented.\n';
    formatted += 'Request raw data for independent verification.\n';

    return formatted;
  }

  private extractTakeaways(text: string): string[] {
    const takeaways: string[] = [];
    const lines = text.split('\n');

    for (const line of lines) {
      // Look for key points (bullet points, numbered lists, or bold text)
      if (line.match(/^[-*•]\s+(.+)/) || line.match(/^\d+\.\s+(.+)/) || line.match(/\*\*(.+?)\*\*/)) {
        const clean = line.replace(/^[\s-*•\d.]+/, '').replace(/\*\*/g, '').trim();
        if (clean.length > 20 && clean.length < 200) {
          takeaways.push(clean);
        }
      }
    }

    return takeaways.slice(0, 5); // Max 5 takeaways
  }

  private extractTechnicalTerms(text: string): string[] {
    const terms: string[] = [];
    const termPatterns = [
      /\b(API|SDK|JSON|REST|GraphQL|SQL|NoSQL)\b/g,
      /\b(TypeScript|JavaScript|Python|React|Node\.js)\b/g,
      /\b(Microservices|Serverless|Container|Kubernetes)\b/g,
      /\b(AI|ML|LLM|NLP|Vector|Embedding)\b/g
    ];

    for (const pattern of termPatterns) {
      const matches = text.match(pattern);
      if (matches) {
        terms.push(...matches);
      }
    }

    return [...new Set(terms)].slice(0, 10); // Remove duplicates, max 10
  }

  private generateFollowUps(
    response: IntelligenceResponse,
    _persona: UserPersona,
    _history: ConversationMessage[]
  ): string[] {
    const followUps: string[] = [];

    // Based on response content and persona
    if (response.metadata.intent === 'coding') {
      followUps.push('Show me an example');
      followUps.push('What are common pitfalls?');
    }

    if (response.metadata.intent === 'strategy') {
      followUps.push('How do I implement this?');
      followUps.push('What are the risks?');
    }

    if (response.metadata.intent === 'learning') {
      followUps.push('Recommend a course');
      followUps.push('Where can I practice?');
    }

    // Limit to 3 suggestions
    return followUps.slice(0, 3);
  }
}
