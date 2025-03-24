import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from '@nestjs/passport';
import { Request } from "express";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(JwtService) private jwtService: JwtService) {} // 👈 Asegura que está inyectado correctamente

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    console.log("🔍 Header Authorization recibido:", authHeader);

    if (!authHeader) {
      console.error("❌ No se encontró el token.");
      throw new UnauthorizedException("No se encontró el token.");
    }

    const token = authHeader.split(" ")[1]; // Extraer el token de "Bearer TOKEN"
    console.log("🔑 Token extraído:", token);

    if (!token) {
      console.error("❌ Token vacío.");
      throw new UnauthorizedException("Token inválido.");
    }

    try {
      const payload = this.jwtService.verify(token);
      
      console.log("✅ Token decodificado:", payload); // 👈 Debug para ver qué hay en el token

      if (!payload.id) {
        console.error("❌ El token no contiene `userId`.");
        throw new UnauthorizedException("El token es inválido.");
      }
      
      (request as any).user = payload; // 👈 Añadir `as any` si TypeScript da error
      return true;
    } catch (error) {
      throw new UnauthorizedException("Token inválido.");
    }
  }
}



