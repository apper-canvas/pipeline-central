import { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";
import { format } from "date-fns";
import { toast } from "react-toastify";

const DealPipeline = ({ onDealSelect, onAddDeal }) => {
    const [deals, setDeals] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const stages = [
        { id: "qualified", name: "Qualified", color: "bg-blue-500" },
        { id: "proposal", name: "Proposal", color: "bg-purple-500" },
        { id: "negotiation", name: "Negotiation", color: "bg-orange-500" },
        { id: "won", name: "Won", color: "bg-green-500" },
        { id: "lost", name: "Lost", color: "bg-red-500" }
    ];

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");
            const [dealsData, contactsData] = await Promise.all([
                dealService.getAll(),
                contactService.getAll()
            ]);
            setDeals(dealsData);
            setContacts(contactsData);
        } catch (err) {
            setError("Failed to load deals");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleStageChange = async (dealId, newStage) => {
        try {
const dealToUpdate = deals.find(d => d.Id === dealId);
            await dealService.update(dealId, { ...dealToUpdate, stage_c: newStage });
            setDeals(deals.map(deal => 
                deal.Id === dealId ? { ...deal, stage_c: newStage } : deal
            ));
            toast.success("Deal stage updated successfully");
        } catch (err) {
            toast.error("Failed to update deal stage");
        }
    };

    const getContactName = (contactId) => {
        const contact = contacts.find(c => c.Id === parseInt(contactId));
        return contact ? `${contact.firstName} ${contact.lastName}` : "Unknown Contact";
    };

    const getDealsByStage = (stageId) => {
return deals.filter(deal => deal.stage_c === stageId);
    };

    if (loading) return <Loading />;
    if (error) return <Error message={error} onRetry={loadData} />;
    if (deals.length === 0) {
        return (
            <Empty
icon="Briefcase"
                title="No items in sales pipeline"
                description="Start tracking your sales opportunities by adding your first pipeline item."
                actionText="Add Sales Pipeline Item"
                onAction={onAddDeal}
            />
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
<h2 className="text-lg font-semibold text-gray-900">Sales Pipeline</h2>
                    <p className="text-sm text-gray-600">{deals.length} active pipeline items</p>
                </div>
<Button onClick={onAddDeal}>
                    <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                    Add Sales Pipeline Item
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {stages.map((stage) => {
                    const stageDeals = getDealsByStage(stage.id);
const stageValue = stageDeals.reduce((sum, deal) => sum + deal.value_c, 0);

                    return (
                        <div key={stage.id} className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                                    <h3 className="font-medium text-gray-900">{stage.name}</h3>
                                    <Badge variant="secondary">{stageDeals.length}</Badge>
                                </div>
                                <p className="text-sm font-medium text-gray-600">
                                    ${stageValue.toLocaleString()}
                                </p>
                            </div>

                            <div className="space-y-3">
                                {stageDeals.map((deal) => (
                                    <Card 
                                        key={deal.Id}
                                        className="cursor-pointer hover:shadow-md transition-all duration-200"
                                        onClick={() => onDealSelect(deal)}
                                    >
                                        <Card.Content className="p-4">
                                            <div className="space-y-3">
                                                <div className="flex items-start justify-between">
                                                    <h4 className="font-medium text-gray-900 truncate">
{deal.title_c}
                                                    </h4>
                                                    <div className="ml-2">
                                                        <select
value={deal.stage_c}
                                                            onChange={(e) => {
                                                                e.stopPropagation();
                                                                handleStageChange(deal.Id, e.target.value);
                                                            }}
                                                            className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                                                        >
                                                            {stages.map(s => (
                                                                <option key={s.id} value={s.id}>
                                                                    {s.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
<div className="text-2xl font-bold text-gray-900">
                                                    ${deal.value_c?.toLocaleString() || 0}
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center text-sm text-gray-600">
<ApperIcon name="User" className="w-4 h-4 mr-2" />
                                                        {getContactName(deal.contact_id_c)}
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-600">
<ApperIcon name="Calendar" className="w-4 h-4 mr-2" />
                                                        {format(new Date(deal.close_date_c), "MMM d, yyyy")}
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center text-sm text-gray-600">
<ApperIcon name="Target" className="w-4 h-4 mr-2" />
                                                            {deal.probability_c}% probability
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card.Content>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DealPipeline;