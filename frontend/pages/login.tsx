import { useState, useContext } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "../context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const authContext = useContext(AuthContext);
  const router = useRouter();

  if (!authContext) return <p>Error: AuthContext no está disponible.</p>;

  const { loginUser } = authContext;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await loginUser(email, password);
    if (success) {
      router.push("/dashboard");
    } else {
      alert("Error en el login, revisa tus credenciales.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-4">Iniciar Sesión</h1>
      <form onSubmit={handleLogin} className="flex flex-col space-y-4">
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
};

export default LoginPage;

