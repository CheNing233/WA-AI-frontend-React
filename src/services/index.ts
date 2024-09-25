import axios from "axios";
import {backendApiUrl} from "@/config/serviceUrl";
import {debounceRequestInterceptor, debounceResponseInterceptor} from "@/services/debounce";
import {cacheRequestInterceptor, cacheResponseInterceptor} from "@/services/cache";
import {retryResponseInterceptor} from "@/services/retry";


const axiosInstance = axios.create({
    baseURL: backendApiUrl,
    withCredentials: true
});


/*
* Debug interceptor
*/
axiosInstance.interceptors.request.use((config) => {
    const {params, data, headers, method, url} = config;
    console.debug(
        `发起请求 ${method} ${url}\n`,
        ">> params", params, "data", data, "headers", headers,
    )
    return config;
})

axiosInstance.interceptors.response.use((response) => {
    const {status, statusText, data, config} = response;
    const {method, url} = config;
    console.log(
        `${method} ${url} Complete\n`,
        ">> ", status, statusText, "data", data,
    )
    return response;
})

// Debounce interceptor
axiosInstance.interceptors.request.use(debounceRequestInterceptor);
axiosInstance.interceptors.response.use(debounceResponseInterceptor);

// Cache interceptor
axiosInstance.interceptors.request.use(cacheRequestInterceptor);
axiosInstance.interceptors.response.use(cacheResponseInterceptor);

// Retry interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    retryResponseInterceptor
)

export default axiosInstance;