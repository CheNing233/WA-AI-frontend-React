import axios from "axios";
import {backendApiUrl} from "@/config/serviceUrl";
import {cacheRequestInterceptor, cacheResponseInterceptor} from "@/services/cache";
import {retryInterceptor} from "@/services/retry";


const axiosInstance = axios.create({
    baseURL: backendApiUrl,
    withCredentials: true
});

/*
* Debug INTERCEPTOR
*/
axiosInstance.interceptors.request.use((config) => {
    const {params, data, headers, method, url} = config;
    console.debug(
        `${method} ${url}\n`,
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

/*
* Retry INTERCEPTOR
*/
axiosInstance.interceptors.response.use(
    (response) => response,
    retryInterceptor
)

/*
* Cache & Intercept duplicate INTERCEPTOR
*/
axiosInstance.interceptors.request.use(cacheRequestInterceptor)
axiosInstance.interceptors.response.use(cacheResponseInterceptor)

export default axiosInstance;