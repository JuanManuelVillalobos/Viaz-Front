import {useState} from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {
    Plus,
    Truck,
    Users,
    Settings,
    Search,
    Mail,
    MoreHorizontal,
    Edit,
    Trash2,
    CheckCircle,
    XCircle,
    Trash,
    BarChart
} from "lucide-react";
import {Checkbox} from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Badge} from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {
    useToast
} from "@/hooks/use-toast";
import {carrierService, Carrier, CreateCarrierRequest} from "@/services/api/carrierService";
import {roleService, RoleCreationRequest} from "@/services/api/roleService";
import {incidentService} from "@/services/api/incidentService";
import {chargeService} from "@/services/api/chargeService";
import {authService, userService} from "@/services/api";
import {ViazUserDTO, UserStatus} from "@/types/api";
import {format} from "date-fns";
import {Switch} from "@/components/ui/switch.tsx";
import {usePermissions} from "@/hooks/usePermissions.ts";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import CarrierStats from "@/components/carrier/CarrierStats.tsx";

// Component interfaces and state

const AdminDashboard = () => {
        const {toast} = useToast();
        const [newCarrierOpen, setNewCarrierOpen] = useState(false);
        const [editUserOpen, setEditUserOpen] = useState(false);
        const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
        const [selectedUser, setSelectedUser] = useState<ViazUserDTO | null>(null);
        const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
        const [userToDelete, setUserToDelete] = useState<ViazUserDTO | null>(null);
        const [searchTerm, setSearchTerm] = useState("");
        const [inviteEmail, setInviteEmail] = useState("");
        const [inviteUsername, setInviteUsername] = useState("");
        const [inviteRole, setInviteRole] = useState("");
        const [isInviting, setIsInviting] = useState(false);

        // Role management state
        const [newRoleOpen, setNewRoleOpen] = useState(false);
        const [newRoleName, setNewRoleName] = useState("");
        const [newRoleDescription, setNewRoleDescription] = useState("");
        const [isRoleCosmetic, setIsRoleCosmetic] = useState(false);
        const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());

        // Incident Types state
        const [newIncidentTypeOpen, setNewIncidentTypeOpen] = useState(false);
        const [newIncidentTypeName, setNewIncidentTypeName] = useState('');
        const [newIncidentTypePenalty, setNewIncidentTypePenalty] = useState(1);

        // Charge Types state
        const [newChargeTypeOpen, setNewChargeTypeOpen] = useState(false);
        const [newChargeTypeName, setNewChargeTypeName] = useState('');
        const [newChargeTypePenalty, setNewChargeTypePenalty] = useState(2);

        // Carrier editing state
        const [editCarrierOpen, setEditCarrierOpen] = useState(false);
        const [editingCarrier, setEditingCarrier] = useState<Carrier | null>(null);
        const [editCarrierData, setEditCarrierData] = useState({
            name: '',
            rfc: '',
            razonSocial: '',
            caat: ''
        });

        const [roleDialogOpen, setRoleDialogOpen] = useState(false);
        const [selectedUserForRole, setSelectedUserForRole] = useState<ViazUserDTO | null>(null);


        const [statsDialogOpen, setStatsDialogOpen] = useState(false);
        const [selectedCarrier, setSelectedCarrier] = useState<any | null>(null);


        // Get permissions and query
        const {canDeleteRoles, canManageIncidentTypes, canManageChargeTypes} = usePermissions();
        const queryClient = useQueryClient();


        //  Manage roles
        const [roleToDelete, setRoleToDelete] = useState<number | null>(null);
        const deleteRoleMutation = useMutation({
            mutationFn: roleService.deleteRole,
            onSuccess: () => {
                toast({
                    title: "Rol Eliminado",
                    description: "El rol ha sido eliminado correctamente.",
                });
            },
        });

        // Manage incidents and charges
        const [incidentTypeToDelete, setIncidentTypeToDelete] = useState<number | null>(null);
        const deleteIncidentTypeMutation = useMutation({
            mutationFn: incidentService.deleteIncidentType,
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey: ['incidentTypes']});
                toast({
                    title: "Tipo de Incidente Eliminado",
                    description: "El tipo de incidente ha sido eliminado correctamente.",
                });
            },
        });

        const [chargeTypeToDelete, setChargeTypeToDelete] = useState<number | null>(null);
        const deleteChargeTypeMutation = useMutation({
            mutationFn: chargeService.deleteChargeType,
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey: ['chargeTypes']});
                toast({
                    title: "Tipo de Cargo Eliminado",
                    description: "El tipo de cargo ha sido eliminado correctamente.",
                });
            },
        });

        const [newCarrier, setNewCarrier] = useState({
            name: '',
            rfc: '',
            razonSocial: '',
            caat: ''
        });


        const {
            data: users,
            isLoading: isLoadingUsers,
        } = useQuery({
            queryKey: ['users'],
            queryFn: () => userService.getAllUsers(),
        });


        const {
            data: carriers = [],
        } = useQuery({
            queryKey: ['carriers'],
            queryFn: () => carrierService.getAllCarriersWithSensitiveFields(),
        });

        const {
            data: roles = [],
        } = useQuery({
            queryKey: ['roles'],
            queryFn:
                () => roleService.getAllRoles(),
        });


        const {
            data: availablePermissions = [],
        } = useQuery({
            queryKey: ['permissions'],
            queryFn: () => roleService.getAllPermissions(),
        });

        const {
            data: incidentTypes = [],
        } = useQuery({
            queryKey: ['incidentTypes'],
            queryFn: () => incidentService.getAllIncidentTypes(),
        });

        const {
            data: chargeTypes = [],
        } = useQuery({
            queryKey: ['chargeTypes'],
            queryFn: () => chargeService.getAllChargeTypes(),

        });

        // =================== Create Carrier ===================
        const handleCreateCarrier = () => {
            if (newCarrier.rfc.length !== 10) {
                toast({
                    title: "RFC inválido",
                    description: "El RFC debe tener exactamente 10 caracteres.",
                    variant: "destructive",
                });
                return;
            }

            if (newCarrier.caat.length !== 4) {
                toast({
                    title: "CAAT inválido",
                    description: "El CAAT debe tener exactamente 4 caracteres.",
                    variant: "destructive",
                });
                return;
            }

            createCarrierMutation.mutate({
                name: newCarrier.name,
                rfc: newCarrier.rfc,
                caat: newCarrier.caat,
                razonSocial: newCarrier.razonSocial,
            });
        };

        const createCarrierMutation = useMutation({
            mutationFn: (carrierData: CreateCarrierRequest) =>
                carrierService.createCarrier(carrierData),
            onSuccess: () => {
                toast({
                    title: "Transportista creado",
                    description: "El transportista ha sido creado exitosamente.",
                });
                setNewCarrier({caat: "", razonSocial: "", rfc: "", name: ""});
                setNewCarrierOpen(false);
                queryClient.invalidateQueries({queryKey: ['carriers']});
            },
            onError: (error) => {
                console.error("Error creating carrier:", error);
                toast({
                    title: "Error",
                    description: "Error al crear el transportista.",
                    variant: "destructive",
                });
            },
        });

