'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Eraser } from 'lucide-react';

interface SignaturePadProps {
  onEnd: (signature: string) => void;
  className?: string;
  penColor?: string;
  backgroundColor?: string;
  width?: number;
  height?: number;
}

export function SignaturePad({
  onEnd,
  className,
  penColor = '#000000',
  backgroundColor = 'hsl(var(--card))',
  width = 500,
  height = 200,
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const getCanvasContext = () => {
    return canvasRef.current?.getContext('2d');
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = getCanvasContext();
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      onEnd('');
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.scale(ratio, ratio);
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }
  }, [backgroundColor]);


  const getCoords = (event: MouseEvent | TouchEvent): { x: number; y: number } | null => {
    if (!canvasRef.current) return null;
    const rect = canvasRef.current.getBoundingClientRect();
    if (event instanceof MouseEvent) {
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    }
    if (event.touches && event.touches.length > 0) {
      return { x: event.touches[0].clientX - rect.left, y: event.touches[0].clientY - rect.top };
    }
    return null;
  };

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const ctx = getCanvasContext();
    const coords = getCoords(event.nativeEvent);
    if (ctx && coords) {
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
      setIsDrawing(true);
    }
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const ctx = getCanvasContext();
    const coords = getCoords(event.nativeEvent);
    if (ctx && coords) {
      ctx.lineTo(coords.x, coords.y);
      ctx.strokeStyle = penColor;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    const ctx = getCanvasContext();
    if (ctx) {
      ctx.closePath();
      setIsDrawing(false);
      const dataUrl = canvasRef.current?.toDataURL() || '';
      onEnd(dataUrl);
    }
  };

  return (
    <div className={cn('relative w-full', className)}>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="w-full h-auto touch-none rounded-md border"
        style={{ width: `${width}px`, height: `${height}px` }}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={clearCanvas}
        className="absolute top-2 right-2"
        aria-label="Clear Signature"
      >
        <Eraser className="h-4 w-4" />
      </Button>
    </div>
  );
}
