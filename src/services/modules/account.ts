import request from "@/services";
import {AxiosResponse} from "axios";

// 参数接口
export interface LoginParams {
    /* 用户名 */
    userName?: string;

    /* 邮箱 */
    email?: string;

    /* 密码 */
    password?: string;

    /* OAuth ID */
    oauthId?: number;

    /* 授权码 */
    authorizationCode?: string;

    /* 记住我 */
    rememberMe?: boolean;
}

/**
 * 用户登录
 * @param {object} params LoginDto
 * @param {string} params.userName
 * @param {string} params.email
 * @param {string} params.password
 * @param {number} params.oauthId
 * @param {string} params.authorizationCode
 * @param {boolean} params.rememberMe
 * @returns
 */
export function login(params: LoginParams): Promise<AxiosResponse> {
    return request.post(`/account/login`, params);
}

/**
 * 用户登出
 * @returns
 */
export function logout(): Promise<AxiosResponse> {
    return request.post(`/account/logout`);
}

/**
 * 是否登录
 * @returns
 */
export function isLogin(): Promise<AxiosResponse> {
    return request.get(`/account/isLogin`);
}

/**
 * 获取当前用户信息
 * @returns
 */
export function info(): Promise<AxiosResponse> {
    return request.get(`/account/me`);
}


/**
 * 权限测试
 * @returns
 */
export function authTest(): Promise<AxiosResponse> {
    return request.get(`/system/authTest`);
}