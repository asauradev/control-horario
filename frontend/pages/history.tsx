import { useEffect, useState, useContext } from "react";
import { getHistory } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "next/router";

interface WorkLog {
  id: string;
  startTime: string;
  endTime?: string;
  breaks: number;
  breakTime: number;
  workDuration: number;
}

const HistoryPage = () => {
  //const [history, setHistory] = useState([]);
  const [history, setHistory] = useState<WorkLog[]>([]);
  const authContext = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!authContext?.token) {
      router.push("/login");
      return;
    }

    const fetchHistory = async () => {
      const response = await getHistory();
      if (response.success) {
        setHistory(response.history);
      } else {
        alert("❌ Error al obtener el historial.");
      }
    };

    fetchHistory();
  }, [authContext?.token, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Historial de Jornadas</h1>
      {history.length === 0 ? (
        <p className="text-lg text-gray-600">No hay registros de jornadas.</p>
      ) : (
        <div className="overflow-x-auto w-full max-w-4xl">
          <table className="w-full bg-white shadow-lg rounded-lg border border-gray-300">
            <thead className="bg-gray-800 text-white uppercase text-sm">
              <tr>
                <th className="p-3 text-left">Fecha</th>
                <th className="p-3 text-left">Hora de Inicio</th>
                <th className="p-3 text-left">Hora de Fin</th>
                <th className="p-3 text-left">Descansos</th>
                <th className="p-3 text-left">Tiempo de Descanso</th>
                <th className="p-3 text-left">Tiempo Trabajado</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {history.map((log, index) => (
                <tr
                  key={log.id}
                  className={`border-b border-gray-300 ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } hover:bg-gray-200 transition`}
                >
                  <td className="p-4 font-medium">{new Date(log.startTime).toLocaleDateString()}</td>
                  <td className="p-4">{new Date(log.startTime).toLocaleTimeString()}</td>
                  <td className="p-4">
                    {log.endTime ? new Date(log.endTime).toLocaleTimeString() : "En curso"}
                  </td>
                  <td className="p-4 text-center">{log.breaks}</td>
                  <td className="p-4 text-center font-semibold text-yellow-600">
                    {(log.breakTime / 60000).toFixed(2)} min
                  </td>
                  <td className="p-4 text-center font-semibold text-green-600">
                    {(log.workDuration / 60000).toFixed(2)} min
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;