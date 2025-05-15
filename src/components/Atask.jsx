import React, { useState, useEffect, useRef } from 'react';

export default function Atask({ setMemories }) {
  const [task, setTask] = useState('');
  const [beforeFile, setBeforeFile] = useState(null);
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const alertTimeoutRef = useRef(null);

  useEffect(() => {
    if (!deadline) return;

    const deadlineTime = new Date(deadline).getTime();
    const now = Date.now();
    const timeUntilDeadline = deadlineTime - now;

    if (timeUntilDeadline <= 0) return;

    // Clear any existing timeout first
    if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);

    alertTimeoutRef.current = setTimeout(() => {
      const audio = new Audio('/deadline.mp3');
      audio.play().catch(err => console.error('Audio playback failed:', err));
    }, timeUntilDeadline);

    return () => {
      if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current);
    };
  }, [deadline]);

  // Auto-clear error and success messages after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task || !beforeFile || !deadline) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newMemory = {
          id: Date.now().toString(),
          task,
          beforeImage: reader.result,
          deadline,
          timestamp: new Date().toISOString(),
          completed: false,
        };
        setMemories((prev) => [...prev, newMemory]);
        setTask('');
        setDeadline('');
        setBeforeFile(null);
        setSuccess(true);
      };
      reader.readAsDataURL(beforeFile);
    } catch (err) {
      console.error('Error saving memory:', err);
      setError('Failed to save memory');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white p-6 rounded-xl shadow-lg border border-pink-200 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-pink-700 font-['Dancing_Script']">Capture a New Moment</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
        {success && <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm">Memory saved successfully!</div>}

        <div>
          <label className="block mb-2 font-medium text-pink-600 font-['Montserrat']">
            Memory Description <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="w-full p-3 border border-pink-300 rounded-lg"
            placeholder="What beautiful moment do you want to remember?"
            disabled={loading}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block mb-2 font-medium text-pink-600 font-['Montserrat']">
              Deadline <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full p-3 border border-pink-300 rounded-lg"
              disabled={loading}
              required
            />
          </div>
          <div>
            <label className="block mb-2 font-medium text-pink-600 font-['Montserrat']">
              Before Photo <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              onChange={(e) => setBeforeFile(e.target.files[0])}
              className="w-full p-3 border border-pink-300 rounded-lg"
              accept="image/*"
              disabled={loading}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !task || !beforeFile || !deadline}
          className="w-full bg-gradient-to-r from-pink-400 to-purple-500 text-white py-3 rounded-lg"
        >
          {loading ? 'Saving...' : 'Preserve This Memory'}
        </button>
      </form>
    </section>
  );
}
