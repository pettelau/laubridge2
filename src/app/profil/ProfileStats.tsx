const ProfileStats = () => {
  return (
    <>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">
            Total gevinst/tap
          </h3>
          <p
            className={`text-2xl font-semibold ${
              1320 >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            1320 kr
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Antall spill</h3>
          <p className="text-2xl font-semibold text-gray-900">42</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Sist spilt</h3>
          <p className="text-2xl font-semibold text-gray-900">3 dager siden</p>
        </div>
      </div>

      {/* Additional stats */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistikk</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Vunnet</span>
              <span className="text-green-600 font-medium">15</span>
            </div>
            <div className="flex justify-between items-center mt-3">
              <span className="text-gray-500">Tapt</span>
              <span className="text-red-600 font-medium">27</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { ProfileStats };
