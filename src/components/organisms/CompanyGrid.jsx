import { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { companyService } from "@/services/api/companyService";

const CompanyGrid = ({ searchQuery, onCompanySelect, onAddCompany }) => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadCompanies = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await companyService.getAll();
            setCompanies(data);
        } catch (err) {
            setError("Failed to load companies");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCompanies();
    }, []);

    const filteredCompanies = companies.filter(company =>
!searchQuery || 
        company.name_c?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.industry_c?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getSizeColor = (size) => {
        const colors = {
            "Small": "primary",
            "Medium": "warning",
            "Large": "success",
            "Enterprise": "secondary"
        };
        return colors[size] || "default";
    };

    if (loading) return <Loading />;
    if (error) return <Error message={error} onRetry={loadCompanies} />;
    if (companies.length === 0) {
        return (
            <Empty
                icon="Building2"
                title="No companies found"
                description="Start building your company directory by adding your first company."
                actionText="Add Company"
                onAction={onAddCompany}
            />
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                    {filteredCompanies.length} of {companies.length} companies
                </p>
                <Button onClick={onAddCompany}>
                    <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                    Add Company
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCompanies.map((company) => (
                    <Card 
                        key={company.Id}
                        className="cursor-pointer hover:shadow-lg transition-all duration-200"
                        onClick={() => onCompanySelect(company)}
                    >
                        <Card.Content className="p-6">
                            <div className="space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="w-12 h-12 bg-gradient-to-br from-accent to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <ApperIcon name="Building2" className="w-6 h-6 text-white" />
                                    </div>
<Badge variant={getSizeColor(company.size_c)}>
                                        {company.size_c}
                                    </Badge>
                                </div>

                                <div>
<h3 className="text-lg font-semibold text-gray-900 mb-1">
                                        {company.name_c}
                                    </h3>
<p className="text-sm text-gray-600 mb-3">
                                        {company.industry_c}
                                    </p>
                                </div>

                                <div className="space-y-2">
{company.website_c && (
                                        <div className="flex items-center text-sm text-gray-600">
                                            <ApperIcon name="Globe" className="w-4 h-4 mr-2" />
                                            <span className="truncate">{company.website_c}</span>
                                        </div>
                                    )}
{company.phone_c && (
                                        <div className="flex items-center text-sm text-gray-600">
                                            <ApperIcon name="Phone" className="w-4 h-4 mr-2" />
                                            {company.phone_c}
                                        </div>
                                    )}
{company.address_c && (
                                        <div className="flex items-center text-sm text-gray-600">
                                            <ApperIcon name="MapPin" className="w-4 h-4 mr-2" />
                                            <span className="truncate">{company.address_c}</span>
                                        </div>
                                    )}
                                </div>

{company.notes_c && (
                                    <div className="pt-3 border-t border-gray-200">
                                        <p className="text-sm text-gray-600 line-clamp-2">
                                            {company.notes_c}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Card.Content>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default CompanyGrid;