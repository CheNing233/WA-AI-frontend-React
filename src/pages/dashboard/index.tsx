import React, { useEffect, useState } from 'react';
import { Layout, Menu } from '@arco-design/web-react';
import { Route, Switch, Link, useLocation } from 'react-router-dom';
import {
    IconApps,
    IconUser,
    IconFolder,
    IconDashboard,
    IconFileImage,
    IconSettings,
    IconTags
} from '@arco-design/web-react/icon';

import dashboard from "@/pages/dashboard/dashboard";
import data from "@/pages/dashboard/components/data"

import userManagement from "@/pages/dashboard/user/userManagement";
import userPermissions from "@/pages/dashboard/user/userPermissions";

import postPublish from "@/pages/dashboard/post/postPublish";
import postReview from "@/pages/dashboard/post/postReview";
import postCategory from "@/pages/dashboard/post/postCategory";
import postStats from "@/pages/dashboard/post/postStats";

import modelPublish from "@/pages/dashboard/model/modelPublish";
import modelReview from "@/pages/dashboard/model/modelReview";
import modelCategory from "@/pages/dashboard/model/modelCategory";
import modelStats from "@/pages/dashboard/model/modelStats";

import imagePublish from "@/pages/dashboard/image/imagePublish";
import imageReview from "@/pages/dashboard/image/imageReview";
import imageCategory from "@/pages/dashboard/image/imageCategory";
import imageStats from "@/pages/dashboard/image/imageStats";

import configManagement from "@/pages/dashboard/system/configManagement";
import staticResource from "@/pages/dashboard/system/staticResource";
import clusterManagement from "@/pages/dashboard/system/clusterManagement";

import './styles/index.css'

const { Sider, Content } = Layout;

const DashboardIndex = () => {
    const location = useLocation();
    const [selectedKey, setSelectedKey] = useState<string | null>(null);

    useEffect(() => {
        const path = location.pathname;
        setSelectedKey(path);
        localStorage.setItem('selectedKey', path);
    }, [location.pathname]);

    useEffect(() => {
        const savedKey = localStorage.getItem('selectedKey');
        if (savedKey) {
            setSelectedKey(savedKey);
        }
    }, []);

    return (
        <Layout style={{ minHeight: '74vh' }}>
            <Sider theme="dark" style={{ width:'170px',backgroundColor: 'white', height: '90vh', overflow: 'hidden', position: 'fixed', left: 0 }}>
                <Menu
                    mode="vertical"
                    selectedKeys={[selectedKey!]}
                    defaultOpenKeys={['userManagement', 'postManagement', 'modelManagement', 'imageManagement', 'systemSettings']}
                    style={{ height: '100%' }}
                >

                    <Menu.Item key="/dashboard">
                        <Link to="/dashboard" className={"menu-link"}>
                            <IconApps />
                            首页统计面板
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="/dashboard/data">
                        <Link to="/dashboard/data" className={"menu-link"}>
                            <IconTags />
                            数据中心
                        </Link>
                    </Menu.Item>
                    <Menu.SubMenu
                        key="userManagement"
                        title={
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <IconUser />
                            <span>用户管理</span>
                        </div>
                        }
                    >
                        <Menu.Item key="/dashboard/userManagement">
                            <Link to="/dashboard/userManagement">
                                用户查询与更新
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="/dashboard/userPermissions">
                            <Link to="/dashboard/userPermissions">
                                用户身份
                            </Link>
                        </Menu.Item>
                    </Menu.SubMenu>

                    <Menu.SubMenu key="postManagement" title={
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <IconFolder />
                            <span>帖子管理</span>
                        </div>
                    }>
                        <Menu.Item key="/dashboard/postPublish">
                            <Link to="/dashboard/postPublish">
                                帖子发布
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="/dashboard/postReview">
                            <Link to="/dashboard/postReview">
                                帖子审核
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="/dashboard/postCategory">
                            <Link to="/dashboard/postCategory">
                                帖子分类
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="/dashboard/postStats">
                            <Link to="/dashboard/postStats">
                                帖子统计
                            </Link>
                        </Menu.Item>
                    </Menu.SubMenu>

                    <Menu.SubMenu key="modelManagement" title={
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <IconDashboard />
                            <span>模型管理</span>
                        </div>
                    }>
                        <Menu.Item key="/dashboard/modelPublish">
                            <Link to="/dashboard/modelPublish">
                                模型发布
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="/dashboard/modelReview">
                            <Link to="/dashboard/modelReview">
                                模型审核
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="/dashboard/modelCategory">
                            <Link to="/dashboard/modelCategory">
                                模型分类
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="/dashboard/modelStats">
                            <Link to="/dashboard/modelStats">
                                模型统计
                            </Link>
                        </Menu.Item>
                    </Menu.SubMenu>
                    <Menu.SubMenu key="imageManagement" title={
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <IconFileImage />
                            <span>图片管理</span>
                        </div>
                    }>
                        <Menu.Item key="/dashboard/imagePublish">
                            <Link to="/dashboard/imagePublish">
                                图片发布
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="/dashboard/imageReview">
                            <Link to="/dashboard/imageReview">
                                图片审核
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="/dashboard/imageCategory">
                            <Link to="/dashboard/imageCategory">
                                图片分类
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="/dashboard/imageStats">
                            <Link to="/dashboard/imageStats">
                                图片统计
                            </Link>
                        </Menu.Item>
                    </Menu.SubMenu>
                    <Menu.SubMenu key="systemSettings" title={
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <IconSettings />
                            <span>系统设置</span>
                        </div>
                    }>
                        <Menu.Item key="/dashboard/configManagement">
                            <Link to="/dashboard/configManagement">
                                配置管理
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="/dashboard/staticResource">
                            <Link to="/dashboard/staticResource">
                                静态资源管理
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="/dashboard/clusterManagement">
                            <Link to="/dashboard/clusterManagement">
                                集群管理
                            </Link>
                        </Menu.Item>
                    </Menu.SubMenu>
                </Menu>
            </Sider>
            <Layout style={{ marginLeft: 160 }}>
                <Content style={{ padding: '20px' }}>
                    <Switch>
                        <Route exact path="/dashboard" component={dashboard} />
                        <Route exact path="/dashboard/data" component={data} />
                        <Route path="/dashboard/userManagement" component={userManagement} />
                        <Route path="/dashboard/userPermissions" component={userPermissions} />
                        <Route path="/dashboard/postPublish" component={postPublish} />
                        <Route path="/dashboard/postReview" component={postReview} />
                        <Route path="/dashboard/postCategory" component={postCategory} />
                        <Route path="/dashboard/postStats" component={postStats} />
                        <Route path="/dashboard/modelPublish" component={modelPublish} />
                        <Route path="/dashboard/modelReview" component={modelReview} />
                        <Route path="/dashboard/modelCategory" component={modelCategory} />
                        <Route path="/dashboard/modelStats" component={modelStats} />
                        <Route path="/dashboard/imagePublish" component={imagePublish} />
                        <Route path="/dashboard/imageReview" component={imageReview} />
                        <Route path="/dashboard/imageCategory" component={imageCategory} />
                        <Route path="/dashboard/imageStats" component={imageStats} />
                        <Route path="/dashboard/configManagement" component={configManagement} />
                        <Route path="/dashboard/staticResource" component={staticResource} />
                        <Route path="/dashboard/clusterManagement" component={clusterManagement} />
                    </Switch>
                </Content>
            </Layout>
        </Layout>
    );
};

export default DashboardIndex;