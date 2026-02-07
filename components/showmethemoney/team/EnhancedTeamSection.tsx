import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Zap, Award, ArrowRight,
  CheckCircle2, Star, Briefcase
} from 'lucide-react';

// Team Member Data
const teamMembers = [
  {
    name: 'Nicolae Fratila',
    role: 'CEO & Chief Architect',
    equity: 38.25,
    avatar: 'NF',
    color: 'cyan',
    background: 'Technical architect behind InfoAcademy (32K students) and APEX OS. Former software engineer with deep expertise in AI orchestration, gamification, and educational technology.',
    expertise: ['AI/ML Architecture', 'System Design', 'Product Strategy', 'Technical Leadership'],
    achievements: [
      'Built InfoAcademy to 32,000 students',
      'Developed proprietary agent orchestration framework',
      'Full-stack expertise across 12+ technologies',
      'Speaker at 5+ tech conferences'
    ],
    social: {
      linkedin: '#',
      twitter: '#',
      github: '#'
    }
  },
  {
    name: 'Kevin Obeegadoo',
    role: 'Strategic Advisor',
    equity: 5.0,
    avatar: 'KO',
    color: 'violet',
    background: 'Strategic advisor with extensive experience in fundraising, business development, and scaling startups. Former investment banker with deep network in VC and private equity.',
    expertise: ['Fundraising Strategy', 'Business Development', 'Market Expansion', 'Investor Relations'],
    achievements: [
      '$50M+ raised for portfolio companies',
      'Network of 200+ institutional investors',
      'Advised 10+ successful exits',
      'Expert in international expansion'
    ],
    social: {
      linkedin: '#',
      twitter: '#'
    }
  }
];

// Advisory Board
const advisoryBoard = [
  {
    name: 'Dr. Sarah Chen',
    role: 'AI Research Advisor',
    background: 'Former Google Brain researcher, PhD MIT',
    expertise: 'Large Language Models'
  },
  {
    name: 'Marcus Johnson',
    role: 'EdTech Strategy Advisor',
    background: 'Former CPO at Coursera, VP Product at Udemy',
    expertise: 'Online Education'
  },
  {
    name: 'Elena Popescu',
    role: 'EU Expansion Advisor',
    background: 'Former EU Policy Director, Tech Brussels',
    expertise: 'Regulatory Affairs'
  }
];

// 36-Agent Swarm Structure
const agentSwarm = [
  {
    department: 'Infrastructure',
    count: 8,
    color: 'cyan',
    agents: ['Cloud Architect', 'DevOps Engineer', 'Security Monitor', 'Database Admin', 'CDN Specialist', 'Monitoring', 'Backup Systems', 'Network Engineer'],
    load: 32
  },
  {
    department: 'Security',
    count: 6,
    color: 'rose',
    agents: ['Threat Detection', 'Vulnerability Scanner', 'Compliance Guardian', 'Incident Response', 'Penetration Tester', 'Security Auditor'],
    load: 28
  },
  {
    department: 'Intelligence',
    count: 7,
    color: 'violet',
    agents: ['AI Director', 'Research Analyst', 'Pattern Recognition', 'Predictive Modeler', 'Data Scientist', 'NLP Specialist', 'Knowledge Graph'],
    load: 41
  },
  {
    department: 'Operations',
    count: 5,
    color: 'amber',
    agents: ['Deployment Automation', 'Cost Optimizer', 'Performance Monitor', 'Resource Scheduler', 'Quality Assurance'],
    load: 55
  },
  {
    department: 'Curriculum',
    count: 5,
    color: 'emerald',
    agents: ['Content Creator', 'Learning Designer', 'Assessment Builder', 'Progress Tracker', 'Skill Validator'],
    load: 38
  },
  {
    department: 'Growth',
    count: 5,
    color: 'blue',
    agents: ['Lead Generator', 'Conversion Optimizer', 'Retention Specialist', 'Referral Engine', 'Analytics Reporter'],
    load: 44
  }
];

// Hiring Roadmap
const hiringRoadmap = [
  {
    phase: 'Seed Round (M0-M6)',
    hires: 8,
    roles: ['Head of Engineering', 'Senior Full-Stack (2)', 'Product Designer', 'Growth Lead', 'Customer Success (2)', 'Content Lead'],
    budget: '$480K'
  },
  {
    phase: 'Growth Phase (M6-M12)',
    hires: 12,
    roles: ['VP Engineering', 'Mobile Developer (2)', 'AI/ML Engineer (2)', 'Sales Lead', 'Marketing Manager', 'Community Manager', 'Support Team (3)'],
    budget: '$720K'
  },
  {
    phase: 'Scale Phase (M12-M18)',
    hires: 15,
    roles: ['CTO', 'Director of Sales', 'Enterprise AE (2)', 'DevOps Engineer', 'Data Engineer', 'UX Researcher', 'International Lead', 'Regional Managers (2)', 'Engineering Team (5)'],
    budget: '$1.2M'
  }
];

