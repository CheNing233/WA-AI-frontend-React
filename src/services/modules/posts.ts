import request from "@/services";
import {AxiosResponse, AxiosRequestConfig} from "axios";

export interface IPost {
    id?: number | string;
    title?: string;
    userId?: number;
    userNickName?: string;
    updateTime?: string;
    sdimageIdList?: string[],

    favours?: boolean;
    numFavours?: number;
    liked?: boolean;
    numLiked?: number;
    numComment?: number;

    userAvatarUrl?: string;
    bannerUrl?: string;
}


/**
 * 按照热度排列帖子
 * @param {string} page
 * @param {string} pageSize
 * @returns
 */
export function getPostLiteByLike(page: number, pageSize: number): Promise<AxiosResponse> {
    return request.get(
        `/post/getPostLite/like?page=${page}&pageSize=${pageSize}`,
        {
            cacheSettings: {
                enable: true,
                expire: 300000
            }
        }
    );
}

/**
 * 按照时间排列帖子
 * @param {string} page
 * @param {string} pageSize
 * @returns
 */
export function getPostLiteByTime(page: number, pageSize: number): Promise<AxiosResponse> {
    return request.get(
        `/post/getPostLite/time?page=${page}&pageSize=${pageSize}`,
        {
            cacheSettings: {
                enable: true,
                expire: 300000
            }
        }
    );
}


// 参数接口
export interface GetPostLiteByMIDParams {
    /* */
    modelId: number;

    /* */
    startTimestamp?: Record<string, unknown>;

    /* */
    endTimestamp?: Record<string, unknown>;

    /* */
    searchQuery?: string;

    /* */
    page: number;

    /* */
    pageSize: number;
}

// 响应接口
export interface GetPostLiteByMIDRes {
    /* */
    success: boolean;

    /* */
    code: number;

    /* */
    errorMsg: string;

    /* */
    data: Record<string, unknown>;

    /* */
    total: number;
}

/**
 * 搜索模型的的帖子
 * @param {object} params PostGetByMIDDto
 * @param {number} params.modelId
 * @param {object} params.startTimestamp
 * @param {object} params.endTimestamp
 * @param {string} params.searchQuery
 * @param {number} params.page
 * @param {number} params.pageSize
 * @returns
 */
export function getPostLiteByMID(params: GetPostLiteByMIDParams): Promise<AxiosResponse<GetPostLiteByMIDRes>> {
    return request.post(`/post/getPostLite/model`, params);
}