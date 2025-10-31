import { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { contactService } from "@/services/api/contactService";
import { format } from "date-fns";

const ContactList = ({ searchQuery, onContactSelect, onAddContact }) => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadContacts = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await contactService.getAll();
            setContacts(data);
        } catch (err) {
            setError("Failed to load contacts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadContacts();
    }, []);

    const filteredContacts = contacts.filter(contact =>
        !searchQuery || 
contact.first_name_c?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.last_name_c?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email_c?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.company_c?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <Loading />;
    if (error) return <Error message={error} onRetry={loadContacts} />;
    if (contacts.length === 0) {
        return (
            <Empty
                icon="Users"
                title="No contacts found"
                description="Start building your network by adding your first contact."
                actionText="Add Contact"
                onAction={onAddContact}
            />
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                    {filteredContacts.length} of {contacts.length} contacts
                </p>
                <Button onClick={onAddContact} size="sm">
                    <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                    Add Contact
                </Button>
            </div>

            <Card>
                <div className="divide-y divide-gray-200">
                    {filteredContacts.map((contact) => (
                        <div
                            key={contact.Id}
                            className="p-6 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                            onClick={() => onContactSelect(contact)}
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-white font-medium text-lg">
{contact.first_name_c?.[0]}{contact.last_name_c?.[0]}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-3 mb-1">
                                        <p className="text-lg font-semibold text-gray-900 truncate">
{contact.first_name_c} {contact.last_name_c}
                                        </p>
                                        <Badge variant="secondary">
{contact.position_c}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                                        <span className="flex items-center">
<ApperIcon name="Mail" className="w-4 h-4 mr-1" />
                                            {contact.email_c}
                                        </span>
                                        <span className="flex items-center">
<ApperIcon name="Phone" className="w-4 h-4 mr-1" />
                                            {contact.phone_c}
                                        </span>
                                        <span className="flex items-center">
<ApperIcon name="Building2" className="w-4 h-4 mr-1" />
                                            {contact.company_c}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end space-y-1">
<span className="text-xs text-gray-500">
                                        Added {format(new Date(contact.CreatedOn), "MMM d, yyyy")}
                                    </span>
                                    <ApperIcon name="ChevronRight" className="w-5 h-5 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default ContactList;