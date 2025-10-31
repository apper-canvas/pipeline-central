class QuoteService {
    constructor() {
        const { ApperClient } = window.ApperSDK;
        this.apperClient = new ApperClient({
            apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
            apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
        });
        this.tableName = 'quote_c';
    }

    async getAll() {
        try {
            const params = {
                fields: [
                    {"field": {"Name": "Id"}},
                    {"field": {"Name": "Name"}},
                    {"field": {"Name": "Tags"}},
                    {"field": {"Name": "quote_date_c"}},
                    {"field": {"Name": "status_c"}},
                    {"field": {"Name": "delivery_method_c"}},
                    {"field": {"Name": "expires_on_c"}},
                    {"field": {"Name": "bill_to_name_c"}},
                    {"field": {"Name": "bill_to_street_c"}},
                    {"field": {"Name": "bill_to_city_c"}},
                    {"field": {"Name": "bill_to_state_c"}},
                    {"field": {"Name": "bill_to_country_c"}},
                    {"field": {"Name": "bill_to_pincode_c"}},
                    {"field": {"Name": "ship_to_name_c"}},
                    {"field": {"Name": "ship_to_street_c"}},
                    {"field": {"Name": "ship_to_city_c"}},
                    {"field": {"Name": "ship_to_state_c"}},
                    {"field": {"Name": "ship_to_country_c"}},
                    {"field": {"Name": "ship_to_pincode_c"}},
                    {"field": {"Name": "company_id_c"}},
                    {"field": {"Name": "contact_id_c"}},
                    {"field": {"Name": "deal_id_c"}},
                    {"field": {"Name": "CreatedOn"}},
                    {"field": {"Name": "ModifiedOn"}}
                ],
                orderBy: [{"fieldName": "ModifiedOn", "sorttype": "DESC"}],
                pagingInfo: {"limit": 100, "offset": 0}
            };
            
            const response = await this.apperClient.fetchRecords(this.tableName, params);
            
            if (!response.success) {
                console.error("Error fetching quotes:", response.message);
                return [];
            }
            
            return response.data || [];
        } catch (error) {
            console.error("Error fetching quotes:", error?.response?.data?.message || error);
            return [];
        }
    }

    async getById(id) {
        try {
            const params = {
                fields: [
                    {"field": {"Name": "Id"}},
                    {"field": {"Name": "Name"}},
                    {"field": {"Name": "Tags"}},
                    {"field": {"Name": "quote_date_c"}},
                    {"field": {"Name": "status_c"}},
                    {"field": {"Name": "delivery_method_c"}},
                    {"field": {"Name": "expires_on_c"}},
                    {"field": {"Name": "bill_to_name_c"}},
                    {"field": {"Name": "bill_to_street_c"}},
                    {"field": {"Name": "bill_to_city_c"}},
                    {"field": {"Name": "bill_to_state_c"}},
                    {"field": {"Name": "bill_to_country_c"}},
                    {"field": {"Name": "bill_to_pincode_c"}},
                    {"field": {"Name": "ship_to_name_c"}},
                    {"field": {"Name": "ship_to_street_c"}},
                    {"field": {"Name": "ship_to_city_c"}},
                    {"field": {"Name": "ship_to_state_c"}},
                    {"field": {"Name": "ship_to_country_c"}},
                    {"field": {"Name": "ship_to_pincode_c"}},
                    {"field": {"Name": "company_id_c"}},
                    {"field": {"Name": "contact_id_c"}},
                    {"field": {"Name": "deal_id_c"}},
                    {"field": {"Name": "CreatedOn"}},
                    {"field": {"Name": "ModifiedOn"}}
                ]
            };
            
            const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
            
            if (!response.success) {
                console.error("Error fetching quote:", response.message);
                return null;
            }
            
            return response.data;
        } catch (error) {
            console.error(`Error fetching quote ${id}:`, error?.response?.data?.message || error);
            return null;
        }
    }

    async create(quoteData) {
        try {
            const params = {
                records: [{
                    Name: quoteData.Name || "New Quote",
                    Tags: quoteData.Tags,
                    quote_date_c: quoteData.quote_date_c,
                    status_c: quoteData.status_c,
                    delivery_method_c: quoteData.delivery_method_c,
                    expires_on_c: quoteData.expires_on_c,
                    bill_to_name_c: quoteData.bill_to_name_c,
                    bill_to_street_c: quoteData.bill_to_street_c,
                    bill_to_city_c: quoteData.bill_to_city_c,
                    bill_to_state_c: quoteData.bill_to_state_c,
                    bill_to_country_c: quoteData.bill_to_country_c,
                    bill_to_pincode_c: quoteData.bill_to_pincode_c,
                    ship_to_name_c: quoteData.ship_to_name_c,
                    ship_to_street_c: quoteData.ship_to_street_c,
                    ship_to_city_c: quoteData.ship_to_city_c,
                    ship_to_state_c: quoteData.ship_to_state_c,
                    ship_to_country_c: quoteData.ship_to_country_c,
                    ship_to_pincode_c: quoteData.ship_to_pincode_c,
                    company_id_c: quoteData.company_id_c ? parseInt(quoteData.company_id_c) : null,
                    contact_id_c: quoteData.contact_id_c ? parseInt(quoteData.contact_id_c) : null,
                    deal_id_c: quoteData.deal_id_c ? parseInt(quoteData.deal_id_c) : null
                }]
            };
            
            const response = await this.apperClient.createRecord(this.tableName, params);
            
            if (!response.success) {
                console.error("Error creating quote:", response.message);
                throw new Error(response.message);
            }
            
            if (response.results && response.results.length > 0) {
                const successful = response.results.filter(r => r.success);
                const failed = response.results.filter(r => !r.success);
                
                if (failed.length > 0) {
                    console.error(`Failed to create ${failed.length} quotes:`, failed);
                    failed.forEach(record => {
                        if (record.message) throw new Error(record.message);
                    });
                }
                
                return successful[0]?.data;
            }
        } catch (error) {
            console.error("Error creating quote:", error?.response?.data?.message || error);
            throw error;
        }
    }

    async update(id, quoteData) {
        try {
            const updateData = {
                Id: parseInt(id),
                Name: quoteData.Name
            };

            // Only include fields that are provided and not undefined
            if (quoteData.Tags !== undefined) updateData.Tags = quoteData.Tags;
            if (quoteData.quote_date_c !== undefined) updateData.quote_date_c = quoteData.quote_date_c;
            if (quoteData.status_c !== undefined) updateData.status_c = quoteData.status_c;
            if (quoteData.delivery_method_c !== undefined) updateData.delivery_method_c = quoteData.delivery_method_c;
            if (quoteData.expires_on_c !== undefined) updateData.expires_on_c = quoteData.expires_on_c;
            if (quoteData.bill_to_name_c !== undefined) updateData.bill_to_name_c = quoteData.bill_to_name_c;
            if (quoteData.bill_to_street_c !== undefined) updateData.bill_to_street_c = quoteData.bill_to_street_c;
            if (quoteData.bill_to_city_c !== undefined) updateData.bill_to_city_c = quoteData.bill_to_city_c;
            if (quoteData.bill_to_state_c !== undefined) updateData.bill_to_state_c = quoteData.bill_to_state_c;
            if (quoteData.bill_to_country_c !== undefined) updateData.bill_to_country_c = quoteData.bill_to_country_c;
            if (quoteData.bill_to_pincode_c !== undefined) updateData.bill_to_pincode_c = quoteData.bill_to_pincode_c;
            if (quoteData.ship_to_name_c !== undefined) updateData.ship_to_name_c = quoteData.ship_to_name_c;
            if (quoteData.ship_to_street_c !== undefined) updateData.ship_to_street_c = quoteData.ship_to_street_c;
            if (quoteData.ship_to_city_c !== undefined) updateData.ship_to_city_c = quoteData.ship_to_city_c;
            if (quoteData.ship_to_state_c !== undefined) updateData.ship_to_state_c = quoteData.ship_to_state_c;
            if (quoteData.ship_to_country_c !== undefined) updateData.ship_to_country_c = quoteData.ship_to_country_c;
            if (quoteData.ship_to_pincode_c !== undefined) updateData.ship_to_pincode_c = quoteData.ship_to_pincode_c;
            if (quoteData.company_id_c !== undefined) updateData.company_id_c = quoteData.company_id_c ? parseInt(quoteData.company_id_c) : null;
            if (quoteData.contact_id_c !== undefined) updateData.contact_id_c = quoteData.contact_id_c ? parseInt(quoteData.contact_id_c) : null;
            if (quoteData.deal_id_c !== undefined) updateData.deal_id_c = quoteData.deal_id_c ? parseInt(quoteData.deal_id_c) : null;

            const params = {
                records: [updateData]
            };
            
            const response = await this.apperClient.updateRecord(this.tableName, params);
            
            if (!response.success) {
                console.error("Error updating quote:", response.message);
                throw new Error(response.message);
            }
            
            if (response.results && response.results.length > 0) {
                const successful = response.results.filter(r => r.success);
                const failed = response.results.filter(r => !r.success);
                
                if (failed.length > 0) {
                    console.error(`Failed to update ${failed.length} quotes:`, failed);
                    failed.forEach(record => {
                        if (record.message) throw new Error(record.message);
                    });
                }
                
                return successful[0]?.data;
            }
        } catch (error) {
            console.error("Error updating quote:", error?.response?.data?.message || error);
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
                console.error("Error deleting quote:", response.message);
                throw new Error(response.message);
            }
            
            if (response.results && response.results.length > 0) {
                const successful = response.results.filter(r => r.success);
                const failed = response.results.filter(r => !r.success);
                
                if (failed.length > 0) {
                    console.error(`Failed to delete ${failed.length} quotes:`, failed);
                    failed.forEach(record => {
                        if (record.message) throw new Error(record.message);
                    });
                }
                
                return successful.length > 0;
            }
        } catch (error) {
            console.error("Error deleting quote:", error?.response?.data?.message || error);
            throw error;
        }
    }
}

export const quoteService = new QuoteService();