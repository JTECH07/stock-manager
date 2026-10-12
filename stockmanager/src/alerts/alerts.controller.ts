import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('alerts')
@UseGuards(JwtAuthGuard)
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  checkAlerts(@Query('productId') productId?: string) {
    return this.alertsService.checkAlerts(
      productId ? parseInt(productId, 10) : undefined,
    );
  }

  @Get('low-stock')
  getLowStockItems(
    @Query('threshold') threshold?: string,
    @Query('productId') productId?: string,
  ) {
    return this.alertsService.getLowStockItems(
      threshold ? parseInt(threshold, 10) : 5,
      productId ? parseInt(productId, 10) : undefined,
    );
  }
}