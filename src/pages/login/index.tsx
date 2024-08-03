import {Card, Space, Tabs} from '@arco-design/web-react';

import Login from "./login"
import Register from "./register"

import "./styles/index.css"

const LoginIndex = () => {
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
                      loading={false}
                    // cover={
                    //     <div>123</div>
                    // }
                >
                    <Tabs defaultActiveTab='1'>
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
