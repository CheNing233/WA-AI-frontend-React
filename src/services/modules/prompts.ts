import request from "@/services";
import {AxiosResponse} from "axios";

export interface ISdTag {
    id: number;
    nameEn: string;
    nameCn: string;
    numberRefe: number;

    weight?: number;
}


// 响应接口
export interface GetSdTags4TextRes {
    /* */
    success: boolean;

    /* */
    code: number;

    /* */
    errorMsg: string;

    /* */
    data: { imageTags: ISdTag[] };

    /* */
    total: number;
}

/**
 * 获取标签列表
 * @param {string} searchQuery
 * @param {string} page
 * @param {string} pageSize
 * @returns
 */
export function getSdTags(searchQuery: string, page: number, pageSize: number)
    : Promise<AxiosResponse<GetSdTags4TextRes>> {
    return request.get(
        `/tag/getSdTagsList?searchQuery=${searchQuery}&page=${page}&pageSize=${pageSize}`,
        {
            // 缓存配置
            cacheSettings: {
                enable: true,
                expire: 60 * 60 * 1000,
            },
        }
    );
}