import { useState, useEffect } from 'react';

const UploadProgress = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const totalDuration = 4000; // 4 seconds in milliseconds
        const increment = 100; // Total percentage (0 to 100)
        const interval = totalDuration / increment; // Time for each step (4000ms / 100)

        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer); // Stop the timer when reaching 100
                    return 100;
                }
                return prev + 1; // Increment progress by 1 each step
            });
        }, interval);

        return () => clearInterval(timer); // Cleanup the interval on unmount
    }, []);

    const normalizedProgress = Math.min(Math.max(progress, 0), 100);

    const getProgressColor = (progress) => {
        if (progress < 30) return 'bg-red-500';
        if (progress < 70) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    return (
        <div className="w-full p-4 bg-gray-100 rounded-lg shadow-sm">
            <div className="mb-2 flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">Loading...</span>
                <span className="text-sm font-bold text-gray-700">{normalizedProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2 overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-300 ${getProgressColor(normalizedProgress)}`}
                    style={{ width: `${normalizedProgress}%` }}
                />
            </div>
            <div className="flex justify-between text-xs text-gray-600">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
            </div>
            <div className="mt-2 text-[20px] text-center">
                {normalizedProgress === 0 && <span className="text-gray-500">Loading</span>}
                {normalizedProgress > 0 && normalizedProgress < 100 && <span className="text-blue-500"></span>}
                {normalizedProgress === 100 && <span className="text-green-500">Loading complete!</span>}
            </div>
        </div>
    );
};

export default UploadProgress;
