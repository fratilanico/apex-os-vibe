/**
 * APEX OS - AI Intelligence Layer v2.0
 * Main Entry Point
 * 
 * Architecture: Multi-model AI system with persona-aware responses
 * Services: Gemini (Active), Perplexity (Active), DeepSeek (Pending)
 * Features: Query parsing, Context management, Service routing, 
 *           Response formatting, Micro-questions, Recommendations
 */

// Core Components
export { QueryParser } from './core/query-parser';
export { ContextManager } from './core/context-manager';
export { ServiceRouter } from './core/service-router';
export { ResponseFormatter } from './core/response-formatter';

// Agents
export { MicroQuestionSystem } from './agents/micro-questions';

// Recommendations
export { RecommendationEngine } from './recommendations/engine';

// Types
export * from './types';

// API Routes
export * from './api/routes';

// Version
export const VERSION = '2.0.0';
export const BUILD_DATE = '2026-02-10';
export const STATUS = 'ACTIVE';
