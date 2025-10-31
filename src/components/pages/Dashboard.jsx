import { useState } from "react";
import Layout from "@/components/organisms/Layout";
import DashboardMetrics from "@/components/organisms/DashboardMetrics";
import ActivityFeed from "@/components/organisms/ActivityFeed";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();

    const quickActions = [
        {
            title: "Add Contact",
            description: "Create a new contact",
            icon: "UserPlus",
            action: () => navigate("/contacts"),
            color: "bg-blue-500"
        },
        {
            title: "New Deal",
            description: "Track a new opportunity",
            icon: "PlusCircle",
            action: () => navigate("/deals"),
            color: "bg-green-500"
        },
        {
            title: "Add Company",
            description: "Register a new company",
            icon: "Building",
            action: () => navigate("/companies"),
            color: "bg-purple-500"
        }
    ];

    return (
        <Layout title="Dashboard">
            <div className="space-y-8">
                {/* Metrics Section */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Metrics</h2>
                    <DashboardMetrics />
                </div>

                {/* Quick Actions & Activity Feed */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Quick Actions */}
                    <div className="lg:col-span-1">
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                            <div className="space-y-3">
                                {quickActions.map((action, index) => (
                                    <Card 
                                        key={index}
                                        className="cursor-pointer hover:shadow-md transition-all duration-200"
                                        onClick={action.action}
                                    >
                                        <Card.Content className="p-4">
                                            <div className="flex items-center space-x-4">
                                                <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                                    <ApperIcon name={action.icon} className="w-5 h-5 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900">{action.title}</h4>
                                                    <p className="text-sm text-gray-600">{action.description}</p>
                                                </div>
                                                <ApperIcon name="ChevronRight" className="w-5 h-5 text-gray-400" />
                                            </div>
                                        </Card.Content>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Activity Feed */}
                    <div className="lg:col-span-2">
                        <ActivityFeed limit={8} />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;