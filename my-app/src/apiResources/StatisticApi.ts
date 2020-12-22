

import { HTTP } from '@/HTTPServices';
import { BaseApi } from '@/apiResources/BaseApi';
import { Pagination } from './PaginatedResponse';
export interface StatisticByDayApiSearchParams extends Pagination {
    Datetime: Date
}
export interface StatisticByMonthApiSearchParams extends Pagination {
    month: number,
    year: number
}
class StatisticApi extends BaseApi {
    getbyday(search: StatisticByDayApiSearchParams): Promise<any> {
        return new Promise<any>((resolve: any, reject: any) => {
            HTTP.get(`api/v1/statistic/day`, { params: search })
            .then((response) => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
        });
    }
    getbymonth(search: StatisticByMonthApiSearchParams): Promise<any> {
        return new Promise<any>((resolve: any, reject: any) => {
            HTTP.get(`api/v1/statistic/month`, { params: search })
            .then((response) => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
        });
    }
}
export default new StatisticApi();
