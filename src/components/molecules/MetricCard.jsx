import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const MetricCard = ({ 
    title, 
    value, 
    change, 
    icon, 
    trend = "neutral",
    className = "" 
}) => {
    const trendColors = {
        up: "text-green-600",
        down: "text-red-600",
        neutral: "text-gray-600"
    };

    const trendIcons = {
        up: "TrendingUp",
        down: "TrendingDown", 
        neutral: "Minus"
    };

    return (
        <Card className={className}>
            <Card.Content className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <ApperIcon name={icon} className="w-6 h-6 text-primary" />
                    </div>
                    {change && (
                        <div className={`flex items-center space-x-1 ${trendColors[trend]}`}>
                            <ApperIcon name={trendIcons[trend]} className="w-4 h-4" />
                            <span className="text-sm font-medium">{change}</span>
                        </div>
                    )}
                </div>
                <div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
                    <p className="text-sm text-gray-600">{title}</p>
                </div>
            </Card.Content>
        </Card>
    );
};

export default MetricCard;