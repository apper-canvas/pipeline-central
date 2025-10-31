import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
    className, 
    variant = "primary", 
    size = "md", 
    children, 
    ...props 
}, ref) => {
    const variants = {
        primary: "bg-primary text-white hover:bg-blue-700 active:bg-blue-800",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300",
        outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100",
        ghost: "text-gray-700 hover:bg-gray-100 active:bg-gray-200",
        danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base"
    };

    return (
        <button
            ref={ref}
            className={cn(
                "inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
});

Button.displayName = "Button";

export default Button;