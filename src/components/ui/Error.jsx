import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry }) => {
    return (
        <div className="flex flex-col items-center justify-center h-96 p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <ApperIcon name="AlertCircle" className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Oops! An error occurred</h3>
            <p className="text-gray-600 text-center mb-6 max-w-md">
                {message}. Please try again or contact support if the problem persists.
            </p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                >
                    <ApperIcon name="RefreshCw" className="w-5 h-5" />
                    <span>Try Again</span>
                </button>
            )}
        </div>
    );
};

export default Error;