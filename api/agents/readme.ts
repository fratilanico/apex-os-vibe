import type { VercelRequest, VercelResponse } from '@vercel/node';
import { execSync } from 'child_process';

interface ReadmeRequest {
  action: 'generate' | 'validate' | 'compliance-check';
  projectPath?: string;
  projectName?: string;
  readmeContent?: string;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { action, projectPath = '.', projectName, readmeContent } = req.body as ReadmeRequest;

  try {
    switch (action) {
      case 'generate':
        // Execute generate-readme.sh script
        const output = execSync(
          `./scripts/generate-readme.sh --project=${projectName || 'apex-os-vibe'}`,
          { cwd: projectPath, encoding: 'utf-8' }
        );
        res.status(200).json({ 
          success: true, 
          action: 'generate',
          output,
          message: 'README generated successfully' 
        });
        break;

      case 'validate':
        // Validate existing README
        const validationResult = await validateReadme(readmeContent);
        res.status(200).json({
          success: true,
          action: 'validate',
          ...validationResult
        });
        break;

      case 'compliance-check':
        // Full compliance audit
        const complianceResult = await checkCompliance(projectPath);
        res.status(200).json({
          success: true,
          action: 'compliance-check',
          ...complianceResult
        });
        break;

      default:
        res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    res.status(500).json({ 
      error: 'README agent failed', 
      details: error instanceof Error ? error.message : String(error) 
    });
  }
}

async function validateReadme(content: string | undefined) {
  const requiredSections = [
    'Quick Start',
    'System Status',
    'AI Provider Cascade',
    'Agent Swarm',
    'API Documentation',
    'Environment Configuration',
    'Cost Analysis',
    'Troubleshooting'
  ];

  const results = requiredSections.map(section => ({
    section,
    present: content?.includes(section) || false
  }));

  const passed = results.filter(r => r.present).length;
  const total = requiredSections.length;

  return {
    valid: passed === total,
    score: `${passed}/${total}`,
    sections: results,
    recommendations: results
      .filter(r => !r.present)
      .map(r => `Add "${r.section}" section`)
  };
}

async function checkCompliance(projectPath: string) {
  const fs = await import('fs');
  const path = await import('path');
  
  const readmePath = path.join(projectPath, 'README.md');
  const hasReadme = fs.existsSync(readmePath);
  
  if (!hasReadme) {
    return {
      compliant: false,
      readmeExists: false,
      message: 'README.md not found. Run generate action first.'
    };
  }

  const content = fs.readFileSync(readmePath, 'utf-8');
  const validation = await validateReadme(content);

  return {
    compliant: validation.valid,
    readmeExists: true,
    ...validation,
    asciiFormatting: {
      doubleBorders: (content.match(/╔|╗|╚|╝/g) || []).length > 0,
      singleBorders: (content.match(/┌|┐|└|┘/g) || []).length > 0,
      progressBars: (content.match(/\[█+░*\]/g) || []).length > 0
    }
  };
}
