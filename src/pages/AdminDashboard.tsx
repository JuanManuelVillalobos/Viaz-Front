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
import {authService, userService} from "@/services/api";
import {ViazUserDTO, UserStatus} from "@/types/api";
import {format} from "date-fns";

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

    // State for data
    const [carriers, setCarriers] = useState<Carrier[]>([]);
    const [users, setUsers] = useState<ViazUserDTO[]>([]);

    const [newCarrier, setNewCarrier] = useState({
        name: ''
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

    // Fetch data on component mount
    useEffect(() => {
        fetchUsers();
        fetchCarriers();
    }, [fetchUsers, fetchCarriers]);

    const handleCreateCarrier = async () => {
        try {
            const carrierData: CreateCarrierRequest = {
                name: newCarrier.name
            };
            await carrierService.createCarrier(carrierData);
            setNewCarrier({name: ''});
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

    const handleUpdateUserRoles = (newRoles: string[]) => {
        if (selectedUser) {
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
        }
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

    const availableRoles = ['ADMIN', 'MANAGER', 'OPERATOR', 'USER'];

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
                                                            <SelectItem value="ADMIN">Admin</SelectItem>
                                                            <SelectItem value="MANAGER">Manager</SelectItem>
                                                            <SelectItem value="OPERATOR">Operator</SelectItem>
                                                            <SelectItem value="USER">User</SelectItem>
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
                                                                <DropdownMenuItem>Change Role</DropdownMenuItem>
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
                            <CardTitle>Configuraciones del Sistema</CardTitle>
                            <CardDescription>Configura parámetros generales del sistema</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Configuraciones del sistema próximamente...</p>
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
                                {availableRoles.map((role) => (
                                    <div key={role} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id={role}
                                            checked={selectedUser?.roles.includes(role) || false}
                                            onChange={(e) => {
                                                if (selectedUser) {
                                                    const newRoles = e.target.checked
                                                        ? [...selectedUser.roles, role]
                                                        : selectedUser.roles.filter(r => r !== role);
                                                    setSelectedUser({...selectedUser, roles: newRoles});
                                                }
                                            }}
                                            className="rounded border border-input"
                                        />
                                        <Label htmlFor={role} className="capitalize">{role}</Label>
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