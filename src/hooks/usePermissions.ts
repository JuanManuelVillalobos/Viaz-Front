import {useAuth} from '@/contexts/AuthContext';

export const usePermissions = () => {
    const {hasPermission, hasAnyPermission, permissions, hasRole} = useAuth();

    return {
        hasPermission,
        hasAnyPermission,
        permissions,
        hasRole,

        isCustomerService: () => hasRole('Customer Service'),

        // Specific permission groups
        canManageUsers: () => hasAnyPermission(['USER_MANAGE', 'USER_WRITE', 'USER_READ']),
        canCreateUsers: () => hasAnyPermission(['USER_MANAGE', 'USER_WRITE']),
        canDeleteUsers: () => hasAnyPermission(['USER_MANAGE', 'USER_DELETE']),

        canManageIncidentTypes: () => hasAnyPermission(['CHARGE_MANAGE']),
        canManageChargeTypes: () => hasAnyPermission(['INCIDENT_MANAGE']),

        canManageRoles: () => hasAnyPermission(['ROLES_MANAGE', 'ROLES_WRITE', 'ROLES_READ']),
        canCreateRoles: () => hasAnyPermission(['ROLES_MANAGE', 'ROLES_WRITE']),
        canDeleteRoles: () => hasAnyPermission(['ROLES_MANAGE', 'ROLES_DELETE']),
        canAssignRoles: () => hasAnyPermission(['ROLES_MANAGE', 'ROLES_ASSIGN']),

        canManageShipments: () => hasAnyPermission(['SHIPMENT_MANAGE', 'SHIPMENT_WRITE', 'SHIPMENT_READ']),
        canCreateShipments: () => hasAnyPermission(['SHIPMENT_MANAGE', 'SHIPMENT_WRITE']),
        canDeleteShipments: () => hasAnyPermission(['SHIPMENT_MANAGE', 'SHIPMENT_DELETE']),
        canCloseShipments: () => hasAnyPermission(['SHIPMENT_MANAGE', 'SHIPMENT_CLOSE']),
        canExportShipments: () => hasAnyPermission(['SHIPMENT_MANAGE', 'SHIPMENT_EXPORT']),
        canRestoreShipments: () => hasAnyPermission(['SHIPMENT_MANAGE', 'SHIPMENT_RESTORE']),

        canManageCarriers: () => hasAnyPermission(['CARRIER_MANAGE', 'CARRIER_WRITE', 'CARRIER_READ']),
        canCreateCarriers: () => hasAnyPermission(['CARRIER_MANAGE', 'CARRIER_WRITE']),
        canDeleteCarriers: () => hasAnyPermission(['CARRIER_MANAGE', 'CARRIER_DELETE']),

        isAdmin: () => hasPermission('ADMIN_OVERRIDE'),
    };
};