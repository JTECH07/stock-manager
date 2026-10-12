import {
  Controller,
  Get,
  Post,
  Body,
  Query,
} from '@nestjs/common';
import { StockMovementsService } from './stock-movements.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';

@Controller('stock-movements')
export class StockMovementsController {
  constructor(private readonly stockMovementsService: StockMovementsService) {}

  @Get()
  findAll(@Query('productId') productId?: string) {
    return this.stockMovementsService.findAll(
      productId ? parseInt(productId, 10) : undefined,
    );
  }

  @Post()
  create(@Body() createStockMovementDto: CreateStockMovementDto) {
    return this.stockMovementsService.create(createStockMovementDto);
  }
}