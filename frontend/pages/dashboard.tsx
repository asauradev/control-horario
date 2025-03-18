import { useContext, useState, useEffect  } from "react";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "next/router";
import { startWork, pauseWork, resumeWork, finishWork } from "../services/authService";

const Dashboard = () => {
  const authContext = useContext(AuthContext);
  const [workStarted, setWorkStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const router = useRouter();

 // ✅ Solo redirecciona en el cliente
 useEffect(() => {
  if (!authContext?.token) {
    router.push("/login");
  }
}, [authContext?.token, router]);

if (!authContext?.token) {
  return null; // ✅ Evita errores durante la renderización en SSR
}

  const handleStartWork = async () => {
    const response = await startWork();
    if (response.success) {
      setWorkStarted(true);
      alert("✅ Jornada iniciada correctamente.");
    } else {
      alert("❌ Error al iniciar la jornada.");
    }
  };

  const handlePauseWork = async () => {
    const response = await pauseWork();
    if (response.success) {
      setIsPaused(true);
      alert("⏸ Jornada pausada correctamente.");
    } else {
      alert("❌ Error al pausar la jornada.");
    }
  };

  const handleResumeWork = async () => {
    const response = await resumeWork();
    if (response.success) {
      setIsPaused(false);
      alert("▶ Jornada reanudada correctamente.");
    } else {
      alert("❌ Error al reanudar la jornada.");
    }
  };

  const handleFinishWork = async () => {
    console.log("🖱 Botón 'Finalizar Jornada' presionado.");
    const response = await finishWork();
    if (response.success) {
      console.log("✅ Jornada finalizada correctamente.");
      setWorkStarted(false);
      setIsPaused(false);
      alert("✅ Jornada finalizada correctamente.");
    } else {
      console.error("❌ Error al finalizar la jornada:", response.message);
      alert("❌ Error al finalizar la jornada: " + response.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-4">Control horario</h1>
      {!workStarted && (
        <button onClick={handleStartWork} className="bg-blue-500 text-white p-2 mt-4">
          Iniciar Jornada
        </button>
      )}
      {workStarted && !isPaused && (
        <button onClick={handlePauseWork} className="bg-yellow-500 text-white p-2 mt-4">
          Pausar Jornada
        </button>
      )}
      {workStarted && isPaused && (
        <button onClick={handleResumeWork} className="bg-green-500 text-white p-2 mt-4">
          Reanudar Jornada
        </button>
      )}
      {workStarted && (
        <button onClick={handleFinishWork} className="bg-red-500 text-white p-2 mt-4">
          Finalizar Jornada
        </button>
      )}
      <button onClick={() => router.push("/history")} className="bg-gray-500 text-white p-2 mt-4">
        Ver Historial
      </button>

    </div>
  );
};

export default Dashboard;


/*
const Dashboard = () => {
  const authContext = useContext(AuthContext);
  const [workStarted, setWorkStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const router = useRouter();

  if (!authContext?.token) {
    router.push("/login");
    return null;
  }

  const startWork = async () => {
    const response = await fetch("http://localhost:3000/worklog/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authContext.token}`,
      },
    });

    if (response.ok) {
      setWorkStarted(true);
      alert("✅ Jornada iniciada correctamente.");
    } else {
      alert("❌ Error al iniciar la jornada.");
    }
  };

  const pauseWork = async () => {
    const response = await fetch("http://localhost:3000/worklog/pause", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authContext.token}`,
      },
    });

    if (response.ok) {
      setIsPaused(true);
      alert("⏸ Jornada pausada correctamente.");
    } else {
      alert("❌ Error al pausar la jornada.");
    }
  };

  return (
    <div>
      <h1>Bienvenido al Dashboard</h1>
      <p>Solo puedes ver esto si has iniciado sesión.</p>
      {!workStarted && (
        <button onClick={startWork} className="bg-blue-500 text-white p-2 mt-4">
          Iniciar Jornada
        </button>
      )}
      {workStarted && !isPaused && (
        <button onClick={pauseWork} className="bg-yellow-500 text-white p-2 mt-4">
          Pausar Jornada
        </button>
      )}
    </div>
  );
};

export default Dashboard;
*/

/*
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/router";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) router.push("/login");
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-xl font-bold">Bienvenido, {user?.email}</h2>
      <button onClick={() => signOut(auth)} className="mt-4 p-2 bg-red-500 text-white">
        Cerrar Sesión
      </button>
    </div>
  );
}*/

