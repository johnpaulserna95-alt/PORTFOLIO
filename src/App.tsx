import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Phone, Truck, Layout, Moon, Sun } from 'lucide-react';
import { ChatInterface } from './components/ChatInterface';
import { ProjectCard } from './components/ProjectCard';
import { useState, useEffect, useRef } from 'react';

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [splashes, setSplashes] = useState<{ id: number; x: number; y: number; hue: number }[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMouseActive, setIsMouseActive] = useState(false);
  const mouseTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initialize theme
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setIsMouseActive(true);
      
      if (mouseTimer.current) clearTimeout(mouseTimer.current);
      mouseTimer.current = setTimeout(() => {
        setIsMouseActive(false);
      }, 1500);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (mouseTimer.current) clearTimeout(mouseTimer.current);
    };
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const hue = (e.clientX / window.innerWidth) * 360;
    const newSplash = { id: Date.now(), x: e.clientX, y: e.clientY, hue };
    setSplashes(prev => [...prev, newSplash]);
    setTimeout(() => {
      setSplashes(prev => prev.filter(s => s.id !== newSplash.id));
    }, 800);
  };

  const mouseHue = (mousePos.x / (window.innerWidth || 1)) * 360;

  return (
    <div 
      onMouseDown={handleMouseDown}
      className="min-h-screen selection:bg-primary selection:text-black transition-colors duration-500 relative"
    >
      {/* Interactive Mouse Gradient */}
      <motion.div
        animate={{
          left: mousePos.x,
          top: mousePos.y,
          opacity: isMouseActive ? 1 : 0,
          scale: isMouseActive ? 1 : 0.5,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 200, mass: 0.5, opacity: { duration: 0.5 } }}
        className="fixed pointer-events-none w-[300px] h-[300px] rounded-full -translate-x-1/2 -translate-y-1/2 z-[9999] blur-[40px]"
        style={{
          background: `radial-gradient(circle, hsla(${mouseHue}, 100%, 70%, ${isDark ? 0.15 : 0.08}) 0%, transparent 70%)`
        }}
      />

      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden bg-surface">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Liquid Splashes */}
      <AnimatePresence>
        {splashes.map(splash => (
          <motion.div
            key={splash.id}
            initial={{ width: 0, height: 0, opacity: 1, filter: 'blur(0px)' }}
            animate={{ width: 400, height: 400, opacity: 0, filter: 'blur(60px)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed pointer-events-none rounded-full -translate-x-1/2 -translate-y-1/2 z-[10000]"
            style={{ 
              left: splash.x, 
              top: splash.y,
              background: `radial-gradient(circle, hsla(${splash.hue}, 100%, 70%, 0.4) 0%, transparent 80%)`
            }}
          />
        ))}
      </AnimatePresence>

      {/* Header */}
      <header className="fixed top-0 w-full bg-surface/80 backdrop-blur-xl z-[100] border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="text-2xl font-bold tracking-tighter font-headline">
            J.P.S <span className="text-primary">|</span> PORTFOLIO
          </div>
          <nav className="hidden md:flex items-center gap-8 text-[10px] font-bold uppercase tracking-widest font-headline">
            <a href="#" className="text-primary hover:neon-text transition-all">Think</a>
            <a href="#skills" className="text-neutral-500 hover:text-on-surface transition-colors">Skills</a>
            <a href="#contact" className="text-neutral-500 hover:text-on-surface transition-colors">Contact</a>
          </nav>
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-on-surface/5 transition-colors text-neutral-400 hover:text-on-surface"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      <main className="pt-40 px-6 max-w-4xl mx-auto">
        {/* Hero */}
        <section className="flex flex-col items-center text-center mb-24">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative mb-8 kinetic-avatar"
          >
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-surface-container-low flex items-center justify-center overflow-hidden border-2 border-primary/20 primary-glow">
              <img 
                src="https://lh3.googleusercontent.com/aida/ADBb0uhL_etXbAo7emgApbNfsdVtjamk9-qriF4aalaU2HhLeNkZemto3W-720vfVOwrnge7duM39HtZOCOXj69e1dvg9qU_4Uu-3NlFXNqnnZdTbOrq_m1hFfCKQJZJFoq1-ppxaOExOIIl5LL6171qFwYp4s_JpjUHVafPvg1P-9PhvzY2G1AuzN3SSSjSqUrXak2FX0MM5opAq-qxtjuXtynBy0VkwI9aGXSZDSsMEy-RIJnFaUlrilnfGUyqyIEZ466xBmzQC7BFLFA" 
                alt="John Paul Serna"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-2 -right-6 bg-primary/20 backdrop-blur-md border border-primary/40 px-3 py-1 rounded-full text-primary text-[10px] font-black uppercase tracking-tighter shadow-lg">
              ONLINE
            </div>
          </motion.div>

          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-8xl font-black tracking-tighter mb-6 font-headline leading-none text-on-surface"
          >
            Hey, I'm John Serna <br />
            <span className="inline-block animate-bounce mt-4">👋</span>
          </motion.h1>

          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-neutral-400 text-lg md:text-2xl font-medium tracking-tight max-w-2xl mx-auto leading-tight"
          >
            AI Automation Specialist — <span className="text-primary">General Santos City, PH</span>. <br />
            I bridge the gap between human intent and machine efficiency.
          </motion.p>
        </section>

        {/* Skills Section */}
        <section id="skills" className="mb-32">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px flex-1 bg-border"></div>
            <h2 className="text-[10px] font-mono text-neutral-500 uppercase tracking-[0.4em]">Core Competencies</h2>
            <div className="h-px flex-1 bg-border"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "AI Automation", level: "Intermediate" },
              { name: "Customer Service", level: "Senior" },
              { name: "Software Logic", level: "Intermediate" },
              { name: "UX/UX Design", level: "Intermediate" },
              
            ].map((skill, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl bg-surface-container-low border border-border text-center group hover:border-primary/30 transition-all"
              >
                <div className="text-primary font-headline font-bold mb-1 group-hover:neon-text transition-all">{skill.name}</div>
                <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">{skill.level}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="space-y-12 mb-32">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-border"></div>
            <h2 className="text-[10px] font-mono text-neutral-500 uppercase tracking-[0.4em]">Featured Deployments</h2>
            <div className="h-px flex-1 bg-border"></div>
          </div>

          <div className="grid gap-8">
            <ProjectCard 
              title="Detail Online Technology"
              description="Dedicated Junior Software Tester ensuring pixel-perfect deployments and robust logic across complex web apps."
              tag="QA & Testing"
              icon={<Terminal size={48} className="text-primary" />}
              stats={[{ label: 'Accuracy', value: '99.9%' }]}
            />
            
            <ProjectCard 
              title="Singapore Spa Account"
              description="Mastered the art of cold calling and client acquisition through data-driven outreach and persistence."
              tag="Outreach"
              icon={<Phone size={48} className="text-secondary" />}
            />

            <ProjectCard 
              title="Terry's Florist"
              description="Streamlined order processing workflows, handling complex logistics with 99.9% accuracy during peak floral seasons."
              tag="Logistics"
              icon={<Truck size={48} className="text-neutral-500" />}
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuBYB_uvcvl9myvrGtEk59KDvXMZQyQ6bIq-sKTx7jq0X260KOlOp8BCBDpslhdcIVMnzLIyV8DKz7sO9-gkaB0_iOX4Q1yhAD_eS3D7l2UPPBAb06oR2ThXriCbWeN5_OyWPJ5Ze6RuoMpgpmqGmJu2GwCOU7ljtjXWfXhGy7D5MTttvN_1T4qcn59CP1j5OTgZaW7BIeVbGIwDpzQCdWxz_kEZ1mI-b3FE1-U7OGpVn06zdkqEItOFQeYeSY_AQonO1z5pTQJYd31Z"
            />

            <ProjectCard 
              title="Front End Design"
              description="Architecting high-performance, AI-driven user interfaces with sub-second inference times and liquid-motion physics."
              tag="UI/UX"
              icon={<Layout size={48} className="text-primary" />}
              image="https://lh3.googleusercontent.com/aida/ADBb0uhejnGBIMk3z-ZAxVZVWZcfXYRilyjBkugeH4LglTcuD7ygcY6u1DQ3SJsCj0Gr5kMsDN2cl4gRYyeg2vFCE4Dsf3xRjTb1ui2Tc9Bl-3drMiL_eGUMMRViaWPkclZw1mQFrXgjup9FoFOLg2hK2xjB6VUoTwLD7oK8Ll5ohb9lUI9_GFsw_RBlGfVKMDv0e7r67ZJA_mpEagV5eXVlz4AoldUilK7qbS3wTMe-vVG9hqTer7TLlnKWCMiddKyRqw6LF5N5pXKxSw"
              stats={[
                { label: 'Speed Inc', value: '90%' },
                { label: 'Latency', value: '300ms' }
              ]}
            />
          </div>
        </section>

        {/* Footer */}
        <footer id="contact" className="pb-40 text-center">
          <div className="liquid-glass p-16 rounded-[2.5rem] border border-border relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <h2 className="text-4xl font-bold font-headline mb-6 relative z-10 text-on-surface">Let's build the future.</h2>
            <p className="text-neutral-400 mb-10 text-lg relative z-10">Available for AI automation consulting and high-end frontend development.</p>
            <a 
              href="mailto:tahopaler@gmail.com"
              className="inline-flex items-center gap-2 bg-on-surface text-surface px-10 py-5 rounded-full font-bold hover:bg-primary hover:text-black transition-all hover:scale-105 active:scale-95 relative z-10 shadow-xl"
            >
              Get in Touch
            </a>
          </div>
          <p className="mt-16 text-[10px] font-mono text-neutral-600 uppercase tracking-[0.5em]">
            © 2026 John Paul Serna
          </p>
        </footer>
      </main>
      <ChatInterface />
    </div>
  );
}
