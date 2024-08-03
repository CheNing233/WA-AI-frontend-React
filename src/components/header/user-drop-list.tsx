import {Avatar, Button, Card, Divider, Menu, Message, Space, Statistic} from "@arco-design/web-react";
import {ThunderIcon, WalletIcon} from "tdesign-icons-react";
import {IconShareExternal} from "@arco-design/web-react/icon";
import clipboard from "@/utils/clipboard";
import {useHistory} from "react-router-dom";

const UserDropList = () => {
    const history = useHistory();

    return (
        <Menu
            style={{maxHeight: '900px'}}
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

            <Menu.Item key='1'>个人资料</Menu.Item>
            <Menu.Item key='2'>我的收藏</Menu.Item>
            <Menu.Item key='3'>我的图片</Menu.Item>
            <Menu.Item key='4'>我的帖子</Menu.Item>

            <Divider style={{margin: '0 0 0 0'}} type='horizontal'/>

            <Menu.Item key='log' onClick={() => {
                history.push('/login')
            }}>登录</Menu.Item>

        </Menu>
    )
}

export default UserDropList