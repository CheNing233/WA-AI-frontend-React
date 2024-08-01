import {Button, Menu, Space} from "@arco-design/web-react";

import './styles/index.css'
import {IconUser} from "@arco-design/web-react/icon";

const Header = () => {
    return (
        <Menu mode={"horizontal"} className={'header-container'}>
            <Space align={'center'} size={16}>
                <Space style={{cursor: 'pointer',transform: 'translate(0, -1px)'}}>
                    <img
                        src={require('@/assets/logo.gif')}
                        alt={"logo"}
                        width={'36px'}
                        height={'36px'}
                        style={{position: 'absolute', transform: 'translate(0, -18px)'}}
                    />
                    <div style={{marginLeft: '36px'}}>
                        <span style={{fontSize: '18px', fontWeight: 1000}}>
                            Ai Platform
                        </span>
                    </div>
                </Space>

                <Menu.Item key='1'>首页</Menu.Item>
                <Menu.Item key='2'>模型</Menu.Item>
                <Menu.Item key='3'>提示词</Menu.Item>
                <Menu.Item key='4'>关于</Menu.Item>

            </Space>

            <Space style={{float: 'right'}}>
                <Button icon={<IconUser />} />

            </Space>
        </Menu>
    )
}

export default Header;