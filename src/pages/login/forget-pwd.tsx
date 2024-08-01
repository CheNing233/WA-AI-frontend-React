// import React from 'react';
import {Button, Form, Grid, Input, Modal, Space, VerificationCode} from '@arco-design/web-react';

import {ForgetPasswordProps} from "@/pages/login/interface";
import {IconEmail, IconLock, IconSend} from "@arco-design/web-react/icon";
import useLocale from "@/utils/useLocale";
import locale from "@/pages/login/locate";

import HelpIcon from "@/components/helpIcon"

const ForgetPassword = (props: ForgetPasswordProps) => {
    const loc = useLocale(locale);

    return (
        <Modal
            title={loc['forgetPassword.title']}
            visible={props.visible}
            onOk={() => {
                props.onOk()
            }}
            onCancel={() => {
                props.onCancel()
            }}
            okText={loc['forgetPassword.okText']}
            autoFocus={true}
            focusLock={true}
        >
            <Form
                wrapperCol={{span: 24}}
            >
                <Space direction={"vertical"} size={16}>
                    <Form.Item style={{width: "100%", marginBottom: "0"}}>
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
                            <Form.Item noStyle>
                                <VerificationCode
                                    style={{minWidth: "256px"}}
                                    onChange={v => {
                                        console.log(v)
                                    }}
                                    onFinish={v => {
                                        console.info('onFinish: ' + v)
                                    }}
                                />
                            </Form.Item>
                        </Grid.Col>
                        <Grid.Col flex={"1"}>
                        </Grid.Col>
                        <Grid.Col flex={"shrink"}>
                            <Button type={"primary"} icon={<IconSend/>}>
                                {loc['form.button.sendValidateCode']}
                            </Button>
                        </Grid.Col>
                    </Grid.Row>

                    <Form.Item style={{width: "100%", marginBottom: "0"}}>
                        <Input.Password
                            style={{width: "100%"}}
                            prefix={<IconLock/>}
                            placeholder={loc['forgetPassword.form.newPassword.placeholder']}
                            allowClear
                        />
                    </Form.Item>
                    <Form.Item style={{width: "100%", marginBottom: "0"}}>
                        <Input.Password
                            style={{width: "100%"}}
                            prefix={<IconLock/>}
                            placeholder={loc['forgetPassword.form.newPasswordConfirm.placeholder']}
                            allowClear
                        />
                    </Form.Item>
                </Space>
            </Form>
        </Modal>
    )
}

export default ForgetPassword