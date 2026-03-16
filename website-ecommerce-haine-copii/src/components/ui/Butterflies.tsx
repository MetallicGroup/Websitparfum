"use client";

import { useEffect, useState } from "react";
import styles from "./butterflies.module.css";

interface Butterfly {
  id: number;
  left: string;
  top: string;
  tx: string;
  ty: string;
  rotStart: string;
  rotEnd: string;
  duration: string;
  delay: string;
  scale: string;
}

export default function Butterflies({ count = 20 }: { count?: number }) {
  const [butterflies, setButterflies] = useState<Butterfly[]>([]);

  useEffect(() => {
    // Generate random butterflies only on the client to avoid hydration mismatch
    const newButterflies = Array.from({ length: count }).map((_, i) => {
      const left = Math.random() * 100; // start anywhere horizontally
      const top = Math.random() * 100; // start anywhere vertically within hero
      
      // Fly to a random location
      const tx = (Math.random() * 100 - 50) + "vw"; 
      const ty = (Math.random() * -100 - 20) + "vh"; // always fly somewhat upwards
      
      const rotStart = (Math.random() * 90 - 45) + "deg"; // slight initial tilt
      const rotEnd = (Math.random() * 180 - 90) + "deg"; // twist as they fly
      
      const duration = 8 + Math.random() * 12 + "s";
      const delay = Math.random() * 8 + "s";
      const scale = 0.4 + Math.random() * 0.8;

      return {
        id: i,
        left: `${left}%`,
        top: `${top}%`,
        tx,
        ty,
        rotStart,
        rotEnd,
        duration,
        delay,
        scale: `${scale}`,
      };
    });

    setButterflies(newButterflies);
  }, [count]);

  if (butterflies.length === 0) return null;

  return (
    <div className={styles.container} aria-hidden="true">
      {butterflies.map((b) => (
        <div
          key={b.id}
          className={styles.butterflyWrap}
          style={{
            left: b.left,
            top: b.top,
            animationDuration: b.duration,
            animationDelay: b.delay,
            "--tx": b.tx,
            "--ty": b.ty,
            "--rot-start": b.rotStart,
            "--rot-end": b.rotEnd,
            "--scale": b.scale,
          } as React.CSSProperties}
        >
          <div className={styles.butterfly}>
            <div className={styles.wingLeft}></div>
            <div className={styles.wingRight}></div>
          </div>
        </div>
      ))}
    </div>
  );
}
