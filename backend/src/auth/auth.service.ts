import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findUserByEmail(email);
    
    console.log("Usuario encontrado:", user);
    
    if (!user) {
      console.log("❌ Usuario no encontrado");
      throw new UnauthorizedException("Usuario no encontrado");
    }

    console.log("Password recibido:", password);
    console.log("Password en BD:", user.password);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("¿Contraseña válida?:", isPasswordValid);
    if (!isPasswordValid) {
      console.log("❌ Contraseña incorrecta");
      throw new UnauthorizedException("Contraseña incorrecta");
    }

    return { email: user.email };
  }

  async login(email: string, password: string) {
    console.log("🔍 JWT_SECRET en login:", this.configService.get<string>("JWT_SECRET")); // Debug

    const user = await this.usersService.findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException("Credenciales incorrectas");
    }

    console.log("✅ Usuario encontrado:", user.email, "ID:", user.id);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("🔍 ¿Contraseña válida?:", isPasswordValid);

    if (!isPasswordValid) {
      console.error("❌ Contraseña incorrecta");
      throw new UnauthorizedException("Contraseña incorrecta");
    }
    
    // 👇 Asegurar que el payload contiene el userId
    const payload = { id: user.id, email: user.email };
    console.log("✅ Generando token con payload:", payload);

    const token = this.jwtService.sign(payload);
    console.log("🔑 Token generado:", token);
    
    return { access_token: this.jwtService.sign(payload) };
  }
}

