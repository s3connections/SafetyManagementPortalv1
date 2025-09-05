import axios from 'axios';

// Define interfaces locally to avoid circular dependencies
export interface ObservationFormData {
  title: string;
  description: string;
  observationType?: string;
  priority: number;
  location: string; // ✅ FIXED: Always required, not optional
  dueDate?: string;
  assignedToUserId?: number;
  plantId?: number;
  departmentId?: number;
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export class ObservationService {
  static async getAllObservations(): Promise<{ success: boolean; data?: any[]; error?: string }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/observation`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching observations:', error);
      return { success: false, error: 'Failed to fetch observations' };
    }
  }

  static async getObservationById(id: number): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/observation/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching observation:', error);
      return { success: false, error: 'Failed to fetch observation' };
    }
  }

  static async createObservation(observationData: ObservationFormData, imageFile?: File): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const formData = new FormData();
      
      // Add observation data
      Object.entries(observationData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });
      
      // Add image if provided
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await axios.post(`${API_BASE_URL}/observation`, observationData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error creating observation:', error);
      return { success: false, error: 'Failed to create observation' };
    }
  }

  // ✅ ADDED: Missing updateObservation method
  static async updateObservation(id: number, observationData: Partial<ObservationFormData>): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await axios.put(`${API_BASE_URL}/observation/${id}`, observationData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error updating observation:', error);
      return { success: false, error: 'Failed to update observation' };
    }
  }

  // ✅ ADDED: Missing updateObservationStatus method
  static async updateObservationStatus(id: number, status: string, notes?: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await axios.patch(`${API_BASE_URL}/observation/${id}/status`, {
        status,
        notes,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error updating observation status:', error);
      return { success: false, error: 'Failed to update observation status' };
    }
  }

  // ✅ ADDED: Missing deleteObservation method
  static async deleteObservation(id: number): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      await axios.delete(`${API_BASE_URL}/observation/${id}`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting observation:', error);
      return { success: false, error: 'Failed to delete observation' };
    }
  }
}

// Export as default to fix import issues
export default ObservationService;