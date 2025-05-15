export default function Ctask({ memories, setMemories }) {
  const handleDelete = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this memory?");
    if (!confirmed) return;

    const updated = memories.filter((m) => m.id !== id);
    setMemories(updated);
  };

  return (
    <section className="space-y-5">
      <h2 className="text-3xl font-semibold text-pink-700 font-['Dancing_Script'] text-center">Completed Memories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memories && memories.length > 0 ? (
          memories
            .filter((mem) => mem.completed)
            .map((mem) => (
              <div key={mem.id} className="bg-white p-5 rounded-xl shadow-lg border border-purple-200">
                <h3 className="text-xl font-medium mb-3 text-purple-700 font-['Dancing_Script']">{mem.task}</h3>
                
                <div className="relative mb-4 h-56 rounded-lg overflow-hidden shadow-inner border border-pink-100">
                  {mem.beforeImage ? (
                    <img
                      src={mem.beforeImage}
                      alt={`Before: ${mem.task}`}
                      className="absolute inset-0 w-full h-full object-cover opacity-40"
                    />
                  ) : (
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-pink-50 text-pink-300 text-sm">
                      No before image
                    </div>
                  )}

                  {mem.confirmationImage ? (
                    <img
                      src={mem.confirmationImage}
                      alt={`After: ${mem.task}`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-purple-50 text-purple-300 text-sm">
                      No confirmation image
                    </div>
                  )}
                </div>

                {mem.confirmationLocation && (
                  <p className="text-xs text-purple-400 mb-2 font-['Montserrat']">
                    <span className="font-semibold">Location:</span>{' '}
                    {`Lat ${mem.confirmationLocation.latitude.toFixed(4)}, Lng ${mem.confirmationLocation.longitude.toFixed(4)}`}
                  </p>
                )}

                <p className="text-sm text-purple-600 font-['Montserrat'] mb-4">
                  <span className="font-semibold">Completed:</span>{' '}
                  {mem.confirmationTimestamp ? new Date(mem.confirmationTimestamp).toLocaleString() : 'N/A'}
                </p>

                <button
                  onClick={() => handleDelete(mem.id)}
                  className="w-full bg-white text-purple-600 py-2 px-4 rounded-lg border border-purple-300 hover:bg-purple-50 transition"
                >
                  Remove Memory
                </button>
              </div>
            ))
        ) : (
          <p className="text-center text-lg text-gray-600">No memories to display</p>
        )}
      </div>
    </section>
  );
}
