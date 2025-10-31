import { useState, useContext } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import { AuthContext } from "../../App";
import { toast } from "react-toastify";

const LogoutButton = () => {
    const { logout } = useContext(AuthContext);
    
    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error("Failed to logout");
        }
    };
    
    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-red-600 hover:text-red-700"
        >
            <ApperIcon name="LogOut" className="w-5 h-5 mr-2" />
            Logout
        </Button>
    );
};
const Header = ({ onMenuClick, title, onSearch, showSearch = false }) => {
    return (
        <header className="bg-white shadow-sm border-b border-gray-200 lg:pl-64">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onMenuClick}
                            className="lg:hidden mr-2"
                        >
                            <ApperIcon name="Menu" className="w-5 h-5" />
                        </Button>
                        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                    </div>

<div className="flex items-center space-x-4">
                        {showSearch && (
                            <div className="hidden md:block">
                                <SearchBar
                                    placeholder="Search..."
                                    onSearch={onSearch}
                                    className="w-64"
                                />
                            </div>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="relative"
                        >
                            <ApperIcon name="Bell" className="w-5 h-5" />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full"></span>
                        </Button>
                        <LogoutButton />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;