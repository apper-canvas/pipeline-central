import { cn } from "@/utils/cn";

const StatusIndicator = ({ status, className = "" }) => {
    const statusConfig = {
        active: { color: "bg-green-400", label: "Active" },
        inactive: { color: "bg-gray-400", label: "Inactive" },
        pending: { color: "bg-amber-400", label: "Pending" },
        qualified: { color: "bg-blue-400", label: "Qualified" },
        proposal: { color: "bg-purple-400", label: "Proposal" },
        negotiation: { color: "bg-orange-400", label: "Negotiation" },
        won: { color: "bg-green-500", label: "Won" },
        lost: { color: "bg-red-500", label: "Lost" }
    };

    const config = statusConfig[status] || statusConfig.inactive;

    return (
        <div className={cn("flex items-center space-x-2", className)}>
            <div className={cn("w-2 h-2 rounded-full", config.color)}></div>
            <span className="text-sm text-gray-600">{config.label}</span>
        </div>
    );
};

export default StatusIndicator;