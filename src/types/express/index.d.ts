import {Usuario} from "../../usuario/entities/usuario.entity";

declare namespace Express {
    export interface Request {
        user?: Usuario;
    }
}