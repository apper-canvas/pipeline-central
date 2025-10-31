import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
    icon = "Database", 
    title = "No data found", 
    description = "There's nothing here yet. Get started by adding some data.",
    actionText = "Add Item",
    onAction 
}) => {
    return (
        <div className="flex flex-col items-center justify-center h-96 p-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ApperIcon name={icon} className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 text-center mb-6 max-w-md">{description}</p>
            {onAction && (
                <button
                    onClick={onAction}
                    className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                >
                    <ApperIcon name="Plus" className="w-5 h-5" />
                    <span>{actionText}</span>
                </button>
            )}
        </div>
    );
};

export default Empty;