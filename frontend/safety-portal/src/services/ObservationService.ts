import axios from 'axios';
import { CreateObservationDto, UpdateObservationDto } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ObservationService {
  static async getAllObservations(): Promise<{ success: boolean; data?: any[]; error?: string }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/observation`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error fetching observations:', error);
      return { success: false, error: 'Failed to fetch observations' };
    }
  }

  static async createObservation(createData: CreateObservationDto): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await axios.post(`${API_BASE_URL}/observation`, createData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error creating observation:', error);
      return { success: false, error: 'Failed to create observation' };
    }
  }

  static async updateObservation(id: number, updateData: UpdateObservationDto): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await axios.put(`${API_BASE_URL}/observation/${id}`, updateData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error updating observation:', error);
      return { success: false, error: 'Failed to update observation' };
    }
  }

  static async updateObservationStatus(id: number, status: string, notes?: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await axios.patch(`${API_BASE_URL}/observation/${id}/status`, { status, notes });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error updating observation status:', error);
      return { success: false, error: 'Failed to update observation status' };
    }
  }

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

export default ObservationService;