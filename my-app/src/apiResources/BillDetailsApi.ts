

import { HTTP } from '@/HTTPServices';
import { BaseApi } from '@/apiResources/BaseApi';
import {  BillDetail } from '@/models/BillDetail';
class BillDetailApi extends BaseApi {
    search(billId : number): Promise< BillDetail[]> {
        return new Promise< BillDetail[]>((resolve: any, reject: any) => {
            HTTP.get(`api/v1/bill_detail/search_by_bill_id/${billId}`)
            .then((response) => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
        });
    }
    insert( billDetail:  BillDetail): Promise< BillDetail> {
        return new Promise< BillDetail>((resolve: any, reject: any) => {
            HTTP.post(`api/v1/bill_detail`, billDetail)
            .then((response) => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
        });
    }
    update( billDetailId: number,  billDetail:  BillDetail): Promise< BillDetail> {
        return new Promise< BillDetail>((resolve: any, reject: any) => {
            HTTP.put(`api/v1/bill_detail/${ billDetailId}`,  billDetail)
                .then((response) => {
                    resolve(response.data);
                }).catch((error) => {
                    reject(error);
                })
        });
    }
    delete( billDetailId: number): Promise<any> {
        return new Promise<any>((resolve: any, reject: any) => {
            HTTP.delete(`api/v1/bill_detail/${ billDetailId}`)
                .then((response) => {
                    resolve(response.data);
                }).catch((error) => {
                    reject(error);
                })
        });
    }
    get( billDetailId: number): Promise<any> {
        return new Promise<any>((resolve: any, reject: any) => {
            HTTP.get(`api/v1/bill_detail/${ billDetailId}`)
                .then((response) => {
                    resolve(response.data);
                }).catch((error) => {
                    reject(error);
                })
        });
    }
    getNumberProduct(weather: number, temperature: number, productId: number, day: Date): Promise<any> {
        return new Promise<any>((resolve: any, reject: any) => {
            HTTP.get(`api/v1/bill_detail/generate_amount`,{
                params: {
                    Weather: weather,
                    Temperature: temperature,
                    ProductId: productId,
                    Datetime: day
                }
            })
                .then((response) => {
                    resolve(response.data);
                }).catch((error) => {
                    reject(error);
                })
        });
    }
}
export default new  BillDetailApi();
