import React, { useRef, useEffect, useState } from 'react';
import { Eraser, RotateCcw, PenLine, Eye } from 'lucide-react';
import { cn } from '../lib/utils';

interface KanjiCanvasProps {
  char: string;
  className?: string;
  key?: string | number;
}

export default function KanjiCanvas({ char, className }: KanjiCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showTrace, setShowTrace] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Responsive sizing
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth * 2;
        canvas.height = parent.clientHeight * 2;
        canvas.style.width = `${parent.clientWidth}px`;
        canvas.style.height = `${parent.clientHeight}px`;
        
        const context = canvas.getContext('2d');
        if (context) {
          context.scale(2, 2);
          context.lineCap = 'round';
          context.strokeStyle = '#1A1A1A';
          context.lineWidth = 4;
          contextRef.current = context;
        }
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const { offsetX, offsetY } = getCoordinates(e);
    contextRef.current?.beginPath();
    contextRef.current?.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = getCoordinates(e);
    contextRef.current?.lineTo(offsetX, offsetY);
    contextRef.current?.stroke();
  };

  const stopDrawing = () => {
    contextRef.current?.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas && contextRef.current) {
      contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    if ('nativeEvent' in e && e.nativeEvent instanceof MouseEvent) {
      return { offsetX: e.nativeEvent.offsetX, offsetY: e.nativeEvent.offsetY };
    } else {
      const touch = (e as React.TouchEvent).touches[0];
      const rect = (e.currentTarget as HTMLCanvasElement).getBoundingClientRect();
      return {
        offsetX: touch.clientX - rect.left,
        offsetY: touch.clientY - rect.top
      };
    }
  };

  return (
    <div className={cn("relative w-full h-full group bg-white border border-border-theme", className)}>
      {/* Trace Layer */}
      {showTrace && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 select-none">
          <span className="text-[200px] font-serif leading-none">{char}</span>
        </div>
      )}

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="block cursor-crosshair relative z-10"
      />

      {/* Controls Overlay */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
        <button
          onClick={() => setShowTrace(!showTrace)}
          className={cn(
            "p-3 border transition-all text-ink",
            showTrace ? "bg-accent text-white border-accent" : "bg-white border-border-theme hover:bg-bg"
          )}
          title="Toggle Trace"
        >
          <Eye size={18} />
        </button>
        <button
          onClick={clearCanvas}
          className="p-3 bg-white border border-border-theme hover:bg-bg text-ink transition-all"
          title="Clear Canvas"
        >
          <Eraser size={18} />
        </button>
      </div>

      <div className="absolute bottom-4 right-4 text-[9px] uppercase tracking-widest font-bold text-muted pointer-events-none opacity-40">
        Draw Mode Active
      </div>
    </div>
  );
}
