import {generateReqKey} from "@/services/utils/generateReqKey";
import axiosInstance from "@/services/index";
import {AxiosRequestConfig} from "axios";

const defaultRetryConfig = {
    retry: 3,
    retryDelay: 1000,
}

declare module "axios" {
    interface AxiosRequestConfig {
        retryConfig?: {
            retry?: number;
            retryDelay?: number;
        }
    }
}

type retryReq_t = {
    currentRetry: number;
}

const retryPool: Map<string, retryReq_t> = new Map();

/**
 * 创建一个拦截器，用于在请求失败时尝试重新请求
 * 该拦截器会根据配置信息判断是否需要重试请求，以及重试的次数
 *
 * @returns {Promise} 返回一个Promise对象，表示处理结果
 * @param error
 */
export const retryResponseInterceptor = (error: any): Promise<any> => {
    // 提取错误中的请求配置
    const {config} = error;

    // 检查并合并默认的重试配置到请求配置中
    if (!config.retryConfig) {
        config.retryConfig = defaultRetryConfig;
    } else {
        // 确保请求配置中的retryConfig是默认配置与自定义配置的合并
        config.retryConfig = {
            ...defaultRetryConfig,
            ...config.retryConfig
        }
    }

    // 如果请求配置中设置了重试次数
    if (config.retryConfig.retry) {
        // 生成请求的唯一标识
        const reqId = generateReqKey(config);
        // 从重试请求池中获取当前请求的重试状态
        let retryReq = retryPool.get(reqId);

        // 如果请求已经在重试请求池中存在，则重试计数加1；否则初始化重试计数为1
        if (retryReq) {
            retryReq.currentRetry += 1;
        } else {
            retryPool.set(reqId, {currentRetry: 1});
            // 重定向引用
            retryReq = retryPool.get(reqId);
        }

        // 如果当前重试次数未超过配置的最大重试次数，则重新发送请求
        if (retryReq.currentRetry <= config.retryConfig.retry) {
            // 重试请求，且重试次数未到
            console.warn(`重试${retryReq.currentRetry}次 ${config.method} ${config.url}`);

            // 关闭缓存和消抖，打通重试通道
            const newConfig: AxiosRequestConfig = {
                ...config,
                debounceSettings: {
                    ...config.debounceSettings,
                    disable: true
                },
                cacheSettings: {
                    ...config.cacheSettings,
                    enable: false
                }
            }

            // 使用更新后的配置重新发送请求
            return axiosInstance(newConfig);
        } else {
            // 重试请求，且重试次数已到
            // 删除重试记录
            retryPool.delete(reqId);
            console.error(`重试失败 ${config.method} ${config.url}`);

            // 返回异常
            return Promise.reject(error);
        }
    }
}
