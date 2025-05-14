import { useState, useEffect } from 'react';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; // Add this import
import Atask from './Atask';
import Ctask from './Ctask';

export default function Dash() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      navigate('/Login'); // Uncommented and active now
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-rose-50">
      <nav className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-pink-50 to-purple-50 border-b border-pink-200">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-purple-800 font-['Pacifico'] tracking-wide">
            📸 Belle Vue
          </h1>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="bg-white/80 px-4 py-1 rounded-full shadow-sm border border-pink-200">
            <span className="text-pink-600 font-['Montserrat'] text-sm">
              {currentTime.toLocaleTimeString()}
            </span>
          </div>
          
          <button
            onClick={handleSignOut}
            disabled={loading}
            className="bg-white text-pink-600 px-5 py-2 rounded-full border border-pink-300 hover:bg-pink-50 shadow-sm hover:shadow-pink-200 disabled:opacity-50 transition-all font-['Montserrat'] font-medium"
          >
            {loading ? 'Signing out...' : 'Logout'}
          </button>
          
          <div className="bg-white p-2 rounded-full shadow-lg border border-pink-200 hover:scale-110 transition-transform">
            <img
              src="src\assets\logo.jpg"
              className="h-10 w-10 object-contain"
              alt="Belle Vue Logo"
            />
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* Call the task sections */}
        <Atask />
        <Ctask />
      </main>
    </div>
  );
}