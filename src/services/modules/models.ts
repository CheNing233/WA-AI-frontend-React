import request from "@/services";
import {AxiosResponse} from "axios";

export interface IModel {
    id?: number;
    title?: string;
    type?: string;
    body?: string;
    userId?: number;
    userNickName?: string;
    updateTime?: string;
    filename?: string;

    userAvatarUrl?: string;
    bannerUrl?: string;
}


/**
 * 获取模型列表
 * @param {string} searchQuery
 * @param {string} type
 * @param {string} startTimestamp
 * @param {string} endTimestamp
 * @param {string} page
 * @param {string} pageSize
 * @returns
 */
export function getSdModelsList(
    page: number,
    pageSize: number,
    searchQuery?: string,
    type?: string,
    startTimestamp?: number,
    endTimestamp?: number,
): Promise<AxiosResponse> {

    const _searchQuery = searchQuery ? `&searchQuery=${searchQuery}` : '';
    const _type = type ? `&type=${type}` : '';
    const _startTimestamp = startTimestamp ? `&startTimestamp=${startTimestamp}` : '';
    const _endTimestamp = endTimestamp ? `&endTimestamp=${endTimestamp}` : '';

    return request.get(
        `/model/getSdModelsList?page=${page}&pageSize=${pageSize}${_searchQuery}${_type}${_startTimestamp}${_endTimestamp}`
    );
}