import { NavLink, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();

const navigation = [
        {
            name: "Dashboard",
            href: "/",
            icon: "BarChart3"
        },
        {
            name: "Contacts",
            href: "/contacts",
            icon: "Users"
        },
        {
            name: "Deals",
            href: "/deals",
            icon: "Briefcase"
        },
        {
            name: "Quotes",
            href: "/quotes",
            icon: "FileText"
        },
        {
            name: "Companies", 
            href: "/companies",
            icon: "Building2"
        }
    ];

    const NavItem = ({ item }) => {
        const isActive = location.pathname === item.href;
        
        return (
            <NavLink
                to={item.href}
                onClick={onClose}
                className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200",
                    isActive
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-gray-100"
                )}
            >
                <ApperIcon name={item.icon} className="w-5 h-5" />
                <span>{item.name}</span>
            </NavLink>
        );
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
                <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
                    <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                        <div className="flex items-center flex-shrink-0 px-4 mb-8">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                                <ApperIcon name="Zap" className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="ml-3 text-xl font-bold text-gray-900">Pipeline Pro</h1>
                        </div>
                        <nav className="mt-5 flex-1 px-4 space-y-1">
                            {navigation.map((item) => (
                                <NavItem key={item.name} item={item} />
                            ))}
                        </nav>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isOpen && (
                <div className="lg:hidden fixed inset-0 flex z-40">
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={onClose} />
                    <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white transform transition-transform duration-300 ease-in-out">
                        <div className="absolute top-0 right-0 -mr-12 pt-2">
                            <button
                                type="button"
                                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                onClick={onClose}
                            >
                                <ApperIcon name="X" className="h-6 w-6 text-white" />
                            </button>
                        </div>
                        <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                            <div className="flex-shrink-0 flex items-center px-4 mb-8">
                                <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                                    <ApperIcon name="Zap" className="w-5 h-5 text-white" />
                                </div>
                                <h1 className="ml-3 text-xl font-bold text-gray-900">Pipeline Pro</h1>
                            </div>
                            <nav className="mt-5 px-4 space-y-1">
                                {navigation.map((item) => (
                                    <NavItem key={item.name} item={item} />
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;