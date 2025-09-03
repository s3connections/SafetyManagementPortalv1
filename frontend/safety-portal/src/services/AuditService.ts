import httpClient from '../utils/httpClient';
import { API_ENDPOINTS } from '../config/api';
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
      const response = await httpClient.post(API_ENDPOINTS.AUDITS, auditData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create audit');
    }
  }

  async getAudits(page = 1, limit = 10, filters?: any): Promise<PaginatedResponse<Audit>> {
    try {
      const params = { page, limit, ...filters };
      const response = await httpClient.get(API_ENDPOINTS.AUDITS, { params });
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
}

const auditService = new AuditService();
export default auditService;
