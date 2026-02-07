import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Users, Globe, ArrowRight, Sparkles } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// APEX OS 3D WAITLIST PAGE - EXTRAORDINARY VISUAL EXPERIENCE
// Full Tony Stark Mode - Neural Point Cloud Matrix
// ═══════════════════════════════════════════════════════════════════════════════

// Generate random points for the neural cloud
function generatePoints(count: number, radius: number) {
  const points = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = radius * Math.cbrt(Math.random());
    
    points[i3] = r * Math.sin(phi) * Math.cos(theta);
    points[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    points[i3 + 2] = r * Math.cos(phi);
    
    // Cyan to emerald gradient
    const t = Math.random();
    colors[i3] = 0.02 + t * 0.04;     // R: 0.02-0.06
    colors[i3 + 1] = 0.7 + t * 0.3;   // G: 0.7-1.0
    colors[i3 + 2] = 0.8 + t * 0.2;   // B: 0.8-1.0
  }
  
  return { positions: points, colors };
}

// Neural Point Cloud Component
function NeuralCloud({ count = 32000, radius = 15 }: { count?: number; radius?: number }) {
  const ref = useRef<THREE.Points>(null);
  const [hovered, setHovered] = useState(false);
  
  const { positions, colors } = useMemo(() => generatePoints(count, radius), [count, radius]);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.05;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.03) * 0.1;
    }
  });
  
  return (
    <Points
      ref={ref}
      positions={positions}
      colors={colors}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <PointMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={hovered ? 0.8 : 0.6}
        sizeAttenuation
      />
    </Points>
  );
}

// Floating Data Streams
function DataStream({ position, delay }: { position: [number, number, number]; delay: number }) {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + delay) * 0.5;
      ref.current.rotation.y += 0.02;
    }
  });
  
  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[0.1, 0.8, 0.1]} />
      <meshBasicMaterial color="#06b6d4" transparent opacity={0.6} />
    </mesh>
  );
}

// Main Waitlist Page Component
export default function WaitlistPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [count, setCount] = useState(2847);
  const [spotsLeft, setSpotsLeft] = useState(153);
  
  // Simulate live counter
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(c => c + Math.floor(Math.random() * 3));
      setSpotsLeft(s => Math.max(0, s - Math.floor(Math.random() * 2)));
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Integration with Supabase would go here
  };
  
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden relative">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 25], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} color="#06b6d4" intensity={1} />
          <pointLight position={[-10, -10, -10]} color="#10b981" intensity={0.5} />
          <NeuralCloud count={32000} radius={15} />
          <DataStream position={[-8, 2, 0]} delay={0} />
          <DataStream position={[8, -2, 2]} delay={2} />
          <DataStream position={[0, 5, -5]} delay={4} />
        </Canvas>
      </div>
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/50 to-[#0a0a0a] z-10 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-20 container mx-auto px-6 py-12 min-h-screen flex flex-col justify-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <pre className="text-[#06b6d4] text-xs md:text-sm mb-4 font-mono">
{`
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║              🔥 APEX OS FOUNDER WAITLIST 🔥                     ║
║              Neural Distribution Network v2.0                    ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
`}
          </pre>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#06b6d4] to-[#10b981] bg-clip-text text-transparent">
              Join the Neural Revolution
            </span>
          </h1>
          
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            32,000 builders. 1,000 spots. Zero excuses.
            <br />
            The 30-Day Sprint to product-market fit starts here.
          </p>
        </motion.div>
        
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12"
        >
          <div className="bg-white/5 backdrop-blur border border-[#06b6d4]/30 rounded-2xl p-6 text-center">
            <Users className="w-8 h-8 text-[#06b6d4] mx-auto mb-2" />
            <div className="text-3xl font-bold text-[#06b6d4]">{count.toLocaleString()}</div>
            <div className="text-sm text-white/60">Builders Applied</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur border border-[#10b981]/30 rounded-2xl p-6 text-center">
            <Zap className="w-8 h-8 text-[#10b981] mx-auto mb-2" />
            <div className="text-3xl font-bold text-[#10b981]">{spotsLeft}</div>
            <div className="text-sm text-white/60">Spots Remaining</div>
          </div>
          
          <div className="bg-white/5 backdrop-blur border border-[#f59e0b]/30 rounded-2xl p-6 text-center">
            <Globe className="w-8 h-8 text-[#f59e0b] mx-auto mb-2" />
            <div className="text-3xl font-bold text-[#f59e0b]">30</div>
            <div className="text-sm text-white/60">Days to Launch</div>
          </div>
        </motion.div>
        
        {/* Waitlist Form */}
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onSubmit={handleSubmit}
              className="max-w-xl mx-auto"
            >
              <div className="bg-white/5 backdrop-blur border border-[#06b6d4]/30 rounded-2xl p-8">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-5 h-5 text-[#06b6d4]" />
                  <span className="text-[#06b6d4] font-mono text-sm">SECURE YOUR SPOT</span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="founder@apex-os.io"
                      className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:border-[#06b6d4] focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#06b6d4] to-[#10b981] text-white font-bold py-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    Join the Waitlist
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-4 text-sm text-white/40">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                      PayPerCut Integrated
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#06b6d4] animate-pulse" />
                      Vertex AI Scoring
                    </div>
                  </div>
                </div>
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-xl mx-auto text-center"
            >
              <div className="bg-white/5 backdrop-blur border border-[#10b981]/30 rounded-2xl p-8">
                <div className="w-16 h-16 rounded-full bg-[#10b981]/20 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-[#10b981]" />
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-2">You're In!</h2>
                <p className="text-white/60 mb-4">
                  Welcome to the neural network. We've sent you a confirmation email.
                </p>
                
                <div className="text-sm text-[#06b6d4] font-mono">
                  Your position: #{count + 1} in queue
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 text-white/40 text-sm"
        >
          <div className="flex items-center justify-center gap-6 mb-4">
            <a href="https://me.paypercut.io/register" target="_blank" rel="noopener noreferrer" className="hover:text-[#06b6d4] transition-colors">
              PayPerCut
            </a>
            <span>|</span>
            <a href="#" className="hover:text-[#06b6d4] transition-colors">
              Terms
            </a>
            <span>|</span>
            <a href="#" className="hover:text-[#06b6d4] transition-colors">
              Privacy
            </a>
          </div>
          
          <p>© 2026 APEX OS • Built with AI • Owned by Builders</p>
        </motion.div>
      </div>
    </div>
  );
}
