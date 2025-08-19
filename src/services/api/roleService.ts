import apiClient from './apiClient';

export interface Role {
  id: number;
  name: string;
  description?: string;
}

export interface RoleCreationRequest {
  name: string;
  description?: string;
}

export const roleService = {
  // Create a new role
  createRole: async (roleData: RoleCreationRequest): Promise<Role> => {
    const response = await apiClient.post('/api/admin/create-role', roleData);
    return response.data;
  },

  // Get all roles
  getAllRoles: async (): Promise<Role[]> => {
    const response = await apiClient.get('/api/admin/get-all-roles');
    return response.data;
  },

  // Assign role to user
  assignRole: async (userId: number, roleName: string): Promise<void> => {
    await apiClient.post(`/api/admin/${userId}/roles/${roleName}`);
  },

  // Remove role from user
  removeRole: async (userId: number, roleName: string): Promise<void> => {
    await apiClient.delete(`/api/admin/${userId}/roles/${roleName}`);
  },
};