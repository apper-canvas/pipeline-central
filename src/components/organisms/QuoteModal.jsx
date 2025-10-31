import { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import { quoteService } from "@/services/api/quoteService";
import { contactService } from "@/services/api/contactService";
import { companyService } from "@/services/api/companyService";
import { dealService } from "@/services/api/dealService";
import { toast } from "react-toastify";

const QuoteModal = ({ quote, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        Name: "",
        quote_date_c: "",
        status_c: "Draft",
        delivery_method_c: "",
        expires_on_c: "",
        bill_to_name_c: "",
        bill_to_street_c: "",
        bill_to_city_c: "",
        bill_to_state_c: "",
        bill_to_country_c: "",
        bill_to_pincode_c: "",
        ship_to_name_c: "",
        ship_to_street_c: "",
        ship_to_city_c: "",
        ship_to_state_c: "",
        ship_to_country_c: "",
        ship_to_pincode_c: "",
        company_id_c: "",
        contact_id_c: "",
        deal_id_c: ""
    });
    const [contacts, setContacts] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const statusOptions = ["Draft", "Sent", "Accepted", "Rejected"];

    useEffect(() => {
        loadData();
        if (quote) {
            setFormData({
                Name: quote.Name || "",
                quote_date_c: quote.quote_date_c ? new Date(quote.quote_date_c).toISOString().split('T')[0] : "",
                status_c: quote.status_c || "Draft",
                delivery_method_c: quote.delivery_method_c || "",
                expires_on_c: quote.expires_on_c ? new Date(quote.expires_on_c).toISOString().split('T')[0] : "",
                bill_to_name_c: quote.bill_to_name_c || "",
                bill_to_street_c: quote.bill_to_street_c || "",
                bill_to_city_c: quote.bill_to_city_c || "",
                bill_to_state_c: quote.bill_to_state_c || "",
                bill_to_country_c: quote.bill_to_country_c || "",
                bill_to_pincode_c: quote.bill_to_pincode_c || "",
                ship_to_name_c: quote.ship_to_name_c || "",
                ship_to_street_c: quote.ship_to_street_c || "",
                ship_to_city_c: quote.ship_to_city_c || "",
                ship_to_state_c: quote.ship_to_state_c || "",
                ship_to_country_c: quote.ship_to_country_c || "",
                ship_to_pincode_c: quote.ship_to_pincode_c || "",
                company_id_c: quote.company_id_c?.Id?.toString() || quote.company_id_c?.toString() || "",
                contact_id_c: quote.contact_id_c?.Id?.toString() || quote.contact_id_c?.toString() || "",
                deal_id_c: quote.deal_id_c?.Id?.toString() || quote.deal_id_c?.toString() || ""
            });
        }
    }, [quote]);

    const loadData = async () => {
        try {
            const [contactsData, companiesData, dealsData] = await Promise.all([
                contactService.getAll(),
                companyService.getAll(),
                dealService.getAll()
            ]);
            setContacts(contactsData);
            setCompanies(companiesData);
            setDeals(dealsData);
        } catch (err) {
            toast.error("Failed to load data");
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.Name.trim()) newErrors.Name = "Quote name is required";
        if (!formData.quote_date_c) newErrors.quote_date_c = "Quote date is required";
        if (!formData.contact_id_c) newErrors.contact_id_c = "Contact is required";
        if (!formData.company_id_c) newErrors.company_id_c = "Company is required";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            setLoading(true);
            if (quote) {
                await quoteService.update(quote.Id, formData);
                toast.success("Quote updated successfully");
            } else {
                await quoteService.create(formData);
                toast.success("Quote created successfully");
            }
            onSave();
            onClose();
        } catch (err) {
            toast.error("Failed to save quote");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const copyBillingToShipping = () => {
        setFormData(prev => ({
            ...prev,
            ship_to_name_c: prev.bill_to_name_c,
            ship_to_street_c: prev.bill_to_street_c,
            ship_to_city_c: prev.bill_to_city_c,
            ship_to_state_c: prev.bill_to_state_c,
            ship_to_country_c: prev.bill_to_country_c,
            ship_to_pincode_c: prev.bill_to_pincode_c
        }));
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {quote ? "Edit Quote" : "Add New Quote"}
                            </h3>
                            <Button variant="ghost" size="sm" onClick={onClose}>
                                <ApperIcon name="X" className="w-5 h-5" />
                            </Button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    label="Quote Name"
                                    name="Name"
                                    value={formData.Name}
                                    onChange={handleChange}
                                    error={errors.Name}
                                    required
                                    placeholder="Enter quote name..."
                                />
                                <FormField
                                    label="Quote Date"
                                    name="quote_date_c"
                                    type="date"
                                    value={formData.quote_date_c}
                                    onChange={handleChange}
                                    error={errors.quote_date_c}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="status_c"
                                        value={formData.status_c}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                                    >
                                        {statusOptions.map(status => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <FormField
                                    label="Delivery Method"
                                    name="delivery_method_c"
                                    value={formData.delivery_method_c}
                                    onChange={handleChange}
                                    placeholder="e.g. Email, Mail, In Person"
                                />
                            </div>

                            <FormField
                                label="Expires On"
                                name="expires_on_c"
                                type="date"
                                value={formData.expires_on_c}
                                onChange={handleChange}
                            />

                            {/* Relationships */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Company <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="company_id_c"
                                        value={formData.company_id_c}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 ${
                                            errors.company_id_c ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">Select company...</option>
                                        {companies.map(company => (
                                            <option key={company.Id} value={company.Id}>
                                                {company.name_c}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.company_id_c && (
                                        <p className="mt-1 text-sm text-red-600">{errors.company_id_c}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Contact <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="contact_id_c"
                                        value={formData.contact_id_c}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 ${
                                            errors.contact_id_c ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">Select contact...</option>
                                        {contacts.map(contact => (
                                            <option key={contact.Id} value={contact.Id}>
                                                {contact.first_name_c} {contact.last_name_c}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.contact_id_c && (
                                        <p className="mt-1 text-sm text-red-600">{errors.contact_id_c}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Deal
                                    </label>
                                    <select
                                        name="deal_id_c"
                                        value={formData.deal_id_c}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                                    >
                                        <option value="">Select deal...</option>
                                        {deals.map(deal => (
                                            <option key={deal.Id} value={deal.Id}>
                                                {deal.title_c}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Billing Address */}
                            <div>
                                <h4 className="text-md font-semibold text-gray-900 mb-3">Billing Address</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        label="Bill To Name"
                                        name="bill_to_name_c"
                                        value={formData.bill_to_name_c}
                                        onChange={handleChange}
                                        placeholder="Billing contact name"
                                    />
                                    <FormField
                                        label="Street"
                                        name="bill_to_street_c"
                                        value={formData.bill_to_street_c}
                                        onChange={handleChange}
                                        placeholder="Street address"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                                    <FormField
                                        label="City"
                                        name="bill_to_city_c"
                                        value={formData.bill_to_city_c}
                                        onChange={handleChange}
                                        placeholder="City"
                                    />
                                    <FormField
                                        label="State"
                                        name="bill_to_state_c"
                                        value={formData.bill_to_state_c}
                                        onChange={handleChange}
                                        placeholder="State"
                                    />
                                    <FormField
                                        label="Country"
                                        name="bill_to_country_c"
                                        value={formData.bill_to_country_c}
                                        onChange={handleChange}
                                        placeholder="Country"
                                    />
                                    <FormField
                                        label="Pincode"
                                        name="bill_to_pincode_c"
                                        value={formData.bill_to_pincode_c}
                                        onChange={handleChange}
                                        placeholder="Pincode"
                                    />
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-md font-semibold text-gray-900">Shipping Address</h4>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={copyBillingToShipping}
                                    >
                                        <ApperIcon name="Copy" className="w-4 h-4 mr-2" />
                                        Copy from Billing
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        label="Ship To Name"
                                        name="ship_to_name_c"
                                        value={formData.ship_to_name_c}
                                        onChange={handleChange}
                                        placeholder="Shipping contact name"
                                    />
                                    <FormField
                                        label="Street"
                                        name="ship_to_street_c"
                                        value={formData.ship_to_street_c}
                                        onChange={handleChange}
                                        placeholder="Street address"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                                    <FormField
                                        label="City"
                                        name="ship_to_city_c"
                                        value={formData.ship_to_city_c}
                                        onChange={handleChange}
                                        placeholder="City"
                                    />
                                    <FormField
                                        label="State"
                                        name="ship_to_state_c"
                                        value={formData.ship_to_state_c}
                                        onChange={handleChange}
                                        placeholder="State"
                                    />
                                    <FormField
                                        label="Country"
                                        name="ship_to_country_c"
                                        value={formData.ship_to_country_c}
                                        onChange={handleChange}
                                        placeholder="Country"
                                    />
                                    <FormField
                                        label="Pincode"
                                        name="ship_to_pincode_c"
                                        value={formData.ship_to_pincode_c}
                                        onChange={handleChange}
                                        placeholder="Pincode"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <Button type="button" variant="outline" onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={loading}>
                                    {loading ? "Saving..." : quote ? "Update Quote" : "Add Quote"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuoteModal;