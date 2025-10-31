const Loading = () => {
    return (
        <div className="w-full h-full p-6 space-y-6">
            {/* Main content loading skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                            <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div className="w-24 h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="w-32 h-3 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                ))}
            </div>

            {/* List loading skeleton */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="divide-y divide-gray-200">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="p-6 flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center space-x-4">
                                    <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                                <div className="w-48 h-3 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                            <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Loading;