import { ChangeEvent, useState } from "react";

import { Button } from "@/components/ui/button"; // Suponiendo que usas Button de shadcn
import { Input } from "@/components/ui/input";

interface FormData {
  email: string;
  password: string;
}

function Login() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  function fnLogin() {
    localStorage.setItem("user", JSON.stringify({ email: formData.email, password: formData.password, role: "admin" }));
    window.location.href = "/";
  }

  return (
    <>
      <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-indigo-900 via-blue-900 to-primary opacity-90"></div>
      <div className="relative flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="z-10 w-full max-w-md space-y-8 rounded-lg bg-white/90 p-8 shadow-lg">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Bienvenido</h2>
            <p className="mt-2 text-sm text-gray-600">Inicia sesión para continuar</p>
          </div>
          <form className="mt-8 space-y-6">
            <div className="space-y-4">
              <Input
                placeholder="Correo"
                type="text"
                id="email"
                name="email"
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                value={formData.email}
                onChange={handleChange}
              />
              <Input
                placeholder="Contraseña"
                type="password"
                id="password"
                name="password"
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <Button onClick={() => fnLogin()} type="button" className="hover:bg-primary-dark w-full rounded-md bg-primary px-4 py-2 font-semibold text-white">
              Iniciar sesión
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