export const EnhancedTeamSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'founders' | 'swarm' | 'hiring'>('founders');

  const totalAgents = agentSwarm.reduce((sum, dept) => sum + dept.count, 0);
  const avgLoad = Math.round(agentSwarm.reduce((sum, dept) => sum + dept.load, 0) / agentSwarm.length);

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6"
        >
          <Users className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-bold text-cyan-400 uppercase tracking-widest">The Team</span>
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-bold text-white mb-4"
        >
          Architects of the Neural Era
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white/60 max-w-2xl mx-auto"
        >
          A hybrid team of visionary founders and autonomous AI agents working in perfect coordination 
          to build the future of education.
        </motion.p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center gap-2">
        {[
          { id: 'founders', label: 'Leadership', icon: Star },
          { id: 'swarm', label: 'Agent Swarm', icon: Zap },
          { id: 'hiring', label: 'Hiring Plan', icon: Briefcase }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === tab.id 
                ? 'bg-cyan-500 text-white' 
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'founders' && (
          <motion.div
            key="founders"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Founders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {teamMembers.map((member, idx) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`p-6 rounded-3xl bg-${member.color}-500/5 border border-${member.color}-500/20 backdrop-blur`}
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-${member.color}-500 to-${member.color}-600 flex items-center justify-center text-white text-xl font-bold`}>
                      {member.avatar}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white">{member.name}</h3>
                      <p className={`text-${member.color}-400 text-sm font-medium`}>{member.role}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-white/40">Equity:</span>
                        <span className="text-xs font-bold text-white">{member.equity}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-white/60 text-sm mb-6 leading-relaxed">{member.background}</p>
                  
                  <div className="mb-6">
                    <h4 className="text-xs text-white/40 uppercase font-bold mb-3">Core Expertise</h4>
                    <div className="flex flex-wrap gap-2">
                      {member.expertise.map(skill => (
                        <span key={skill} className={`px-3 py-1 rounded-full bg-${member.color}-500/20 text-${member.color}-400 text-xs font-medium`}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xs text-white/40 uppercase font-bold mb-3">Key Achievements</h4>
                    <ul className="space-y-2">
                      {member.achievements.map((achievement, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                          <CheckCircle2 className={`w-4 h-4 text-${member.color}-400 shrink-0 mt-0.5`} />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Advisory Board */}
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                Advisory Board
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {advisoryBoard.map((advisor) => (
                  <div key={advisor.name} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <h4 className="text-white font-bold mb-1">{advisor.name}</h4>
                    <p className="text-amber-400 text-sm mb-2">{advisor.role}</p>
                    <p className="text-white/50 text-xs mb-2">{advisor.background}</p>
                    <span className="text-xs text-white/40">Expertise: {advisor.expertise}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'swarm' && (
          <motion.div
            key="swarm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Swarm Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 text-center">
                <div className="text-3xl font-bold text-cyan-400">{totalAgents}</div>
                <div className="text-xs text-white/40 uppercase">Total Agents</div>
              </div>
              <div className="p-4 rounded-2xl bg-violet-500/5 border border-violet-500/20 text-center">
                <div className="text-3xl font-bold text-violet-400">{agentSwarm.length}</div>
                <div className="text-xs text-white/40 uppercase">Departments</div>
              </div>
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-center">
                <div className="text-3xl font-bold text-amber-400">{avgLoad}%</div>
                <div className="text-xs text-white/40 uppercase">Avg Load</div>
              </div>
            </div>

            {/* Department Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agentSwarm.map((dept, idx) => (
                <motion.div
                  key={dept.department}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`p-4 rounded-2xl bg-${dept.color}-500/5 border border-${dept.color}-500/20`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className={`text-${dept.color}-400 font-bold`}>{dept.department}</h4>
                    <span className="text-2xl font-bold text-white">{dept.count}</span>
                  </div>
                  
                  <div className="space-y-1 mb-4">
                    {dept.agents.map(agent => (
                      <div key={agent} className="text-xs text-white/50 flex items-center gap-2">
                        <Zap className={`w-3 h-3 text-${dept.color}-400`} />
                        {agent}
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-3 border-t border-white/10">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/40">Load</span>
                      <span className={`text-${dept.color}-400 font-bold`}>{dept.load}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-${dept.color}-500 rounded-full`}
                        style={{ width: `${dept.load}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'hiring' && (
          <motion.div
            key="hiring"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {hiringRoadmap.map((phase, idx) => (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 rounded-3xl bg-white/5 border border-white/10"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">{phase.phase}</h3>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-cyan-400">+{phase.hires}</span>
                    <span className="text-sm text-emerald-400 font-medium">{phase.budget}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {phase.roles.map(role => (
                    <div key={role} className="flex items-center gap-2 text-sm text-white/70">
                      <ArrowRight className="w-4 h-4 text-cyan-400" />
                      {role}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedTeamSection;
