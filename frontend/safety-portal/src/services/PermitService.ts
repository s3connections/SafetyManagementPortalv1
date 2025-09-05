import httpClient from '../utils/httpClient';
import { API_ENDPOINTS } from '../constants';
import { Audit, ApiResponse, PaginatedResponse, AuditStatus } from '../types';

export interface CreateAuditDto {
  auditType: string;
  departmentId: number;
  plantId: number;
  auditorId: number;
  scheduledDate: string;
}

export interface UpdateAuditDto {
  auditType?: string;
  departmentId?: number;
  auditorId?: number;
  scheduledDate?: string;
  status?: AuditStatus;
  score?: number;
}

class AuditService {
  async createAudit(auditData: CreateAuditDto): Promise<ApiResponse<Audit>> {
    try {
      const response = await httpClient.post(API_ENDPOINTS.AUDITS.CREATE, auditData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create audit');
    }
  }

  async getAudits(page = 1, limit = 10, filters?: any): Promise<PaginatedResponse<Audit>> {
    try {
      const params = { page, limit, ...filters };
      const response = await httpClient.get(API_ENDPOINTS.AUDITS.BASE, { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch audits');
    }
  }

  async getAudit(id: number): Promise<ApiResponse<Audit>> {
    try {
      const response = await httpClient.get(`${API_ENDPOINTS.AUDITS}/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch audit');
    }
  }

  async updateAudit(id: number, auditData: UpdateAuditDto): Promise<ApiResponse<Audit>> {
    try {
      const response = await httpClient.put(`${API_ENDPOINTS.AUDITS}/${id}`, auditData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update audit');
    }
  }

  async deleteAudit(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await httpClient.delete(`${API_ENDPOINTS.AUDITS}/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete audit');
    }
  }

  async getAuditsByDepartment(departmentId: number): Promise<ApiResponse<Audit[]>> {
    try {
      const response = await httpClient.get(`${API_ENDPOINTS.AUDITS}/department/${departmentId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch department audits');
    }
  }

  async getAuditsByPlant(plantId: number): Promise<ApiResponse<Audit[]>> {
    try {
      const response = await httpClient.get(`${API_ENDPOINTS.AUDITS}/plant/${plantId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch plant audits');
    }
  }

  async startAudit(id: number): Promise<ApiResponse<Audit>> {
    try {
      const response = await httpClient.post(`${API_ENDPOINTS.AUDITS}/${id}/start`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to start audit');
    }
  }

  async completeAudit(id: number, score?: number, remarks?: string): Promise<ApiResponse<Audit>> {
    try {
      const response = await httpClient.post(`${API_ENDPOINTS.AUDITS}/${id}/complete`, {
        score,
        remarks
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to complete audit');
    }
  }

  async getAuditAnalytics(plantId?: number, departmentId?: number, dateRange?: { start: string; end: string }): Promise<ApiResponse<any>> {
    try {
      const params: any = {};
      if (plantId) params.plantId = plantId;
      if (departmentId) params.departmentId = departmentId;
      if (dateRange) {
        params.startDate = dateRange.start;
        params.endDate = dateRange.end;
      }

      const response = await httpClient.get(`${API_ENDPOINTS.AUDITS}/analytics`, { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch audit analytics');
    }
  }
}

export default new AuditService;