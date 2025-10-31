class DealService {
    constructor() {
        const { ApperClient } = window.ApperSDK;
        this.apperClient = new ApperClient({
            apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
            apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
        });
        this.tableName = 'deal_c';
    }

    async getAll() {
        try {
            const params = {
                fields: [
                    {"field": {"Name": "Id"}},
                    {"field": {"Name": "Name"}},
                    {"field": {"Name": "title_c"}},
                    {"field": {"Name": "value_c"}},
                    {"field": {"Name": "stage_c"}},
                    {"field": {"Name": "probability_c"}},
                    {"field": {"Name": "close_date_c"}},
                    {"field": {"Name": "notes_c"}},
                    {"field": {"Name": "contact_id_c"}},
                    {"field": {"Name": "company_id_c"}},
                    {"field": {"Name": "CreatedOn"}},
                    {"field": {"Name": "ModifiedOn"}}
                ],
                orderBy: [{"fieldName": "ModifiedOn", "sorttype": "DESC"}],
                pagingInfo: {"limit": 100, "offset": 0}
            };
            
            const response = await this.apperClient.fetchRecords(this.tableName, params);
            
            if (!response.success) {
                console.error("Error fetching deals:", response.message);
                return [];
            }
            
            return response.data || [];
        } catch (error) {
            console.error("Error fetching deals:", error?.response?.data?.message || error);
            return [];
        }
    }

    async getById(id) {
        try {
            const params = {
                fields: [
                    {"field": {"Name": "Id"}},
                    {"field": {"Name": "Name"}},
                    {"field": {"Name": "title_c"}},
                    {"field": {"Name": "value_c"}},
                    {"field": {"Name": "stage_c"}},
                    {"field": {"Name": "probability_c"}},
                    {"field": {"Name": "close_date_c"}},
                    {"field": {"Name": "notes_c"}},
                    {"field": {"Name": "contact_id_c"}},
                    {"field": {"Name": "company_id_c"}},
                    {"field": {"Name": "CreatedOn"}},
                    {"field": {"Name": "ModifiedOn"}}
                ]
            };
            
            const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
            
            if (!response.success) {
                console.error("Error fetching deal:", response.message);
                return null;
            }
            
            return response.data;
        } catch (error) {
            console.error(`Error fetching deal ${id}:`, error?.response?.data?.message || error);
            return null;
        }
    }

    async create(dealData) {
        try {
            const params = {
                records: [{
                    Name: dealData.title_c || "New Deal",
                    title_c: dealData.title_c,
                    value_c: parseFloat(dealData.value_c),
                    stage_c: dealData.stage_c,
                    probability_c: parseInt(dealData.probability_c),
                    close_date_c: dealData.close_date_c,
                    notes_c: dealData.notes_c,
                    contact_id_c: dealData.contact_id_c ? parseInt(dealData.contact_id_c) : null,
                    company_id_c: dealData.company_id_c ? parseInt(dealData.company_id_c) : null
                }]
            };
            
            const response = await this.apperClient.createRecord(this.tableName, params);
            
            if (!response.success) {
                console.error("Error creating deal:", response.message);
                throw new Error(response.message);
            }
            
            if (response.results && response.results.length > 0) {
                const successful = response.results.filter(r => r.success);
                const failed = response.results.filter(r => !r.success);
                
                if (failed.length > 0) {
                    console.error(`Failed to create ${failed.length} deals:`, failed);
                    failed.forEach(record => {
                        if (record.message) throw new Error(record.message);
                    });
                }
                
                return successful[0]?.data;
            }
        } catch (error) {
            console.error("Error creating deal:", error?.response?.data?.message || error);
            throw error;
        }
    }

    async update(id, dealData) {
        try {
            const updateData = {
                Id: parseInt(id),
                Name: dealData.title_c || dealData.Name
            };

            // Only include fields that are provided and not undefined
            if (dealData.title_c !== undefined) updateData.title_c = dealData.title_c;
            if (dealData.value_c !== undefined) updateData.value_c = parseFloat(dealData.value_c);
            if (dealData.stage_c !== undefined) updateData.stage_c = dealData.stage_c;
            if (dealData.probability_c !== undefined) updateData.probability_c = parseInt(dealData.probability_c);
            if (dealData.close_date_c !== undefined) updateData.close_date_c = dealData.close_date_c;
            if (dealData.notes_c !== undefined) updateData.notes_c = dealData.notes_c;
            if (dealData.contact_id_c !== undefined) updateData.contact_id_c = dealData.contact_id_c ? parseInt(dealData.contact_id_c) : null;
            if (dealData.company_id_c !== undefined) updateData.company_id_c = dealData.company_id_c ? parseInt(dealData.company_id_c) : null;

            const params = {
                records: [updateData]
            };
            
            const response = await this.apperClient.updateRecord(this.tableName, params);
            
            if (!response.success) {
                console.error("Error updating deal:", response.message);
                throw new Error(response.message);
            }
            
            if (response.results && response.results.length > 0) {
                const successful = response.results.filter(r => r.success);
                const failed = response.results.filter(r => !r.success);
                
                if (failed.length > 0) {
                    console.error(`Failed to update ${failed.length} deals:`, failed);
                    failed.forEach(record => {
                        if (record.message) throw new Error(record.message);
                    });
                }
                
                return successful[0]?.data;
            }
        } catch (error) {
            console.error("Error updating deal:", error?.response?.data?.message || error);
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
                console.error("Error deleting deal:", response.message);
                throw new Error(response.message);
            }
            
            if (response.results && response.results.length > 0) {
                const successful = response.results.filter(r => r.success);
                const failed = response.results.filter(r => !r.success);
                
                if (failed.length > 0) {
                    console.error(`Failed to delete ${failed.length} deals:`, failed);
                    failed.forEach(record => {
                        if (record.message) throw new Error(record.message);
                    });
                }
                
                return successful.length > 0;
            }
        } catch (error) {
            console.error("Error deleting deal:", error?.response?.data?.message || error);
            throw error;
        }
    }
}

export const dealService = new DealService();