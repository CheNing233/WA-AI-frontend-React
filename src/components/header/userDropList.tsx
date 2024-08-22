import {
    Avatar,
    Button,
    Card,
    Divider,
    Dropdown,
    Menu,
    Message,
    Modal,
    Space,
    Statistic,
    Tag
} from "@arco-design/web-react";
import {ThunderIcon, WalletIcon} from "tdesign-icons-react";
import {IconShareExternal} from "@arco-design/web-react/icon";
import clipboard from "@/utils/clipboard";
import {useHistory} from "react-router-dom";
import {IUser, useUser} from "@/store/user";
import PermissionWrapper from "@/components/permissionWrapper";
import {useEffect} from "react";
import api from "@/services/export";
import eventbus from "@/eventbus";
import {AxiosError} from "axios";

import './styles/index.css'
import {loadingMessage} from "@/utils/loadingMessage";
import {AdminPerm} from "@/constants/permissions";

const UserDropList = (props: any) => {
    const history = useHistory();

    const userLogged = useUser((state: IUser) => state.userLogged)
    const userInfo = useUser((state: IUser) => state.userInfo)
    const userPerms = useUser((state: IUser) => state.userPerms)

    useEffect(() => {
    }, [userLogged, userInfo])

    // const result = authentication({
    //     srcAndActList: [{resource: 'user', actions: ['fuck']}],
    //     oneOfPerm: false
    // }, userPerms)
    // console.log("authentication", result)

    const getUserTagState = () => {
        if (userLogged) {
            if (userPerms === AdminPerm) {
                return (
                    <Tag size={'small'} bordered={true} color={'arcoblue'}>
                        管理员
                    </Tag>
                )
            } else {
                return (
                    <Tag size={'small'} bordered={true} color={'green'}>
                        Lv0
                    </Tag>
                )
            }
        } else {
            return (
                <Tag size={'small'} bordered={true}>
                    游客
                </Tag>
            )
        }
    }

    const handleClickMenu = (key: string) => {
        switch (key) {
            case 'avatar':
                if (userLogged) {
                    history.push('/user')
                } else {
                    history.push('/login')
                }
                break;
            case 'log':
                if (userLogged) {
                    Modal.confirm({
                        title: '确认退出登录？',
                        onOk: () => {
                            loadingMessage(
                                'msg.logout',
                                '退出登录中...',
                                (resolve) => {
                                    api.account.logout()
                                        .then(() => {
                                            resolve(true, '退出成功')
                                        })
                                        .catch((error: AxiosError) => {
                                            resolve(false, `退出失败：${error.message}`)
                                        })
                                        .finally(() => {
                                            eventbus.emit('user.getLoginState')
                                        })
                                }
                            )
                        }
                    })
                } else {
                    history.push('/login')
                }
                break;
        }
    }

    return (
        <div style={{overflow: 'hidden'}}>
            <Dropdown
                position={'br'}
                unmountOnExit={false}
                trigger={'hover'}
                triggerProps={{
                    className: 'user-dropdown-menu'
                }}
                droplist={
                    <Menu style={{maxHeight: '900px', width: '250px'}} onClickMenuItem={handleClickMenu}>
                        <Menu.Item style={{height: '48px', margin: '6px 0 8px 0'}} key='avatar'>
                            <Space align={'center'} style={{marginTop: '4px'}}>
                                <Avatar shape={'circle'}>
                                    {
                                        userInfo.avatarUrl
                                            ? <img alt={'avatar'} src={userInfo.avatarUrl}/>
                                            : 'WA'
                                    }
                                </Avatar>
                                <Divider style={{margin: '0 0 0 0'}} type='vertical'/>
                                <Space size={8}>
                                    {getUserTagState()}
                                    <span style={{margin: '0 0 0 0', lineHeight: '0'}}>
                                        {userLogged ? userInfo.nickName : '请先登录'} {'>'}
                                    </span>
                                </Space>
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
                                    <Button
                                        icon={<IconShareExternal/>}
                                        type={'primary'}
                                        shape={'round'}
                                        onClick={() => {
                                            clipboard('https://wa.glcn.top/')
                                                .then(() => {
                                                    Message.success('本站链接已复制到剪贴板');
                                                })
                                                .catch((err) => {
                                                    Message.error('本站链接复制失败，原因：' + err);
                                                })
                                        }}
                                    >
                                        分享
                                    </Button>
                                    <Button icon={<WalletIcon/>} type={'primary'} shape={'round'}>
                                        充值
                                    </Button>
                                </Button.Group>
                            </Space>
                        </Card>

                        <Divider style={{margin: '0 0 0 0'}} type='horizontal'/>

                        <Menu.Item key='profile'>个人资料</Menu.Item>
                        <Menu.Item key='favourites'>我的收藏</Menu.Item>
                        <Menu.Item key='images'>我的图片</Menu.Item>
                        <Menu.Item key='posts'>我的帖子</Menu.Item>

                        <Divider style={{margin: '0 0 0 0'}} type='horizontal'/>

                        <PermissionWrapper
                            required={{
                                srcAndActList: [{resource: 'user', actions: ['login', 'register']}],
                                oneOfPerm: true
                            }}
                            backup={<Menu.Item key='log' disabled={true}>登录已禁用</Menu.Item>}
                        >
                            <Menu.Item key='log'>
                                {userLogged ? '退出登录' : '登录'}
                            </Menu.Item>
                        </PermissionWrapper>
                    </Menu>
                }
            >
                {props.children}
            </Dropdown>
        </div>
    )
}

export default UserDropList