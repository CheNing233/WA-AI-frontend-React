import {useEffect, useState} from "react";

import {Button, Checkbox, Divider, Form, Grid, Input, Space} from '@arco-design/web-react';
import {IconLock, IconUser} from '@arco-design/web-react/icon';
import "@arco-design/web-react/dist/css/arco.css";

import {LogoGithubIcon} from 'tdesign-icons-react'

import {useHistory} from 'react-router-dom'


import useLocale from '@/utils/useLocale';
import locale from './locate';
import HelpIcon from "@/components/helpIcon";
import ForgetPassword from "@/pages/login/forget-pwd";
import eventbus from "@/eventbus";
import api from "@/services/export";
import {LoginParams} from "@/services/modules/account";

import CryptoJS from 'crypto-js';
import {loadingMessage} from "@/utils/loadingMessage";


const initialFormValues = {
    user: '',
    password: '',
    rememberMe: true,
}

const Login = () => {
    // 语言包
    const loc = useLocale(locale);

    const history = useHistory()

    // 忘记密码弹窗
    const [
        showForgetPasswordModel,
        setShowForgetPasswordModel
    ] = useState(false);

    // form
    const [form] = Form.useForm();

    // 获取用户名
    const user: string = Form.useWatch("user", form)
    const [loginWithUser, setLoginWithUser] = useState(true);
    useEffect(() => {
        const emailPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailPattern.test(user)) {
            setLoginWithUser(false)
        } else {
            setLoginWithUser(true)
        }

    }, [user, loc])


    /**
     * 处理表单提交事件
     * @param {Object} values - 表单字段的值
     */
    const handleSubmit = (values) => {
        // 触发登录加载动画
        eventbus.emit('login.index.loading', true)

        // 初始化登录参数
        let params: LoginParams = {
            rememberMe: values.rememberMe,
        }

        // 根据登录方式设置用户名或邮箱参数
        if (loginWithUser) {
            params.userName = values.user
        } else {
            params.email = values.user
        }

        // 对密码进行SHA256加密
        params.password = CryptoJS.SHA256(values.password).toString(CryptoJS.enc.Hex)

        loadingMessage(
            'msg.login',
            '登录中...',
            (resolve) => {
                // 调用API进行登录
                api.account.login(params)
                    .then((loginRes) => {
                        // 处理登录响应
                        if (loginRes.data.data === '登录成功') {
                            // 登录成功提示并跳转至首页
                            resolve(true, '登录成功喵~')
                            history.push('/home')
                        } else {
                            // 登录失败提示错误信息
                            resolve(false, `登陆失败：${loginRes.data.errorMsg}`)
                        }
                    })
                    .catch((error) => {
                        // 登录失败提示错误信息
                        resolve(false, `登陆失败：${error.message}`)
                    })
                    .finally(() => {
                        // 停止登录加载动画
                        eventbus.emit('login.index.loading', false)
                        // 触发获取用户登录状态事件
                        eventbus.emit('user.getLoginState')
                    })
            }
        )

    }

    return (
        <Form
            form={form}
            style={{width: "100%"}}
            wrapperCol={{span: 24}}
            initialValues={initialFormValues}
            onSubmit={handleSubmit}
            autoComplete="off"
        >
            <Space direction={"vertical"} size={16} style={{width: "100%"}}>
                <Form.Item
                    style={{width: "100%", marginBottom: "0"}}
                    field={"user"}
                    extra={loginWithUser ? loc['login.form.userName.useUser'] : loc['login.form.userName.useEmail']}
                    rules={[
                        {required: true, message: loc['form.error.required']}
                    ]}
                >
                    <Input
                        style={{width: "100%"}}
                        prefix={<IconUser/>}
                        placeholder={loc['login.form.userName.placeholder']}
                        allowClear
                    />
                </Form.Item>
                <Form.Item
                    style={{width: "100%", marginBottom: "0"}}
                    field={"password"}
                    rules={[
                        {required: true, message: loc['form.error.required']}
                    ]}
                >
                    <Input.Password
                        style={{width: "100%"}}
                        prefix={<IconLock/>}
                        placeholder={loc['login.form.password.placeholder']}
                        allowClear
                        autoComplete={'off'}
                    />
                </Form.Item>
                <Grid.Row style={{width: "100%"}} align={"center"}>
                    <Grid.Col flex={"1"}>
                        <Form.Item
                            noStyle={true}
                            field={"rememberMe"}
                            triggerPropName='checked'
                        >
                            <Checkbox>
                                {loc['login.form.rememberMe.label']} {<HelpIcon
                                text={loc['login.form.rememberMe.help']}/>}
                            </Checkbox>
                        </Form.Item>
                    </Grid.Col>
                    <Grid.Col flex={"shrink"} style={{float: "right"}}>
                        <Button type={"text"} size={"small"} onClick={() => {
                            setShowForgetPasswordModel(true)
                        }}>
                            {loc['login.form.forgetPassword.label']}
                        </Button>
                    </Grid.Col>
                </Grid.Row>

                <Grid.Row style={{width: "100%"}} align={"center"} gutter={0} justify={"center"}>
                    <Grid.Col>
                        <Form.Item noStyle={true}>
                            <Button type={"primary"} htmlType='submit' long>
                                {loc['login.form.button.login']}
                            </Button>
                        </Form.Item>
                    </Grid.Col>
                </Grid.Row>
                <div style={{width: "100%"}}>
                    <Divider orientation={"center"} style={{margin: "0", overflow: "visible"}}>
                        {loc['login.otherAccount.label']}
                    </Divider>
                    <Space direction={"horizontal"} size={16} style={{width: "100%"}}>
                        <Button type={"dashed"} icon={<LogoGithubIcon/>}>
                            {loc['login.otherAccount.github']}
                        </Button>
                    </Space>
                </div>

                <ForgetPassword
                    visible={showForgetPasswordModel}
                    onOk={() => {
                        setShowForgetPasswordModel(false)
                    }}
                    onCancel={() => {
                        setShowForgetPasswordModel(false)
                    }}
                />
            </Space>
        </Form>
    )
}

export default Login