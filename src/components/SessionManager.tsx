import React, { useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTokenService } from '@/services/tokenService';
import { SessionWarningModal } from './SessionWarningModal';
import { useTokenMonitor } from '@/hooks/useTokenMonitor';

interface SessionManagerProps {
  children: ReactNode;
}

export const SessionManager: React.FC<SessionManagerProps> = ({ children }) => {
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const { userAuth, logout } = useAuth();
  const tokenService = useTokenService();

  // Enable token monitoring
  useTokenMonitor();

  useEffect(() => {
    if (!userAuth?.tokenInfo) return;

    const expiresIn = userAuth.tokenInfo.expiresIn;
    
    // Show warning 2 minutes before expiration
    if (expiresIn <= 120 && expiresIn > 0) {
      setShowWarning(true);
      setTimeRemaining(expiresIn);
    } else {
      setShowWarning(false);
    }

    // Auto-logout when token expires
    const logoutTimer = setTimeout(() => {
      logout();
    }, expiresIn * 1000);

    return () => clearTimeout(logoutTimer);
  }, [userAuth?.tokenInfo, logout]);

  const extendSession = async () => {
    try {
      await tokenService.refreshAccessToken();
      setShowWarning(false);
    } catch (error) {
      console.error('Failed to extend session:', error);
      logout();
    }
  };

  const handleLogout = () => {
    setShowWarning(false);
    logout();
  };

  return (
    <>
      {children}
      
      <SessionWarningModal
        isOpen={showWarning}
        onExtend={extendSession}
        onLogout={handleLogout}
        timeRemaining={timeRemaining}
      />
    </>
  );
};