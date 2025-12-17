import { Module } from '@nestjs/common';

// JWT Imports
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

// Permisos
import { PermissionGuard } from './permissions.guard';

@Module({
    imports: [PassportModule],
    providers: [JwtStrategy, PermissionGuard]
})
export class AuthModule {}
