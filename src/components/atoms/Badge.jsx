import { cn } from "@/utils/cn";

const Badge = ({ className, variant = "default", children, ...props }) => {
    const variants = {
        default: "bg-gray-100 text-gray-700",
        primary: "bg-blue-100 text-blue-700",
        secondary: "bg-secondary/10 text-secondary",
        success: "bg-green-100 text-green-700",
        warning: "bg-amber-100 text-amber-700",
        danger: "bg-red-100 text-red-700"
    };

    return (
        <span
            className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
};

export default Badge;