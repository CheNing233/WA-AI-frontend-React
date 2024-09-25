import {generateReqKey} from "@/services/utils/generateReqKey";
import {AxiosRequestConfig} from "axios";

// 默认防抖配置
const defaultDebounceSettings = {
    disable: false,
    expire: 1000
};

// 拓展 AxiosRequestConfig
declare module "axios" {
    export interface AxiosRequestConfig {
        debounceSettings?: {
            disable?: boolean;
            // 单位ms
            expire?: number;
        };
    }
}

// 防抖请求记录
type debounceReq_t = {
    count: number;
    timestamp: number;
    response: null | any;
}

// 存储防抖请求记录
const debouncePool: Map<string, debounceReq_t> = new Map();


export const debounceRequestInterceptor = (config: AxiosRequestConfig | any) => {
    // 合并默认防抖配置
    if (!config.debounceSettings) {
        config.debounceSettings = defaultDebounceSettings
    } else {
        config.debounceSettings = {
            ...defaultDebounceSettings,
            ...config.debounceSettings
        };
    }

    // 如果 debounceSettings.disable 为 true，则不进行防抖处理
    if (!config.debounceSettings.disable) {
        // 生成请求唯一键
        const reqId = generateReqKey(config);
        const debounceReq = debouncePool.get(reqId);

        if (debounceReq
            && Date.now() - debounceReq.timestamp < config.debounceSettings.expire
        ) {
            // 存在防抖记录，且时间未到
            // 判定为重复请求，进行消抖
            // console.log(`重复命中 ${config.method} ${config.url}`);
            debounceReq.count += 1;

            // 使用适配器，将重复请求的结果变更为第一个请求的结果
            config.adapter = (config: AxiosRequestConfig | any) => {
                return new Promise((resolve) => {
                    // 定义一个检查请求是否完成的函数
                    const checkReqFinish = () => {
                        // 如果防抖请求的响应不为空，说明首个请求已经完成
                        if (debounceReq.response !== null) {
                            // 准备响应数据，包括状态、状态文本、实际响应数据、头信息和配置
                            const debounceResponse = {
                                status: 200,
                                statusText: '重复命中，该请求响应自[消抖拦截器]',
                                // 注意是 debounceReq.response === response.data
                                data: debounceReq.response,
                                headers: {'content-type': 'application/json'},
                                config: config
                            };

                            // 日志记录，表示重复请求已被首个请求的数据同步
                            // console.log(`同步重复 ${config.method} ${config.url}`);
                            // 计数
                            debounceReq.count -= 1;
                            // 解析Promise，返回同步后的响应数据
                            resolve(debounceResponse);
                        } else {
                            // 如果首个请求仍在进行中，设置定时器在100毫秒后再次检查
                            setTimeout(checkReqFinish, 100);
                        }
                    }

                    // 启动检查
                    checkReqFinish();
                })
            };
        } else {
            // 不存在防抖记录，或时间已到，创建新的防抖记录
            debouncePool.set(reqId, {
                count: 1,
                timestamp: Date.now(),
                response: null
            });
        }
    }

    // 返回配置
    return config;
}

/**
 * 延迟响应拦截器。此拦截器用于处理针对同一请求的连续响应。
 * 它会存储连续的响应，并仅允许最后一个响应生效，防止不必要的重复操作。
 *
 * @param response 请求返回的响应对象，包含请求的配置和数据。
 * @returns 返回处理后的响应对象。
 */
export const debounceResponseInterceptor = (response: any) => {
    const {config} = response;
    const reqId = generateReqKey(config);
    const debounceReq = debouncePool.get(reqId);

    if (!config.debounceSettings.disable) {
        if (debounceReq) {
            // 将响应数据存储在防抖记录中，并减少计数，注意是 response.data 被存储
            debounceReq.response = response.data;
            debounceReq.count -= 1;
        }
    }

    // 返回响应
    return response;
}
