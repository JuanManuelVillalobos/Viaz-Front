import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Truck, Users, Settings } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Carrier {
  id: string;
  name: string;
  type: 'maritime' | 'terrestrial';
  contact: string;
  email: string;
  status: 'active' | 'inactive';
}

interface UserRole {
  userId: string;
  username: string;
  email: string;
  roles: string[];
  status: 'active' | 'pending';
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const [newCarrierOpen, setNewCarrierOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRole | null>(null);

  // Mock data - replace with actual API calls
  const [carriers, setCarriers] = useState<Carrier[]>([
    { id: '1', name: 'Naviera Global', type: 'maritime', contact: '+52 123 456 7890', email: 'contact@navieraglobal.com', status: 'active' },
    { id: '2', name: 'Transportes Terrestres SA', type: 'terrestrial', contact: '+52 098 765 4321', email: 'info@transportesterrestres.com', status: 'active' },
  ]);

  const [users, setUsers] = useState<UserRole[]>([
    { userId: '1', username: 'juan.perez', email: 'juan@viaz.com', roles: ['admin', 'user'], status: 'active' },
    { userId: '2', username: 'maria.garcia', email: 'maria@viaz.com', roles: ['user'], status: 'active' },
    { userId: '3', username: 'carlos.lopez', email: 'carlos@viaz.com', roles: ['manager'], status: 'pending' },
  ]);

  const [newCarrier, setNewCarrier] = useState({
    name: '',
    type: 'maritime' as 'maritime' | 'terrestrial',
    contact: '',
    email: ''
  });

  const handleCreateCarrier = () => {
    const carrier: Carrier = {
      id: Date.now().toString(),
      ...newCarrier,
      status: 'active'
    };
    setCarriers([...carriers, carrier]);
    setNewCarrier({ name: '', type: 'maritime', contact: '', email: '' });
    setNewCarrierOpen(false);
    toast({
      title: "Transportista creado",
      description: "El transportista ha sido creado exitosamente.",
    });
  };

  const handleDeleteCarrier = (id: string) => {
    setCarriers(carriers.filter(c => c.id !== id));
    toast({
      title: "Transportista eliminado",
      description: "El transportista ha sido eliminado exitosamente.",
    });
  };

  const handleEditUser = (user: UserRole) => {
    setSelectedUser(user);
    setEditUserOpen(true);
  };

  const handleUpdateUserRoles = (newRoles: string[]) => {
    if (selectedUser) {
      setUsers(users.map(u => 
        u.userId === selectedUser.userId 
          ? { ...u, roles: newRoles }
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

  const availableRoles = ['admin', 'manager', 'user', 'viewer', 'customer_service'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <p className="text-muted-foreground">Gestiona transportistas, usuarios y configuraciones del sistema</p>
        </div>
      </div>

      <Tabs defaultValue="carriers" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="carriers" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Transportistas
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Gestión de Usuarios
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configuraciones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="carriers" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Transportistas</CardTitle>
                  <CardDescription>Gestiona todos los transportistas y sus información</CardDescription>
                </div>
                <Dialog open={newCarrierOpen} onOpenChange={setNewCarrierOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
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
                          onChange={(e) => setNewCarrier({...newCarrier, name: e.target.value})}
                          placeholder="Nombre del transportista"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="type">Tipo</Label>
                        <Select
                          value={newCarrier.type}
                          onValueChange={(value: 'maritime' | 'terrestrial') => setNewCarrier({...newCarrier, type: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="maritime">Marítimo</SelectItem>
                            <SelectItem value="terrestrial">Terrestre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="contact">Teléfono</Label>
                        <Input
                          id="contact"
                          value={newCarrier.contact}
                          onChange={(e) => setNewCarrier({...newCarrier, contact: e.target.value})}
                          placeholder="+52 123 456 7890"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newCarrier.email}
                          onChange={(e) => setNewCarrier({...newCarrier, email: e.target.value})}
                          placeholder="email@ejemplo.com"
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
                    <TableHead>Tipo</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="w-[70px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {carriers.map((carrier) => (
                    <TableRow key={carrier.id}>
                      <TableCell className="font-medium">{carrier.name}</TableCell>
                      <TableCell>
                        <Badge variant={carrier.type === 'maritime' ? 'default' : 'secondary'}>
                          {carrier.type === 'maritime' ? 'Marítimo' : 'Terrestre'}
                        </Badge>
                      </TableCell>
                      <TableCell>{carrier.contact}</TableCell>
                      <TableCell>{carrier.email}</TableCell>
                      <TableCell>
                        <Badge variant={carrier.status === 'active' ? 'default' : 'secondary'}>
                          {carrier.status === 'active' ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDeleteCarrier(carrier.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
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
            <CardHeader>
              <CardTitle>Gestión de Roles de Usuario</CardTitle>
              <CardDescription>Asigna y modifica roles de usuarios en el sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="w-[70px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.userId}>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {user.roles.map((role) => (
                            <Badge key={role} variant="outline">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                          {user.status === 'active' ? 'Activo' : 'Pendiente'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
    </div>
  );
};

export default AdminDashboard;