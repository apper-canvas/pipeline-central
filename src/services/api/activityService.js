class ActivityService {
    constructor() {
        const { ApperClient } = window.ApperSDK;
        this.apperClient = new ApperClient({
            apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
            apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
        });
        this.tableName = 'activity_c';
    }

    async getAll() {
        try {
            const params = {
                fields: [
                    {"field": {"Name": "Id"}},
                    {"field": {"Name": "Name"}},
                    {"field": {"Name": "type_c"}},
                    {"field": {"Name": "description_c"}},
                    {"field": {"Name": "timestamp_c"}},
                    {"field": {"Name": "contact_id_c"}},
                    {"field": {"Name": "deal_id_c"}}
                ],
                orderBy: [{"fieldName": "timestamp_c", "sorttype": "DESC"}],
                pagingInfo: {"limit": 100, "offset": 0}
            };
            
            const response = await this.apperClient.fetchRecords(this.tableName, params);
            
            if (!response.success) {
                console.error("Error fetching activities:", response.message);
                return [];
            }
            
            return response.data || [];
        } catch (error) {
            console.error("Error fetching activities:", error?.response?.data?.message || error);
            return [];
        }
    }

    async getById(id) {
        try {
            const params = {
                fields: [
                    {"field": {"Name": "Id"}},
                    {"field": {"Name": "Name"}},
                    {"field": {"Name": "type_c"}},
                    {"field": {"Name": "description_c"}},
                    {"field": {"Name": "timestamp_c"}},
                    {"field": {"Name": "contact_id_c"}},
                    {"field": {"Name": "deal_id_c"}}
                ]
            };
            
            const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
            
            if (!response.success) {
                console.error("Error fetching activity:", response.message);
                return null;
            }
            
            return response.data;
        } catch (error) {
            console.error(`Error fetching activity ${id}:`, error?.response?.data?.message || error);
            return null;
        }
    }

    async create(activityData) {
        try {
            const params = {
                records: [{
                    Name: activityData.Name || activityData.type_c || "New Activity",
                    type_c: activityData.type_c,
                    description_c: activityData.description_c,
                    timestamp_c: activityData.timestamp_c || new Date().toISOString(),
                    contact_id_c: activityData.contact_id_c ? parseInt(activityData.contact_id_c) : null,
                    deal_id_c: activityData.deal_id_c ? parseInt(activityData.deal_id_c) : null
                }]
            };
            
            const response = await this.apperClient.createRecord(this.tableName, params);
            
            if (!response.success) {
                console.error("Error creating activity:", response.message);
                throw new Error(response.message);
            }
            
            if (response.results && response.results.length > 0) {
                const successful = response.results.filter(r => r.success);
                const failed = response.results.filter(r => !r.success);
                
                if (failed.length > 0) {
                    console.error(`Failed to create ${failed.length} activities:`, failed);
                    failed.forEach(record => {
                        if (record.message) throw new Error(record.message);
                    });
                }
                
                return successful[0]?.data;
            }
        } catch (error) {
            console.error("Error creating activity:", error?.response?.data?.message || error);
            throw error;
        }
    }

    async update(id, activityData) {
        try {
            const params = {
                records: [{
                    Id: parseInt(id),
                    Name: activityData.Name,
                    type_c: activityData.type_c,
                    description_c: activityData.description_c,
                    timestamp_c: activityData.timestamp_c,
                    contact_id_c: activityData.contact_id_c ? parseInt(activityData.contact_id_c) : null,
                    deal_id_c: activityData.deal_id_c ? parseInt(activityData.deal_id_c) : null
                }]
            };
            
            const response = await this.apperClient.updateRecord(this.tableName, params);
            
            if (!response.success) {
                console.error("Error updating activity:", response.message);
                throw new Error(response.message);
            }
            
            if (response.results && response.results.length > 0) {
                const successful = response.results.filter(r => r.success);
                const failed = response.results.filter(r => !r.success);
                
                if (failed.length > 0) {
                    console.error(`Failed to update ${failed.length} activities:`, failed);
                    failed.forEach(record => {
                        if (record.message) throw new Error(record.message);
                    });
                }
                
                return successful[0]?.data;
            }
        } catch (error) {
            console.error("Error updating activity:", error?.response?.data?.message || error);
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
                console.error("Error deleting activity:", response.message);
                throw new Error(response.message);
            }
            
            if (response.results && response.results.length > 0) {
                const successful = response.results.filter(r => r.success);
                const failed = response.results.filter(r => !r.success);
                
                if (failed.length > 0) {
                    console.error(`Failed to delete ${failed.length} activities:`, failed);
                    failed.forEach(record => {
                        if (record.message) throw new Error(record.message);
                    });
                }
                
                return successful.length > 0;
            }
        } catch (error) {
            console.error("Error deleting activity:", error?.response?.data?.message || error);
            throw error;
        }
    }
}

export const activityService = new ActivityService();