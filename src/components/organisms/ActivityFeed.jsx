import { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { activityService } from "@/services/api/activityService";
import { contactService } from "@/services/api/contactService";
import { format } from "date-fns";

const ActivityFeed = ({ limit }) => {
    const [activities, setActivities] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");
            const [activitiesData, contactsData] = await Promise.all([
                activityService.getAll(),
                contactService.getAll()
            ]);
            setActivities(activitiesData);
            setContacts(contactsData);
        } catch (err) {
            setError("Failed to load activities");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const getContactName = (contactId) => {
        const contact = contacts.find(c => c.Id === parseInt(contactId));
        return contact ? `${contact.firstName} ${contact.lastName}` : "Unknown Contact";
    };

    const getActivityIcon = (type) => {
        const icons = {
            call: "Phone",
            email: "Mail",
            meeting: "Calendar",
            note: "FileText",
            task: "CheckCircle"
        };
        return icons[type] || "Activity";
    };

    const getActivityColor = (type) => {
        const colors = {
            call: "primary",
            email: "secondary",
            meeting: "success",
            note: "warning",
            task: "default"
        };
        return colors[type] || "default";
    };

    const displayActivities = limit ? activities.slice(0, limit) : activities;

    if (loading) return <Loading />;
    if (error) return <Error message={error} onRetry={loadData} />;
    if (activities.length === 0) {
        return (
            <Empty
                icon="Activity"
                title="No activities yet"
                description="Activity history will appear here as you interact with contacts and deals."
            />
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            
            <Card>
                <div className="divide-y divide-gray-200">
                    {displayActivities.map((activity) => (
                        <div key={activity.Id} className="p-4">
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                        <ApperIcon 
name={getActivityIcon(activity.type_c)}
                                            className="w-4 h-4 text-gray-600" 
                                        />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2 mb-1">
<Badge variant={getActivityColor(activity.type_c)}>
                                            {activity.type_c}
                                        </Badge>
                                        <span className="text-sm text-gray-500">
{format(new Date(activity.timestamp_c), "MMM d, yyyy 'at' h:mm a")}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-900 mb-1">
{activity.description_c}
                                    </p>
                                    <p className="text-sm text-gray-600">
Contact: {getContactName(activity.contact_id_c)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default ActivityFeed;