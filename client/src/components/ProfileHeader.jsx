export const ProfileHeader = ({ name, email }) => {
  return (
    <div className="w-full max-w-5xl mb-8">
      <div className="p-6 bg-gradient-to-r from-white to-green-50 rounded-2xl shadow-md">
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-green-700 flex items-center justify-center text-2xl font-bold text-white">
            {name.charAt(0).toUpperCase()}
          </div>

          {/* Details */}
          <div>
            <h1 className="text-xl font-bold text-gray-800 relative ">{name}</h1>
            <p className="text-gray-500">{email}</p>

            <div className="flex gap-2 mt-3">
              <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-600">
                ✓ Verified
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
