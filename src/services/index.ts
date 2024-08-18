import axios from "axios";
import {backendApiUrl} from "@/config/serviceUrl";


const axiosInstance = axios.create({
    baseURL: backendApiUrl,
    withCredentials: true
});

axiosInstance.interceptors.request.use((config) => {
    const {params, data, headers, method, url} = config;
    console.log(
        `${method} ${url}\n`,
        ">> params", params, "data", data, "headers", headers,
    )
    return config;
})


axiosInstance.interceptors.response.use((response) => {
    const {status, statusText, data, config} = response;
    const {method, url} = config;
    console.debug(
        `${method} ${url}\n`,
        ">> ", status, statusText, "data", data,
    )
    return response;
})

export default axiosInstance;