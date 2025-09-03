import httpClient from '../utils/httpClient';
import { API_ENDPOINTS } from '../config/api';
import { Observation, ApiResponse, PaginatedResponse, ObservationType, Priority, ObservationStatus, ObservationStage } from '../types';

export interface CreateObservationDto {
  observationType: ObservationType;
  hazardType?: string;
  priority: Priority;
  description: string;
  location: string;
  plantId: number;
  departmentId: number;
  assignedTo?: number;
}

export interface UpdateObservationDto {
  status?: ObservationStatus;
  stage?: ObservationStage;
  assignedTo?: number;
  resolutionRemarks?: string;
  priority?: Priority;
}

class ObservationService {
  async createObservation(observationData: CreateObservationDto, imageFile?: File): Promise<ApiResponse<Observation>> {
    try {
      const formData = new FormData();
      
      // Append observation data
      Object.keys(observationData).forEach(key => {
        const value = (observationData as any)[key];
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      // Append image if provided
      if (imageFile) {
        formData.append('observationImage', imageFile);
      }

      const response = await httpClient.post(API_ENDPOINTS.OBSERVATIONS, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create observation');
    }
  }

  async getObservations(page = 1, limit = 10, filters?: any): Promise<PaginatedResponse<Observation>> {
    try {
      const params = { page, limit, ...filters };
      const response = await httpClient.get(API_ENDPOINTS.OBSERVATIONS, { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch observations');
    }
  }

  async getObservation(id: number): Promise<ApiResponse<Observation>> {
    try {
      const response = await httpClient.get(`${API_ENDPOINTS.OBSERVATIONS}/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch observation');
    }
  }

  async updateObservation(id: number, updateData: UpdateObservationDto, resolutionImage?: File): Promise<ApiResponse<Observation>> {
    try {
      const formData = new FormData();
      
      // Append update data
      Object.keys(updateData).forEach(key => {
        const value = (updateData as any)[key];
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      // Append resolution image if provided
      if (resolutionImage) {
        formData.append('resolutionImage', resolutionImage);
      }

      const response = await httpClient.put(`${API_ENDPOINTS.OBSERVATIONS}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update observation');
    }
  }

  async closeObservation(id: number, resolutionRemarks: string, resolutionImage?: File): Promise<ApiResponse<Observation>> {
    try {
      return await this.updateObservation(id, {
        status: ObservationStatus.CLOSED,
        stage: ObservationStage.CLOSED,
        resolutionRemarks
      }, resolutionImage);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to close observation');
    }
  }

  async reassignObservation(id: number, newAssigneeId: number, reason: string): Promise<ApiResponse<Observation>> {
    try {
      const response = await httpClient.post(`${API_ENDPOINTS.OBSERVATIONS}/${id}/reassign`, {
        assignedTo: newAssigneeId,
        reason
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to reassign observation');
    }
  }

  async getObservationsByDepartment(departmentId: number): Promise<ApiResponse<Observation[]>> {
    try {
      const response = await httpClient.get(`${API_ENDPOINTS.OBSERVATIONS}/department/${departmentId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch department observations');
    }
  }
}

const observationService = new ObservationService();
export default observationService;
