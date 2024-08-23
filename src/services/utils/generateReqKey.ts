import Qs from "qs";

export const generateReqKey = (config: any) => {
    const {method, url, params, data} = config;
    return [method, url, Qs.stringify(params), Qs.stringify(data)].join("&");
}