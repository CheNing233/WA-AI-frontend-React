import request from "@/services";
import {AxiosResponse} from "axios";

export enum TaskStatus {
    created = 0, // 已创建
    running = 1, // 运行中
    success = 2, // 成功
    failed = 3, // 失败
    deleted = 4, // 删除
    unknown = 9, // 未知
}

export interface ITask {
    id?: string | number,
    userId?: number,
    nickName?: string,
    type?: string,
    priority?: number,
    status?: TaskStatus,
    imageId?: string,
    createTime?: string,
    updateTime?: string,

    bannerUrl?: string,
    statusText?: string,
}

/**
 * 获取个人任务
 * @param {string} page
 * @param {string} pageSize
 * @param forceUpdate
 * @returns
 */
export function getTaskByUser(page: number, pageSize: number, forceUpdate?: boolean): Promise<AxiosResponse> {
    return request.get(`/task/getTaskByUser?page=${page}&pageSize=${pageSize}`);
}
