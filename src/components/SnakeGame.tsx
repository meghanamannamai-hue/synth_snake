import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { Point, Direction, GameState } from '../types';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2;

export const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    snake: [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }],
    food: { x: 5, y: 5 },
    direction: 'UP',
    score: 0,
    isGameOver: false,
    highScore: parseInt(localStorage.getItem('snakeHighScore') || '0'),
  });

  const directionRef = useRef<Direction>('UP');
  const lastTimeRef = useRef<number>(0);
  const speedRef = useRef<number>(INITIAL_SPEED);

  const getRandomPoint = useCallback((): Point => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  }, []);

  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      snake: [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }],
      food: getRandomPoint(),
      direction: 'UP',
      score: 0,
      isGameOver: false,
    }));
    directionRef.current = 'UP';
    speedRef.current = INITIAL_SPEED;
  };

  const moveSnake = useCallback(() => {
    if (gameState.isGameOver) return;

    setGameState(prev => {
      const head = prev.snake[0];
      const newHead = { ...head };

      switch (directionRef.current) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Wall collision
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        handleGameOver(prev.score);
        return { ...prev, isGameOver: true };
      }

      // Self collision
      if (prev.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        handleGameOver(prev.score);
        return { ...prev, isGameOver: true };
      }

      const newSnake = [newHead, ...prev.snake];
      let newScore = prev.score;
      let newFood = prev.food;

      // Food collision
      if (newHead.x === prev.food.x && newHead.y === prev.food.y) {
        newScore += 10;
        newFood = getRandomPoint();
        speedRef.current = Math.max(50, INITIAL_SPEED - (newScore / 10) * SPEED_INCREMENT);
      } else {
        newSnake.pop();
      }

      return {
        ...prev,
        snake: newSnake,
        food: newFood,
        score: newScore,
      };
    });
  }, [gameState.isGameOver, getRandomPoint]);

  const handleGameOver = (score: number) => {
    const currentHigh = parseInt(localStorage.getItem('snakeHighScore') || '0');
    if (score > currentHigh) {
      localStorage.setItem('snakeHighScore', score.toString());
      setGameState(prev => ({ ...prev, highScore: score }));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (directionRef.current !== 'DOWN') directionRef.current = 'UP'; break;
        case 'ArrowDown': if (directionRef.current !== 'UP') directionRef.current = 'DOWN'; break;
        case 'ArrowLeft': if (directionRef.current !== 'RIGHT') directionRef.current = 'LEFT'; break;
        case 'ArrowRight': if (directionRef.current !== 'LEFT') directionRef.current = 'RIGHT'; break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const gameLoop = useCallback((time: number) => {
    if (time - lastTimeRef.current > speedRef.current) {
      moveSnake();
      lastTimeRef.current = time;
    }
    requestAnimationFrame(gameLoop);
  }, [moveSnake]);

  useEffect(() => {
    const animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [gameLoop]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear board
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid Lines (subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw Food
    ctx.fillStyle = '#d946ef'; // Fuchsia 500
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#d946ef';
    ctx.beginPath();
    ctx.arc(
      gameState.food.x * cellSize + cellSize / 2,
      gameState.food.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw Snake
    gameState.snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#22d3ee' : '#0ea5e9'; // Cyan 400 to Blue 500
      ctx.shadowBlur = isHead ? 20 : 5;
      ctx.shadowColor = isHead ? '#22d3ee' : '#0ea5e9';
      
      const padding = 2;
      ctx.fillRect(
        segment.x * cellSize + padding,
        segment.y * cellSize + padding,
        cellSize - padding * 2,
        cellSize - padding * 2
      );
      ctx.shadowBlur = 0;
    });

    if (gameState.isGameOver) {
      ctx.fillStyle = 'rgba(2, 2, 5, 0.9)'; // Deep background
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#f1f5f9'; // Slate 100
      ctx.font = 'bold 30px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('SYSTEM ERROR', canvas.width / 2, canvas.height / 2 - 20);
      ctx.font = '12px monospace';
      ctx.fillText('CRASH DETECTED • REBOOT REQUIRED', canvas.width / 2, canvas.height / 2 + 10);
      ctx.fillStyle = '#22d3ee';
      ctx.fillText('CLICK TO INITIALIZE RECOVERY', canvas.width / 2, canvas.height / 2 + 35);
    }
  }, [gameState]);

  return (
    <div className="flex flex-col items-center gap-6 w-full h-full justify-center" id="snake-container">
      <div className="relative group p-0.5 bg-slate-800 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,1)] flex items-center justify-center aspect-square w-full max-w-[500px]">
        <canvas 
          ref={canvasRef}
          width={500}
          height={500}
          className="rounded-[1.8rem] cursor-none touch-none w-full h-full bg-black border-4 border-slate-900"
          onClick={() => gameState.isGameOver && resetGame()}
        />
        
        {/* Game UI Overlays */}
        <div className="absolute bottom-6 left-6 flex gap-2 pointer-events-none">
           <span className="px-2 py-1 bg-slate-900/80 rounded text-[10px] font-mono border border-slate-700 text-slate-400">SPEED: {((INITIAL_SPEED - speedRef.current) / 10 + 1).toFixed(1)}x</span>
           <span className="px-2 py-1 bg-slate-900/80 rounded text-[10px] font-mono border border-slate-700 uppercase text-slate-400">Status: Operational</span>
        </div>
      </div>
    </div>
  );
};