// =================== Delete Carrier ===================
        const handleDeleteCarrier = (id: number) => {
            deleteCarrierMutation.mutate(id);
        };

        const deleteCarrierMutation = useMutation({
            mutationFn: (id: number) => carrierService.deleteCarrier(id),
            onSuccess: () => {
                toast({
                    title: "Transportista eliminado",
                    description: "El transportista ha sido eliminado exitosamente.",
                });
                queryClient.invalidateQueries({queryKey: ['carriers']});
            },
            onError: (error) => {
                console.error("Error deleting carrier:", error);
                toast({
                    title: "Error",
                    description: "Error al eliminar el transportista.",
                    variant: "destructive",
                });
            },
        });

// =================== Delete User ===================
        const handleDeleteUser = () => {
            if (userToDelete?.userId) {
                deleteUserMutation.mutate(userToDelete.userId);
            }
        };

        const deleteUserMutation = useMutation({
            mutationFn: (userId: number) => userService.deleteUser(userId),
            onSuccess: (_) => {
                toast({
                    title: "User Deleted",
                    description: `User ${userToDelete?.username} has been deleted.`,
                });
                queryClient.invalidateQueries({queryKey: ['users']});
                setDeleteDialogOpen(false);
                setUserToDelete(null);
            },
            onError: (error) => {
                console.error("Error deleting user:", error);
                toast({
                    title: "Error",
                    description: "Failed to delete user. Please try again.",
                    variant: "destructive",
                });
            },
        });

// =================== Invite User ===================
        const handleInvite = () => {
            if (inviteEmail && inviteRole) {
                setIsInviting(true);
                inviteUserMutation.mutate({
                    userId: 0,
                    username: inviteUsername || inviteEmail.split('@')[0],
                    email: inviteEmail,
                    roles: [inviteRole],
                    status: UserStatus.PENDING,
                });
            }
        };

        const inviteUserMutation = useMutation({
            mutationFn: (userData: ViazUserDTO) => authService.register(userData),
            onSuccess: () => {
                toast({
                    title: "Invitation Sent",
                    description: `An invitation has been sent to ${inviteEmail}`,
                });
                queryClient.invalidateQueries({queryKey: ['users']});
                setInviteEmail("");
                setInviteUsername("");
                setInviteRole("");
                setInviteDialogOpen(false);
            },
            onError: (error) => {
                console.error("Error sending invitation:", error);
                toast({
                    title: "Error",
                    description: "Failed to send invitation. Please try again.",
                    variant: "destructive",
                });
            },
            onSettled: () => {
                setIsInviting(false);
            },
        });

