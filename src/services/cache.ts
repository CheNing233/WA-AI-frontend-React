import Qs from 'qs'

const cacheBuffer: any = {}
const cacheTimeout = 60000;

const pendingRequests: any = new Map();


const generateReqKey = (config: any) => {
    const {method, url, params, data} = config;
    return [method, url, Qs.stringify(params), Qs.stringify(data)].join("&");
}

// 定义一个请求拦截器，用于缓存 GET 请求，并拒绝所有重复请求
export const cacheRequestInterceptor = (config: any) => {
    // 仅当请求方法为 GET 时进行缓存处理
    if (config.method === 'get') {
        // 生成当前请求的唯一键值
        const key = generateReqKey(config);

        // 检查请求重复
        if (pendingRequests.has(key)) {
            // 重复请求
            console.log(`重复命中 ${config.method} ${config.url}`);

            // 使用适配器，将重复请求的结果变更为第一个请求的结果
            config.adapter = (config: any) => {
                return new Promise((resolve) => {
                    const check = () => {
                        // 第一个请求结束，将第一个请求的数据同步到该重复请求中
                        if (cacheBuffer[key] && Date.now() - cacheBuffer[key].timestamp < cacheTimeout) {
                            const responseData = {
                                status: 200,
                                data: cacheBuffer[key].data,
                                headers: {'content-type': 'application/json'},
                                config: config
                            };

                            // 声明该请求已被第一个请求的数据同步
                            console.log(`同步重复 ${config.method} ${config.url}`);
                            resolve(responseData);
                        } else {
                            // 第一个请求仍然进行，轮询检查第一个请求是否完成
                            setTimeout(check, 100);
                        }
                    }
                    check();
                })
            };
        } else {
            // 这里是第一个请求，在 pendingRequests 声明
            pendingRequests.set(key, true);

            // 检查是否存在有效缓存，如果存在，则直接返回缓存数据
            if (cacheBuffer[key] && Date.now() - cacheBuffer[key].timestamp < cacheTimeout) {
                // 从 pendingRequests 中移除该请求
                pendingRequests.delete(key, true);

                // 修改请求的适配器，以返回缓存中的数据
                config.adapter = () => {
                    // 记录缓存命中日志
                    console.log(`缓存命中 ${config.method} ${config.url}`, cacheBuffer[key]);

                    const responseData = {
                        status: 200,
                        data: cacheBuffer[key].data,
                        headers: {'content-type': 'application/json'},
                        config: config
                    };

                    // 返回包含缓存数据的 Promise 对象
                    return Promise.resolve(responseData);
                }
            }
        }
    }

    // 继续发送请求
    return config;
}


/**
 * 缓存响应拦截器
 * 该函数用作 Axios 请求的响应拦截器，主要用于将成功的 GET 请求结果进行缓存
 *
 * @param response Axios 请求的响应对象
 * @returns 返回原始的响应对象，如果适用，则对其进行缓存
 */
export const cacheResponseInterceptor = (response: any) => {
    // 只对 GET 请求进行缓存
    if (response.config.method === 'get') {
        // 生成当前请求的唯一键值，用于标识和缓存此请求
        const key = generateReqKey(response.config);

        // 如果当前请求正在等待中，移除它，因为我们已经获得了响应
        if (pendingRequests.has(key)) {
            pendingRequests.delete(key);
        }

        // 如果响应数据存在，将其缓存
        if (response.data) {
            cacheBuffer[key] = {
                data: response.data, // 缓存的响应数据
                timestamp: Date.now() // 缓存的时间戳，用于后续的缓存失效策略
            };
        }
    }

    // 返回原始响应对象
    return response;
}
