import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface SessionWarningModalProps {
  isOpen: boolean;
  onExtend: () => void;
  onLogout: () => void;
  timeRemaining: number; // in seconds
}

export const SessionWarningModal: React.FC<SessionWarningModalProps> = ({
  isOpen,
  onExtend,
  onLogout,
  timeRemaining: initialTimeRemaining
}) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTimeRemaining);

  useEffect(() => {
    setTimeRemaining(initialTimeRemaining);
  }, [initialTimeRemaining]);

  useEffect(() => {
    if (!isOpen || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          onLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeRemaining, onLogout]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progressValue = (timeRemaining / initialTimeRemaining) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-amber-500">⚠️</span>
            Session Expiring Soon
          </DialogTitle>
          <DialogDescription>
            Your session will expire in {formatTime(timeRemaining)}. Would you like to extend your session?
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Progress value={progressValue} className="w-full" />
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Time remaining: {formatTime(timeRemaining)}
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onLogout}>
            Logout Now
          </Button>
          <Button onClick={onExtend}>
            Extend Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};