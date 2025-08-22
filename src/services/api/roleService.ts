import apiClient from './apiClient';

export interface Role {
  roleId: number;
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
    const response = await apiClient.post('/api/role/create-role', roleData);
    return response.data;
  },

  // Get all roles
  getAllRoles: async (): Promise<Role[]> => {
    const response = await apiClient.get('/api/role/get-all-roles');
    return response.data;
  },

  // Assign role to user
  assignRole: async (userId: number, roleName: string): Promise<void> => {
    await apiClient.post(`/api/user/${userId}/assign-role/${roleName}`);
  },

  // Remove role from user
  removeRole: async (userId: number, roleName: string): Promise<void> => {
    await apiClient.delete(`/api/user/${userId}/remove-role/${roleName}`);
  },
};