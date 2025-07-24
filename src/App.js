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

  // Cursor tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
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
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        x: particle.x > window.innerWidth ? 0 : particle.x < 0 ? window.innerWidth : particle.x,
        y: particle.y > window.innerHeight ? 0 : particle.y < 0 ? window.innerHeight : particle.y,
      })));
      
      setCodeLines(prev => prev.map(line => ({
        ...line,
        y: line.y + line.vy,
        y: line.y > window.innerHeight ? -50 : line.y,
        text: line.y > window.innerHeight ? 
          techCodeSnippets[Math.floor(Math.random() * techCodeSnippets.length)] : line.text,
      })));
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white overflow-x-hidden relative cursor-none">
      {/* Custom Cursor */}
      <div 
        className={`fixed w-6 h-6 pointer-events-none z-50 transition-all duration-300 ease-out ${
          cursorVariant === 'hover' ? 'w-12 h-12 bg-green-400/20 border-2 border-green-400' :
          cursorVariant === 'text' ? 'w-1 h-6 bg-green-400' :
          cursorVariant === 'code' ? 'w-8 h-8 bg-blue-400/20 border-2 border-blue-400' :
          'w-2 h-2 bg-green-400'
        } rounded-full -translate-x-1/2 -translate-y-1/2 mix-blend-difference`}
        style={{
          left: `${cursorPos.x}px`,
          top: `${cursorPos.y}px`,
        }}
      />
      
      {/* Cursor Trail Effect */}
      <div 
        className="fixed w-1 h-1 bg-green-400/40 rounded-full pointer-events-none z-40 transition-all duration-1000 ease-out -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${cursorPos.x}px`,
          top: `${cursorPos.y}px`,
        }}
      />

      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Floating Particles */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-green-400 rounded-full"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              opacity: particle.opacity,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
          />
        ))}
        
        {/* Floating Code Snippets */}
        {codeLines.map(line => (
          <div
            key={line.id}
            className="absolute font-mono text-xs text-green-400/30"
            style={{
              left: `${line.x}px`,
              top: `${line.y}px`,
              opacity: line.opacity,
            }}
          >
            {line.text}
          </div>
        ))}
        
        {/* Circuit Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#00ff00" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Animated Circuit Lines */}
          <g className="animate-pulse">
            <path
              d="M0,100 Q250,50 500,100 T1000,100"
              fill="none"
              stroke="#00ff0030"
              strokeWidth="1"
            />
            <path
              d="M0,200 Q350,150 700,200 T1400,200"
              fill="none"
              stroke="#0080ff30"
              strokeWidth="1"
            />
            <path
              d="M0,300 Q150,250 300,300 T600,300"
              fill="none"
              stroke="#ff008030"
              strokeWidth="1"
            />
          </g>
          
          {/* Circuit Nodes */}
          <circle cx="200" cy="100" r="3" fill="#00ff0050" className="animate-ping" />
          <circle cx="600" cy="200" r="3" fill="#0080ff50" className="animate-ping" style={{animationDelay: '1s'}} />
          <circle cx="400" cy="300" r="3" fill="#ff008050" className="animate-ping" style={{animationDelay: '2s'}} />
        </svg>
        
        {/* Matrix-style Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="animate-pulse text-green-400 font-mono text-xs leading-none">
            {Array.from({ length: 20 }, (_, i) => (
              <div key={i} className="mb-2">
                {Array.from({ length: 100 }, (_, j) => 
                  Math.random() > 0.7 ? (Math.random() > 0.5 ? '1' : '0') : ' '
                ).join('')}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Header */}
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-gray-800 relative">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div 
            className="text-xl font-mono text-green-400"
            onMouseEnter={() => handleMouseEnter('text')}
            onMouseLeave={handleMouseLeave}
          >
            ~/portfolio
          </div>
          <div className="hidden md:flex space-x-8">
            <button 
              onClick={() => scrollToSection('about')} 
              className="hover:text-green-400 transition-colors"
              onMouseEnter={() => handleMouseEnter('hover')}
              onMouseLeave={handleMouseLeave}
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('projects')} 
              className="hover:text-green-400 transition-colors"
              onMouseEnter={() => handleMouseEnter('hover')}
              onMouseLeave={handleMouseLeave}
            >
              Projects
            </button>
            <button 
              onClick={() => scrollToSection('skills')} 
              className="hover:text-green-400 transition-colors"
              onMouseEnter={() => handleMouseEnter('hover')}
              onMouseLeave={handleMouseLeave}
            >
              Skills
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className="hover:text-green-400 transition-colors"
              onMouseEnter={() => handleMouseEnter('hover')}
              onMouseLeave={handleMouseLeave}
            >
              Contact
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center relative z-10">
        <div className={`text-center transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div 
            className="mb-4 text-green-400 font-mono text-sm"
            onMouseEnter={() => handleMouseEnter('text')}
            onMouseLeave={handleMouseLeave}
          >
            {currentTime.toLocaleTimeString()} IST // Uptime: {Math.floor(Date.now() / 1000)} seconds
          </div>
          <h1 
            className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent"
            onMouseEnter={() => handleMouseEnter('hover')}
            onMouseLeave={handleMouseLeave}
          >
            Harish Kumar
          </h1>
          <div 
            className="text-xl md:text-2xl mb-8 font-mono"
            onMouseEnter={() => handleMouseEnter('code')}
            onMouseLeave={handleMouseLeave}
          >
            <span className="text-gray-400">const developer = </span>
            <span className="text-yellow-400">"Tech Enthusiast"</span>
            <span className="text-gray-400">;</span>
          </div>
          <p 
            className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto"
            onMouseEnter={() => handleMouseEnter('text')}
            onMouseLeave={handleMouseLeave}
          >
            EEE Student @ NIT Calicut | Robotics Enthusiast | AI/ML Explorer | ROS Developer in Progress
          </p>
          <div className="flex justify-center space-x-6">
            <a 
              href="https://github.com/magneticstray" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-3 bg-gray-800 rounded-full hover:bg-green-400 transition-colors hover:text-black"
              onMouseEnter={() => handleMouseEnter('hover')}
              onMouseLeave={handleMouseLeave}
            >
              <Github size={24} />
            </a>
            <a 
              href="https://www.linkedin.com/in/harish-kumar-299b03322" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-3 bg-gray-800 rounded-full hover:bg-blue-500 transition-colors"
              onMouseEnter={() => handleMouseEnter('hover')}
              onMouseLeave={handleMouseLeave}
            >
              <Linkedin size={24} />
            </a>
            <a 
              href="mailto:k.a.harish2019@gmail.com" 
              className="p-3 bg-gray-800 rounded-full hover:bg-red-500 transition-colors"
              onMouseEnter={() => handleMouseEnter('hover')}
              onMouseLeave={handleMouseLeave}
            >
              <Mail size={24} />
            </a>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown size={32} className="text-green-400" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 
            className="text-4xl font-bold mb-12 text-center"
            onMouseEnter={() => handleMouseEnter('hover')}
            onMouseLeave={handleMouseLeave}
          >
            <span className="text-green-400"># </span>About Me
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div 
                className="bg-gray-900 rounded-lg p-6 font-mono text-sm border border-gray-700"
                onMouseEnter={() => handleMouseEnter('code')}
                onMouseLeave={handleMouseLeave}
              >
                <div className="flex items-center mb-4">
                  <Terminal size={16} className="text-green-400 mr-2" />
                  <span className="text-green-400">terminal</span>
                  {isTyping && <span className="ml-2 animate-pulse">|</span>}
                </div>
                <pre className="text-green-400 whitespace-pre-wrap">{terminalText}</pre>
              </div>
            </div>
            <div>
              <p 
                className="text-lg leading-relaxed mb-6"
                onMouseEnter={() => handleMouseEnter('text')}
                onMouseLeave={handleMouseLeave}
              >
                JEE Main 98.88 percentile achiever and NIT Calicut EEE student with certifications in 
                Python and Data Science. Currently pursuing AI/ML certification from DeepLearning.ai & 
                Stanford. From clearing NDA prelims to completing Dakshin Bharat Hindi Prachar Sabha's 
                8 exams, I love tackling diverse challenges.
              </p>
              <p 
                className="text-lg leading-relaxed mb-6"
                onMouseEnter={() => handleMouseEnter('text')}
                onMouseLeave={handleMouseLeave}
              >
                When I'm not building robots or training models, you'll find me exploring the beautiful 
                world of physics, capturing moments through photography, or dominating the football field. 
                Fun fact: I've won medals in science & math and even made it to state-level spelling bee! 
                Physics isn't just a subject for me - it's pure magic! ⚡
              </p>
              <div className="flex flex-wrap gap-2">
                {['Python', 'TensorFlow', 'Pandas', 'Arduino', 'OpenCV', 'Photography', '⚽ Football'].map((tech) => (
                  <span 
                    key={tech} 
                    className="px-3 py-1 bg-gray-800 rounded-full text-sm border border-gray-700 hover:border-green-400 transition-colors"
                    onMouseEnter={() => handleMouseEnter('hover')}
                    onMouseLeave={handleMouseLeave}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-6 bg-gray-900/50 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 
            className="text-4xl font-bold mb-12 text-center"
            onMouseEnter={() => handleMouseEnter('hover')}
            onMouseLeave={handleMouseLeave}
          >
            <span className="text-green-400"># </span>Projects
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Autonomous Vacuum Cleaner */}
            <div 
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-green-400 transition-all duration-300 hover:scale-105"
              onMouseEnter={() => handleMouseEnter('hover')}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex items-center justify-between mb-4">
                <Code className="text-green-400" size={24} />
                <a 
                  href="https://github.com/magneticstray/RoboVacuum"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-400 transition-colors"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
              <h3 className="text-xl font-bold mb-2">Autonomous Vacuum Cleaner</h3>
              <p className="text-gray-300 mb-4">Built an intelligent obstacle-avoiding vacuum cleaner that navigates autonomously, featuring real-time path planning and sensor-based obstacle detection.</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-gray-700 rounded text-xs">Arduino</span>
                <span className="px-2 py-1 bg-gray-700 rounded text-xs">Sensors</span>
                <span className="px-2 py-1 bg-gray-700 rounded text-xs">Robotics</span>
              </div>
            </div>
            
            {/* AviBot */}
            <div 
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-yellow-400 transition-all duration-300 hover:scale-105"
              onMouseEnter={() => handleMouseEnter('hover')}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex items-center justify-between mb-4">
                <Zap className="text-yellow-400" size={24} />
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-yellow-400/20 text-yellow-400 rounded text-xs">In Progress</span>
                  <button 
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                    onClick={() => alert('Please provide the project link!')}
                  >
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">AviBot - Egg Picker & Sorter</h3>
              <p className="text-gray-300 mb-4">Developing an autonomous robot for poultry farms that intelligently picks and sorts eggs using computer vision and robotic manipulation.</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-gray-700 rounded text-xs">Computer Vision</span>
                <span className="px-2 py-1 bg-gray-700 rounded text-xs">OpenCV</span>
                <span className="px-2 py-1 bg-gray-700 rounded text-xs">Automation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 px-6 bg-gray-900/30 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 
            className="text-4xl font-bold mb-12 text-center"
            onMouseEnter={() => handleMouseEnter('hover')}
            onMouseLeave={handleMouseLeave}
          >
            <span className="text-green-400"># </span>Achievements & Certifications
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div 
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-green-400 transition-colors"
              onMouseEnter={() => handleMouseEnter('hover')}
              onMouseLeave={handleMouseLeave}
            >
              <h3 className="text-xl font-bold mb-4 text-green-400">🏆 Academic Excellence</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• JEE Main: 98.88 percentile</li>
                <li>• NDA Prelims cleared</li>
                <li>• Science & Mathematics medal winner</li>
                <li>• State-level Spelling Bee participant</li>
              </ul>
            </div>
            <div 
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-400 transition-colors"
              onMouseEnter={() => handleMouseEnter('hover')}
              onMouseLeave={handleMouseLeave}
            >
              <h3 className="text-xl font-bold mb-4 text-blue-400">📜 Certifications</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <button 
                    className="hover:text-blue-400 transition-colors"
                    onClick={() => alert('Please provide the Python certification link!')}
                  >
                    • Python Programming Certification
                  </button>
                </li>
                <li>
                  <button 
                    className="hover:text-blue-400 transition-colors"
                    onClick={() => alert('Please provide the Data Science certification link!')}
                  >
                    • Data Science using Python
                  </button>
                </li>
                <li>• AI/ML (DeepLearning.ai & Stanford) - In Progress</li>
                <li>• Dakshin Bharat Hindi Prachar Sabha (8 levels)</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 text-center">
            <div 
              className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-lg p-6 border border-purple-500/30 hover:border-purple-400 transition-colors"
              onMouseEnter={() => handleMouseEnter('text')}
              onMouseLeave={handleMouseLeave}
            >
              <h3 className="text-xl font-bold mb-2 text-purple-400">⚡ Fun Physics Fact</h3>
              <p className="text-gray-300 italic">
                "Physics isn't just equations on a board - it's the universe revealing its secrets, 
                from quantum mechanics powering our computers to electromagnetic waves carrying this very website to your screen!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 
            className="text-4xl font-bold mb-12 text-center"
            onMouseEnter={() => handleMouseEnter('hover')}
            onMouseLeave={handleMouseLeave}
          >
            <span className="text-green-400"># </span>Skills & Technologies
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div 
              className="text-center"
              onMouseEnter={() => handleMouseEnter('hover')}
              onMouseLeave={handleMouseLeave}
            >
              <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 hover:border-green-400 transition-all duration-300 hover:scale-105">
                <Code className="text-green-400 mx-auto mb-4" size={48} />
                <h3 className="text-xl font-bold mb-4">Robotics & Hardware</h3>
                <p className="text-gray-300">Arduino, Raspberry Pi, Sensors, Servo Motors, Circuit Design</p>
              </div>
            </div>
            <div 
              className="text-center"
              onMouseEnter={() => handleMouseEnter('hover')}
              onMouseLeave={handleMouseLeave}
            >
              <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 hover:border-blue-400 transition-all duration-300 hover:scale-105">
                <Terminal className="text-blue-400 mx-auto mb-4" size={48} />
                <h3 className="text-xl font-bold mb-4">AI & Machine Learning</h3>
                <p className="text-gray-300">Python, TensorFlow, OpenCV, Computer Vision, Neural Networks</p>
              </div>
            </div>
            <div 
              className="text-center"
              onMouseEnter={() => handleMouseEnter('hover')}
              onMouseLeave={handleMouseLeave}
            >
              <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 hover:border-yellow-400 transition-all duration-300 hover:scale-105">
                <Zap className="text-yellow-400 mx-auto mb-4" size={48} />
                <h3 className="text-xl font-bold mb-4">Development & Tools</h3>
                <p className="text-gray-300">Pandas, Data Analysis, IoT, Git, Linux, Photography, Problem Solving</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 bg-gray-900/50 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 
            className="text-4xl font-bold mb-8"
            onMouseEnter={() => handleMouseEnter('hover')}
            onMouseLeave={handleMouseLeave}
          >
            <span className="text-green-400"># </span>Let's Connect
          </h2>
          <p 
            className="text-lg text-gray-300 mb-8"
            onMouseEnter={() => handleMouseEnter('text')}
            onMouseLeave={handleMouseLeave}
          >
            Always excited to collaborate on interesting projects or just chat about tech!
          </p>
          <div 
            className="bg-gray-800 rounded-lg p-8 border border-gray-700 font-mono hover:border-green-400 transition-colors"
            onMouseEnter={() => handleMouseEnter('code')}
            onMouseLeave={handleMouseLeave}
          >
            <div className="text-green-400 mb-4">$ cat contact.txt</div>
            <div className="text-left">
              <div className="mb-2">📧 Email: k.a.harissh2019@gmail.com</div>
              <div className="mb-2">🐙 GitHub: github.com/magneticstray</div>
              <div className="mb-2">💼 LinkedIn: linkedin.com/in/harish-kumar-299b03322</div>
              <div className="mb-2">📍 Location: Kozhikode, Kerala, India</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800 relative z-10">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p 
            className="font-mono"
            onMouseEnter={() => handleMouseEnter('text')}
            onMouseLeave={handleMouseLeave}
          >
            Made with ❤️ and lots of ☕ | © 2025 | 
            <span className="text-green-400 ml-2">git status: awesome</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
