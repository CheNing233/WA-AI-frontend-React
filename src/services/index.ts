import axios from "axios";
import {backendApiUrl} from "@/config/serviceUrl";
import {cacheRequestInterceptor, cacheResponseInterceptor} from "@/services/cache";


const axiosInstance = axios.create({
    baseURL: backendApiUrl,
    withCredentials: true
});

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


axiosInstance.interceptors.request.use(cacheRequestInterceptor)
axiosInstance.interceptors.response.use(cacheResponseInterceptor)

export default axiosInstance;