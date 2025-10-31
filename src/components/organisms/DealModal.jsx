import { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";
import { companyService } from "@/services/api/companyService";
import { toast } from "react-toastify";

const DealModal = ({ deal, onClose, onSave }) => {
    const [formData, setFormData] = useState({
title_c: "",
        value_c: "",
        stage_c: "qualified",
        probability_c: "",
        close_date_c: "",
        contact_id_c: "",
        company_id_c: "",
        notes_c: ""
    });
    const [contacts, setContacts] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const stages = [
        { value: "qualified", label: "Qualified" },
        { value: "proposal", label: "Proposal" },
        { value: "negotiation", label: "Negotiation" },
        { value: "won", label: "Won" },
        { value: "lost", label: "Lost" }
    ];

    useEffect(() => {
        loadData();
        if (deal) {
setFormData({
                title_c: deal.title_c || "",
                value_c: deal.value_c?.toString() || "",
                stage_c: deal.stage_c || "qualified",
                probability_c: deal.probability_c?.toString() || "",
                close_date_c: deal.close_date_c ? new Date(deal.close_date_c).toISOString().split('T')[0] : "",
                contact_id_c: deal.contact_id_c?.toString() || "",
                company_id_c: deal.company_id_c?.toString() || "",
                notes_c: deal.notes_c || ""
            });
        }
    }, [deal]);

    const loadData = async () => {
        try {
            const [contactsData, companiesData] = await Promise.all([
                contactService.getAll(),
                companyService.getAll()
            ]);
            setContacts(contactsData);
            setCompanies(companiesData);
        } catch (err) {
            toast.error("Failed to load data");
        }
    };

    const validate = () => {
        const newErrors = {};
if (!formData.title_c.trim()) newErrors.title_c = "Title is required";
        if (!formData.value_c || formData.value_c <= 0) newErrors.value_c = "Value must be greater than 0";
        if (!formData.close_date_c) newErrors.close_date_c = "Close date is required";
        if (!formData.contact_id_c) newErrors.contact_id_c = "Contact is required";
        if (!formData.probability_c || formData.probability_c < 0 || formData.probability_c > 100) {
            newErrors.probability_c = "Probability must be between 0 and 100";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            setLoading(true);
            const dealData = {
...formData,
                value_c: parseFloat(formData.value_c),
                probability_c: parseInt(formData.probability_c),
                contact_id_c: formData.contact_id_c,
                company_id_c: formData.company_id_c || null
            };

            if (deal) {
                await dealService.update(deal.Id, dealData);
                toast.success("Deal updated successfully");
            } else {
                await dealService.create(dealData);
                toast.success("Deal created successfully");
            }
            onSave();
            onClose();
        } catch (err) {
            toast.error("Failed to save deal");
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

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">
{deal ? "Edit Sales Pipeline Item" : "Add New Sales Pipeline Item"}
                            </h3>
                            <Button variant="ghost" size="sm" onClick={onClose}>
                                <ApperIcon name="X" className="w-5 h-5" />
                            </Button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <FormField
label="Pipeline Item Title"
                                name="title_c"
                                value={formData.title_c}
                                onChange={handleChange}
                                error={errors.title_c}
                                required
                                placeholder="Enter deal title..."
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField
label="Pipeline Item Value"
                                    name="value_c"
                                    type="number"
                                    value={formData.value_c}
                                    onChange={handleChange}
                                    error={errors.value_c}
                                    required
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                />
                                <FormField
                                    label="Probability (%)"
name="probability_c"
                                    type="number"
                                    value={formData.probability_c}
                                    onChange={handleChange}
                                    error={errors.probability_c}
                                    required
                                    placeholder="0-100"
                                    min="0"
                                    max="100"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Stage <span className="text-red-500">*</span>
                                    </label>
                                    <select
name="stage_c"
value={formData.stage_c}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                                    >
                                        {stages.map(stage => (
                                            <option key={stage.value} value={stage.value}>
                                                {stage.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <FormField
label="Close Date"
                                    name="close_date_c"
                                    type="date"
                                    value={formData.close_date_c}
                                    onChange={handleChange}
                                    error={errors.close_date_c}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Contact <span className="text-red-500">*</span>
                                    </label>
                                    <select
name="contact_id_c"
                                        value={formData.contact_id_c}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 ${
                                            errors.contactId ? 'border-red-500' : 'border-gray-300'
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
                                        Company
                                    </label>
                                    <select
name="company_id_c"
                                        value={formData.company_id_c}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                                    >
                                        <option value="">Select company...</option>
                                        {companies.map(company => (
<option key={company.Id} value={company.Id}>
                                                {company.name_c}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Notes
                                </label>
                                <textarea
name="notes_c"
                                    value={formData.notes_c}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                                    placeholder="Add any notes about this deal..."
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <Button type="button" variant="outline" onClick={onClose}>
                                    Cancel
                                </Button>
<Button type="submit" disabled={loading}>
                                    {loading ? "Saving..." : deal ? "Update Sales Pipeline Item" : "Add Sales Pipeline Item"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DealModal;