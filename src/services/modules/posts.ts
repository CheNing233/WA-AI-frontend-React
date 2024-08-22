import request from "@/services";
import {AxiosResponse} from "axios";

export interface IPost {
    id?: number;
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
    return request.get(`/post/getPostLite/like?page=${page}&pageSize=${pageSize}`);
}

/**
 * 按照时间排列帖子
 * @param {string} page
 * @param {string} pageSize
 * @returns
 */
export function getPostLiteByTime(page: number, pageSize: number): Promise<AxiosResponse> {
    return request.get(`/post/getPostLite/time?page=${page}&pageSize=${pageSize}`);
}
