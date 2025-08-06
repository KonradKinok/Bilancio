import { useEffect, useRef, useState } from "react";
import { useMainDataContext } from "../Context/useMainDataContext";
import scss from "./LogoBilancio.module.scss";

interface LogoBilancioProps {
  classNameIconContainer?: string;
}

export const LogoBilancio: React.FC<LogoBilancioProps> = (
  classNameIconContainer
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { dotsNumber, setDotsNumber } = useMainDataContext();
  const [numberOfDots, setNumberOfDots] = useState(dotsNumber); // Domyślna liczba kropek
  // Synchronizacja numberOfDots z dotsNumber
  useEffect(() => {
    if (numberOfDots !== dotsNumber) {
      setNumberOfDots(dotsNumber);
    }
  }, [dotsNumber, numberOfDots]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const containerWidth = 190;
    const containerHeight = 60;
    const dotRadius = 1.5;

    // Funkcja generująca losowy jasny kolor rgba dla lepszego kontrastu
    const getRandomColor = () => {
      const r = Math.floor(100 + Math.random() * 156); // Losowy czerwony (100-255)
      const g = Math.floor(100 + Math.random() * 156); // Losowy zielony (100-255)
      const b = Math.floor(100 + Math.random() * 156); // Losowy niebieski (100-255)
      const a = 0.7 + Math.random() * 0.3; // Losowa alfa (0.7-1)
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    };

    // Tablica trzech kropek z losowymi początkowymi pozycjami i kątami
    const dots = Array.from({ length: numberOfDots }, () => ({
      x: Math.random() * (containerWidth - 2 * dotRadius) + dotRadius,
      y: Math.random() * (containerHeight - 2 * dotRadius) + dotRadius,
      vx: 0,
      vy: 0,
      speed: 0.01 + Math.random() * 0.09, // Losowa prędkość od 0.01 do 0.1
      color: getRandomColor(), // Losowy jasny kolor dla każdej kropki
    }));

    // Ustaw początkowe prędkości dla każdej kropki
    dots.forEach((dot) => {
      const angle = Math.random() * 2 * Math.PI;
      dot.vx = dot.speed * Math.cos(angle);
      dot.vy = dot.speed * Math.sin(angle);
    });

    const animate = () => {
      // Wyczyść canvas
      ctx.clearRect(0, 0, containerWidth, containerHeight);

      // Aktualizuj każdą kropkę
      dots.forEach((dot) => {
        // Aktualizuj pozycję
        dot.x += dot.vx;
        dot.y += dot.vy;

        // Sprawdź kolizje z krawędziami
        if (dot.x - dotRadius <= 0 || dot.x + dotRadius >= containerWidth) {
          // Odbicie od lewej/prawej krawędzi
          dot.vx = -dot.vx;
          // Losowy kąt odchylenia (±45 stopni)
          const deviation = ((Math.random() - 0.5) * Math.PI) / 2;
          const newAngle = Math.atan2(dot.vy, dot.vx) + deviation;
          dot.vx = dot.speed * Math.cos(newAngle);
          dot.vy = dot.speed * Math.sin(newAngle);
          // Upewnij się, że kropka nie wychodzi poza krawędź
          dot.x = Math.max(
            dotRadius,
            Math.min(containerWidth - dotRadius, dot.x)
          );
        }

        if (dot.y - dotRadius <= 0 || dot.y + dotRadius >= containerHeight) {
          // Odbicie od górnej/dolnej krawędzi
          dot.vy = -dot.vy;
          // Losowy kąt odchylenia (±45 stopni)
          const deviation = ((Math.random() - 0.5) * Math.PI) / 2;
          const newAngle = Math.atan2(dot.vy, dot.vx) + deviation;
          dot.vx = dot.speed * Math.cos(newAngle);
          dot.vy = dot.speed * Math.sin(newAngle);
          // Upewnij się, że kropka nie wychodzi poza krawędź
          dot.y = Math.max(
            dotRadius,
            Math.min(containerHeight - dotRadius, dot.y)
          );
        }

        // Rysuj kropkę
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dotRadius, 0, 2 * Math.PI);
        ctx.fillStyle = dot.color;
        ctx.fill();
        ctx.closePath();
      });

      // Kontynuuj animację
      requestAnimationFrame(animate);
    };

    // Rozpocznij animację
    animate();

    // Czyszczenie przy odmontowaniu
    return () => {
      ctx.clearRect(0, 0, containerWidth, containerHeight);
    };
  }, [numberOfDots]);
  // Ustawienie dynamicznej klasy
  const containerClassName =
    `${classNameIconContainer} ${scss["logo-main-container"]}`.trim();

  return (
    <div className={containerClassName}>
      <div className={scss["logo-container"]}>
        <canvas
          ref={canvasRef}
          width={190}
          height={60}
          className={scss["canvas"]}
        />
        <div className={scss["logo-text-container"]}>BILANCIO</div>
      </div>
    </div>
  );
};
