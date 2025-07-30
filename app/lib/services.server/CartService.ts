import { MongoClient, Db, Collection } from "mongodb";
import { CartItem, CartItemDocument } from "~/lib/models";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = process.env.DB_NAME || "beauty_ecommerce";

export class CartService {
  private client: MongoClient;
  private db: Db | null = null;

  constructor() {
    this.client = new MongoClient(MONGODB_URI);
  }

  private async getCollection(): Promise<Collection<CartItemDocument>> {
    if (!this.db) {
      await this.client.connect();
      this.db = this.client.db(DB_NAME);
    }
    return this.db.collection<CartItemDocument>("cart_items");
  }

  async addToCart(customerId: number, productId: number, productName: string, productImage: string, price: number, quantity: number = 1): Promise<CartItem> {
    const collection = await this.getCollection();
    
    // Check if item already exists in cart
    const existingItem = await collection.findOne({ customerId, productId });
    
    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      await collection.updateOne(
        { customerId, productId },
        { 
          $set: { 
            quantity: newQuantity,
            updatedAt: new Date()
          }
        }
      );
      
      return {
        productId,
        productName,
        productImage,
        price,
        quantity: newQuantity,
        addedAt: existingItem.addedAt
      };
    } else {
      // Add new item
      const cartItem: CartItemDocument = {
        customerId,
        productId,
        productName,
        productImage,
        price,
        quantity,
        addedAt: new Date(),
        updatedAt: new Date()
      };
      
      await collection.insertOne(cartItem);
      
      return {
        productId,
        productName,
        productImage,
        price,
        quantity,
        addedAt: cartItem.addedAt
      };
    }
  }

  async getCart(customerId: number): Promise<CartItem[]> {
    const collection = await this.getCollection();
    const items = await collection.find({ customerId }).toArray();
    
    return items.map(item => ({
      productId: item.productId,
      productName: item.productName,
      productImage: item.productImage,
      price: item.price,
      quantity: item.quantity,
      addedAt: item.addedAt
    }));
  }

  async updateQuantity(customerId: number, productId: number, quantity: number): Promise<boolean> {
    const collection = await this.getCollection();
    
    if (quantity <= 0) {
      return this.removeFromCart(customerId, productId);
    }
    
    const result = await collection.updateOne(
      { customerId, productId },
      { 
        $set: { 
          quantity,
          updatedAt: new Date()
        }
      }
    );
    
    return result.modifiedCount > 0;
  }

  async removeFromCart(customerId: number, productId: number): Promise<boolean> {
    const collection = await this.getCollection();
    const result = await collection.deleteOne({ customerId, productId });
    return result.deletedCount > 0;
  }

  async clearCart(customerId: number): Promise<boolean> {
    const collection = await this.getCollection();
    const result = await collection.deleteMany({ customerId });
    return result.deletedCount > 0;
  }

  async getCartCount(customerId: number): Promise<number> {
    const collection = await this.getCollection();
    const items = await collection.find({ customerId }).toArray();
    return items.reduce((total, item) => total + item.quantity, 0);
  }
}

export const cartService = new CartService();