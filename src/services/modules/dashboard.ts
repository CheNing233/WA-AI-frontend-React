import request from "@/services";
import {AxiosResponse} from "axios";

// 响应接口
export interface GetCountRes {
    /* */
    success: boolean;

    /* */
    code: number;

    /* */
    errorMsg: string;

    /* 报错这里改 any，其他报错自己 gpt */
    data: Record<string, unknown>;

    /* */
    total: number;
}

/**
 * 每日数据
 * @param {string} startDate
 * @param {string} endDate
 * @param {string} type
 * @returns
 */
export function getCount(startDate: string, endDate: string, type: string): Promise<AxiosResponse<GetCountRes>> {
    return request.get(`/dashboard?startDate=${startDate}&endDate=${endDate}&type=${type}`);
}