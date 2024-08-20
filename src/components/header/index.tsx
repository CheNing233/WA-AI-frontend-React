import {Avatar, Button, Divider, Dropdown, Grid, Menu, Message, Select, Space, Tooltip,} from "@arco-design/web-react";

import './styles/index.css'
import {IconLanguage, IconMoonFill, IconSunFill} from "@arco-design/web-react/icon";
import {ControlPlatformIcon} from "tdesign-icons-react";

import {useContext, useMemo} from "react";
import {GlobalContext} from '@/context';
import locate from './locate'
import useLocale from "@/utils/useLocale";
import Logo from "@/components/header/logo";

import useRoute, {getFlattenRoutes} from "@/routes";
import {useHistory, useLocation} from 'react-router-dom'
import useWorkbench from "@/components/workbench/useWorkbench";
import {IUser, useUser} from "@/store/user";
import UserDropList from "@/components/header/userDropList";

const Header = () => {
    const {lang, setLang, theme, setTheme} = useContext(GlobalContext);
    const loc = useLocale(locate)

    const location = useLocation()
    const history = useHistory()

    const [routes] = useRoute();
    const flattenRoutes = useMemo(() => getFlattenRoutes(routes) || [], [routes]);

    const {workbenchShow, setWorkbenchShow} = useWorkbench();

    const userInfo = useUser((state: IUser) => state.userInfo)


    /**
     * 获取当前选中的路由键
     *
     * 此函数用于从预定义的路由数组中查找与当前URL匹配的路由键
     * 它通过比较路由对象的key属性与当前location的pathname来实现匹配
     * 如果找到匹配项，则返回该路由的键值，否则返回undefined
     */
    const getSelectedKey = () => {
        return flattenRoutes.find(
            (route) => `/${route.key}` === location.pathname
        )?.key;
    }

    const handleClickMenuItem = (key: string) => {
        history.push(`/${key}`)
    }

    return (
        <Menu
            mode={"horizontal"}
            className={'header-container'}
            ellipsis={false}
            selectedKeys={getSelectedKey()}
            onClickMenuItem={handleClickMenuItem}
        >
            <Grid.Row
                align={'center'}
                className={'header-row-container'}
                gutter={[0, 24]}
            >
                <Grid.Col flex={"shrink"}>
                    <Logo/>
                </Grid.Col>

                <Grid.Col flex={"shrink"}>
                    <Divider type='vertical'/>
                </Grid.Col>

                <Grid.Col flex={"shrink"}>
                    {
                        flattenRoutes.map((route) => {
                            if (route.ignore) {
                                return null;
                            }
                            return (
                                <Menu.Item
                                    key={route.key}
                                >
                                    {loc[route.name]}
                                </Menu.Item>
                            )
                        })
                    }
                </Grid.Col>

                <Grid.Col flex={"1"}/>

                <Grid.Col flex={"shrink"}>
                    <Space size={12} style={{ marginLeft: '12px'}}>
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
                            <Button
                                shape={'circle'}
                                icon={theme !== 'dark' ? <IconMoonFill/> : <IconSunFill/>}
                                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                            />
                        </Tooltip>
                        <Button
                            icon={<ControlPlatformIcon/>}
                            type={'primary'}
                            shape={'round'}
                            onClick={() => setWorkbenchShow(!workbenchShow)}
                        >
                            在线画图
                        </Button>
                        <UserDropList>
                            <Avatar
                                size={36}
                                shape={'circle'}
                                style={{cursor: 'pointer'}}
                            >
                                {
                                    userInfo.avatarUrl
                                        ? <img alt={'avatar'} src={userInfo.avatarUrl}/>
                                        : 'WA'
                                }
                            </Avatar>
                        </UserDropList>
                    </Space>
                </Grid.Col>
            </Grid.Row>

            <Divider style={{position: 'absolute', left: '0', bottom: '0', margin: '0 0 0 0'}} type='horizontal'/>
        </Menu>
    )
}

export default Header;