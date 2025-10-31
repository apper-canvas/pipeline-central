import { useState, useEffect } from "react";
import MetricCard from "@/components/molecules/MetricCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";
import { companyService } from "@/services/api/companyService";

const DashboardMetrics = () => {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadMetrics = async () => {
        try {
            setLoading(true);
            setError("");
            const [deals, contacts, companies] = await Promise.all([
                dealService.getAll(),
                contactService.getAll(),
                companyService.getAll()
            ]);

            const totalDeals = deals.length;
            const totalContacts = contacts.length;
            const totalCompanies = companies.length;
            
const totalRevenue = deals
                .filter(deal => deal.stage_c === "won")
                .reduce((sum, deal) => sum + deal.value_c, 0);

const pipelineValue = deals
                .filter(deal => !["won", "lost"].includes(deal.stage_c))
                .reduce((sum, deal) => sum + deal.value_c, 0);

const avgDealSize = totalDeals > 0 ? Math.round(totalRevenue / Math.max(deals.filter(d => d.stage_c === "won").length, 1)) : 0;

const winRate = totalDeals > 0 
                ? Math.round((deals.filter(deal => deal.stage_c === "won").length / deals.filter(deal => ["won", "lost"].includes(deal.stage_c)).length) * 100) || 0
                : 0;

            setMetrics({
                totalRevenue,
                pipelineValue,
                totalContacts,
                totalCompanies,
                avgDealSize,
                winRate,
                totalDeals
            });
        } catch (err) {
            setError("Failed to load metrics");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMetrics();
    }, []);

    if (loading) return <Loading />;
    if (error) return <Error message={error} onRetry={loadMetrics} />;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
                title="Total Revenue"
                value={`$${metrics.totalRevenue.toLocaleString()}`}
                icon="DollarSign"
                change="+12%"
                trend="up"
            />
            <MetricCard
                title="Pipeline Value"
                value={`$${metrics.pipelineValue.toLocaleString()}`}
                icon="TrendingUp"
                change="+8%"
                trend="up"
            />
            <MetricCard
                title="Active Contacts"
                value={metrics.totalContacts.toLocaleString()}
                icon="Users"
                change="+15"
                trend="up"
            />
            <MetricCard
                title="Win Rate"
                value={`${metrics.winRate}%`}
                icon="Target"
                change="+5%"
                trend="up"
            />
        </div>
    );
};

export default DashboardMetrics;