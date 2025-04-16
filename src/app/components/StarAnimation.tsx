import { motion, useSpring } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  velocity: { x: number; y: number };
  hue: number;  // Nouvelle propriété pour la teinte
}

export default function StarAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stars, setStars] = useState<Star[]>([
    { id: 1, x: 100, y: 100, velocity: { x: 2, y: 1 }, hue: 0 },
    { id: 2, x: 200, y: 200, velocity: { x: -1, y: 2 }, hue: 180 }
  ]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const requestRef = useRef<number | null>(null);

  // Configuration de l'animation
  const config = {
    damping: 10,
    stiffness: 100,
    mass: 0.5,
    gravitationalForce: 0.5,
    maxSpeed: 5,
    bounceElasticity: 0.8,
    colorChangeSpeed: 0.5  // Vitesse de changement de couleur
  };

  // Création des springs pour des mouvements fluides
  const springOptions = { damping: config.damping, stiffness: config.stiffness, mass: config.mass };
  const springsX = stars.map(() => useSpring(0, springOptions));
  const springsY = stars.map(() => useSpring(0, springOptions));

  // Gestion du mouvement de la souris
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      });
    }
  };

  // Animation principale
  const animate = () => {
    if (!containerRef.current) return;

    const container = containerRef.current.getBoundingClientRect();
    
    setStars(prevStars => {
      return prevStars.map((star, index) => {
        let { x, y, velocity, hue } = star;
        
        // Mise à jour de la teinte
        hue = (hue + config.colorChangeSpeed) % 360;
        
        // Calcul de la force gravitationnelle vers la souris
        const dx = mousePosition.x + x;
        const dy = mousePosition.y + y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const force = config.gravitationalForce / (distance + 10);
        
        // Application de la force gravitationnelle
        velocity.x += (dx / distance) * force;
        velocity.y += (dy / distance) * force;
        
        // Limitation de la vitesse
        const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
        if (speed > config.maxSpeed) {
          velocity.x = (velocity.x / speed) * config.maxSpeed;
          velocity.y = (velocity.y / speed) * config.maxSpeed;
        }
        
        // Mise à jour de la position
        x += velocity.x;
        y += velocity.y;
        
        // Rebonds sur les bords
        if (x <= 0 || x >= container.width) {
          velocity.x *= -config.bounceElasticity;
          x = x <= 0 ? 0 : container.width;
        }
        if (y <= 0 || y >= container.height) {
          velocity.y *= -config.bounceElasticity;
          y = y <= 0 ? 0 : container.height;
        }
        
        // Mise à jour des springs pour un mouvement fluide
        springsX[index].set(x);
        springsY[index].set(y);
        
        return { ...star, x, y, velocity, hue };
      });
    });

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [mousePosition]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="fixed inset-0 pointer-events-none"
      style={{ background: 'transparent', zIndex: 50 }}
    >
      {stars.map((star, index) => (
        <motion.div
          key={star.id}
          className="absolute"
          style={{
            x: springsX[index],
            y: springsY[index],
            width: '40px',
            height: '40px',
            zIndex: 51
          }}
        >
          {/* Étoile avec effet de traînée */}
          <div className="relative w-full h-full">
            {/* Traînée lumineuse */}
            <motion.div
              className="absolute w-full h-full -translate-x-1/2 -translate-y-1/2"
              style={{
                background: `radial-gradient(circle at center, hsla(${star.hue}, 100%, 60%, 0.4) 0%, hsla(${star.hue}, 100%, 50%, 0.2) 40%, transparent 70%)`,
                filter: 'blur(12px)',
                mixBlendMode: 'screen',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            />
            {/* Étoile principale */}
            <motion.div
              className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2"
              style={{
                background: `radial-gradient(circle at center, hsla(${star.hue}, 100%, 80%, 1) 0%, hsla(${star.hue}, 100%, 60%, 0.8) 30%, transparent 70%)`,
                boxShadow: `0 0 30px 10px hsla(${star.hue}, 100%, 70%, 0.9), 0 0 50px 20px hsla(${star.hue}, 100%, 50%, 0.6)`,
                filter: 'blur(1px)',
                mixBlendMode: 'screen',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            >
              {/* Scintillement */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  opacity: [1, 0.5, 1],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
                style={{
                  background: `radial-gradient(circle at center, hsla(${star.hue}, 100%, 80%, 1) 0%, transparent 70%)`,
                  borderRadius: '50%'
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  );
} 