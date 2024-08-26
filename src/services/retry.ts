import {generateReqKey} from "@/services/utils/generateReqKey";
import axiosInstance from "@/services/index";

const retryRequests = new Map();
const maxRetries = 3;

/**
 * 错误请求重试拦截器
 *
 * 当请求发生错误时，此函数用作拦截器，以处理重试逻辑确保某些请求在失败时可以被重试，以提高健壮性
 *
 * @param error 错误对象，包含请求失败的信息
 * @returns 返回一个Promise，用于处理重试后的请求结果或再次拒绝
 */
export const retryInterceptor = (error: any) => {
    // 提取错误中的请求配置
    const {config} = error;

    // 生成请求的唯一键，用于在重试请求集合中进行唯一标识
    const key = generateReqKey(config);

    // 如果该请求已经重试过 maxRetries，则不再重试，直接拒绝
    if (retryRequests.has(key) && retryRequests.get(key) > maxRetries) {
        retryRequests.delete(key);
        return Promise.reject(error);
    } else {
        // 将当前请求标记
        if (!retryRequests.has(key)) {
            retryRequests.set(key, 1);
        } else {
            retryRequests.set(key, retryRequests.get(key) + 1);
        }

        // 警告日志：提示正在重试请求，并记录请求的方法和URL
        console.warn(`重试${retryRequests.get(key)}次 ${config.method} ${config.url}`);

        // 如果config中不存在cache属性，则创建它，用于后续存储重试标记
        if (!config['cache']) {
            config['cache'] = {};
        }

        // 标记此请求需要强制更新，即进行重试
        config['cache']['forceUpdate'] = true

        // 使用更新后的配置重新发送请求
        return axiosInstance(config)
    }
}
