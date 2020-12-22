

import { HTTP } from '@/HTTPServices';
import { BaseApi } from '@/apiResources/BaseApi';
import { Bill } from '@/models/Bill';
import { Pagination } from './PaginatedResponse';
export interface BillApiSearchParams extends Pagination {
    DatetimeStart: Date,
    DatetimeEnd: Date,
    TotalMoneyStart: number,
    TotalMoneyEnd: number,
    Type: number
}
class BillApi extends BaseApi {
    search(search: BillApiSearchParams): Promise<Bill[]> {
        return new Promise<Bill[]>((resolve: any, reject: any) => {
            HTTP.get(`api/v1/bills/search`, { params: search })
            .then((response) => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
        });
    }
    insert(bill: Bill): Promise<Bill> {
        return new Promise<Bill>((resolve: any, reject: any) => {
            HTTP.post(`api/v1/bills`,bill)
            .then((response) => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
        });
    }
    update(billId: number, bill: Bill): Promise<Bill> {
        return new Promise<Bill>((resolve: any, reject: any) => {
            HTTP.put(`api/v1/bills/${billId}`, bill)
                .then((response) => {
                    resolve(response.data);
                }).catch((error) => {
                    reject(error);
                })
        });
    }
    delete(billId: number): Promise<any> {
        return new Promise<any>((resolve: any, reject: any) => {
            HTTP.delete(`api/v1/bills/${billId}`)
                .then((response) => {
                    resolve(response.data);
                }).catch((error) => {
                    reject(error);
                })
        });
    }
    get(billId: number): Promise<any> {
        return new Promise<any>((resolve: any, reject: any) => {
            HTTP.get(`api/v1/bills/${billId}`)
                .then((response) => {
                    resolve(response.data);
                }).catch((error) => {
                    reject(error);
                })
        });
    }
}
export default new BillApi();
