import React, { useEffect, useState } from 'react';

export default function Itask({ memories, setMemories }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000); // update every minute
    return () => clearInterval(interval);
  }, []);

  const handleComplete = (id) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const updated = memories.map((mem) =>
            mem.id === id
              ? {
                  ...mem,
                  completed: true,
                  confirmationImage: reader.result,
                  confirmationTimestamp: new Date().toISOString(),
                }
              : mem
          );
          setMemories(updated);
        };
        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
  };

  const getCountdown = (deadline) => {
    if (!deadline) return null;
    const end = new Date(deadline);
    const diff = end - now;

    if (diff <= 0) return 'Deadline passed';

    const mins = Math.floor((diff / 1000 / 60) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    return `${days}d ${hours}h ${mins}m left`;
  };

  return (
    <section className="space-y-5">
      <h2 className="text-3xl font-semibold text-pink-700 font-['Dancing_Script'] text-center">Pending Memories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memories && memories.length > 0 ? (
          memories
            .filter((mem) => !mem.completed)
            .map((mem) => (
              <div key={mem.id} className="bg-white p-5 rounded-xl shadow-lg border border-pink-200">
                <h3 className="text-xl font-medium mb-3 text-purple-700 font-['Dancing_Script']">{mem.task}</h3>
                <div className="relative mb-4 h-56 rounded-lg overflow-hidden shadow-inner border border-pink-100">
                  {mem.beforeImage ? (
                    <img
                      src={mem.beforeImage}
                      alt={`Memory before: ${mem.task}`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-pink-50 text-pink-300 text-sm">
                      No image
                    </div>
                  )}
                </div>

                <p className="text-sm text-purple-600 font-['Montserrat']">
                  <span className="font-semibold">Added:</span>{' '}
                  {new Date(mem.timestamp ?? '').toLocaleString()}
                </p>

                {mem.deadline && (
                  <p className="text-xs text-red-500 font-['Montserrat'] mb-2">
                    <span className="font-semibold">Deadline:</span>{' '}
                    {getCountdown(mem.deadline)}
                  </p>
                )}

                <button
                  onClick={() => handleComplete(mem.id)}
                  className="mt-2 px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition"
                >
                  Mark as Complete
                </button>
              </div>
            ))
        ) : (
          <p className="text-center text-lg text-gray-600">No pending memories</p>
        )}
      </div>
    </section>
  );
}
