import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, Code, Zap, Terminal, ChevronDown, ExternalLink } from 'lucide-react';

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [terminalText, setTerminalText] = useState('');
  const [particles, setParticles] = useState([]);
  const [codeLines, setCodeLines] = useState([]);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');
  const [isTyping, setIsTyping] = useState(false);

  const terminalCommands = [
    'sudo apt-get install awesome-dev',
    'npm install --save cool-projects',
    'git commit -m "Initial commit to greatness"',
    'python -c "print(\'Hello, World!\')"',
    './compile_dreams.sh'
  ];

  const techCodeSnippets = [
    'if (robot.autonomous) { navigate(); }',
    'model.train(epochs=100)',
    'sensor.read() > threshold',
    'cv2.detectContours()',
    'digitalWrite(LED_PIN, HIGH)',
    'import tensorflow as tf',
    'while(true) { solve(); }',
    'const future = await AI.predict()',
  ];

  // Smooth cursor tracking with throttling
  useEffect(() => {
    let animationFrameId;
    
    const handleMouseMove = (e) => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      
      animationFrameId = requestAnimationFrame(() => {
        setCursorPos({ x: e.clientX, y: e.clientY });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  // Initialize particles and code lines
  useEffect(() => {
    const initParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2,
    }));

    const initCodeLines = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      text: techCodeSnippets[Math.floor(Math.random() * techCodeSnippets.length)],
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vy: 0.3 + Math.random() * 0.4,
      opacity: 0.1 + Math.random() * 0.2,
    }));

    setParticles(initParticles);
    setCodeLines(initCodeLines);
  }, []);

  useEffect(() => {
    setIsLoaded(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    // Animate particles and code lines
    const animateBackground = () => {
      setParticles(prev => prev.map(particle => {
        let newX = particle.x + particle.vx;
        let newY = particle.y + particle.vy;

        if (newX > window.innerWidth) newX = 0;
        else if (newX < 0) newX = window.innerWidth;
        if (newY > window.innerHeight) newY = 0;
        else if (newY < 0) newY = window.innerHeight;

        return {
          ...particle,
          x: newX,
          y: newY,
        };
      }));

      setCodeLines(prev => prev.map(line => {
        const newY = line.y + line.vy;
        const reset = newY > window.innerHeight;
        return {
          ...line,
          y: reset ? -50 : newY,
          text: reset ? techCodeSnippets[Math.floor(Math.random() * techCodeSnippets.length)] : line.text,
        };
      }));
    };

    const backgroundTimer = setInterval(animateBackground, 50);

    // Terminal typing effect
    let cmdIndex = 0;
    let charIndex = 0;
    setIsTyping(true);
    
    const typeTerminal = () => {
      if (cmdIndex < terminalCommands.length) {
        if (charIndex < terminalCommands[cmdIndex].length) {
          setTerminalText(prev => prev + terminalCommands[cmdIndex][charIndex]);
          charIndex++;
          setTimeout(typeTerminal, 50);
        } else {
          setTerminalText(prev => prev + '\n$ ');
          cmdIndex++;
          charIndex = 0;
          setTimeout(typeTerminal, 1000);
        }
      } else {
        setIsTyping(false);
      }
    };

    setTimeout(() => {
      setTerminalText('$ ');
      typeTerminal();
    }, 2000);

    return () => {
      clearInterval(timer);
      clearInterval(backgroundTimer);
    };
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleMouseEnter = (variant) => {
    setCursorVariant(variant);
  };

  const handleMouseLeave = () => {
    setCursorVariant('default');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden relative">
      {/* Smooth Custom Cursor */}
      <div
        className={`fixed pointer-events-none z-50 transition-all duration-200 ease-out ${
          cursorVariant === 'text' ? 'w-8 h-8 bg-purple-400 opacity-30' : 'w-4 h-4 bg-white opacity-80'
        } rounded-full mix-blend-difference`}
        style={{
          left: cursorPos.x - (cursorVariant === 'text' ? 16 : 8),
          top: cursorPos.y - (cursorVariant === 'text' ? 16 : 8),
          transform: 'translate3d(0, 0, 0)', // Hardware acceleration
        }}
      />

      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute bg-purple-400 rounded-full"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              opacity: particle.opacity,
              transform: 'translate3d(0, 0, 0)', // Hardware acceleration
            }}
          />
        ))}
      </div>

      {/* Floating Code Lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {codeLines.map(line => (
          <div
            key={line.id}
            className="absolute text-green-400 font-mono text-sm"
            style={{
              left: line.x,
              top: line.y,
              opacity: line.opacity,
              transform: 'translate3d(0, 0, 0)', // Hardware acceleration
            }}
          >
            {line.text}
          </div>
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className={`text-center transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="mb-8">
            <h1 
              className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent"
              onMouseEnter={() => handleMouseEnter('text')}
              onMouseLeave={handleMouseLeave}
            >
              Your Name
            </h1>
            <p 
              className="text-xl md:text-2xl text-gray-300 mb-8"
              onMouseEnter={() => handleMouseEnter('text')}
              onMouseLeave={handleMouseLeave}
            >
              EEE Student @ NIT Calicut | Robotics Enthusiast | AI/ML Explorer | App Developer in Progress
            </p>
          </div>

          {/* Terminal Window */}
          <div className="bg-gray-900 rounded-lg p-6 max-w-2xl mx-auto mb-8 shadow-2xl border border-gray-700">
            <div className="flex items-center mb-4">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="ml-4 text-gray-400 text-sm">terminal</div>
            </div>
            <div className="font-mono text-green-400 text-left whitespace-pre-wrap">
              {terminalText}
              {isTyping && <span className="animate-pulse">|</span>}
            </div>
          </div>

          {/* Social Links */}
          <div className="flex justify-center space-x-6">
            <a href="https://github.com/yourusername" className="text-gray-400 hover:text-white transition-colors">
              <Github size={24} />
            </a>
            <a href="https://linkedin.com/in/yourusername" className="text-gray-400 hover:text-white transition-colors">
              <Linkedin size={24} />
            </a>
            <a href="mailto:your.email@example.com" className="text-gray-400 hover:text-white transition-colors">
              <Mail size={24} />
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-center">About Me</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div 
              className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6"
              onMouseEnter={() => handleMouseEnter('text')}
              onMouseLeave={handleMouseLeave}
            >
              <p className="text-gray-300 leading-relaxed">
                JEE Main 98.88 percentile achiever and NIT Calicut EEE student with certifications in Python and Data Science. Currently pursuing AI/ML certification from DeepLearning.ai & Stanford. From clearing NDA prelims to completing Dakshin Bharat Hindi Prachar Sabha's 8 exams, I love tackling diverse challenges.
              </p>
            </div>
            <div 
              className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6"
              onMouseEnter={() => handleMouseEnter('text')}
              onMouseLeave={handleMouseLeave}
            >
              <p className="text-gray-300 leading-relaxed">
                When I'm not building robots or training models, you'll find me exploring the beautiful world of physics, capturing moments through photography, or dominating the football field. Fun fact: I've won medals in science & math and even made it to state-level spelling bee! Physics isn't just a subject for me - it's pure magic! ⚡
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section id="certifications" className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-center">Certifications</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 hover:bg-gray-700/50 transition-colors">
              <h3 className="text-xl font-semibold mb-2 text-purple-400">Data Science - NPTEL</h3>
              <p className="text-gray-300 mb-4">Comprehensive data science certification covering statistical analysis, machine learning, and data visualization techniques.</p>
              <a 
                href="https://internalapp.nptel.ac.in/noc/Ecertificate/?q=NPTEL25CS60S44340539001294634" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
              >
                View Certificate <ExternalLink size={16} className="ml-2" />
              </a>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 hover:bg-gray-700/50 transition-colors">
              <h3 className="text-xl font-semibold mb-2 text-purple-400">Python Programming - Coursera</h3>
              <p className="text-gray-300 mb-4">Advanced Python programming certification with focus on data structures, algorithms, and application development.</p>
              <a 
                href="https://www.coursera.org/account/accomplishments/verify/YCC77N1RY4UAwq" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
              >
                View Certificate <ExternalLink size={16} className="ml-2" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Featured Projects</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 hover:bg-gray-700/50 transition-colors">
              <h3 className="text-2xl font-semibold mb-4 text-purple-400">🤖 Autonomous Vacuum Cleaner</h3>
              <p className="text-gray-300 mb-4">
                Built an intelligent obstacle-avoiding vacuum cleaner that navigates autonomously, featuring real-time path planning and sensor-based obstacle detection.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-purple-600/30 rounded-full text-sm">Arduino</span>
                <span className="px-3 py-1 bg-purple-600/30 rounded-full text-sm">Sensors</span>
                <span className="px-3 py-1 bg-purple-600/30 rounded-full text-sm">Path Planning</span>
              </div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 hover:bg-gray-700/50 transition-colors">
              <h3 className="text-2xl font-semibold mb-4 text-purple-400">🥚 AviBot (Ongoing)</h3>
              <p className="text-gray-300 mb-4">
                Developing an autonomous robot for poultry farms that intelligently picks and sorts eggs using computer vision and robotic manipulation.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-green-600/30 rounded-full text-sm">Computer Vision</span>
                <span className="px-3 py-1 bg-green-600/30 rounded-full text-sm">Robotics</span>
                <span className="px-3 py-1 bg-green-600/30 rounded-full text-sm">AI/ML</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Technical Skills</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
                <Code className="mx-auto mb-4 text-purple-400" size={48} />
                <h3 className="text-xl font-semibold mb-4">Hardware & Robotics</h3>
                <p className="text-gray-300 text-sm">Arduino, Raspberry Pi, Sensors, Servo Motors, Circuit Design</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
                <Zap className="mx-auto mb-4 text-purple-400" size={48} />
                <h3 className="text-xl font-semibold mb-4">AI & Machine Learning</h3>
                <p className="text-gray-300 text-sm">Python, TensorFlow, OpenCV, Computer Vision, Neural Networks</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
                <Terminal className="mx-auto mb-4 text-purple-400" size={48} />
                <h3 className="text-xl font-semibold mb-4">Development & Tools</h3>
                <p className="text-gray-300 text-sm">Pandas, Data Analysis, IoT, Git, Linux, Photography, Problem Solving</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative z-10 py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Let's Connect</h2>
          <p 
            className="text-xl text-gray-300 mb-8"
            onMouseEnter={() => handleMouseEnter('text')}
            onMouseLeave={handleMouseLeave}
          >
            Always excited to collaborate on interesting projects or just chat about tech!
          </p>
          <div className="flex justify-center space-x-6">
            <a 
              href="https://github.com/yourusername" 
              className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg transition-colors flex items-center"
            >
              <Github className="mr-2" size={20} />
              GitHub
            </a>
            <a 
              href="https://linkedin.com/in/yourusername" 
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors flex items-center"
            >
              <Linkedin className="mr-2" size={20} />
              LinkedIn
            </a>
            <a 
              href="mailto:your.email@example.com" 
              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg transition-colors flex items-center"
            >
              <Mail className="mr-2" size={20} />
              Email
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};



export default App;
