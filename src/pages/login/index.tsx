import {Card, Space, Tabs} from '@arco-design/web-react';

import Login from "./login"
import Register from "./register"

import "./styles/index.css"
import {useEffect, useState} from "react";
import eventbus from "@/eventbus";

const LoginIndex = () => {

    const [loading, setLoading] = useState(false)
    const [tab, setTab] = useState('1')

    useEffect(() => {
        const handleLoading = (isLoading: boolean) => {
            setLoading(isLoading)
        }

        const handleTab = (newTab: string) => {
            setTab(newTab)
        }

        eventbus.on('login.index.loading', handleLoading)
        eventbus.on('login.index.tab', handleTab)
        return () => {
            eventbus.off('login.index.loading', handleLoading)
            eventbus.off('login.index.tab', handleTab)
        }
    }, []);

    return (
        <div style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            flexDirection: "column"
        }}>
            <Space
                align={"center"}
                direction={"vertical"}
            >
                <img src={require("@/assets/logo.gif")} alt={"logo"}
                     style={{
                         width: "16vw",
                         height: "16vw",
                         minWidth: "128px",
                         minHeight: "128px",
                         maxWidth: "150px",
                         maxHeight: "150px",
                         margin: "32px 0 -24px 0"
                     }}
                />
                <span className={"banner-title"}>「 the AI Generation Platform 」</span>
                <Card style={{width: "45vw", minWidth: "300px", maxWidth: "550px", marginTop: "48px"}}
                      title={false}
                      bordered={true}
                      loading={loading}
                    // cover={
                    //     <div>123</div>
                    // }
                >
                    <Tabs
                        activeTab={tab}
                        onChange={(key: string) => {
                            setTab(key)
                        }}
                    >
                        <Tabs.TabPane key='1' title='登录'>
                            <Login/>
                        </Tabs.TabPane>
                        <Tabs.TabPane key='2' title='注册'>
                            <Register/>
                        </Tabs.TabPane>
                    </Tabs>
                </Card>
            </Space>
        </div>
    )
}


export default LoginIndex
