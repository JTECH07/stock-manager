export interface Alert {
  id: number;
  productId: number;
  currentQuantity: number;
  threshold: number;
  message: string;
  generatedAt: Date;
}