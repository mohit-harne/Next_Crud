const UploadProgress = ({ progress = 0 }) => { // Default to 0 if undefined
    // Ensure progress is between 0 and 100
    const normalizedProgress = Math.min(Math.max(progress, 0), 100);
    
    // Calculate colors based on progress
    const getProgressColor = (progress) => {
        if (progress < 30) return 'bg-red-500';
        if (progress < 70) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    return (
        <div className="w-full p-4 bg-gray-100 rounded-lg shadow-sm">
            <div className="mb-2 flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">
                    Uploading...
                </span>
                <span className="text-sm font-bold text-gray-700">
                    {normalizedProgress}%
                </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2 overflow-hidden">
                <div 
                    className={`h-full rounded-full transition-all duration-300 ${getProgressColor(normalizedProgress)}`}
                    style={{ 
                        width: `${normalizedProgress}%`,
                        transition: 'width 0.3s ease-in-out'
                    }}
                />
            </div>

            <div className="flex justify-between text-xs text-white">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
            </div>

            {/* Status message based on progress */}
            <div className="mt-2 text-[20px] text-center">
                {normalizedProgress === 0 && (
                    <span className="text-gray-500">Preparing to upload...</span>
                )}
                {normalizedProgress > 0 && normalizedProgress < 100 && (
                    <span className="text-blue-500">Uploading file...</span>
                )}
                {normalizedProgress === 100 && (
                    <span className="text-green-500">Upload complete!</span>
                )}
            </div>

            {/* Additional details for larger files */}
            {normalizedProgress > 0 && normalizedProgress < 100 && (
                <div className="mt-1 text-2xl text-white text-center">
                    Please wait while we process your file
                </div>
            )}
        </div>
    );
};

export default UploadProgress;