// =================== Create Role ===================
        const handleCreateRole = () => {
            const name = newRoleName.trim();
            const description = newRoleDescription.trim();
            const nameRegex = /^[a-zA-Z0-9_-]+$/;

            if (!name) {
                toast({
                    title: "Nombre requerido",
                    description: "El nombre del rol no puede estar vacío.",
                    variant: "destructive",
                });
                return;
            }

            if (!description) {
                toast({
                    title: "Descripción requerida",
                    description: "La descripción del rol no puede estar vacía.",
                    variant: "destructive",
                });
                return;
            }

            if (!nameRegex.test(name)) {
                toast({
                    title: "Nombre inválido",
                    description: "El nombre solo puede contener letras, números, guiones (-) y guiones bajos (_).",
                    variant: "destructive",
                });
                return;
            }

            createRoleMutation.mutate({
                name,
                description,
                permissions: selectedPermissions.size > 0 ? selectedPermissions : undefined,
                cosmetic: isRoleCosmetic,
            });
        };

        const createRoleMutation = useMutation({
            mutationFn: (roleData: RoleCreationRequest) => roleService.createRole(roleData),
            onSuccess: () => {
                setNewRoleName("");
                setNewRoleDescription("");
                setSelectedPermissions(new Set());
                setNewRoleOpen(false);
                queryClient.invalidateQueries({queryKey: ['roles']});
                toast({
                    title: "Rol creado",
                    description: "El rol ha sido creado exitosamente.",
                });
            },
            onError: (error) => {
                console.error("Error creating role:", error);
                toast({
                    title: "Error",
                    description: "Error al crear el rol.",
                    variant: "destructive",
                });
            },
        });

// =================== Create Incident Type ===================
        const handleCreateIncidentType = () => {
            if (!newIncidentTypeName.trim()) {
                toast({
                    title: "Error",
                    description: "El nombre del tipo de incidente es requerido.",
                    variant: "destructive",
                });
                return;
            }

            createIncidentTypeMutation.mutate({name: newIncidentTypeName, penalty: newIncidentTypePenalty});
        };

        const createIncidentTypeMutation = useMutation({
            mutationFn: (data: { name: string, penalty: number }) => incidentService.createIncidentType(data),
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey: ['incidentTypes']});

                setNewIncidentTypeOpen(false);
                setNewIncidentTypeName('');
                toast({
                    title: "Tipo de incidente creado",
                    description: `Tipo de incidente creado exitosamente.`,
                });
            },
            onError: (error) => {
                console.error('Error creating incident type:', error);
                toast({
                    title: "Error",
                    description: "Error al crear el tipo de incidente.",
                    variant: "destructive",
                });
            },
        });

// =================== Create Charge Type ===================
        const handleCreateChargeType = () => {
            if (!newChargeTypeName.trim()) {
                toast({
                    title: "Error",
                    description: "El nombre del tipo de cargo es requerido.",
                    variant: "destructive",
                });
                return;
            }

            createChargeTypeMutation.mutate({name: newChargeTypeName, penalty: newChargeTypePenalty});
        };

        const createChargeTypeMutation = useMutation({
            mutationFn: (data: { name: string, penalty: number }) => chargeService.createChargeType(data),
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey: ['chargeTypes']});

                setNewChargeTypeOpen(false);
                setNewChargeTypeName('');
                toast({
                    title: "Tipo de cargo creado",
                    description: `Tipo de cargo creado exitosamente.`,
                });
            },
            onError: (error) => {
                console.error('Error creating charge type:', error);
                toast({
                    title: "Error",
                    description: "Error al crear el tipo de cargo.",
                    variant: "destructive",
                });
            },
        });

// =================== Update Carrier ===================
        const handleUpdateCarrier = () => {
            if (!editingCarrier) return;

            if (editCarrierData.rfc.length !== 10) {
                toast({
                    title: "RFC inválido",
                    description: "El RFC debe tener exactamente 10 caracteres.",
                    variant: "destructive",
                });
                return;
            }

            if (editCarrierData.caat.length !== 4) {
                toast({
                    title: "CAAT inválido",
                    description: "El CAAT debe tener exactamente 4 caracteres.",
                    variant: "destructive",
                });
                return;
            }

            updateCarrierMutation.mutate({
                carrierId: editingCarrier.carrierId,
                data: editCarrierData,
            });
        };

        const updateCarrierMutation = useMutation({
            mutationFn: ({carrierId, data}: { carrierId: number; data: CreateCarrierRequest }) =>
                carrierService.updateCarrier(carrierId, data),
            onSuccess: (updatedCarrier) => {
                queryClient.invalidateQueries({queryKey: ['carriers']});

                setEditCarrierOpen(false);
                setEditingCarrier(null);
                setEditCarrierData({
                    name: '',
                    rfc: '',
                    razonSocial: '',
                    caat: '',
                });

                toast({
                    title: "Transportista actualizado",
                    description: `Transportista "${updatedCarrier.name}" actualizado exitosamente.`,
                });

                queryClient.invalidateQueries({queryKey: ['carriers']});
            },
            onError: (error) => {
                console.error('Error updating carrier:', error);
                toast({
                    title: "Error",
                    description: "Error al actualizar el transportista.",
                    variant: "destructive",
                });
            },
        });

// =================== Edit Carrier (Open Modal) ===================
        const handleEditCarrier = (carrier: Carrier) => {
            setEditingCarrier(carrier);
            setEditCarrierData({
                name: carrier.name,
                rfc: carrier.rfc,
                razonSocial: carrier.razonSocial,
                caat: carrier.caat,
            });
            setEditCarrierOpen(true);
        };


