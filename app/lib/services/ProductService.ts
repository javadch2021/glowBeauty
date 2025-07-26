import { Collection } from 'mongodb';
import { connectToDatabase, COLLECTIONS } from '../mongodb';
import { 
  Product, 
  ProductDocument, 
  documentToProduct, 
  productToDocument 
} from '../models';

export class ProductService {
  private async getCollection(): Promise<Collection<ProductDocument>> {
    const db = await connectToDatabase();
    return db.collection<ProductDocument>(COLLECTIONS.PRODUCTS);
  }

  /**
   * Get all products
   */
  async getAll(): Promise<Product[]> {
    try {
      const collection = await this.getCollection();
      const documents = await collection.find({}).sort({ id: 1 }).toArray();
      return documents.map(documentToProduct);
    } catch (error) {
      console.error('Error fetching all products:', error);
      throw new Error('Failed to fetch products');
    }
  }

  /**
   * Get product by ID
   */
  async getById(id: number): Promise<Product | null> {
    try {
      const collection = await this.getCollection();
      const document = await collection.findOne({ id });
      return document ? documentToProduct(document) : null;
    } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error);
      throw new Error('Failed to fetch product');
    }
  }

  /**
   * Get products by category
   */
  async getByCategory(category: string): Promise<Product[]> {
    try {
      const collection = await this.getCollection();
      const documents = await collection.find({ category }).sort({ id: 1 }).toArray();
      return documents.map(documentToProduct);
    } catch (error) {
      console.error(`Error fetching products by category ${category}:`, error);
      throw new Error('Failed to fetch products by category');
    }
  }

  /**
   * Search products by name or description
   */
  async search(query: string): Promise<Product[]> {
    try {
      const collection = await this.getCollection();
      const searchRegex = new RegExp(query, 'i'); // Case-insensitive search
      const documents = await collection.find({
        $or: [
          { name: { $regex: searchRegex } },
          { description: { $regex: searchRegex } }
        ]
      }).sort({ id: 1 }).toArray();
      return documents.map(documentToProduct);
    } catch (error) {
      console.error(`Error searching products with query "${query}":`, error);
      throw new Error('Failed to search products');
    }
  }

  /**
   * Create a new product
   */
  async create(productData: Omit<Product, 'id'>): Promise<Product> {
    try {
      const collection = await this.getCollection();
      
      // Get the next available ID
      const lastProduct = await collection.findOne({}, { sort: { id: -1 } });
      const nextId = lastProduct ? lastProduct.id + 1 : 1;
      
      const newProduct: Product = {
        ...productData,
        id: nextId,
      };

      const document = {
        ...productToDocument(newProduct),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await collection.insertOne(document);
      
      if (!result.acknowledged) {
        throw new Error('Failed to insert product');
      }

      console.log(`ProductService - Created product with ID ${nextId}`);
      return newProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error('Failed to create product');
    }
  }

  /**
   * Update an existing product
   */
  async update(product: Product): Promise<Product> {
    try {
      const collection = await this.getCollection();
      
      const document = {
        ...productToDocument(product),
        updatedAt: new Date(),
      };

      const result = await collection.updateOne(
        { id: product.id },
        { $set: document }
      );

      if (result.matchedCount === 0) {
        throw new Error(`Product with ID ${product.id} not found`);
      }

      console.log(`ProductService - Updated product with ID ${product.id}`);
      return product;
    } catch (error) {
      console.error(`Error updating product with ID ${product.id}:`, error);
      throw new Error('Failed to update product');
    }
  }

  /**
   * Delete a product by ID
   */
  async delete(id: number): Promise<boolean> {
    try {
      const collection = await this.getCollection();
      const result = await collection.deleteOne({ id });
      
      const deleted = result.deletedCount > 0;
      if (deleted) {
        console.log(`ProductService - Deleted product with ID ${id}`);
      } else {
        console.log(`ProductService - Product with ID ${id} not found for deletion`);
      }
      
      return deleted;
    } catch (error) {
      console.error(`Error deleting product with ID ${id}:`, error);
      throw new Error('Failed to delete product');
    }
  }

  /**
   * Get product count
   */
  async getCount(): Promise<number> {
    try {
      const collection = await this.getCollection();
      return await collection.countDocuments();
    } catch (error) {
      console.error('Error getting product count:', error);
      throw new Error('Failed to get product count');
    }
  }

  /**
   * Get products with pagination
   */
  async getPaginated(page: number = 1, limit: number = 10): Promise<{ products: Product[], total: number, page: number, totalPages: number }> {
    try {
      const collection = await this.getCollection();
      const skip = (page - 1) * limit;
      
      const [documents, total] = await Promise.all([
        collection.find({}).sort({ id: 1 }).skip(skip).limit(limit).toArray(),
        collection.countDocuments()
      ]);

      const products = documents.map(documentToProduct);
      const totalPages = Math.ceil(total / limit);

      return {
        products,
        total,
        page,
        totalPages
      };
    } catch (error) {
      console.error('Error fetching paginated products:', error);
      throw new Error('Failed to fetch paginated products');
    }
  }

  /**
   * Check if product exists
   */
  async exists(id: number): Promise<boolean> {
    try {
      const collection = await this.getCollection();
      const count = await collection.countDocuments({ id });
      return count > 0;
    } catch (error) {
      console.error(`Error checking if product ${id} exists:`, error);
      throw new Error('Failed to check product existence');
    }
  }
}

// Export singleton instance
export const productService = new ProductService();
