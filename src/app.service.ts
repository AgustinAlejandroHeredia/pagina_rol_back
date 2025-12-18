import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  getHello(): string {
    return 'Hello World!';
  }

  getPublic(): string {
    return 'Recurso publico'
  }

  getPrivate(): string {
    return 'Recurso privado'
  }

  getPermission(): string {
    return 'Recurso solo con permiso, se puede ver la campaña'
  }

  getConexion(): string {
    return 'Conexion validada, permisos aceptados'
  }

}
