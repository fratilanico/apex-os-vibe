/**
 * APEX OS - Pitch Deck Data Structure
 * Mission Control v4.0 - Operation ShowMeThePitch
 */

export interface GrowthData {
  month: number;
  acquisition: number;
  churn: number;
  totalUsers: number;
}

export interface PitchSection {
  id: string;
  title: string;
  content: string[];
  meta?: Record<string, any>;
}

export const growthModel: GrowthData[] = [
  { "month": 1, "acquisition": 35, "churn": 0, "totalUsers": 35 },
  { "month": 2, "acquisition": 38.38, "churn": 0.7, "totalUsers": 73 },
  { "month": 3, "acquisition": 41.77, "churn": 1.45, "totalUsers": 113 },
  { "month": 4, "acquisition": 45.15, "churn": 2.26, "totalUsers": 156 },
  { "month": 5, "acquisition": 48.54, "churn": 3.12, "totalUsers": 201 },
  { "month": 6, "acquisition": 51.92, "churn": 4.03, "totalUsers": 249 },
  { "month": 7, "acquisition": 55.31, "churn": 4.98, "totalUsers": 300 },
  { "month": 8, "acquisition": 58.69, "churn": 5.99, "totalUsers": 352 },
  { "month": 9, "acquisition": 62.07, "churn": 7.04, "totalUsers": 407 },
  { "month": 10, "acquisition": 65.46, "churn": 8.15, "totalUsers": 465 },
  { "month": 11, "acquisition": 68.84, "churn": 9.29, "totalUsers": 524 },
  { "month": 12, "acquisition": 72.23, "churn": 10.48, "totalUsers": 586 },
  { "month": 13, "acquisition": 75.61, "churn": 11.72, "totalUsers": 650 },
  { "month": 14, "acquisition": 79, "churn": 13, "totalUsers": 716 },
  { "month": 15, "acquisition": 82.38, "churn": 14.32, "totalUsers": 784 },
  { "month": 16, "acquisition": 85.77, "churn": 15.68, "totalUsers": 854 },
  { "month": 17, "acquisition": 89.15, "churn": 17.08, "totalUsers": 926 },
  { "month": 18, "acquisition": 92.53, "churn": 18.52, "totalUsers": 1000 }
];

export const pitchSections: PitchSection[] = [
  {
    id: "hook",
    title: "The Hook",
    content: [
      "The Future of Work isn't AI replacing humans.",
      "It's humans orchestrating AI swarms.",
      "APEX OS is the Operating System for the Neural Era."
    ]
  },
  {
    id: "problem",
    title: "The Problem",
    content: [
      "EdTech is broken: 15% completion rates and static video tutorials.",
      "The 'AI Gap': 90% of workers want to use AI; <5% know how to build with it.",
      "Current learning doesn't match the velocity of the AI revolution."
    ]
  },
  {
    id: "solution",
    title: "The Solution",
    content: [
      "A live, multi-agent ecosystem (APEX OS) where learning is building.",
      "Recursive Agent Coordination: Students deploy their own swarm to solve real tasks.",
      "Gamified 'Full Wire' UI: Maximum immersion via Terminal-first architecture."
    ]
  },
  {
    id: "market",
    title: "Market Opportunity",
    content: [
      "Total Addressable Market: $50B+ Global EdTech & Upskilling.",
      "Serviceable Market: 100M+ Knowledge Workers transitioning to AI.",
      "Immediate Entry: The 32,000-strong InfoAcademy high-intent lead list."
    ]
  },
  {
    id: "team",
    title: "The Team",
    content: [
      "Nicolae Fratila (CEO): Technical Architect behind InfoAcademy & APEX OS.",
      "Kevin Obeegadoo (Advisor): Strategic scale and fundraising specialist.",
      "The Swarm: 36 recursive agents handling Infrastructure, Security, and Code."
    ]
  },
  {
    id: "academy",
    title: "APEX Academy",
    content: [
      "6-Module Mastery: From 'Prompt Engineering' to 'Autonomous Founder'.",
      "85% Gross Margins via automated curriculum delivery.",
      "Proof of Work: Every graduate leaves with a live, revenue-generating agent swarm."
    ]
  },
  {
    id: "accelerator",
    title: "APEX Accelerator",
    content: [
      "Capturing the Value: We fund the top 5% of Academy graduates.",
      "Built-in Pipeline: High-quality deal flow at zero acquisition cost.",
      "Shared Infrastructure: Graduates build on the APEX stack, creating a technical moat."
    ]
  },
  {
    id: "economics",
    title: "Unit Economics",
    content: [
      "SaaS Floor (25:1 LTV/CAC): Pure subscription revenue from the Academy.",
      "Ecosystem Ceiling (56:1 LTV/CAC): Including Accelerator equity upside and B2B licenses.",
      "CAC Efficiency: Leveraging our 32k lead list to hit $0.80 blended CAC."
    ],
    meta: {
      ratios: {
        saasFloor: "25:1",
        ecosystemCeiling: "56:1"
      }
    }
  },
  {
    id: "gtm",
    title: "Go-To-Market",
    content: [
      "Phase 1: Direct conversion of the 32,000 InfoAcademy leads.",
      "Phase 2: Viral 'Show Me The Pitch' social loops and builder leaderboards.",
      "Phase 3: Strategic influencer partnerships in the AI/Dev space."
    ]
  },
  {
    id: "b2g",
    title: "B2G & Partnerships",
    content: [
      "National Digitization: Partnering with the Romanian Ministry of Education.",
      "EU Grants: Tapping into the €20B Digital Europe Program.",
      "University Integration: APEX as the 'Lab' for Computer Science departments."
    ]
  },
  {
    id: "risk",
    title: "Risk Mitigation",
    content: [
      "Tech Obsolescence: We teach core orchestration principles, not specific tool syntax.",
      "Competition: Our community network effect and proprietary agent-stack are high-moat.",
      "Execution: Phased rollout using recursive agent automation to keep overhead low."
    ]
  },
  {
    id: "ask",
    title: "The Ask",
    content: [
      "Raising $1.2M Seed Round.",
      "Goal: Hit 1,000 total users and $2M ARR within 18 months.",
      "Use of Funds: 40% Engineering, 30% Growth, 20% Accelerator Pool, 10% Ops."
    ]
  }
];

export const financialCalculations = {
  saasFloor: {
    ltv: 1875,
    cac: 75,
    ratio: 25
  },
  ecosystemCeiling: {
    ltv: 4200,
    cac: 75,
    ratio: 56
  },
  note: "Ceiling includes projected equity value from Accelerator graduates and secondary B2B revenue."
};

export default {
  growthModel,
  pitchSections,
  financialCalculations
};
