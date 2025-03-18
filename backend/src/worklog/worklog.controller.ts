import { Controller, Get, Post, UseGuards, Req } from "@nestjs/common";
import { WorklogService } from "./worklog.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller("worklog")
export class WorklogController {
  constructor(private worklogService: WorklogService) {}

  @UseGuards(JwtAuthGuard)
  @Get("history") // ✅ Obtener historial de jornadas
  async getHistory(@Req() req) {
    const userId = req.user.id;
    return this.worklogService.getHistory(userId);
  }

  @UseGuards(JwtAuthGuard) // 🔒 Protegemos la ruta con JWT
  @Post("start")
  async startWork(@Req() req) {
    console.log("🔍 Usuario autenticado:", req.user); // 👈 Depuración
    const userId = req.user.id; // Obtenemos el usuario autenticado
    console.log("🔍 Usuario autenticado:", req.user); // 👈 Depuración
    
    if (!req.user || !req.user.id) {
      console.error("❌ Error: No se encontró `userId` en el token.");
      throw new Error("Usuario no autenticado");
    }

    return this.worklogService.startWork(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post("pause")
  async pauseWork(@Req() req) {
    const userId = req.user.id;
    return this.worklogService.pauseWork(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post("resume") // 👈 Asegurar que esta línea existe
  async resumeWork(@Req() req) {
    const userId = req.user.id;
    return this.worklogService.resumeWork(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post("finish") // 👈 Asegurar que está correctamente definido
  async finishWork(@Req() req) {
    console.log("📡 Petición recibida en /worklog/finish");
    const userId = req.user.id;
    return this.worklogService.finishWork(userId);
  }
}

