import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PermissionGuard } from './auth/permissions.guard';
import { Permissions } from './auth/permissions.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiBearerAuth('access-token') // solo para cuando se usa Swagger
  @UseGuards(AuthGuard('jwt'))
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/public')
  getPublic(): string {
    return this.appService.getPublic()
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @Get('/private')
  getPrivate(): string {
    return this.appService.getPrivate()
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'), PermissionGuard)
  @Permissions('read:campaign')
  @Get('/permission')
  getPermission(): string {
    return this.appService.getPermission()
  }
}
