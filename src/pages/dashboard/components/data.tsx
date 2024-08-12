import React from 'react';
import { Menu } from '@arco-design/web-react';
import '@arco-design/web-react/dist/css/arco.css'; // Import Arco Design styles

const { Item } = Menu;

const data = () => {
    return (
        <Menu
            mode="horizontal"
            style={{ backgroundColor: 'transparent', border: 'none' }}
            defaultSelectedKeys={['user']}
        >
            <Item key="user">用户</Item>
            <Item key="model">模型</Item>
            <Item key="posts">帖子</Item>
            <Item key="comments">评论</Item>
            <Item key="tasks">任务</Item>
            <Item key="sd-images">SD图片</Item>
        </Menu>
    );
}

export default data;
