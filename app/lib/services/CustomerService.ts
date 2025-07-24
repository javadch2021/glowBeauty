import { Collection } from 'mongodb';
import { connectToDatabase, COLLECTIONS } from '../mongodb';
import { 
  Customer, 
  CustomerDocument, 
  documentToCustomer, 
  customerToDocument 
} from '../models';

export class CustomerService {
  private async getCollection(): Promise<Collection<CustomerDocument>> {
    const db = await connectToDatabase();
    return db.collection<CustomerDocument>(COLLECTIONS.CUSTOMERS);
  }

  /**
   * Get all customers
   */
  async getAll(): Promise<Customer[]> {
    try {
      const collection = await this.getCollection();
      const documents = await collection.find({}).sort({ id: 1 }).toArray();
      return documents.map(documentToCustomer);
    } catch (error) {
      console.error('Error fetching all customers:', error);
      throw new Error('Failed to fetch customers');
    }
  }

  /**
   * Get customer by ID
   */
  async getById(id: number): Promise<Customer | null> {
    try {
      const collection = await this.getCollection();
      const document = await collection.findOne({ id });
      return document ? documentToCustomer(document) : null;
    } catch (error) {
      console.error(`Error fetching customer with ID ${id}:`, error);
      throw new Error('Failed to fetch customer');
    }
  }

  /**
   * Get customer by email
   */
  async getByEmail(email: string): Promise<Customer | null> {
    try {
      const collection = await this.getCollection();
      const document = await collection.findOne({ email });
      return document ? documentToCustomer(document) : null;
    } catch (error) {
      console.error(`Error fetching customer with email ${email}:`, error);
      throw new Error('Failed to fetch customer by email');
    }
  }

  /**
   * Search customers by name or email
   */
  async search(query: string): Promise<Customer[]> {
    try {
      const collection = await this.getCollection();
      const searchRegex = new RegExp(query, 'i'); // Case-insensitive search
      const documents = await collection.find({
        $or: [
          { name: { $regex: searchRegex } },
          { email: { $regex: searchRegex } }
        ]
      }).sort({ id: 1 }).toArray();
      return documents.map(documentToCustomer);
    } catch (error) {
      console.error(`Error searching customers with query "${query}":`, error);
      throw new Error('Failed to search customers');
    }
  }

  /**
   * Create a new customer
   */
  async create(customerData: Omit<Customer, 'id'>): Promise<Customer> {
    try {
      const collection = await this.getCollection();
      
      // Check if email already exists
      const existingCustomer = await collection.findOne({ email: customerData.email });
      if (existingCustomer) {
        throw new Error('Customer with this email already exists');
      }
      
      // Get the next available ID
      const lastCustomer = await collection.findOne({}, { sort: { id: -1 } });
      const nextId = lastCustomer ? lastCustomer.id + 1 : 1;
      
      const newCustomer: Customer = {
        ...customerData,
        id: nextId,
      };

      const document = {
        ...customerToDocument(newCustomer),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await collection.insertOne(document);
      
      if (!result.acknowledged) {
        throw new Error('Failed to insert customer');
      }

      console.log(`CustomerService - Created customer with ID ${nextId}`);
      return newCustomer;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error instanceof Error ? error : new Error('Failed to create customer');
    }
  }

  /**
   * Update an existing customer
   */
  async update(customer: Customer): Promise<Customer> {
    try {
      const collection = await this.getCollection();
      
      // Check if email is being changed and if it conflicts with another customer
      const existingCustomer = await collection.findOne({ 
        email: customer.email, 
        id: { $ne: customer.id } 
      });
      if (existingCustomer) {
        throw new Error('Another customer with this email already exists');
      }
      
      const document = {
        ...customerToDocument(customer),
        updatedAt: new Date(),
      };

      const result = await collection.updateOne(
        { id: customer.id },
        { $set: document }
      );

      if (result.matchedCount === 0) {
        throw new Error(`Customer with ID ${customer.id} not found`);
      }

      console.log(`CustomerService - Updated customer with ID ${customer.id}`);
      return customer;
    } catch (error) {
      console.error(`Error updating customer with ID ${customer.id}:`, error);
      throw error instanceof Error ? error : new Error('Failed to update customer');
    }
  }

  /**
   * Delete a customer by ID
   */
  async delete(id: number): Promise<boolean> {
    try {
      const collection = await this.getCollection();
      const result = await collection.deleteOne({ id });
      
      const deleted = result.deletedCount > 0;
      if (deleted) {
        console.log(`CustomerService - Deleted customer with ID ${id}`);
      } else {
        console.log(`CustomerService - Customer with ID ${id} not found for deletion`);
      }
      
      return deleted;
    } catch (error) {
      console.error(`Error deleting customer with ID ${id}:`, error);
      throw new Error('Failed to delete customer');
    }
  }

  /**
   * Update customer statistics (total orders and total spent)
   */
  async updateStats(customerId: number, totalOrders: number, totalSpent: number): Promise<void> {
    try {
      const collection = await this.getCollection();
      const result = await collection.updateOne(
        { id: customerId },
        { 
          $set: { 
            totalOrders, 
            totalSpent,
            updatedAt: new Date()
          } 
        }
      );

      if (result.matchedCount === 0) {
        console.warn(`Customer with ID ${customerId} not found for stats update`);
      } else {
        console.log(`CustomerService - Updated stats for customer ${customerId}`);
      }
    } catch (error) {
      console.error(`Error updating customer stats for ID ${customerId}:`, error);
      throw new Error('Failed to update customer statistics');
    }
  }

  /**
   * Get customer count
   */
  async getCount(): Promise<number> {
    try {
      const collection = await this.getCollection();
      return await collection.countDocuments();
    } catch (error) {
      console.error('Error getting customer count:', error);
      throw new Error('Failed to get customer count');
    }
  }

  /**
   * Get customers with pagination
   */
  async getPaginated(page: number = 1, limit: number = 10): Promise<{ customers: Customer[], total: number, page: number, totalPages: number }> {
    try {
      const collection = await this.getCollection();
      const skip = (page - 1) * limit;
      
      const [documents, total] = await Promise.all([
        collection.find({}).sort({ id: 1 }).skip(skip).limit(limit).toArray(),
        collection.countDocuments()
      ]);

      const customers = documents.map(documentToCustomer);
      const totalPages = Math.ceil(total / limit);

      return {
        customers,
        total,
        page,
        totalPages
      };
    } catch (error) {
      console.error('Error fetching paginated customers:', error);
      throw new Error('Failed to fetch paginated customers');
    }
  }

  /**
   * Check if customer exists
   */
  async exists(id: number): Promise<boolean> {
    try {
      const collection = await this.getCollection();
      const count = await collection.countDocuments({ id });
      return count > 0;
    } catch (error) {
      console.error(`Error checking if customer ${id} exists:`, error);
      throw new Error('Failed to check customer existence');
    }
  }

  /**
   * Check if email exists
   */
  async emailExists(email: string, excludeId?: number): Promise<boolean> {
    try {
      const collection = await this.getCollection();
      const query: any = { email };
      if (excludeId) {
        query.id = { $ne: excludeId };
      }
      const count = await collection.countDocuments(query);
      return count > 0;
    } catch (error) {
      console.error(`Error checking if email ${email} exists:`, error);
      throw new Error('Failed to check email existence');
    }
  }
}

// Export singleton instance
export const customerService = new CustomerService();
