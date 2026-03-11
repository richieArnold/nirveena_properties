import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/Instance';

const SessionTracker = ({ children }) => {
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const warningTimeoutRef = useRef(null);

  // 3 minutes = 180000 milliseconds
  const SESSION_TIMEOUT = 3 * 60 * 1000;
  const WARNING_BEFORE = 30 * 1000; // Show warning 30 seconds before logout

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);

    // Set warning timeout
    warningTimeoutRef.current = setTimeout(() => {
      // Show warning toast or modal
      const warning = document.getElementById('session-warning');
      if (warning) warning.classList.remove('hidden');
    }, SESSION_TIMEOUT - WARNING_BEFORE);

    // Set logout timeout
    timeoutRef.current = setTimeout(() => {
      handleLogout(true);
    }, SESSION_TIMEOUT);
  };

  const handleLogout = async (expired = false) => {
    // Clear all timers
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);

    // Hide warning if visible
    const warning = document.getElementById('session-warning');
    if (warning) warning.classList.add('hidden');

    try {
      // Optional: Call logout endpoint if you have one
      // await axiosInstance.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      
      // Redirect to login with session expired message
      navigate('/admin/login', { 
        state: { 
          message: expired ? 'Session expired due to inactivity' : 'Logged out successfully' 
        } 
      });
    }
  };

  // Handle user activity
  const handleUserActivity = () => {
    resetTimer();
    // Hide warning if visible
    const warning = document.getElementById('session-warning');
    if (warning) warning.classList.add('hidden');
  };

  useEffect(() => {
    // Set up event listeners for user activity
    const events = ['mousedown', 'keydown', 'scroll', 'mousemove', 'touchstart'];
    
    events.forEach(event => {
      window.addEventListener(event, handleUserActivity);
    });

    // Initial timer setup
    resetTimer();

    // Check token validity on mount
    const checkToken = async () => {
      try {
        await axiosInstance.get('/api/auth/verify');
      } catch (error) {
        if (error.response?.data?.expired) {
          handleLogout(true);
        }
      }
    };
    checkToken();

    // Cleanup
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleUserActivity);
      });
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    };
  }, []);

  return (
    <>
      {/* Session Warning Modal */}
      <div 
        id="session-warning" 
        className="hidden fixed top-4 right-4 z-50 max-w-md bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg shadow-lg animate-slide-in"
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-yellow-800">
              Session about to expire
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              You'll be logged out in 30 seconds due to inactivity.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleUserActivity}
                className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1.5 rounded-lg hover:bg-yellow-200 transition"
              >
                Stay Logged In
              </button>
              <button
                onClick={() => handleLogout(false)}
                className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition"
              >
                Logout Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {children}
    </>
  );
};

export default SessionTracker;