import { useEffect, useRef } from 'react';
import Stats from 'stats.js';

export const StatsMonitor = () => {
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInstance = useRef<Stats | null>(null);

  useEffect(() => {
    if (!statsRef.current || statsInstance.current) return;

    const stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb

    stats.dom.style.position = 'absolute';
    stats.dom.style.top = '80px';
    stats.dom.style.left = '4px';
    stats.dom.style.zIndex = '1000';
    stats.dom.style.opacity = '0.8';

    statsRef.current.appendChild(stats.dom);
    statsInstance.current = stats;

    const animate = () => {
      stats.begin();
      stats.end();
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (statsRef.current && stats.dom) {
        statsRef.current.removeChild(stats.dom);
      }
      statsInstance.current = null;
    };
  }, []);

  return <div ref={statsRef} className="stats-container" />;
};
