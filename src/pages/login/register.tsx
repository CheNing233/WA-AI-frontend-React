import {Button, Form, Grid, Input, Space, VerificationCode} from "@arco-design/web-react";
import {IconEmail, IconLock, IconSend, IconTag, IconUser} from "@arco-design/web-react/icon";
import useLocale from "@/utils/useLocale";

import locale from './locate';
import api from "@/services/export";
import eventbus from "@/eventbus";
import {RegisterParams} from "@/services/modules/account";
import {loadingMessage} from "@/utils/loadingMessage";
import {useHistory} from "react-router-dom";
import {useState} from "react";
import CryptoJS from 'crypto-js';
import {HourglassIcon, SendIcon} from "tdesign-icons-react";
import {getEmailCode} from "@/services/utils/account";

const initialFormValues = {
    user: '',
    password: '',
}

interface FromProps {
    userName: string;
    nickName: string;
    password: string;
    rePassword: string;
    email: string;
    validateCode: string;
}

const Register = () => {
    // 语言包
    const loc = useLocale(locale);


    // form
    const [form] = Form.useForm();
    const password = Form.useWatch("password", form);

    const [emailCodeCooldown, setEmailCodeCoolDown] = useState(0)

    /**
     * 处理表单提交事件
     * @param {Object} values - 表单字段的值
     */
    const handleSubmit = (values: FromProps) => {
        // 触发加载动画
        eventbus.emit('login.index.loading', true)

        let params: RegisterParams = {
            userName: values.userName,
            nickName: values.nickName,
            email: values.email,
            emailCode: values.validateCode,
            password: CryptoJS.SHA256(values.password).toString(CryptoJS.enc.Hex),
            rePassword: CryptoJS.SHA256(values.rePassword).toString(CryptoJS.enc.Hex)
        }

        loadingMessage(
            'msg.register',
            '注册中...',
            (resolve) => {
                // 调用API进行登录
                api.account.register(params)
                    .then((loginRes) => {
                        // 处理登录响应
                        if (loginRes.data.data === '注册成功') {
                            // 登录成功提示并跳转至首页
                            resolve(true, '注册成功喵, 请使用新账号进行登陆')
                            eventbus.emit('login.index.tab', '1')
                        } else {
                            // 登录失败提示错误信息
                            resolve(false, `注册失败：${loginRes.data.errorMsg}`)
                        }
                    })
                    .catch((error) => {
                        // 登录失败提示错误信息
                        resolve(false, `注册失败：${error.message}`)
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

    const twoPwdValidator = (val, cb) => {
        if (password === val) {
            return cb();
        } else {
            return cb('两次密码对不上喵');
        }
    }

    const emailValidator = (val, cb) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(val)) {
            return cb(); // 如果是邮箱格式，调用回调函数
        } else {
            return cb('请输入正确的邮箱喵'); // 如果不是邮箱格式，返回提示信息
        }
    };

    return (
        <Form
            form={form}
            style={{width: "100%"}}
            wrapperCol={{span: 24}}
            initialValues={initialFormValues}
            autoComplete="off"
            onSubmit={handleSubmit}
        >
            <Space direction={"vertical"} size={16} style={{width: "100%"}}>
                <Form.Item
                    style={{width: "100%", marginBottom: "0"}}
                    field={"userName"}
                    extra={loc['register.form.userName.help']}
                    rules={[
                        {required: true, message: loc['form.error.required']}
                    ]}
                >
                    <Input
                        style={{width: "100%"}}
                        prefix={<IconUser/>}
                        placeholder={loc['register.form.userName.placeholder']}
                        allowClear
                    />
                </Form.Item>
                <Form.Item
                    style={{width: "100%", marginBottom: "0"}}
                    field={"nickName"}
                    extra={loc['register.form.nickName.help']}
                    rules={[
                        {required: true, message: loc['form.error.required']}
                    ]}
                >
                    <Input
                        style={{width: "100%"}}
                        prefix={<IconTag/>}
                        placeholder={loc['register.form.nickName.placeholder']}
                        allowClear
                    />
                </Form.Item>

                <Form.Item
                    style={{width: "100%", marginBottom: "0"}}
                    field={"email"}
                    rules={[
                        {required: true, message: loc['form.error.required']},
                        {validator: emailValidator}
                    ]}
                    validateTrigger={'onBlur'}
                >
                    <Input
                        style={{width: "100%"}}
                        prefix={<IconEmail/>}
                        placeholder={loc['register.form.email.placeholder']}
                        allowClear
                    />
                </Form.Item>
                <Grid.Row gutter={[16, 16]}>
                    <Grid.Col flex={"shrink"}>
                        <Form.Item
                            style={{width: "100%", marginBottom: "0"}}
                            field={"validateCode"}
                            rules={[
                                {required: true, message: loc['form.error.required']},
                            ]}
                            validateTrigger={['onFinish']}
                        >
                            <VerificationCode
                                style={{minWidth: "256px"}}
                            />
                        </Form.Item>
                    </Grid.Col>
                    <Grid.Col flex={"1"}>
                    </Grid.Col>
                    <Grid.Col flex={"shrink"}>
                        <Button type={"primary"} disabled={emailCodeCooldown > 0}
                                icon={emailCodeCooldown > 0
                                    ? <HourglassIcon/>
                                    : <SendIcon/>
                                }
                                onClick={() => {
                                    getEmailCode(form.getFieldValue('email'), 'register', setEmailCodeCoolDown)
                                }}
                        >
                            {emailCodeCooldown > 0
                                ? `${emailCodeCooldown}s`
                                : loc['form.button.sendValidateCode']
                            }
                        </Button>
                    </Grid.Col>
                </Grid.Row>

                <Form.Item
                    style={{width: "100%", marginBottom: "0", marginTop: "4px"}}
                    field={"password"}
                    rules={[
                        {required: true, message: loc['form.error.required']},
                    ]}
                >
                    <Input.Password
                        style={{width: "100%"}}
                        prefix={<IconLock/>}
                        placeholder={loc['register.form.password.placeholder']}
                        allowClear
                        autoComplete={'off'}
                    />
                </Form.Item>
                <Form.Item
                    style={{width: "100%", marginBottom: "0"}}
                    field={"rePassword"}
                    rules={[
                        {required: true, message: loc['form.error.required']},
                        {validator: twoPwdValidator}
                    ]}
                    validateTrigger={'onBlur'}
                >
                    <Input.Password
                        style={{width: "100%"}}
                        prefix={<IconLock/>}
                        placeholder={loc['register.form.passwordConfirm.placeholder']}
                        allowClear
                        autoComplete={'off'}
                    />
                </Form.Item>

                <Form.Item noStyle>
                    <Button type={"primary"} htmlType='submit' long>
                        {loc['register.form.button.register']}
                    </Button>
                </Form.Item>
            </Space>
        </Form>
    )
}

export default Register