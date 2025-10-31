import { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";
import { contactService } from "@/services/api/contactService";
import { toast } from "react-toastify";

const ContactModal = ({ contact, onClose, onSave }) => {
const [formData, setFormData] = useState({
        first_name_c: "",
        last_name_c: "",
        email_c: "",
        mobile_c: "",
        company_c: "",
        position_c: "",
        notes_c: ""
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (contact) {
setFormData({
                first_name_c: contact.first_name_c || "",
                last_name_c: contact.last_name_c || "",
                email_c: contact.email_c || "",
                mobile_c: contact.mobile_c || "",
                company_c: contact.company_c || "",
                position_c: contact.position_c || "",
                notes_c: contact.notes_c || ""
            });
        }
    }, [contact]);

    const validate = () => {
        const newErrors = {};
if (!formData.first_name_c.trim()) newErrors.first_name_c = "First name is required";
        if (!formData.last_name_c.trim()) newErrors.last_name_c = "Last name is required";
        if (!formData.email_c.trim()) newErrors.email_c = "Email is required";
        if (!formData.company_c.trim()) newErrors.company_c = "Company is required";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            setLoading(true);
            if (contact) {
                await contactService.update(contact.Id, formData);
                toast.success("Contact updated successfully");
            } else {
                await contactService.create(formData);
                toast.success("Contact created successfully");
            }
            onSave();
            onClose();
        } catch (err) {
            toast.error("Failed to save contact");
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
                                {contact ? "Edit Contact" : "Add New Contact"}
                            </h3>
                            <Button variant="ghost" size="sm" onClick={onClose}>
                                <ApperIcon name="X" className="w-5 h-5" />
                            </Button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
<FormField
                                    label="First Name"
                                    name="first_name_c"
                                    value={formData.first_name_c}
                                    onChange={handleChange}
                                    error={errors.first_name_c}
                                    required
                                />
<FormField
                                    label="Last Name"
                                    name="last_name_c"
                                    value={formData.last_name_c}
                                    onChange={handleChange}
                                    error={errors.last_name_c}
                                    required
                                />
                            </div>
<FormField
                                label="Mobile"
                                name="mobile_c"
                                type="tel"
                                value={formData.mobile_c}
                                onChange={handleChange}
                                error={errors.mobile_c}
                            />
                            <FormField
label="Email"
                                name="email_c"
                                type="email"
                                value={formData.email_c}
                                onChange={handleChange}
                                error={errors.email_c}
                                required
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField
label="Company"
                                    name="company_c"
                                    value={formData.company_c}
                                    onChange={handleChange}
                                    error={errors.company_c}
                                    required
                                />
<FormField
                                    label="Position"
                                    name="position_c"
                                    value={formData.position_c}
                                    onChange={handleChange}
                                    error={errors.position_c}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Notes
                                </label>
                                <textarea
                                    name="notes"
value={formData.notes_c}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                                    placeholder="Add any notes about this contact..."
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <Button type="button" variant="outline" onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={loading}>
                                    {loading ? "Saving..." : contact ? "Update Contact" : "Add Contact"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactModal;