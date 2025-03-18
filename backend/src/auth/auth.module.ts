import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "../users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { JwtService } from "@nestjs/jwt";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { PrismaService } from "../prisma.service";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    UsersModule,
    ConfigModule, // 👈 Asegurar que ConfigModule está aquí
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>("JWT_SECRET");
        console.log("🔍 JWT_SECRET en JwtModule:", secret); // 👈 Debug
        return {
          secret: secret || "secreto_super_seguro",
          signOptions: { expiresIn: "2h" },
        };
      },
    }),
  ],
  providers: [AuthService], // 👈 Agregamos JwtService aquí
  controllers: [AuthController],
  exports: [AuthService, JwtModule], // 👈 Exportamos JwtService para otros módulos
})
export class AuthModule {}



