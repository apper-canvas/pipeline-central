class ContactService {
    constructor() {
        const { ApperClient } = window.ApperSDK;
        this.apperClient = new ApperClient({
            apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
            apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
        });
        this.tableName = 'contact_c';
    }

    async getAll() {
        try {
            const params = {
                fields: [
                    {"field": {"Name": "Id"}},
                    {"field": {"Name": "Name"}},
                    {"field": {"Name": "first_name_c"}},
                    {"field": {"Name": "last_name_c"}},
                    {"field": {"Name": "email_c"}},
                    {"field": {"Name": "phone_c"}},
                    {"field": {"Name": "company_c"}},
                    {"field": {"Name": "position_c"}},
                    {"field": {"Name": "notes_c"}},
                    {"field": {"Name": "CreatedOn"}},
                    {"field": {"Name": "ModifiedOn"}}
                ],
                orderBy: [{"fieldName": "ModifiedOn", "sorttype": "DESC"}],
                pagingInfo: {"limit": 100, "offset": 0}
            };
            
            const response = await this.apperClient.fetchRecords(this.tableName, params);
            
            if (!response.success) {
                console.error("Error fetching contacts:", response.message);
                return [];
            }
            
            return response.data || [];
        } catch (error) {
            console.error("Error fetching contacts:", error?.response?.data?.message || error);
            return [];
        }
    }

    async getById(id) {
        try {
            const params = {
                fields: [
                    {"field": {"Name": "Id"}},
                    {"field": {"Name": "Name"}},
                    {"field": {"Name": "first_name_c"}},
                    {"field": {"Name": "last_name_c"}},
                    {"field": {"Name": "email_c"}},
                    {"field": {"Name": "phone_c"}},
                    {"field": {"Name": "company_c"}},
                    {"field": {"Name": "position_c"}},
                    {"field": {"Name": "notes_c"}},
                    {"field": {"Name": "CreatedOn"}},
                    {"field": {"Name": "ModifiedOn"}}
                ]
            };
            
            const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
            
            if (!response.success) {
                console.error("Error fetching contact:", response.message);
                return null;
            }
            
            return response.data;
        } catch (error) {
            console.error(`Error fetching contact ${id}:`, error?.response?.data?.message || error);
            return null;
        }
    }

    async create(contactData) {
        try {
            const params = {
                records: [{
                    Name: `${contactData.first_name_c || ''} ${contactData.last_name_c || ''}`.trim() || "New Contact",
                    first_name_c: contactData.first_name_c,
                    last_name_c: contactData.last_name_c,
                    email_c: contactData.email_c,
                    phone_c: contactData.phone_c,
                    company_c: contactData.company_c,
                    position_c: contactData.position_c,
                    notes_c: contactData.notes_c
                }]
            };
            
            const response = await this.apperClient.createRecord(this.tableName, params);
            
            if (!response.success) {
                console.error("Error creating contact:", response.message);
                throw new Error(response.message);
            }
            
            if (response.results && response.results.length > 0) {
                const successful = response.results.filter(r => r.success);
                const failed = response.results.filter(r => !r.success);
                
                if (failed.length > 0) {
                    console.error(`Failed to create ${failed.length} contacts:`, failed);
                    failed.forEach(record => {
                        if (record.message) throw new Error(record.message);
                    });
                }
                
                return successful[0]?.data;
            }
        } catch (error) {
            console.error("Error creating contact:", error?.response?.data?.message || error);
            throw error;
        }
    }

    async update(id, contactData) {
        try {
            const params = {
                records: [{
                    Id: parseInt(id),
                    Name: `${contactData.first_name_c || ''} ${contactData.last_name_c || ''}`.trim(),
                    first_name_c: contactData.first_name_c,
                    last_name_c: contactData.last_name_c,
                    email_c: contactData.email_c,
                    phone_c: contactData.phone_c,
                    company_c: contactData.company_c,
                    position_c: contactData.position_c,
                    notes_c: contactData.notes_c
                }]
            };
            
            const response = await this.apperClient.updateRecord(this.tableName, params);
            
            if (!response.success) {
                console.error("Error updating contact:", response.message);
                throw new Error(response.message);
            }
            
            if (response.results && response.results.length > 0) {
                const successful = response.results.filter(r => r.success);
                const failed = response.results.filter(r => !r.success);
                
                if (failed.length > 0) {
                    console.error(`Failed to update ${failed.length} contacts:`, failed);
                    failed.forEach(record => {
                        if (record.message) throw new Error(record.message);
                    });
                }
                
                return successful[0]?.data;
            }
        } catch (error) {
            console.error("Error updating contact:", error?.response?.data?.message || error);
            throw error;
        }
    }

    async delete(id) {
        try {
            const params = { 
                RecordIds: [parseInt(id)]
            };
            
            const response = await this.apperClient.deleteRecord(this.tableName, params);
            
            if (!response.success) {
                console.error("Error deleting contact:", response.message);
                throw new Error(response.message);
            }
            
            if (response.results && response.results.length > 0) {
                const successful = response.results.filter(r => r.success);
                const failed = response.results.filter(r => !r.success);
                
                if (failed.length > 0) {
                    console.error(`Failed to delete ${failed.length} contacts:`, failed);
                    failed.forEach(record => {
                        if (record.message) throw new Error(record.message);
                    });
                }
                
                return successful.length > 0;
            }
        } catch (error) {
            console.error("Error deleting contact:", error?.response?.data?.message || error);
            throw error;
        }
    }
}

export const contactService = new ContactService();