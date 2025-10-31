import { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import SearchBar from "@/components/molecules/SearchBar";
import Layout from "@/components/organisms/Layout";
import QuoteModal from "@/components/organisms/QuoteModal";
import { quoteService } from "@/services/api/quoteService";
import { toast } from "react-toastify";
import { format } from "date-fns";

const Quotes = () => {
    const [quotes, setQuotes] = useState([]);
    const [filteredQuotes, setFilteredQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedQuote, setSelectedQuote] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        loadQuotes();
    }, []);

    useEffect(() => {
        filterQuotes();
    }, [searchTerm, quotes]);

    const loadQuotes = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await quoteService.getAll();
            setQuotes(data);
        } catch (err) {
            setError("Failed to load quotes");
            console.error("Error loading quotes:", err);
        } finally {
            setLoading(false);
        }
    };

    const filterQuotes = () => {
        if (!searchTerm) {
            setFilteredQuotes(quotes);
            return;
        }

        const filtered = quotes.filter(quote =>
            quote.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quote.company_id_c?.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quote.contact_id_c?.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quote.deal_id_c?.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quote.status_c?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredQuotes(filtered);
    };

    const handleAddQuote = () => {
        setSelectedQuote(null);
        setIsModalOpen(true);
    };

    const handleEditQuote = (quote) => {
        setSelectedQuote(quote);
        setIsModalOpen(true);
    };

    const handleDeleteQuote = async (quoteId) => {
        if (!confirm("Are you sure you want to delete this quote?")) {
            return;
        }

        try {
            await quoteService.delete(quoteId);
            toast.success("Quote deleted successfully");
            loadQuotes();
        } catch (err) {
            toast.error("Failed to delete quote");
            console.error("Error deleting quote:", err);
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedQuote(null);
    };

    const handleModalSave = () => {
        loadQuotes();
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'draft':
                return 'bg-gray-100 text-gray-800';
            case 'sent':
                return 'bg-blue-100 text-blue-800';
            case 'accepted':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return format(new Date(dateString), 'MMM dd, yyyy');
        } catch {
            return 'Invalid Date';
        }
    };

    if (loading) return <Layout><Loading /></Layout>;
    if (error) return <Layout><Error message={error} onRetry={loadQuotes} /></Layout>;

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Quotes</h1>
                        <p className="text-gray-600">Manage your sales quotes and proposals</p>
                    </div>
                    <Button onClick={handleAddQuote} className="inline-flex items-center">
                        <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                        Add Quote
                    </Button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <SearchBar
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Search quotes, companies, contacts..."
                        />
                    </div>
                </div>

                {filteredQuotes.length === 0 ? (
                    <Empty
                        title="No quotes found"
                        description={searchTerm ? "Try adjusting your search criteria" : "Get started by creating your first quote"}
                        actionLabel="Add Quote"
                        onAction={handleAddQuote}
                    />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredQuotes.map((quote) => (
                            <Card key={quote.Id} className="hover:shadow-lg transition-shadow">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 mb-2">
                                                {quote.Name || 'Untitled Quote'}
                                            </h3>
                                            <Badge className={getStatusColor(quote.status_c)}>
                                                {quote.status_c || 'Draft'}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEditQuote(quote)}
                                            >
                                                <ApperIcon name="Edit2" className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteQuote(quote.Id)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <ApperIcon name="Trash2" className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex items-center">
                                            <ApperIcon name="Building2" className="w-4 h-4 mr-2" />
                                            <span>{quote.company_id_c?.Name || 'No Company'}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <ApperIcon name="User" className="w-4 h-4 mr-2" />
                                            <span>{quote.contact_id_c?.Name || 'No Contact'}</span>
                                        </div>
                                        {quote.deal_id_c && (
                                            <div className="flex items-center">
                                                <ApperIcon name="Briefcase" className="w-4 h-4 mr-2" />
                                                <span>{quote.deal_id_c.Name}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center">
                                            <ApperIcon name="Calendar" className="w-4 h-4 mr-2" />
                                            <span>Quote: {formatDate(quote.quote_date_c)}</span>
                                        </div>
                                        {quote.expires_on_c && (
                                            <div className="flex items-center">
                                                <ApperIcon name="Clock" className="w-4 h-4 mr-2" />
                                                <span>Expires: {formatDate(quote.expires_on_c)}</span>
                                            </div>
                                        )}
                                        {quote.delivery_method_c && (
                                            <div className="flex items-center">
                                                <ApperIcon name="Truck" className="w-4 h-4 mr-2" />
                                                <span>{quote.delivery_method_c}</span>
                                            </div>
                                        )}
                                    </div>

                                    {(quote.bill_to_name_c || quote.ship_to_name_c) && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                                                {quote.bill_to_name_c && (
                                                    <div>
                                                        <div className="font-medium">Bill To:</div>
                                                        <div>{quote.bill_to_name_c}</div>
                                                        {quote.bill_to_city_c && quote.bill_to_state_c && (
                                                            <div>{quote.bill_to_city_c}, {quote.bill_to_state_c}</div>
                                                        )}
                                                    </div>
                                                )}
                                                {quote.ship_to_name_c && (
                                                    <div>
                                                        <div className="font-medium">Ship To:</div>
                                                        <div>{quote.ship_to_name_c}</div>
                                                        {quote.ship_to_city_c && quote.ship_to_state_c && (
                                                            <div>{quote.ship_to_city_c}, {quote.ship_to_state_c}</div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {isModalOpen && (
                <QuoteModal
                    quote={selectedQuote}
                    onClose={handleModalClose}
                    onSave={handleModalSave}
                />
            )}
        </Layout>
    );
};

export default Quotes;