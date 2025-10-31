import { useState } from "react";
import Layout from "@/components/organisms/Layout";
import ContactList from "@/components/organisms/ContactList";
import ContactModal from "@/components/organisms/ContactModal";

const Contacts = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleContactSelect = (contact) => {
        setSelectedContact(contact);
        setShowModal(true);
    };

    const handleAddContact = () => {
        setSelectedContact(null);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedContact(null);
    };

    const handleModalSave = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <Layout 
            title="Contacts" 
            showSearch={true} 
            onSearch={setSearchQuery}
        >
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Contact Management</h1>
                        <p className="text-gray-600 mt-1">Manage your contacts and build relationships</p>
                    </div>
                </div>

                <ContactList
                    key={refreshKey}
                    searchQuery={searchQuery}
                    onContactSelect={handleContactSelect}
                    onAddContact={handleAddContact}
                />

                {showModal && (
                    <ContactModal
                        contact={selectedContact}
                        onClose={handleModalClose}
                        onSave={handleModalSave}
                    />
                )}
            </div>
        </Layout>
    );
};

export default Contacts;