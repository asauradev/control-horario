import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config"; // 👈 Importamos ConfigModule
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { WorklogModule } from "./worklog/worklog.module";
import { PrismaService } from "./prisma.service";

@Module({
  imports: [
    ConfigModule.forRoot(), // 👈 Esto carga las variables de .env
    AuthModule,
    UsersModule,
    WorklogModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}


