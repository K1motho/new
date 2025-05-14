import React, { useState } from 'react';
import { auth, db, storage } from '../firebaseConfig';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function Atask() {
  const [task, setTask] = useState('');
  const [beforeFile, setBeforeFile] = useState(null);
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task || !beforeFile) {
      setError('Please fill all required fields');
      return;
    }
    if (!auth.currentUser) {
      setError('Please sign in to create a memory');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Upload the before image
      const fileRef = ref(storage, `beforeImages/${Date.now()}_${beforeFile.name}`);
      await uploadBytes(fileRef, beforeFile);
      const beforeImageUrl = await getDownloadURL(fileRef);

      // Save to Firestore
      await addDoc(collection(db, 'memories'), {
        task,
        beforeImage: beforeImageUrl,
        deadline: deadline || null,
        timestamp: serverTimestamp(),
        completed: false,
        userId: auth.currentUser.uid,
      });

      // Reset form
      setTask('');
      setDeadline('');
      setBeforeFile(null);
      setSuccess(true);
    } catch (err) {
      console.error('Error saving memory:', err);
      setError(err.message || 'Failed to save memory');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white p-6 rounded-xl shadow-lg border border-pink-200 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-pink-700 font-['Dancing_Script']">Capture a New Moment</h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        {success && (
          <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm">
            Memory saved successfully!
          </div>
        )}

        <div>
          <label className="block mb-2 font-medium text-pink-600 font-['Montserrat']">
            Memory Description <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="w-full p-3 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-400"
            placeholder="What beautiful moment do you want to remember?"
            disabled={loading}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block mb-2 font-medium text-pink-600 font-['Montserrat']">Deadline (optional)</label>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full p-3 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-200"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block mb-2 font-medium text-pink-600 font-['Montserrat']">
              Before Photo <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              onChange={(e) => setBeforeFile(e.target.files[0])}
              className="w-full p-3 border border-pink-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
              accept="image/*"
              disabled={loading}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !task || !beforeFile}
          className={`w-full bg-gradient-to-r from-pink-400 to-purple-500 text-white py-3 rounded-lg hover:from-pink-500 hover:to-purple-600 transition-all shadow-md font-['Montserrat'] font-medium ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : (
            'Preserve This Memory'
          )}
        </button>
      </form>
    </section>
  );
}