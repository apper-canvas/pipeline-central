import { useState } from "react";
import Layout from "@/components/organisms/Layout";
import CompanyGrid from "@/components/organisms/CompanyGrid";
import CompanyModal from "@/components/organisms/CompanyModal";

const Companies = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleCompanySelect = (company) => {
        setSelectedCompany(company);
        setShowModal(true);
    };

    const handleAddCompany = () => {
        setSelectedCompany(null);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedCompany(null);
    };

    const handleModalSave = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <Layout 
            title="Companies" 
            showSearch={true} 
            onSearch={setSearchQuery}
        >
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Company Directory</h1>
                        <p className="text-gray-600 mt-1">Manage your company relationships and accounts</p>
                    </div>
                </div>

                <CompanyGrid
                    key={refreshKey}
                    searchQuery={searchQuery}
                    onCompanySelect={handleCompanySelect}
                    onAddCompany={handleAddCompany}
                />

                {showModal && (
                    <CompanyModal
                        company={selectedCompany}
                        onClose={handleModalClose}
                        onSave={handleModalSave}
                    />
                )}
            </div>
        </Layout>
    );
};

export default Companies;