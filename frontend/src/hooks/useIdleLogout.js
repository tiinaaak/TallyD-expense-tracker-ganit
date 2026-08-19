import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

const IDLE_TIMEOUT = 20 * 60 * 1000;   // 20 minutes
const WARNING_BEFORE = 60 * 1000;      // warn 1 minute before logout
const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];

function useIdleLogout(isActive, onIdleLogout) {
  const timeoutRef = useRef(null);
  const warningRef = useRef(null);
  const warnedRef = useRef(false);

  useEffect(() => {
    if (!isActive) return;

    const clearTimers = () => {
      clearTimeout(timeoutRef.current);
      clearTimeout(warningRef.current);
    };

    const resetTimers = () => {
      clearTimers();
      warnedRef.current = false;

      warningRef.current = setTimeout(() => {
        warnedRef.current = true;
        toast.warn("You've been idle — you'll be logged out in 1 minute.");
      }, IDLE_TIMEOUT - WARNING_BEFORE);

      timeoutRef.current = setTimeout(() => {
        toast.info('Logged out due to inactivity.');
        onIdleLogout();
      }, IDLE_TIMEOUT);
    };

    const handleActivity = () => resetTimers();

    ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, handleActivity));
    resetTimers();

    return () => {
      clearTimers();
      ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, handleActivity));
    };
  }, [isActive, onIdleLogout]);
}

export default useIdleLogout;