//     =================== Edit Carrier (Open Modal) ===================

        const handleUpdateUserRoles = (newRoles: string[]) => {
            if (selectedUser) {
                updateUserRolesMutation.mutate({
                    newRoles,
                    userId: selectedUser.userId,
                });
            }
        };


        const updateUserRolesMutation = useMutation({
            mutationFn: async ({userId, newRoles}: { userId: number, newRoles: string[] }) => {
                const user = users.find(u => u.userId === userId);
                if (!user) throw new Error("Usuario no encontrado");

                const currentRoles = user.roles;
                const rolesToAdd = newRoles.filter(role => !currentRoles.includes(role));
                const rolesToRemove = currentRoles.filter(role => !newRoles.includes(role));

                // Perform role updates
                for (const role of rolesToAdd) {
                    await roleService.assignRole(userId, role);
                }
                for (const role of rolesToRemove) {
                    await roleService.removeRole(userId, role);
                }

                return newRoles;
            },
            onSuccess: (newRoles, variables) => {
                // Update local state
                queryClient.invalidateQueries({queryKey: ['users']});

                setEditUserOpen(false);
                setSelectedUser(null);

                toast({
                    title: "Roles actualizados",
                    description: "Los roles del usuario han sido actualizados exitosamente.",
                });
            },
            onError: (error) => {
                console.error("Error updating user roles:", error);
                toast({
                    title: "Error",
                    description: "Error al actualizar los roles del usuario.",
                    variant: "destructive",
                });
            }
        });


