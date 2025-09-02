import {useState, useEffect, useCallback} from "react";
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
    XCircle
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
import {useToast} from "@/hooks/use-toast";
import {carrierService, Carrier, CreateCarrierRequest} from "@/services/api/carrierService";
import {roleService, Role, RoleCreationRequest} from "@/services/api/roleService";
import {authService, userService} from "@/services/api";
import {ViazUserDTO, UserStatus} from "@/types/api";
import {format} from "date-fns";
import {Switch} from "@/components/ui/switch.tsx";

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
    const [isLoading, setIsLoading] = useState(true);

    // Role management state
    const [newRoleOpen, setNewRoleOpen] = useState(false);
    const [newRoleName, setNewRoleName] = useState("");
    const [newRoleDescription, setNewRoleDescription] = useState("");
    const [isRoleCosmetic, setIsRoleCosmetic] = useState(false);
    const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());
    const [availablePermissions, setAvailablePermissions] = useState<string[]>([]);
    const [roleDialogOpen, setRoleDialogOpen] = useState(false);
    const [selectedUserForRole, setSelectedUserForRole] = useState<ViazUserDTO | null>(null);

    // State for data
    const [carriers, setCarriers] = useState<Carrier[]>([]);
    const [users, setUsers] = useState<ViazUserDTO[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);

    const [newCarrier, setNewCarrier] = useState({
        name: '',
        rfc: '',
        razonSocial: '',
        caat: ''
    });

    // Filtered users for search
    const filteredUsers = users.filter(
        (user) =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.roles.some(role => role.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const fetchedUsers = await userService.getAllUsers();
            setUsers(fetchedUsers);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast({
                title: "Error",
                description: "Failed to load users. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }, [setIsLoading, setUsers, toast]);


    const fetchCarriers = useCallback(async () => {
        try {
            const fetchedCarriers = await carrierService.getAllCarriers();
            setCarriers(fetchedCarriers || []); // Ensure carriers is always an array
        } catch (error) {
            console.error("Error fetching carriers:", error);
            // Don't show error for carriers as they might not be implemented yet
        }
    }, [setCarriers]);

    const fetchRoles = useCallback(async () => {
        try {
            const fetchedRoles = await roleService.getAllRoles();
            setRoles(fetchedRoles || []);
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    }, [setRoles]);


    const fetchPermissions = useCallback(async () => {
        try {
            const permissions = await roleService.getAllPermissions();
            console.log("Permissions:", permissions);
            setAvailablePermissions(permissions || []);
        } catch (error) {
            console.error("Error fetching permissions:", error);
        }
    }, [setAvailablePermissions]);

    // Fetch data on component mount
    useEffect(() => {
        fetchUsers();
        fetchCarriers();
        fetchRoles();
        fetchPermissions();
    }, [fetchUsers, fetchCarriers, fetchRoles, fetchPermissions]);

    const handleCreateCarrier = async () => {
        try {
            const carrierData: CreateCarrierRequest = {
                name: newCarrier.name,
                rfc: newCarrier.rfc,
                caat: newCarrier.caat,
                razonSocial: newCarrier.razonSocial
            };
            await carrierService.createCarrier(carrierData);
            setNewCarrier({caat: "", razonSocial: "", rfc: "", name: ''});
            setNewCarrierOpen(false);
            fetchCarriers(); // Refresh carriers list
            toast({
                title: "Transportista creado",
                description: "El transportista ha sido creado exitosamente.",
            });
        } catch (error) {
            console.error("Error creating carrier:", error);
            toast({
                title: "Error",
                description: "Error al crear el transportista.",
                variant: "destructive",
            });
        }
    };

    const handleDeleteCarrier = async (id: string) => {
        try {
            await carrierService.deleteCarrier(id);
            fetchCarriers(); // Refresh carriers list
            toast({
                title: "Transportista eliminado",
                description: "El transportista ha sido eliminado exitosamente.",
            });
        } catch (error) {
            console.error("Error deleting carrier:", error);
            toast({
                title: "Error",
                description: "Error al eliminar el transportista.",
                variant: "destructive",
            });
        }
    };

    const handleDeleteUser = async () => {
        if (!userToDelete?.userId) return;

        try {
            await userService.deleteUser(userToDelete.userId);

            toast({
                title: "User Deleted",
                description: `User ${userToDelete.username} has been deleted.`,
            });

            fetchUsers(); // Refresh the user list
        } catch (error) {
            console.error("Error deleting user:", error);
            toast({
                title: "Error",
                description: "Failed to delete user. Please try again.",
                variant: "destructive",
            });
        } finally {
            setDeleteDialogOpen(false);
            setUserToDelete(null);
        }
    };

    const handleInvite = async () => {
        if (inviteEmail && inviteRole) {
            try {
                setIsInviting(true);
                const userData: ViazUserDTO = {
                    userId: 0,
                    username: inviteUsername || inviteEmail.split('@')[0],
                    email: inviteEmail,
                    roles: [inviteRole],
                    status: UserStatus.PENDING
                };

                await authService.register(userData);

                toast({
                    title: "Invitation Sent",
                    description: `An invitation has been sent to ${inviteEmail}`,
                });

                fetchUsers(); // Refresh user list

                // Reset form and close dialog
                setInviteEmail("");
                setInviteUsername("");
                setInviteRole("");
                setInviteDialogOpen(false);
            } catch (error) {
                console.error("Error sending invitation:", error);
                toast({
                    title: "Error",
                    description: "Failed to send invitation. Please try again.",
                    variant: "destructive",
                });
            } finally {
                setIsInviting(false);
            }
        }
    };

    const handleEditUser = (user: ViazUserDTO) => {
        setSelectedUser(user);
        setEditUserOpen(true);
    };

    const handleUpdateUserRoles = async (newRoles: string[]) => {
        if (selectedUser) {
            try {
                // Get current roles and determine changes
                const currentRoles = selectedUser.roles;
                const rolesToAdd = newRoles.filter(role => !currentRoles.includes(role));
                const rolesToRemove = currentRoles.filter(role => !newRoles.includes(role));

                // Add new roles
                for (const role of rolesToAdd) {
                    await roleService.assignRole(selectedUser.userId, role);
                }

                // Remove old roles
                for (const role of rolesToRemove) {
                    await roleService.removeRole(selectedUser.userId, role);
                }

                // Update local state
                setUsers(users.map(u =>
                    u.userId === selectedUser.userId
                        ? {...u, roles: newRoles}
                        : u
                ));
                setEditUserOpen(false);
                setSelectedUser(null);
                toast({
                    title: "Roles actualizados",
                    description: "Los roles del usuario han sido actualizados exitosamente.",
                });
            } catch (error) {
                console.error("Error updating user roles:", error);
                toast({
                    title: "Error",
                    description: "Error al actualizar los roles del usuario.",
                    variant: "destructive",
                });
            }
        }
    };

    const handleCreateRole = async () => {
        if (!newRoleName.trim()) return;

        try {
            const roleData: RoleCreationRequest = {
                name: newRoleName,
                description: newRoleDescription || undefined,
                permissions: selectedPermissions.size > 0 ? selectedPermissions : undefined,
                cosmetic: isRoleCosmetic
            };
            await roleService.createRole(roleData);
            setNewRoleName("");
            setNewRoleDescription("");
            setSelectedPermissions(new Set());
            setNewRoleOpen(false);
            fetchRoles(); // Refresh roles list
            toast({
                title: "Rol creado",
                description: "El rol ha sido creado exitosamente.",
            });
        } catch (error) {
            console.error("Error creating role:", error);
            toast({
                title: "Error",
                description: "Error al crear el rol.",
                variant: "destructive",
            });
        }
    };

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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Panel de Administración</h1>
                    <p className="text-muted-foreground">Gestiona transportistas, usuarios y configuraciones del
                        sistema</p>
                </div>
            </div>

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
                                        </div>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="rfc">RFC</Label>
                                                <Input
                                                    id="rfc"
                                                    value={newCarrier.name}
                                                    onChange={(e) => setNewCarrier({
                                                        ...newCarrier,
                                                        name: e.target.value
                                                    })}
                                                    placeholder="Nombre del transportista"
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
                                        <TableHead>Estado</TableHead>
                                        <TableHead className="w-[70px]">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {carriers.map((carrier) => (
                                        <TableRow key={carrier.id}>
                                            <TableCell className="font-medium">{carrier.name}</TableCell>
                                            <TableCell>
                                                <Badge variant={carrier.status === 'active' ? 'default' : 'secondary'}>
                                                    {carrier.status === 'active' ? 'Activo' : 'Inactivo'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <MoreHorizontal className="h-4 w-4"/>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>
                                                            <Edit className="mr-2 h-4 w-4"/>
                                                            Editar
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-destructive"
                                                            onClick={() => handleDeleteCarrier(carrier.id)}
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
                                        {isLoading ? (
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
                                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                <DropdownMenuSeparator/>
                                                                <DropdownMenuItem onClick={() => handleEditUser(user)}>Edit
                                                                    User</DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => handleChangeRole(user)}>Change
                                                                    Role</DropdownMenuItem>
                                                                {user.status === UserStatus.PENDING ? (
                                                                    <>
                                                                        <DropdownMenuItem>
                                                                            <CheckCircle
                                                                                className="mr-2 h-4 w-4 text-green-500"/>
                                                                            Approve
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem>
                                                                            <XCircle
                                                                                className="mr-2 h-4 w-4 text-red-500"/>
                                                                            Reject
                                                                        </DropdownMenuItem>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        {user.status === UserStatus.ACTIVE ? (
                                                                            <DropdownMenuItem>Deactivate</DropdownMenuItem>
                                                                        ) : (
                                                                            <DropdownMenuItem>Activate</DropdownMenuItem>
                                                                        )}
                                                                        <DropdownMenuSeparator/>
                                                                        <DropdownMenuItem
                                                                            className="text-red-500"
                                                                            onClick={() => {
                                                                                setUserToDelete(user);
                                                                                setDeleteDialogOpen(true);
                                                                            }}
                                                                        >
                                                                            Remove User
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
                                                <Label htmlFor="roleDescription">Descripción (Opcional)</Label>
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
                                        <TableHead>ID</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {roles.map((role) => (
                                        <TableRow key={role.roleId}>
                                            <TableCell className="font-medium">{role.name}</TableCell>
                                            <TableCell>{role.description || "Sin descripción"}</TableCell>
                                            <TableCell className="text-muted-foreground">{role.roleId}</TableCell>
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
                </TabsContent>
            </Tabs>

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
                                                        setUsers(users.map(u =>
                                                            u.userId === selectedUserForRole.userId
                                                                ? {...u, roles: newRoles}
                                                                : u
                                                        ));

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
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the user
                            {userToDelete && ` ${userToDelete.username}`} and remove their data from the system.
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
    );
};

export default AdminDashboard;