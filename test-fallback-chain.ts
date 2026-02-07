// Test script to verify AI provider fallback chain
import { queryAI } from './lib/ai/globalAIService';
import dotenv from 'dotenv';

dotenv.config();

async function testFallbackChain() {
  console.log('=== TESTING AI PROVIDER FALLBACK CHAIN ===\n');
  
  const testMessage = "Hello, this is a test message";
  
  try {
    console.log('1. Testing Perplexity (Primary)...');
    const response = await queryAI(testMessage, []);
    console.log('✅ SUCCESS:', response.provider, '-', response.model);
    console.log('Response:', response.content.substring(0, 100) + '...\n');
  } catch (error) {
    console.error('❌ FAILED:', error.message);
    console.log('Should fallback to Groq...\n');
  }
}

testFallbackChain();
