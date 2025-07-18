import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioModule } from './usuario/usuario.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: config.get<'postgres' | 'mysql'>('DB_DIALECT')!,  // mudou para DB_DIALECT
                host: config.get<string>('DB_HOST')!,
                port: Number(config.get<string>('DB_PORT')),
                username: config.get<string>('DB_USER')!,             // mudou para DB_USER
                password: config.get<string>('DB_PASS')!,             // mudou para DB_PASS
                database: config.get<string>('DB_NAME')!,             // mudou para DB_NAME
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: true,
            }),
        }),
        UsuarioModule,
    ],
})
export class AppModule {}
