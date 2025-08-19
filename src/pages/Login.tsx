import {useState} from "react";
import {useNavigate, Link} from "react-router-dom";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {LogIn, Mail, LockKeyhole} from "lucide-react";
import {toast} from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            toast({
                title: "Error",
                description: "Por favor ingresa email y contraseña",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            await login({ email, password });
            navigate("/");
        } catch (error) {
            // Error handling is done in the AuthContext
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-4">
                        <div
                            className="h-12 w-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                            <LogIn className="h-6 w-6"/>
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Inicio de Sesión</CardTitle>
                    <CardDescription className="text-center">
                        Ingresa las credenciales para acceder a tu cuenta
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    className="pl-8"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Contraseña</Label>
                                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>
                            <div className="relative">
                                <LockKeyhole className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                                <Input
                                    id="password"
                                    type="password"
                                    className="pl-8"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Iniciando Sesión..." : "Iniciar Sesión"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center">
                    <div className="text-sm text-muted-foreground">
                        ¿No tienes acceso a tu cuenta? Contacta a tu administrador
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Login;
