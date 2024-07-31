import {Button, Checkbox, Divider, Grid, Input, Popover, Space} from '@arco-design/web-react';
import {IconLock, IconQuestion, IconUser} from '@arco-design/web-react/icon';
import "@arco-design/web-react/dist/css/arco.css";

import {LogoGithubIcon} from 'tdesign-icons-react'

import useLocale from '@/utils/useLocale';
import locale from './locate';


const Login = () => {
    const loc = useLocale(locale);

    const helpIcon = (helpText: string) => {
        return (
            <Popover
                content={helpText}
            >
                <IconQuestion/>
            </Popover>
        )

    }

    return (
        <Space direction={"vertical"} size={16} style={{width: "100%"}}>
            <Input
                style={{width: "100%"}}
                prefix={<IconUser/>}
                suffix={helpIcon('help text')}
                placeholder={loc['login.form.userName.placeholder']}
                allowClear
            />
            <Input.Password
                style={{width: "100%"}}
                prefix={<IconLock/>}
                // suffix={helpIcon('help text')}
                placeholder={loc['login.form.password.placeholder']}
                allowClear
            />
            <Grid.Row style={{width: "100%"}} align={"center"}>
                <Grid.Col flex={"1"}>
                    <Checkbox>
                        保持近期免登录 {helpIcon('help text')}
                    </Checkbox>
                </Grid.Col>
                <Grid.Col flex={"shrink"} style={{float: "right"}}>
                    <Button type={"text"} size={"small"}>
                        忘记密码
                    </Button>
                </Grid.Col>
            </Grid.Row>

            <Grid.Row style={{width: "100%"}} align={"center"} gutter={0} justify={"center"}>
                {/*<Grid.Col span={6}>*/}
                {/*    <Button type={"dashed"} long>*/}
                {/*        注册*/}
                {/*    </Button>*/}
                {/*</Grid.Col>*/}
                <Grid.Col>
                    <Button type={"primary"} long>
                        登录
                    </Button>
                </Grid.Col>
            </Grid.Row>
            <div style={{width: "100%"}}>
                <Divider orientation={"center"} style={{margin: "0", overflow: "visible"}}>
                    其他账号登录
                </Divider>
                <Space direction={"horizontal"} size={16} style={{width: "100%"}}>
                    <Button type={"dashed"} icon={<LogoGithubIcon/>}>
                        Github 登录
                    </Button>
                </Space>
            </div>

        </Space>
    )
}

export default Login