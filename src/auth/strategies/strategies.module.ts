import {forwardRef, Module} from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { UsuarioModule } from '../../usuario/usuario.module';

import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import {AuthModule} from "../auth.module";

@Module({
    imports: [
        PassportModule,
        ConfigModule,
        UsuarioModule,
        forwardRef(() => AuthModule),
    ],
    providers: [
        LocalStrategy,
        JwtStrategy,
    ],
    exports: [
        LocalStrategy,
        JwtStrategy,
    ],
})
export class StrategiesModule {}