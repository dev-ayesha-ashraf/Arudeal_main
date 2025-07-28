
import React from 'react';

export const LoadingScreen: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mb-4"></div>
                <h2 className="text-xl font-semibold text-gray-700">Loading arudeal...</h2>
                <p className="text-gray-500">Please wait while we prepare your shopping experience</p>
            </div>
        </div>
    );
};