import { useState } from "react";
import Layout from "@/components/organisms/Layout";
import DealPipeline from "@/components/organisms/DealPipeline";
import DealModal from "@/components/organisms/DealModal";

const Deals = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedDeal, setSelectedDeal] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleDealSelect = (deal) => {
        setSelectedDeal(deal);
        setShowModal(true);
    };

    const handleAddDeal = () => {
        setSelectedDeal(null);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedDeal(null);
    };

    const handleModalSave = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
<Layout title="Sales Pipeline">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Sales Pipeline</h1>
                        <p className="text-gray-600 mt-1">Track and manage your sales opportunities</p>
                    </div>
                </div>

                <DealPipeline
                    key={refreshKey}
                    onDealSelect={handleDealSelect}
                    onAddDeal={handleAddDeal}
                />

                {showModal && (
                    <DealModal
                        deal={selectedDeal}
                        onClose={handleModalClose}
                        onSave={handleModalSave}
                    />
                )}
            </div>
        </Layout>
    );
};

export default Deals;