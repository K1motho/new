import React from 'react';
import { db, storage } from '../firebaseConfig';
import { deleteDoc, doc } from 'firebase/firestore';
import {  ref, deleteObject } from 'firebase/storage';

export default function Ctask({ memories }) {
  const handleDelete = async (id, beforeImageUrl, confirmationImageUrl) => {
    try {
      // Check if beforeImageUrl exists and delete it from Firebase Storage
      if (beforeImageUrl) {
        const beforeImageRef = ref(storage, beforeImageUrl);
        await deleteObject(beforeImageRef);
      }
      
      // Check if confirmationImageUrl exists and delete it from Firebase Storage
      if (confirmationImageUrl) {
        const afterImageRef = ref(storage, confirmationImageUrl);
        await deleteObject(afterImageRef);
      }

      // Delete the memory document from Firestore
      await deleteDoc(doc(db, 'memories', id));
    } catch (err) {
      console.error('Error deleting memory:', err);
    }
  };

  return (
    <section className="space-y-5">
      <h2 className="text-3xl font-semibold text-pink-700 font-['Dancing_Script'] text-center">Completed Memories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memories && memories.length > 0 ? memories.map((mem) => (
          mem.completed && (
            <div key={mem.id} className="bg-white p-5 rounded-xl shadow-lg border border-purple-200">
              <h3 className="text-xl font-medium mb-3 text-purple-700 font-['Dancing_Script']">{mem.task}</h3>
              <div className="relative mb-4 h-56 rounded-lg overflow-hidden shadow-inner border border-pink-100">
                {mem.beforeImage && (
                  <img src={mem.beforeImage} alt="Before" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                )}
                {mem.confirmationImage && (
                  <img src={mem.confirmationImage} alt="After" className="absolute inset-0 w-full h-full object-cover" />
                )}
              </div>
              <p className="text-sm text-purple-600 font-['Montserrat'] mb-4">
                <span className="font-semibold">Completed:</span> 
                {mem.confirmationTimestamp ? 
                  new Date(mem.confirmationTimestamp.seconds * 1000).toLocaleString() : 'N/A'}
              </p>
              <button
                onClick={() => handleDelete(mem.id, mem.beforeImage, mem.confirmationImage)}
                className="w-full bg-white text-purple-600 py-2 px-4 rounded-lg border border-purple-300 hover:bg-purple-50 transition-all font-['Montserrat'] shadow-sm"
              >
                Remove Memory
              </button>
            </div>
          )
        )) : (
          <p className="text-center text-lg text-gray-600">No memories to display</p>
        )}
      </div>
    </section>
  );
}
