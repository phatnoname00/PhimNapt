import React from 'react';

// Using pure CSS animation for performance and wow-factor
const MeteorBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-black pointer-events-none">
      
      {/* Dynamic Starfield with CSS gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-black to-black opacity-80 dark:opacity-100 transition-opacity duration-1000"></div>
      
      {/* 3D Perspective Container */}
      <div className="absolute inset-0 preserve-3d perspective-1000">
        
        {/* Layer 1: Slow distant stars */}
        <div className="absolute inset-0 animate-spin-slow opacity-30" style={{ transformStyle: 'preserve-3d' }}>
           {Array.from({ length: 50 }).map((_, i) => (
             <div key={`star1-${i}`} className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_5px_#fff]" 
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    transform: `translateZ(${Math.random() * -500}px)`,
                    animation: `twinkle ${Math.random() * 5 + 3}s infinite alternate`
                  }}
             ></div>
           ))}
        </div>

        {/* Layer 2: Medium speed stars */}
        <div className="absolute inset-0 animate-spin-slow-reverse opacity-50" style={{ transformStyle: 'preserve-3d' }}>
           {Array.from({ length: 50 }).map((_, i) => (
             <div key={`star2-${i}`} className="absolute w-1.5 h-1.5 bg-blue-200 rounded-full shadow-[0_0_8px_#93c5fd]" 
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    transform: `translateZ(${Math.random() * -200}px)`,
                    animation: `twinkle ${Math.random() * 4 + 2}s infinite alternate`
                  }}
             ></div>
           ))}
        </div>

        {/* Meteor Shower Effect */}
        <div className="absolute inset-0 transform -rotate-45">
          {Array.from({ length: 15 }).map((_, i) => (
            <div 
              key={`meteor-${i}`}
              className="absolute h-[2px] w-[100px] bg-gradient-to-r from-transparent via-white to-transparent animate-meteor opacity-0 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${Math.random() * 2 + 1}s`
              }}
            >
              {/* Meteor Head */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_15px_5px_#fff]"></div>
            </div>
          ))}
        </div>

        {/* Planet / Earth Element */}
        <div className="absolute -bottom-20 -right-20 w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full bg-gradient-to-br from-blue-600 via-blue-900 to-black shadow-[inset_-20px_-20px_50px_rgba(0,0,0,0.8),0_0_100px_rgba(59,130,246,0.2)] animate-pulse-slow transition-opacity duration-1000 opacity-20 md:opacity-40">
           {/* Atmosphere glow */}
           <div className="absolute inset-0 rounded-full border border-blue-400/20 blur-xl"></div>
        </div>
      </div>
      
      {/* Light mode overlay to tone it down if user switches to light mode */}
      <div className="absolute inset-0 bg-white/80 dark:bg-transparent transition-colors duration-500 z-10"></div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes twinkle {
          0% { opacity: 0.2; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes meteor {
          0% { transform: translateX(200vw); opacity: 0; }
          10% { opacity: 1; }
          40% { transform: translateX(-200vw); opacity: 0; }
          100% { transform: translateX(-200vw); opacity: 0; }
        }
        .animate-spin-slow {
          animation: spin 120s linear infinite;
        }
        .animate-spin-slow-reverse {
          animation: spin 150s linear infinite reverse;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.05); opacity: 0.4; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 15s ease-in-out infinite;
        }
      `}} />
    </div>
  );
};

export default MeteorBackground;
