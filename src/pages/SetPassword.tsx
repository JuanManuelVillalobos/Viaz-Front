import {useState} from "react";
import {useSearchParams, useNavigate} from "react-router-dom";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Eye, EyeOff, LockKeyhole} from "lucide-react";
import {apiAuthService} from "@/services/api";
import {useToast} from "@/hooks/use-toast";

const setPasswordSchema = z
    .object({
        password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
        confirmPassword: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
    });

type SetPasswordForm = z.infer<typeof setPasswordSchema>;

const SetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const {toast} = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const token = searchParams.get("token");
    const email = searchParams.get("email");

    const form = useForm<SetPasswordForm>({
        resolver: zodResolver(setPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: SetPasswordForm) => {
        if (!token || !email) {
            toast({
                title: "Error",
                description: "El enlace de restablecimiento no es válido.",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        try {
            await apiAuthService.setPassword(email, data.password, token);
            toast({
                title: "Éxito",
                description: "Tu contraseña se ha actualizado. Ahora puedes iniciar sesión.",
            });
            navigate("/login");
        } catch (error) {
            toast({
                title: "Error",
                description: "No se pudo actualizar la contraseña. Intenta nuevamente.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    if (!token || !email) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background px-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold text-red-600">Enlace inválido</CardTitle>
                        <CardDescription>
                            El enlace ha expirado o no es válido. Solicita un nuevo restablecimiento.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => navigate("/forgot-password")} className="w-full">
                            Solicitar nuevo enlace
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-4">
                        <div
                            className="h-12 w-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                            <LockKeyhole className="h-6 w-6"/>
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Restablecer Contraseña</CardTitle>
                    <CardDescription className="text-center">
                        Ingresa una nueva contraseña para {email}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({field}) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel>Nueva contraseña</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    {...field}
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Ingresa tu nueva contraseña"
                                                    disabled={loading}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    disabled={loading}
                                                >
                                                    {showPassword ? <EyeOff className="h-4 w-4"/> :
                                                        <Eye className="h-4 w-4"/>}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({field}) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel>Confirmar contraseña</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    {...field}
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    placeholder="Confirma tu nueva contraseña"
                                                    disabled={loading}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    disabled={loading}
                                                >
                                                    {showConfirmPassword ? (
                                                        <EyeOff className="h-4 w-4"/>
                                                    ) : (
                                                        <Eye className="h-4 w-4"/>
                                                    )}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Guardando..." : "Guardar contraseña"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="justify-center">
                    <div className="text-sm text-muted-foreground">
                        ¿Tienes problemas? Contacta a tu administrador.
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default SetPassword;
