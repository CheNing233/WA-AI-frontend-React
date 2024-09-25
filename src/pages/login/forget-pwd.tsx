// import React from 'react';
import {Button, Form, Grid, Input, Modal, Space, VerificationCode} from '@arco-design/web-react';

import {ForgetPasswordProps} from "@/pages/login/interface";
import {IconEmail, IconLock, IconSend} from "@arco-design/web-react/icon";
import useLocale from "@/utils/useLocale";
import locale from "@/pages/login/locate";

import HelpIcon from "@/components/helpIcon"
import {HourglassIcon, LockOffIcon, SendIcon} from "tdesign-icons-react";
import {useState} from "react";
import {getEmailCode} from "@/services/utils/account";
import {loadingMessage} from "@/utils/loadingMessage";
import api from "@/services/export";
import eventbus from "@/eventbus";
import CryptoJS from "crypto-js";

interface ForgetPasswordForm {
    email: string;
    emailCode: string;
    password: string;
    rePassword: string;
}

const ForgetPassword = (props: ForgetPasswordProps) => {
    const loc = useLocale(locale);

    const [form] = Form.useForm();
    const [emailCodeCooldown, setEmailCodeCoolDown] = useState(0)
    const [loading, setLoading] = useState(false);

    const twoPwdValidator = (val, cb) => {
        if (form.getFieldValue('password') === val) {
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

    const handleSubmit = (values: ForgetPasswordForm) => {
        setLoading(true)

        let params: ForgetPasswordForm = {
            email: values.email,
            emailCode: values.emailCode,
            password: CryptoJS.SHA256(values.password).toString(CryptoJS.enc.Hex),
            rePassword: CryptoJS.SHA256(values.rePassword).toString(CryptoJS.enc.Hex)
        }

        loadingMessage(
            'msg.resetPassword',
            '重置密码中...',
            (resolve) => {
                api.account.resetPassword(params)
                    .then((loginRes) => {
                        if (loginRes.data.code === 200) {
                            resolve(true, '重置成功喵, 请使用新账号密码进行登录')
                            props.onOk()
                        } else {
                            resolve(false, `重置失败：${loginRes.data.errorMsg}`)
                        }
                    })
                    .catch((error) => {
                        resolve(false, `重置失败：${error.message}`)
                    })
                    .finally(() => {
                        eventbus.emit('user.getLoginState')
                        setLoading(false)
                        form.setFieldValue('emailCode', '')
                    })
            }
        )
    };

    return (
        <Modal
            title={loc['forgetPassword.title']}
            visible={props.visible}
            onCancel={() => {
                props.onCancel()
            }}
            footer={
                <Space>
                    <Button onClick={() => {
                        props.onCancel()
                    }}>
                        取消
                    </Button>
                    <Button type={"primary"}
                            icon={<LockOffIcon/>}
                            loading={loading}
                            onClick={() => {
                                form.submit()
                            }}
                    >
                        {loc['forgetPassword.okText']}
                    </Button>
                </Space>
            }
            autoFocus={true}
            focusLock={true}
        >
            <Form
                form={form}
                onSubmit={handleSubmit}
                wrapperCol={{span: 24}}
            >
                <Space direction={"vertical"} size={16}>
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
                            suffix={<HelpIcon text={loc['forgetPassword.form.email.help']}/>}
                            placeholder={loc['forgetPassword.form.email.placeholder']}
                            allowClear
                        />
                    </Form.Item>
                    <Grid.Row gutter={16}>
                        <Grid.Col flex={"shrink"}>
                            <Form.Item noStyle
                                       field={"emailCode"}
                            >
                                <VerificationCode
                                    style={{minWidth: "256px"}}
                                />
                            </Form.Item>
                        </Grid.Col>
                        <Grid.Col flex={"1"}>
                        </Grid.Col>
                        <Grid.Col flex={"shrink"}>
                            <Button type={"primary"}
                                    disabled={emailCodeCooldown > 0}
                                    icon={emailCodeCooldown > 0
                                        ? <HourglassIcon/>
                                        : <SendIcon/>
                                    }
                                    onClick={() => {
                                        getEmailCode(form.getFieldValue('email'), 'forgetPassword', setEmailCodeCoolDown)
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
                        style={{width: "100%", marginBottom: "0"}}
                        field={"password"}
                        rules={[
                            {required: true, message: loc['form.error.required']},
                        ]}
                    >
                        <Input.Password
                            style={{width: "100%"}}
                            prefix={<IconLock/>}
                            placeholder={loc['forgetPassword.form.newPassword.placeholder']}
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
                            placeholder={loc['forgetPassword.form.newPasswordConfirm.placeholder']}
                            allowClear
                            autoComplete={'off'}
                        />
                    </Form.Item>
                </Space>
            </Form>
        </Modal>
    )
}

export default ForgetPassword