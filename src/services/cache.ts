import {generateReqKey} from "@/services/utils/generateReqKey";
import {AxiosRequestConfig} from "axios";

const defaultCacheSettings = {
    enable: false,
    expire: 60 * 1000,
}

// 拓展 AxiosRequestConfig
declare module "axios" {
    export interface AxiosRequestConfig {
        cacheSettings?: {
            enable?: boolean;
            // 单位ms
            expire?: number;
        };
    }
}

// 缓存记录
type cacheReq_t = {
    timestamp: number;
    cachedResponse: any;
}

// 缓存池
const cachePool: Map<string, cacheReq_t> = new Map();

export const cacheRequestInterceptor = (config: AxiosRequestConfig | any) => {
    // 合并默认配置
    if (!config.cacheSettings) {
        config.cacheSettings = defaultCacheSettings;
    } else {
        config.cacheSettings = {
            ...defaultCacheSettings,
            ...config.cacheSettings
        }
    }

    if (config.cacheSettings.enable) {
        // 生成请求唯一键
        const reqId = generateReqKey(config);
        const cacheReq = cachePool.get(reqId);

        if (cacheReq
            && Date.now() - cacheReq.timestamp < config.cacheSettings.expire
        ) {
            // 存在缓存记录，且时间未到
            // 使用适配器，将缓存结果作为响应
            config.adapter = (config: AxiosRequestConfig | any) => {
                const cacheResponse = {
                    status: 200,
                    statusText: '已命中缓存，该请求响应自[缓存拦截器]',
                    // cacheReq.cachedResponse === response.data
                    data: cacheReq.cachedResponse,
                    headers: {'content-type': 'application/json'},
                    config: config
                }
                // console.log(`命中缓存 ${config.method} ${config.url}`);

                return Promise.resolve(cacheResponse);
            }
        }
    }

    // 返回配置
    return config;
}


/**
 * 缓存响应拦截器
 * 该函数用于拦截API响应，并将响应数据缓存到本地存储中
 *
 * @param response API响应对象
 * @returns 返回经过处理后的响应对象
 */
export const cacheResponseInterceptor = (response: any) => {
    // 提取响应配置
    const {config} = response;
    // 生成请求的唯一标识
    const reqId = generateReqKey(config);
    // 尝试从缓存中获取该请求的记录
    const cacheReq = cachePool.get(reqId);

    // 如果缓存中不存在该请求的记录
    if (config.cacheSettings.enable) {
        if (!cacheReq
            || (cacheReq && (Date.now() - cacheReq.timestamp > config.cacheSettings.expire))
        ) {
            // 创建新的缓存记录，包括当前时间和响应数据
            cachePool.set(reqId, {
                timestamp: Date.now(),
                // 缓存响应数据 response.data
                cachedResponse: response.data
            });
        }
    }

    // 返回原始响应
    return response;
}
