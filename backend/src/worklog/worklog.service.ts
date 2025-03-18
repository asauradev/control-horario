import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class WorklogService {
  constructor(private prisma: PrismaService) {}

  async startWork(userId: string) {
    return this.prisma.workLog.create({
      data: {
        userId,
        startTime: new Date(),
        breaks: 0,
        breakTime: 0,
        workDuration: 0
      },
    });
  }

  async pauseWork(userId: string) {
    // Obtener la jornada laboral activa
    const workLog = await this.prisma.workLog.findFirst({
      where: { userId, endTime: null },
      orderBy: { startTime: "desc" },
    });

    if (!workLog) {
      throw new Error("No hay una jornada activa para pausar.");
    }

    const now = new Date();
    return this.prisma.workLog.update({
      where: { id: workLog.id },
      data: {
        breaks: workLog.breaks + 1,
        breakTime: workLog.breakTime + (now.getTime() - new Date(workLog.startTime).getTime()), // Calcula el tiempo de descanso acumulado
      },
    });
  }

  async endWork(userId: string) {
    return this.prisma.workLog.updateMany({
      where: { userId, endTime: null },
      data: { endTime: new Date() },
    });
  }

  async getHistory(userId: string) {
    console.log("📜 Obteniendo historial de jornadas para:", userId);
  
    const history = await this.prisma.workLog.findMany({
      where: { userId },
      orderBy: { startTime: "desc" }, // ✅ Ordenar por fecha descendente
      select: {
        id: true,
        startTime: true,
        endTime: true,
        breaks: true,
        breakTime: true,
        workDuration: true,
      },
    });
  
    console.log("✅ Historial encontrado:", history);
    return history;
  }

  async resumeWork(userId: string) {
    console.log("🔍 Buscando jornada activa para el usuario:", userId);

    const workLog = await this.prisma.workLog.findFirst({
      where: { userId, endTime: null },
      orderBy: { startTime: "desc" },
    });

    console.log("✅ Jornada encontrada:", workLog);
  
    if (!workLog) {
      console.error("❌ No hay una jornada activa para reanudar.");
      throw new Error("No hay una jornada activa para reanudar.");
    }
  
    return this.prisma.workLog.update({
      where: { id: workLog.id },
      data: {
        startTime: new Date(), // 👈 Reanuda el tiempo de trabajo
      },
    });
  }

  async finishWork(userId: string) {
    console.log("🔍 Intentando finalizar jornada para el usuario:", userId);
  
    const workLog = await this.prisma.workLog.findFirst({
      where: { userId, endTime: null },
      orderBy: { startTime: "desc" },
    });
  
    console.log("✅ Jornada encontrada para finalizar:", workLog);
  
    if (!workLog) {
      console.error("❌ No hay una jornada activa para finalizar.");
      throw new Error("No hay una jornada activa para finalizar.");
    }
  
    const now = new Date();
    const totalWorkedTime = now.getTime() - new Date(workLog.startTime).getTime() - workLog.breakTime;
  
    console.log(`🕒 Calculando tiempo trabajado: ${totalWorkedTime} ms`);
  
    const updatedWorkLog = await this.prisma.workLog.update({
      where: { id: workLog.id },
      data: {
        endTime: now,
        workDuration: totalWorkedTime, // ✅ Guardar el tiempo total trabajado
      },
    });
  
    console.log("✅ Jornada finalizada y actualizada en la base de datos:", updatedWorkLog);
    return updatedWorkLog;
  }    
}

