
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, Users, Crown, CreditCard, Gamepad2 } from 'lucide-react';

interface QueueDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const PongGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let ball = { x: 200, y: 150, dx: 2, dy: 2, radius: 5 };
    const paddle = { x: 175, y: 250, width: 50, height: 10 };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Ball
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#3b82f6';
      ctx.fill();
      
      // Paddle
      ctx.fillStyle = '#1f2937';
      ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
      
      // Update ball position
      ball.x += ball.dx;
      ball.y += ball.dy;
      
      // Ball collision with walls
      if (ball.x <= ball.radius || ball.x >= canvas.width - ball.radius) {
        ball.dx = -ball.dx;
      }
      if (ball.y <= ball.radius) {
        ball.dy = -ball.dy;
      }
      
      // Ball collision with paddle
      if (ball.y + ball.radius >= paddle.y && 
          ball.x >= paddle.x && 
          ball.x <= paddle.x + paddle.width) {
        ball.dy = -ball.dy;
        setScore(prev => prev + 1);
        
        // Increase ball speed slightly each time it hits the paddle
        const speedIncrease = 1.05;
        ball.dx *= speedIncrease;
        ball.dy *= speedIncrease;
      }
      
      // Ball out of bounds
      if (ball.y > canvas.height) {
        ball = { x: 200, y: 150, dx: 2, dy: 2, radius: 5 };
        setScore(0);
      }
      
      animationId = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      paddle.x = e.clientX - rect.left - paddle.width / 2;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="text-center">
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        className="border border-gray-300 rounded"
      />
      <p className="text-sm text-gray-600 mt-2">Score: {score}</p>
    </div>
  );
};

const QueueDialog = ({ isOpen, onClose }: QueueDialogProps) => {
  const [queuePosition, setQueuePosition] = useState(127);
  const [showGame, setShowGame] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setQueuePosition(prev => Math.max(1, prev - Math.floor(Math.random() * 3)));
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 2000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const progress = ((200 - queuePosition) / 200) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-orange-500" />
            <span>Queue Active</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">#{queuePosition}</div>
            <p className="text-sm text-gray-600">Your position in queue</p>
            <Progress value={progress} className="mt-3" />
            <div className="flex items-center justify-center space-x-1 mt-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>~{timeLeft}s remaining</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              className="flex flex-col items-center space-y-1 h-auto py-3"
              onClick={() => alert('Payment processing...')}
            >
              <CreditCard className="h-4 w-4" />
              <span className="text-xs">Skip Queue</span>
              <span className="text-xs font-bold">$1</span>
            </Button>
            
            <Button 
              variant="outline"
              className="flex flex-col items-center space-y-1 h-auto py-3 border-amber-300 text-amber-700 hover:bg-amber-50"
              onClick={() => alert('Premium plans coming soon!')}
            >
              <Crown className="h-4 w-4" />
              <span className="text-xs">Premium Plans</span>
              <span className="text-xs">No queues</span>
            </Button>
          </div>

          <div className="border-t pt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowGame(!showGame)}
              className="w-full"
            >
              <Gamepad2 className="h-4 w-4 mr-2" />
              {showGame ? 'Hide Game' : 'Play Pong While Waiting'}
            </Button>
            
            {showGame && (
              <div className="mt-4">
                <PongGame />
              </div>
            )}
          </div>
          
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QueueDialog;
