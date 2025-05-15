import { useState, useEffect } from 'react';
import { auth, db } from '../firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Atask from './Atask';
import Ctask from './Ctask';

export default function Dash() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [memories, setMemories] = useState([]);
  const navigate = useNavigate();

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Monitor auth + fetch user memories
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        const q = query(
          collection(db, 'memories'),
          where('userId', '==', user.uid),
          orderBy('timestamp', 'desc')
        );

        const unsubscribeData = onSnapshot(q, (snapshot) => {
          const fetched = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMemories(fetched);
        });

        // Unsubscribe from data listener when user changes or component unmounts
        return () => unsubscribeData();
      } else {
        setMemories([]);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleAuthAction = async () => {
    if (user) {
      try {
        setLoading(true);
        await signOut(auth);
        navigate('/Login');
      } catch (error) {
        console.error('Error signing out:', error);
      } finally {
        setLoading(false);
      }
    } else {
      navigate('/Login');
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
            onClick={handleAuthAction}
            disabled={loading}
            className="bg-white text-pink-600 px-5 py-2 rounded-full border border-pink-300 hover:bg-pink-50 shadow-sm hover:shadow-pink-200 disabled:opacity-50 transition-all font-['Montserrat'] font-medium"
          >
            {loading ? (user ? 'Signing out...' : 'Redirecting...') : user ? 'Logout' : 'Login'}
          </button>

          <div className="bg-white p-2 rounded-full shadow-lg border border-pink-200 hover:scale-110 transition-transform">
            <img
              src="src/assets/logo.jpg"
              className="h-10 w-10 object-contain"
              alt="Belle Vue Logo"
            />
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-6 space-y-8">
        <Atask />
        <Ctask memories={memories} />
      </main>
    </div>
  );
}
