import React, { useEffect, useRef, useState } from 'react';

interface Point { x: number; y: number }

const BOARD_SIZE = 10;
const INITIAL_SNAKE: Point[] = [{ x: 4, y: 4 }];

function randomFood(): Point {
  return {
    x: Math.floor(Math.random() * BOARD_SIZE),
    y: Math.floor(Math.random() * BOARD_SIZE)
  };
}

interface SnakeGameProps {
  active: boolean;
}

const SnakeGame = ({ active }: SnakeGameProps) => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>(randomFood());
  const directionRef = useRef<Point>({ x: 1, y: 0 });

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') directionRef.current = { x: 0, y: -1 };
      else if (e.key === 'ArrowDown') directionRef.current = { x: 0, y: 1 };
      else if (e.key === 'ArrowLeft') directionRef.current = { x: -1, y: 0 };
      else if (e.key === 'ArrowRight') directionRef.current = { x: 1, y: 0 };
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setSnake(prev => {
        const head = prev[0];
        const newHead = {
          x: (head.x + directionRef.current.x + BOARD_SIZE) % BOARD_SIZE,
          y: (head.y + directionRef.current.y + BOARD_SIZE) % BOARD_SIZE
        };
        const newSnake = [newHead, ...prev.slice(0, prev.length - 1)];
        if (newHead.x === food.x && newHead.y === food.y) {
          setFood(randomFood());
          newSnake.push(prev[prev.length - 1]);
        }
        return newSnake;
      });
    }, 200);
    return () => clearInterval(id);
  }, [active, food]);

  return (
    <div className="grid grid-cols-10 gap-0.5 w-40 mx-auto">
      {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, i) => {
        const x = i % BOARD_SIZE;
        const y = Math.floor(i / BOARD_SIZE);
        const isSnake = snake.some(p => p.x === x && p.y === y);
        const isFood = food.x === x && food.y === y;
        const bg = isFood ? 'bg-red-500' : isSnake ? 'bg-green-600' : 'bg-gray-200';
        return <div key={i} className={`w-3 h-3 ${bg}`}></div>;
      })}
    </div>
  );
};

export default SnakeGame;
