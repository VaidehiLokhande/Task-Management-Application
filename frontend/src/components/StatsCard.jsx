function StatsCard({ title, value, percentage, isPositive, color }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs hover:shadow-sm transition-all duration-200">
      
      <h3 className="text-sm font-medium text-gray-400 tracking-wide">
        {title}
      </h3>

      <div className="flex items-baseline justify-between mt-3">
        
        <h1 className={`text-2xl font-bold tracking-tight ${color || 'text-gray-800'}`}>
          {value}
        </h1>

        {percentage && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
              isPositive 
                ? "bg-green-50 text-green-600" 
                : "bg-red-50 text-red-500"
            }`}
          >
            {percentage}
          </span>
        )}
      </div>

    </div>
  );
}

export default StatsCard;