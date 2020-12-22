import { Product } from "./Product";

export interface BillDetail {
    BillDetailId: number;
    BillId: number;
    ProductId: number;
    Amount: number;
    Price: number;
    Product: Product;
    TotalMoney: number;
}
    