// =================== Change Role (Open Modal) ===================
        const handleChangeRole = (user: ViazUserDTO) => {
            setSelectedUserForRole(user);
            setRoleDialogOpen(true);
        };


        // Helper functions
        const getStatusBadge = (status: UserStatus) => {
            switch (status) {
                case UserStatus.ACTIVE:
                    return <Badge className="bg-green-500">Active</Badge>;
                case UserStatus.PENDING:
                    return <Badge className="bg-yellow-500">Pending</Badge>;
                default:
                    return <Badge variant="outline">{status}</Badge>;
            }
        };

        const getInitials = (name: string) => {
            return name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase();
        };

        const formatDate = (dateString?: string) => {
            if (!dateString) return 'Never';
            try {
                return format(new Date(dateString), 'PPP');
            } catch (error) {
                return dateString;
            }
        };

        const getPrimaryRole = (roles: string[]) => {
            if (roles.includes('ADMIN')) return 'Admin';
            if (roles.includes('MANAGER')) return 'Manager';
            if (roles.includes('OPERATOR')) return 'Operator';
            if (roles.includes('USER')) return 'User';
            return roles[0] || 'N/A';
        };

        // Filtered users for search
        const filteredUsers = (users ?? []).filter(
            (user) =>
                user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.roles.some(role =>
                    role.toLowerCase().includes(searchTerm.toLowerCase())
                )
        );

        const handleViewStats = (carrier) => {
            setSelectedCarrier(carrier);
            setStatsDialogOpen(true);
        };


        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Panel de Administración</h1>
                        <p className="text-muted-foreground">Gestiona transportistas, usuarios y configuraciones del
                            sistema</p>
                    </div>
                </div>

                <Dialog open={statsDialogOpen} onOpenChange={setStatsDialogOpen}>
                    <DialogContent className="max-w-[800px] max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Estadísticas de {selectedCarrier?.name}</DialogTitle>
                            <DialogDescription>
                                Historial de ratings mensuales para este transportista.
                            </DialogDescription>
                        </DialogHeader>
                        {selectedCarrier && <CarrierStats carrierId={selectedCarrier.carrierId}/>}
                    </DialogContent>
                </Dialog>

                <Tabs defaultValue="carriers" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="carriers" className="flex items-center gap-2">
                            <Truck className="h-4 w-4"/>
                            Transportistas
                        </TabsTrigger>
                        <TabsTrigger value="users" className="flex items-center gap-2">
                            <Users className="h-4 w-4"/>
                            Gestión de Usuarios
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="flex items-center gap-2">
                            <Settings className="h-4 w-4"/>
                            Configuraciones
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="carriers" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Transportistas</CardTitle>
                                        <CardDescription>Gestiona todos los transportistas y sus
                                            información</CardDescription>
                                    </div>
                                    <Dialog open={newCarrierOpen} onOpenChange={setNewCarrierOpen}>
                                        <DialogTrigger asChild>
                                            <Button>
                                                <Plus className="h-4 w-4 mr-2"/>
                                                Nuevo Transportista
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Crear Nuevo Transportista</DialogTitle>
                                                <DialogDescription>
                                                    Agrega un nuevo transportista al sistema
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="name">Nombre</Label>
                                                    <Input
                                                        id="name"
                                                        value={newCarrier.name}
                                                        onChange={(e) => setNewCarrier({
                                                            ...newCarrier,
                                                            name: e.target.value
                                                        })}
                                                        placeholder="Nombre del transportista"
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="rfc">RFC</Label>
                                                    <Input
                                                        id="rfc"
                                                        value={newCarrier.rfc}
                                                        maxLength={10}
                                                        minLength={10}
                                                        onChange={(e) => setNewCarrier({
                                                            ...newCarrier,
                                                            rfc: e.target.value
                                                        })}
                                                        placeholder="RFC del transportista"
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="razonSocial">Razón Social</Label>
                                                    <Input
                                                        id="razonSocial"
                                                        value={newCarrier.razonSocial}
                                                        onChange={(e) => setNewCarrier({
                                                            ...newCarrier,
                                                            razonSocial: e.target.value
                                                        })}
                                                        placeholder="Razón social del transportista"
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="caat">CAAT</Label>
                                                    <Input
                                                        id="caat"
                                                        value={newCarrier.caat}
                                                        maxLength={4}
                                                        minLength={4}
                                                        onChange={(e) => setNewCarrier({
                                                            ...newCarrier,
                                                            caat: e.target.value
                                                        })}
                                                        placeholder="CAAT del transportista"
                                                    />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button variant="outline" onClick={() => setNewCarrierOpen(false)}>
                                                    Cancelar
                                                </Button>
                                                <Button onClick={handleCreateCarrier}>Crear Transportista</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nombre</TableHead>
                                            <TableHead>RFC</TableHead>
                                            <TableHead>CAAT</TableHead>
                                            <TableHead>Razón Social</TableHead>
                                            <TableHead className="w-[70px]">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {carriers.map((carrier) => (
                                            <TableRow key={carrier.carrierId}>
                                                <TableCell className="font-medium">{carrier.name}</TableCell>
                                                <TableCell className="font-light">{carrier.rfc}</TableCell>
                                                <TableCell className="font-light">{carrier.caat}</TableCell>
                                                <TableCell className="font-light">{carrier.razonSocial}</TableCell>

                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <MoreHorizontal className="h-4 w-4"/>
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handleEditCarrier(carrier)}>
                                                                <Edit className="mr-2 h-4 w-4"/>
                                                                Editar
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleViewStats(carrier)}>
                                                                <BarChart className="mr-2 h-4 w-4"/>
                                                                Ver Estadísticas
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="text-destructive"
                                                                onClick={() => handleDeleteCarrier(carrier.carrierId)}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4"/>
                                                                Eliminar
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="users" className="space-y-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center">
                                    <Users className="mr-2 h-5 w-5"/>
                                    Gestión de Usuarios
                                </CardTitle>
                                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                    <div className="relative w-full sm:w-96">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                                        <Input
                                            placeholder="Search users..."
                                            className="pl-8"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <div className="ml-auto">
                                        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button>
                                                    <Mail className="mr-2 h-4 w-4"/>
                                                    Invite User
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px]">
                                                <DialogHeader>
                                                    <DialogTitle>Invite New User</DialogTitle>
                                                    <DialogDescription>
                                                        Send an invitation to add a new team member.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="username">Username</Label>
                                                        <Input
                                                            id="username"
                                                            placeholder="Enter username"
                                                            value={inviteUsername}
                                                            onChange={(e) => setInviteUsername(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="email">Email</Label>
                                                        <Input
                                                            id="email"
                                                            type="email"
                                                            placeholder="email@example.com"
                                                            value={inviteEmail}
                                                            onChange={(e) => setInviteEmail(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="role">Role</Label>
                                                        <Select value={inviteRole} onValueChange={setInviteRole}>
                                                            <SelectTrigger id="role">
                                                                <SelectValue placeholder="Select a role"/>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {roles.map((role) => (
                                                                    <SelectItem key={role.roleId} value={role.name}>
                                                                        {role.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
                                                        Cancel
                                                    </Button>
                                                    <Button onClick={handleInvite} disabled={isInviting}>
                                                        {isInviting ? "Sending..." : "Send Invitation"}
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>User</TableHead>
                                                <TableHead>Role</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Last Active</TableHead>
                                                <TableHead></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {isLoadingUsers ? (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="text-center py-8">
                                                        Loading users...
                                                    </TableCell>
                                                </TableRow>
                                            ) : filteredUsers.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="text-center py-8">
                                                        No users found
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                filteredUsers.map((user) => (
                                                    <TableRow key={user.userId}>
                                                        <TableCell>
                                                            <div className="flex items-center gap-3">
                                                                <Avatar>
                                                                    <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <div className="font-medium">{user.username}</div>
                                                                    <div
                                                                        className="text-sm text-muted-foreground">{user.email}</div>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{getPrimaryRole(user.roles)}</TableCell>
                                                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                                                        <TableCell>{formatDate(user.lastLoginDate)}</TableCell>
                                                        <TableCell>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="icon">
                                                                        <MoreHorizontal className="h-4 w-4"/>
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                                    <DropdownMenuSeparator/>
                                                                    <DropdownMenuItem
                                                                        onClick={() => handleChangeRole(user)}>Change
                                                                        Role</DropdownMenuItem>
                                                                    {user.status === UserStatus.PENDING ? (
                                                                        <>
                                                                            <DropdownMenuItem>
                                                                                <CheckCircle
                                                                                    className="mr-2 h-4 w-4 text-green-500"/>
                                                                                Aprobar
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem>
                                                                                <XCircle
                                                                                    className="mr-2 h-4 w-4 text-red-500"/>
                                                                                Rechazar
                                                                            </DropdownMenuItem>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            {/*TODO DEACTIVATE AND ACTIVATE THINGS*/}
                                                                            {/*{user.status === UserStatus.ACTIVE ? (*/}
                                                                            {/*    <DropdownMenuItem>Deactivate</DropdownMenuItem>*/}
                                                                            {/*) : (*/}
                                                                            {/*    <DropdownMenuItem>Activate</DropdownMenuItem>*/}
                                                                            {/*)}*/}
                                                                            <DropdownMenuSeparator/>
                                                                            <DropdownMenuItem
                                                                                className="text-red-500"
                                                                                onClick={() => {
                                                                                    setUserToDelete(user);
                                                                                    setDeleteDialogOpen(true);
                                                                                }}
                                                                            >
                                                                                Eliminar Usuario
                                                                            </DropdownMenuItem>
                                                                        </>
                                                                    )}
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="settings" className="space-y-4">
                        {/* Roles Management */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Gestión de Roles</CardTitle>
                                        <CardDescription>Administra los roles del sistema</CardDescription>
                                    </div>
                                    <Dialog open={newRoleOpen} onOpenChange={setNewRoleOpen}>
                                        <DialogTrigger asChild>
                                            <Button>
                                                <Plus className="h-4 w-4 mr-2"/>
                                                Nuevo Rol
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Crear Nuevo Rol</DialogTitle>
                                                <DialogDescription>
                                                    Agrega un nuevo rol al sistema
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="roleName">Nombre del Rol</Label>
                                                    <Input
                                                        id="roleName"
                                                        value={newRoleName}
                                                        onChange={(e) => setNewRoleName(e.target.value)}
                                                        placeholder="Ej: SUPERVISOR"
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="roleDescription">Descripción de rol</Label>
                                                    <Input
                                                        id="roleDescription"
                                                        value={newRoleDescription}
                                                        onChange={(e) => setNewRoleDescription(e.target.value)}
                                                        placeholder="Descripción del rol"
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="isRoleCosmetic">El rol es cosmético?</Label>
                                                    <Switch
                                                        id={"cosmetic"}
                                                        checked={isRoleCosmetic}
                                                        onCheckedChange={setIsRoleCosmetic}
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    {!isRoleCosmetic && (
                                                        <>
                                                            <Label>Permisos</Label>
                                                            <div
                                                                className="max-h-48 overflow-y-auto border rounded-md p-3 space-y-2">
                                                                {availablePermissions.length > 0 ? (
                                                                    availablePermissions.map((permission) => (
                                                                        <div key={permission}
                                                                             className="flex items-center space-x-2">
                                                                            <Checkbox
                                                                                id={`permission-${permission}`}
                                                                                checked={selectedPermissions.has(permission)}
                                                                                onCheckedChange={(checked) => {
                                                                                    const newPermissions = new Set(selectedPermissions);
                                                                                    if (checked) {
                                                                                        newPermissions.add(permission);
                                                                                    } else {
                                                                                        newPermissions.delete(permission);
                                                                                    }
                                                                                    setSelectedPermissions(newPermissions);
                                                                                }}
                                                                            />
                                                                            <Label htmlFor={`permission-${permission}`}
                                                                                   className="text-sm cursor-pointer">
                                                                                {permission}
                                                                            </Label>
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <p className="text-sm text-muted-foreground">No hay
                                                                        permisos disponibles</p>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-muted-foreground">
                                                                {selectedPermissions.size} permiso{selectedPermissions.size !== 1 ? 's' : ''} seleccionado
                                                                {selectedPermissions.size !== 1 ? 's' : ''}
                                                            </p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button variant="outline" onClick={() => setNewRoleOpen(false)}>
                                                    Cancelar
                                                </Button>
                                                <Button onClick={handleCreateRole}>Crear Rol</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nombre</TableHead>
                                            <TableHead>Descripción</TableHead>
                                            <TableHead>Cosmético?</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {roles.map((role) => (
                                            <TableRow key={role.roleId}>
                                                <TableCell className="font-medium">{role.name}</TableCell>
                                                <TableCell>{role.description || "Sin descripción"}</TableCell>
                                                <TableCell
                                                    className="text-muted-foreground">{role.cosmetic ? "Si" : "No"}</TableCell>
                                                {canDeleteRoles() && (
                                                    <TableCell>
                                                        <Button
                                                            className="text-destructive focus:text-destructive"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                setRoleToDelete(role.roleId);
                                                            }}
                                                        >
                                                            <Trash/>
                                                        </Button>
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        ))}
                                        {roles.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center py-8">
                                                    No se han encontrado roles
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        <AlertDialog open={!!roleToDelete} onOpenChange={(open) => !open && setRoleToDelete(null)}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Role</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Estas seguro de querer eliminar este rol? Esta acción no se puede deshacer.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => {
                                            if (roleToDelete) {
                                                deleteRoleMutation.mutate(roleToDelete);
                                                setRoleToDelete(null);
                                            }
                                        }}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>


                        {/* Incident Types Management */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Gestión de Tipos de Incidentes</CardTitle>
                                        <CardDescription>Administra los tipos de incidentes del sistema</CardDescription>
                                    </div>
                                    <Dialog open={newIncidentTypeOpen} onOpenChange={setNewIncidentTypeOpen}>
                                        <DialogTrigger asChild>
                                            <Button>
                                                <Plus className="h-4 w-4 mr-2"/>
                                                Nuevo Tipo de Incidente
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Crear Nuevo Tipo de Incidente</DialogTitle>
                                                <DialogDescription>
                                                    Agrega un nuevo tipo de incidente al sistema
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="incidentTypeName">Nombre del Tipo de Incidente</Label>
                                                    <Input
                                                        id="incidentTypeName"
                                                        value={newIncidentTypeName}
                                                        onChange={(e) => setNewIncidentTypeName(e.target.value)}
                                                        placeholder="Ej: Retraso en aduana"
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="incidentTypePenalty">Penalización del Tipo de
                                                        Incidente</Label>
                                                    <Input
                                                        id="incidentTypePenalty"
                                                        type="number"
                                                        value={newIncidentTypePenalty}
                                                        onChange={(e) => setNewIncidentTypePenalty(parseInt(e.target.value, 10))}
                                                        placeholder="Ej: 1"
                                                        className="text-center"
                                                    />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button variant="outline" onClick={() => setNewIncidentTypeOpen(false)}>
                                                    Cancelar
                                                </Button>
                                                <Button onClick={handleCreateIncidentType}>Crear Tipo de Incidente</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nombre</TableHead>
                                            <TableHead>Penalización</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {incidentTypes.map((incidentType) => (
                                            <TableRow key={incidentType.incidentId}>
                                                <TableCell className="font-medium">{incidentType.name}</TableCell>
                                                <TableCell>{incidentType.penalty || "Sin descripción"}</TableCell>
                                                {canManageIncidentTypes() && (
                                                    <TableCell>
                                                        <Button
                                                            className="text-destructive focus:text-destructive"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                setIncidentTypeToDelete(incidentType.incidentId);
                                                            }}
                                                        >
                                                            <Trash/>
                                                        </Button>
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        ))}
                                        {incidentTypes.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center py-8">
                                                    No se han encontrado tipos de incidentes
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        <AlertDialog open={!!incidentTypeToDelete}
                                     onOpenChange={(open) => !open && setIncidentTypeToDelete(null)}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Eliminar Tipo de Incidente</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Estas seguro de querer eliminar este tipo de incidente? Esta acción no se puede
                                        deshacer.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => {
                                            if (incidentTypeToDelete) {
                                                deleteIncidentTypeMutation.mutate(incidentTypeToDelete);
                                                setIncidentTypeToDelete(null);
                                            }
                                        }}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        {/* Charge Types Management */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Gestión de Tipos de Cargos</CardTitle>
                                        <CardDescription>Administra los tipos de cargos del sistema</CardDescription>
                                    </div>
                                    <Dialog open={newChargeTypeOpen} onOpenChange={setNewChargeTypeOpen}>
                                        <DialogTrigger asChild>
                                            <Button>
                                                <Plus className="h-4 w-4 mr-2"/>
                                                Nuevo Tipo de Cargo
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Crear Nuevo Tipo de Cargo</DialogTitle>
                                                <DialogDescription>
                                                    Agrega un nuevo tipo de cargo al sistema
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="chargeTypeName">Nombre del Tipo de Cargo</Label>
                                                    <Input
                                                        id="chargeTypeName"
                                                        value={newChargeTypeName}
                                                        onChange={(e) => setNewChargeTypeName(e.target.value)}
                                                        placeholder="Ej: Costo de almacenaje"
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="chargeTypePenalty">Penalización del Tipo de
                                                        Incidente</Label>
                                                    <Input
                                                        id="chargeTypePenalty"
                                                        type="number"
                                                        value={newChargeTypePenalty}
                                                        onChange={(e) => setNewChargeTypePenalty(parseInt(e.target.value, 10))}
                                                        placeholder="Ej: 1"
                                                        className="text-center"
                                                    />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button variant="outline" onClick={() => setNewChargeTypeOpen(false)}>
                                                    Cancelar
                                                </Button>
                                                <Button onClick={handleCreateChargeType}>Crear Tipo de Cargo</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nombre</TableHead>
                                            <TableHead>Penalización</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {chargeTypes.map((chargeType) => (
                                            <TableRow key={chargeType.chargeId}>
                                                <TableCell className="font-medium">{chargeType.name}</TableCell>
                                                <TableCell>{chargeType.penalty || "Sin descripción"}</TableCell>
                                                {canManageChargeTypes() && (
                                                    <TableCell>
                                                        <Button
                                                            className="text-destructive focus:text-destructive"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                setChargeTypeToDelete(chargeType.chargeId);
                                                            }}
                                                        >
                                                            <Trash/>
                                                        </Button>
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        ))}
                                        {chargeTypes.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center py-8">
                                                    No se han encontrado tipos de cargos
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        <AlertDialog open={!!chargeTypeToDelete}
                                     onOpenChange={(open) => !open && setChargeTypeToDelete(null)}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Eliminar Tipo de Cargo</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Estas seguro de querer eliminar este tipo de cargo? Esta acción no se puede
                                        deshacer.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => {
                                            if (chargeTypeToDelete) {
                                                deleteChargeTypeMutation.mutate(chargeTypeToDelete);
                                                setChargeTypeToDelete(null);
                                            }
                                        }}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </TabsContent>
                </Tabs>


                {/* Edit Carrier Dialog */}
                <Dialog open={editCarrierOpen} onOpenChange={setEditCarrierOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Editar Transportista</DialogTitle>
                            <DialogDescription>
                                Modifica la información del transportista {editingCarrier?.name}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-carrier-name">Nombre</Label>
                                <Input
                                    id="edit-carrier-name"
                                    value={editCarrierData.name}
                                    onChange={(e) => setEditCarrierData({...editCarrierData, name: e.target.value})}
                                    placeholder="Nombre del transportista"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-carrier-rfc">RFC</Label>
                                <Input
                                    id="edit-carrier-rfc"
                                    value={editCarrierData.rfc}
                                    onChange={(e) => setEditCarrierData({...editCarrierData, rfc: e.target.value})}
                                    placeholder="RFC (10 caracteres)"
                                    maxLength={10}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-carrier-razonSocial">Razón Social</Label>
                                <Input
                                    id="edit-carrier-razonSocial"
                                    value={editCarrierData.razonSocial}
                                    onChange={(e) => setEditCarrierData({...editCarrierData, razonSocial: e.target.value})}
                                    placeholder="Razón social"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-carrier-caat">CAAT</Label>
                                <Input
                                    id="edit-carrier-caat"
                                    value={editCarrierData.caat}
                                    onChange={(e) => setEditCarrierData({...editCarrierData, caat: e.target.value})}
                                    placeholder="CAAT (4 caracteres)"
                                    maxLength={4}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setEditCarrierOpen(false)}>
                                Cancelar
                            </Button>
                            <Button onClick={handleUpdateCarrier}>Actualizar Transportista</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Edit User Roles Dialog */}
                <Dialog open={editUserOpen} onOpenChange={setEditUserOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Editar Roles de Usuario</DialogTitle>
                            <DialogDescription>
                                Modifica los roles asignados a {selectedUser?.username}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Roles Disponibles</Label>
                                <div className="space-y-2">
                                    {roles.map((role) => (
                                        <div key={role.roleId} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`edit-role-${role.roleId}`}
                                                checked={selectedUser?.roles.includes(role.name) || false}
                                                onCheckedChange={(checked) => {
                                                    if (selectedUser) {
                                                        const newRoles = checked
                                                            ? [...selectedUser.roles, role.name]
                                                            : selectedUser.roles.filter(r => r !== role.name);
                                                        setSelectedUser({...selectedUser, roles: newRoles});
                                                    }
                                                }}
                                            />
                                            <Label htmlFor={`edit-role-${role.roleId}`}
                                                   className="capitalize cursor-pointer">
                                                {role.name}
                                                {role.description && (
                                                    <span className="text-muted-foreground text-sm ml-2">
                                                     ({role.description})
                                                 </span>
                                                )}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setEditUserOpen(false)}>
                                Cancelar
                            </Button>
                            <Button onClick={() => handleUpdateUserRoles(selectedUser?.roles || [])}>
                                Guardar Cambios
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Change Role Dialog */}
                <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Cambiar Roles</DialogTitle>
                            <DialogDescription>
                                Modifica los roles de {selectedUserForRole?.username}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Roles Disponibles</Label>
                                <div className="space-y-2">
                                    {roles.map((role) => (
                                        <div key={role.roleId} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`role-${role.roleId}`}
                                                checked={selectedUserForRole?.roles.includes(role.name) || false}
                                                onCheckedChange={async (checked) => {
                                                    if (selectedUserForRole) {
                                                        try {
                                                            if (checked) {
                                                                await roleService.assignRole(selectedUserForRole.userId, role.name);
                                                            } else {
                                                                await roleService.removeRole(selectedUserForRole.userId, role.name);
                                                            }

                                                            // Update local state
                                                            const newRoles = checked
                                                                ? [...selectedUserForRole.roles, role.name]
                                                                : selectedUserForRole.roles.filter(r => r !== role.name);

                                                            setSelectedUserForRole({
                                                                ...selectedUserForRole,
                                                                roles: newRoles
                                                            });
                                                            queryClient.invalidateQueries({queryKey: ['users']});

                                                            toast({
                                                                title: "Rol actualizado",
                                                                description: `Rol ${role.name} ${checked ? 'asignado' : 'removido'} exitosamente.`,
                                                            });
                                                        } catch (error) {
                                                            console.error("Error updating role:", error);
                                                            toast({
                                                                title: "Error",
                                                                description: "Error al actualizar el rol.",
                                                                variant: "destructive",
                                                            });
                                                        }
                                                    }
                                                }}
                                            />
                                            <Label htmlFor={`role-${role.roleId}`} className="capitalize cursor-pointer">
                                                {role.name}
                                                {role.description && (
                                                    <span className="text-muted-foreground text-sm ml-2">
                                                     ({role.description})
                                                 </span>
                                                )}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={() => {
                                setRoleDialogOpen(false);
                                setSelectedUserForRole(null);
                            }}>
                                Cerrar
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete User Confirmation Dialog */}
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Seguro de eliminar usuario?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta accion no se puede deshacer. Esto va a eliminar permanentemente al usuario
                                {userToDelete && ` ${userToDelete.username}`} y todos sus datos.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setUserToDelete(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDeleteUser}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        )
            ;
    }
;

export default AdminDashboard;