import {
    Avatar,
    Button,
    Card,
    Divider,
    Dropdown,
    Grid,
    Menu,
    Message,
    Select,
    Space,
    Statistic,
    Tooltip,
} from "@arco-design/web-react";

import './styles/index.css'
import {IconLanguage, IconMoonFill, IconShareExternal, IconSunFill} from "@arco-design/web-react/icon";
import {ControlPlatformIcon, ThunderIcon, WalletIcon} from "tdesign-icons-react";

import {useContext} from "react";
import {GlobalContext} from '@/context';
import locate from './locate'
import useLocale from "@/utils/useLocale";

const Header = () => {
    const {lang, setLang, theme, setTheme} = useContext(GlobalContext);
    const loc = useLocale(locate)

    const IconButton = (props: { icon: any, onClick: () => void }) => {
        return (
            <Button shape={'circle'} icon={props.icon} onClick={props.onClick}/>
        )
    }


    return (
        <Menu mode={"horizontal"} className={'header-container'} ellipsis={false}>
            <Grid.Row align={'center'} style={{width: '100%'}} gutter={[0, 8]}>
                <Grid.Col flex={"shrink"}>
                    <Space style={{cursor: 'pointer', transform: 'translate(0, -1px)', marginLeft: '12px'}}>
                        <img
                            src={require('@/assets/logo.gif')}
                            alt={"logo"}
                            width={'36px'}
                            height={'36px'}
                            style={{position: 'absolute', transform: 'translate(0, -18px)'}}
                        />
                        <div style={{marginLeft: '38px', marginRight: '12px'}}>
                            <span style={{fontSize: '18px', fontWeight: 1000, color: 'var(--color-text-2)'}}>
                                Ai Platform
                            </span>
                        </div>
                    </Space>
                </Grid.Col>

                <Grid.Col flex={"shrink"}>
                    <Divider type='vertical'/>
                </Grid.Col>

                <Grid.Col flex={"shrink"}>
                    <Menu.Item key='1'>首页</Menu.Item>
                    <Menu.Item key='2'>模型</Menu.Item>
                    <Menu.Item key='3'>提示词</Menu.Item>
                    <Menu.Item key='4'>关于</Menu.Item>
                </Grid.Col>

                <Grid.Col flex={"1"}>
                </Grid.Col>

                <Grid.Col flex={"shrink"}>
                    <Space size={12} style={{float: 'right', marginLeft: '12px'}}>
                        <Select
                            triggerElement={<Button shape={"circle"} icon={<IconLanguage/>}/>}
                            options={[
                                {label: '中文', value: 'zh-CN'},
                                {label: 'English', value: 'en-US'},
                            ]}
                            value={lang}
                            triggerProps={{
                                autoAlignPopupWidth: false,
                                autoAlignPopupMinWidth: true,
                                position: 'br',
                            }}
                            trigger="hover"
                            onChange={(value) => {
                                setLang(value);
                                Message.info(`切换到 ${value}`);
                            }}
                        />
                        <Tooltip
                            content={
                                theme === 'light'
                                    ? loc['settings.navbar.theme.toDark']
                                    : loc['settings.navbar.theme.toLight']
                            }
                        >
                            <IconButton
                                icon={theme !== 'dark' ? <IconMoonFill/> : <IconSunFill/>}
                                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                            />
                        </Tooltip>
                        <Button
                            icon={<ControlPlatformIcon/>}
                            type={'primary'}
                            shape={'round'}
                        >
                            在线画图
                        </Button>

                        <Dropdown
                            position={'br'}
                            unmountOnExit={true}
                            droplist={
                                <Menu
                                    style={{maxHeight:'900px'}}
                                >
                                    <Menu.Item style={{height: '48px', margin: '6px 0 8px 0'}} key='0'>
                                        <Space align={'center'} style={{marginTop: '4px'}}>
                                            <Avatar
                                                shape={'circle'}
                                            >
                                                WA
                                            </Avatar>
                                            <Divider style={{margin: '0 0 0 0'}} type='vertical'/>
                                            <h3
                                                style={{margin: '0 0 0 0'}}
                                            >
                                                请先登录 {'>'}
                                            </h3>
                                        </Space>
                                    </Menu.Item>
                                    <Divider style={{margin: '0 0 0 0'}} type='horizontal'/>
                                    <Card>
                                        <Space style={{width: '100%'}} direction={'vertical'} align={'center'}>
                                            <Space size={16}>
                                                <Statistic
                                                    title={"已购算力"}
                                                    prefix={<ThunderIcon/>}
                                                    value={0}
                                                />
                                                <Divider style={{margin: '0 0 0 0'}} type='vertical'/>
                                                <Statistic
                                                    title={"每日赠送"}
                                                    prefix={<ThunderIcon/>}
                                                    value={0}
                                                />
                                            </Space>
                                            <Button.Group>
                                                <Button icon={<IconShareExternal/>} type={'primary'} shape={'round'}>
                                                    分享
                                                </Button>
                                                <Button icon={<WalletIcon/>} type={'primary'} shape={'round'}>
                                                    充值
                                                </Button>
                                            </Button.Group>
                                        </Space>
                                    </Card>

                                    <Divider style={{margin: '0 0 0 0'}} type='horizontal'/>

                                    <Menu.Item key='1'>个人资料</Menu.Item>
                                    <Menu.Item key='2'>我的收藏</Menu.Item>
                                    <Menu.Item key='3'>我的图片</Menu.Item>
                                    <Menu.Item key='4'>我的帖子</Menu.Item>

                                    <Divider style={{margin: '0 0 0 0'}} type='horizontal'/>

                                    <Menu.Item key='log'>登录</Menu.Item>


                                </Menu>
                            }
                        >
                            <Avatar
                                size={36}
                                shape={'circle'}
                                style={{cursor: 'pointer'}}
                            >
                                wa
                            </Avatar>
                        </Dropdown>
                    </Space>
                </Grid.Col>

            </Grid.Row>

            <Divider style={{position: 'absolute', transform: 'translate(-20px, 29px)'}} type='horizontal'/>
        </Menu>
    )
}

export default Header;