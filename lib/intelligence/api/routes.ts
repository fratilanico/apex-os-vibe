/**
 * API Routes - Intelligence Layer Endpoints
 * APEX OS Intelligence Layer v2.0
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { QueryParser } from '../core/query-parser';
import { ContextManager } from '../core/context-manager';
import { ServiceRouter } from '../core/service-router';
import { ResponseFormatter } from '../core/response-formatter';
import { MicroQuestionSystem } from '../agents/micro-questions';
import { RecommendationEngine } from '../recommendations/engine';
import { 
  IntelligenceQuery, 
  IntelligenceResponse,
  UserPersona,
  StudyRecommendation,
  MicroQuestion 
} from '../types';

// Initialize core components
const queryParser = new QueryParser();
const contextManager = new ContextManager();
const serviceRouter = new ServiceRouter();
const responseFormatter = new ResponseFormatter();
const microQuestionSystem = new MicroQuestionSystem();
const recommendationEngine = new RecommendationEngine();

/**
 * POST /api/intelligence/query
 * Main intelligence endpoint - process user queries
 */
export async function handleQuery(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, userId, sessionId } = req.body;

    if (!text || !userId) {
      return res.status(400).json({ 
        error: 'Missing required fields: text, userId' 
      });
    }

    // 1. Create query object
    const query: IntelligenceQuery = {
      id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      text,
      timestamp: Date.now(),
    };

    // 2. Parse intent
    const intent = await queryParser.parse(query);

    // 3. Build context
    const context = await contextManager.buildQueryContext(userId, text);

    // 4. Route to AI service
    const rawResponse = await serviceRouter.routeQuery(
      query, 
      intent, 
      context.persona
    );

    // 5. Format for persona
    const formattedResponse = await responseFormatter.formatResponse(
      rawResponse,
      context.persona,
      context.userProfile,
      context.conversationHistory
    );

    // 6. Save to conversation history
    await contextManager.addConversationMessage(userId, {
      role: 'user',
      content: text,
      timestamp: Date.now(),
    });

    await contextManager.addConversationMessage(userId, {
      role: 'assistant',
      content: formattedResponse.text,
      timestamp: Date.now(),
      provider: formattedResponse.provider,
    });

    // 7. Return response
    return res.status(200).json({
      success: true,
      data: formattedResponse,
      meta: {
        intent: intent.type,
        persona: context.persona,
        confidence: intent.confidence,
      },
    });

  } catch (error) {
    console.error('Intelligence query error:', error);
    return res.status(500).json({
      error: 'Failed to process query',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * GET /api/intelligence/profile/:userId
 * Get user profile and persona
 */
export async function handleGetProfile(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'Missing userId' });
    }

    const profile = await contextManager.getUserProfile(userId);
    const session = await contextManager.getSession(userId);

    return res.status(200).json({
      success: true,
      data: {
        profile,
        session,
      },
    });

  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ error: 'Failed to get profile' });
  }
}

/**
 * POST /api/intelligence/profile/:userId
 * Update user profile
 */
export async function handleUpdateProfile(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;
    const updates = req.body;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'Missing userId' });
    }

    const updatedProfile = await contextManager.updateUserProfile(userId, updates);

    return res.status(200).json({
      success: true,
      data: updatedProfile,
    });

  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
}

/**
 * GET /api/intelligence/questions/:userId
 * Get next micro-question for user profiling
 */
export async function handleGetQuestion(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'Missing userId' });
    }

    const profile = await contextManager.getUserProfile(userId);
    const question = await microQuestionSystem.getNextQuestion(profile);

    if (!question) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'Profiling complete',
      });
    }

    return res.status(200).json({
      success: true,
      data: question,
    });

  } catch (error) {
    console.error('Get question error:', error);
    return res.status(500).json({ error: 'Failed to get question' });
  }
}

/**
 * POST /api/intelligence/questions/:userId/answer
 * Submit answer to micro-question
 */
export async function handleSubmitAnswer(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;
    const { questionId, answer } = req.body;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'Missing userId' });
    }

    const profile = await contextManager.getUserProfile(userId);
    const updatedProfile = await microQuestionSystem.processAnswer(
      profile,
      questionId,
      answer
    );

    await contextManager.updateUserProfile(userId, updatedProfile);

    return res.status(200).json({
      success: true,
      data: updatedProfile,
    });

  } catch (error) {
    console.error('Submit answer error:', error);
    return res.status(500).json({ error: 'Failed to submit answer' });
  }
}

/**
 * GET /api/intelligence/recommendations/:userId
 * Get personalized study recommendations
 */
export async function handleGetRecommendations(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;
    const limit = parseInt(req.query.limit as string) || 5;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'Missing userId' });
    }

    const profile = await contextManager.getUserProfile(userId);
    const session = await contextManager.getSession(userId);
    
    const recommendations = await recommendationEngine.getRecommendations(
      profile,
      session,
      limit
    );

    return res.status(200).json({
      success: true,
      data: recommendations,
    });

  } catch (error) {
    console.error('Get recommendations error:', error);
    return res.status(500).json({ error: 'Failed to get recommendations' });
  }
}

/**
 * GET /api/intelligence/history/:userId
 * Get conversation history
 */
export async function handleGetHistory(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;
    const limit = parseInt(req.query.limit as string) || 20;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'Missing userId' });
    }

    const history = await contextManager.getConversationHistory(userId);
    const limited = history.slice(-limit);

    return res.status(200).json({
      success: true,
      data: limited,
    });

  } catch (error) {
    console.error('Get history error:', error);
    return res.status(500).json({ error: 'Failed to get history' });
  }
}

/**
 * GET /api/intelligence/health
 * Health check endpoint
 */
export async function handleHealth(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return res.status(200).json({
    status: 'healthy',
    version: '2.0',
    components: {
      queryParser: 'active',
      contextManager: 'active',
      serviceRouter: 'active',
      responseFormatter: 'active',
      microQuestions: 'active',
      recommendations: 'active',
    },
    timestamp: new Date().toISOString(),
  });
}
