
import { geminiService } from './geminiService';

interface ComparisonRequest {
  currentDevice: string;
  newDevice: string;
}

interface SpecsRequest {
  productName: string;
}

class BackendServiceClass {
  async getProductComparison(currentDevice: string, newDevice: string): Promise<any> {
    try {
      // Use Gemini service directly
      return await geminiService.getProductComparison(currentDevice, newDevice);
    } catch (error) {
      console.error('Comparison error:', error);
      throw error;
    }
  }

  async getProductSpecs(productName: string): Promise<any> {
    try {
      // Use Gemini service directly
      return await geminiService.getProductSpecs(productName);
    } catch (error) {
      console.error('Specs error:', error);
      throw error;
    }
  }

  async processRequest(type: string, data: any): Promise<any> {
    switch (type) {
      case 'comparison':
        return this.getProductComparison(data.currentDevice, data.newDevice);
      case 'specs':
        return this.getProductSpecs(data.productName);
      default:
        throw new Error(`Unknown request type: ${type}`);
    }
  }
}

export const backendService = new BackendServiceClass();
