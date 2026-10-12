export class CreateStockMovementDto {
  productId: number;
  type: 'IN' | 'OUT';
  quantity: number;
}