import {PassportStrategy} from "@nestjs/passport";
import {Injectable, UnauthorizedException} from "@nestjs/common";
import {Strategy} from "passport-local";
import {AuthService} from "../auth.service";
import {Usuario} from "../../usuario/entities/usuario.entity";
import {UsuarioService} from "../../usuario/usuario.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService: AuthService,
        private readonly usuarioService: UsuarioService
    ) {
        super({
            usernameField: 'email',
            passwordField: 'senha'
        });
    }

    async validate(email: string, pass: string): Promise<Omit<Usuario, 'senha'>> {
        console.log('Usuario: ', await this.usuarioService.findOneByEmail(email));
        const user = await this.authService.validateUser(email, pass);

        if (!user) {
            throw new UnauthorizedException('Credenciais inválidas.');
        }
        return user;
    }
}