import { Module } from "@nestjs/common";
import { WorklogService } from "./worklog.service";
import { WorklogController } from "./worklog.controller";
import { PrismaService } from "../prisma.service";
import { AuthModule } from "../auth/auth.module"; // 👈 Importamos AuthModule
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Module({
  imports: [AuthModule], // 👈 Importamos AuthModule para acceder a JwtService
  providers: [WorklogService, PrismaService, JwtAuthGuard], // 👈 Registramos JwtAuthGuard aquí
  controllers: [WorklogController],
})
export class WorklogModule {}


