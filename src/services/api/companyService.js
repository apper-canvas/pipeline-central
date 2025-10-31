class CompanyService {
    constructor() {
        const { ApperClient } = window.ApperSDK;
        this.apperClient = new ApperClient({
            apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
            apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
        });
        this.tableName = 'company_c';
    }

    async getAll() {
        try {
            const params = {
                fields: [
                    {"field": {"Name": "Id"}},
                    {"field": {"Name": "Name"}},
                    {"field": {"Name": "name_c"}},
                    {"field": {"Name": "industry_c"}},
                    {"field": {"Name": "size_c"}},
                    {"field": {"Name": "website_c"}},
                    {"field": {"Name": "phone_c"}},
                    {"field": {"Name": "address_c"}},
                    {"field": {"Name": "notes_c"}},
                    {"field": {"Name": "CreatedOn"}},
                    {"field": {"Name": "ModifiedOn"}}
                ],
                orderBy: [{"fieldName": "ModifiedOn", "sorttype": "DESC"}],
                pagingInfo: {"limit": 100, "offset": 0}
            };
            
            const response = await this.apperClient.fetchRecords(this.tableName, params);
            
            if (!response.success) {
                console.error("Error fetching companies:", response.message);
                return [];
            }
            
            return response.data || [];
        } catch (error) {
            console.error("Error fetching companies:", error?.response?.data?.message || error);
            return [];
        }
    }

    async getById(id) {
        try {
            const params = {
                fields: [
                    {"field": {"Name": "Id"}},
                    {"field": {"Name": "Name"}},
                    {"field": {"Name": "name_c"}},
                    {"field": {"Name": "industry_c"}},
                    {"field": {"Name": "size_c"}},
                    {"field": {"Name": "website_c"}},
                    {"field": {"Name": "phone_c"}},
                    {"field": {"Name": "address_c"}},
                    {"field": {"Name": "notes_c"}},
                    {"field": {"Name": "CreatedOn"}},
                    {"field": {"Name": "ModifiedOn"}}
                ]
            };
            
            const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
            
            if (!response.success) {
                console.error("Error fetching company:", response.message);
                return null;
            }
            
            return response.data;
        } catch (error) {
            console.error(`Error fetching company ${id}:`, error?.response?.data?.message || error);
            return null;
        }
    }

    async create(companyData) {
        try {
            const params = {
                records: [{
                    Name: companyData.name_c || "New Company",
                    name_c: companyData.name_c,
                    industry_c: companyData.industry_c,
                    size_c: companyData.size_c,
                    website_c: companyData.website_c,
                    phone_c: companyData.phone_c,
                    address_c: companyData.address_c,
                    notes_c: companyData.notes_c
                }]
            };
            
            const response = await this.apperClient.createRecord(this.tableName, params);
            
            if (!response.success) {
                console.error("Error creating company:", response.message);
                throw new Error(response.message);
            }
            
            if (response.results && response.results.length > 0) {
                const successful = response.results.filter(r => r.success);
                const failed = response.results.filter(r => !r.success);
                
                if (failed.length > 0) {
                    console.error(`Failed to create ${failed.length} companies:`, failed);
                    failed.forEach(record => {
                        if (record.message) throw new Error(record.message);
                    });
                }
                
                return successful[0]?.data;
            }
        } catch (error) {
            console.error("Error creating company:", error?.response?.data?.message || error);
            throw error;
        }
    }

    async update(id, companyData) {
        try {
            const params = {
                records: [{
                    Id: parseInt(id),
                    Name: companyData.name_c,
                    name_c: companyData.name_c,
                    industry_c: companyData.industry_c,
                    size_c: companyData.size_c,
                    website_c: companyData.website_c,
                    phone_c: companyData.phone_c,
                    address_c: companyData.address_c,
                    notes_c: companyData.notes_c
                }]
            };
            
            const response = await this.apperClient.updateRecord(this.tableName, params);
            
            if (!response.success) {
                console.error("Error updating company:", response.message);
                throw new Error(response.message);
            }
            
            if (response.results && response.results.length > 0) {
                const successful = response.results.filter(r => r.success);
                const failed = response.results.filter(r => !r.success);
                
                if (failed.length > 0) {
                    console.error(`Failed to update ${failed.length} companies:`, failed);
                    failed.forEach(record => {
                        if (record.message) throw new Error(record.message);
                    });
                }
                
                return successful[0]?.data;
            }
        } catch (error) {
            console.error("Error updating company:", error?.response?.data?.message || error);
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
                console.error("Error deleting company:", response.message);
                throw new Error(response.message);
            }
            
            if (response.results && response.results.length > 0) {
                const successful = response.results.filter(r => r.success);
                const failed = response.results.filter(r => !r.success);
                
                if (failed.length > 0) {
                    console.error(`Failed to delete ${failed.length} companies:`, failed);
                    failed.forEach(record => {
                        if (record.message) throw new Error(record.message);
                    });
                }
                
                return successful.length > 0;
            }
        } catch (error) {
            console.error("Error deleting company:", error?.response?.data?.message || error);
            throw error;
        }
    }
}

export const companyService = new CompanyService();