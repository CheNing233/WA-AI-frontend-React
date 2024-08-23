import request from "@/services";
import {AxiosResponse} from "axios";


/**
 * 获取Sd图片信息
 * @param {string} id
 * @returns
 */
export function getById(id: string): Promise<AxiosResponse> {
    return request.get(`/sdImage/${id}`);
}