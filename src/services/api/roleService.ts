import apiClient from './apiClient';

export interface Role {
    roleId: number;
    name: string;
    description?: string;
    cosmetic: boolean;
    permissions?: string[];
}

export interface RoleCreationRequest {
    name: string;
    description?: string;
    permissions?: Set<string>;
    cosmetic?: boolean;
}

export const roleService = {
    // Get all permissions
    getAllPermissions: async (): Promise<string[]> => {
        const response = await apiClient.get('/api/permissions/get-permissions');
        // Backend returns a string representation, parse it to get the actual permissions
        return response.data;

        // return  permissionsString = response.data;
        // // Extract permissions from the string format, assuming it's something like "[PERMISSION1, PERMISSION2]"
        // const matches = permissionsString.match(/\[(.*?)\]/);
        // if (matches && matches[1]) {
        //   return matches[1].split(',').map((permission: string) => permission.trim());
        // }
        // return [];
    },

    // Create a new role
    createRole: async (roleData: RoleCreationRequest): Promise<Role> => {
        const requestData = {
            name: roleData.name,
            description: roleData.description,
            permissions: roleData.permissions ? Array.from(roleData.permissions) : undefined,
            cosmetic: roleData.cosmetic || false
        };
        const response = await apiClient.post('/api/role/create-role', requestData);
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

//     Delete Role
    deleteRole: async (roleId: number): Promise<void> => {
        await apiClient.delete(`/api/role/delete-role/${roleId}`);
    },
};