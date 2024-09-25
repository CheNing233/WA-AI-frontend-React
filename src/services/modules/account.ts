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

export interface RegisterParams {
    userName: string;
    nickName: string;
    email: string;
    emailCode: string;
    password: string;
    rePassword: string;
    oauthId?: number;
    authorizationCode?: string;
}

/**
 * 用户注册功能
 * @param params 包含注册所需信息的对象，如用户名、密码等
 * @returns 返回一个Promise对象，该Promise对象解析为AxiosResponse类型，包含服务器的响应结果
 */
export function register(params: RegisterParams): Promise<AxiosResponse> {
    return request.post(`/account/register`, params);
}

export interface ResetPasswordParams {
    email: string;
    emailCode: string;
    password: string;
    rePassword: string;
}

export function resetPassword(params: ResetPasswordParams): Promise<AxiosResponse> {
    return request.post(`/account/forgetPassword`, params);
}

/**
 * 发送邮箱验证码
 *
 * 此函数用于在用户注册或忘记密码时，向指定邮箱发送验证码
 * 验证码在用户注册账户或重置密码过程中起到验证身份的作用
 *
 * @param email 用户的邮箱地址，用于接收验证码
 * @param type 发送验证码的场景，可以是注册(register)或忘记密码(forgetPassword)
 * @returns 返回一个Promise对象，该对象在请求完成后解析为AxiosResponse类型
 *
 * 注意：该函数内部使用request库发送HTTP POST请求到后端API，以触发验证码的发送流程
 */
export function sendEmailCode(email: string, type: 'register' | 'forgetPassword'): Promise<AxiosResponse> {
    return request.post(`/account/sendRegisterMail?email=${email}&type=${type}`);
}


/**
 * 权限测试
 * @returns
 */
export function authTest(): Promise<AxiosResponse> {
    return request.get(`/system/authTest`);
}

/**
 * getUserInformation
 * @param {string} id
 * @returns
 */
export function getUserInformation(id: number): Promise<AxiosResponse> {
    return request.get(`/user/${id}`);
}