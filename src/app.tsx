import React, {useEffect, useMemo, useState} from 'react';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';

import {ConfigProvider, ResizeBox} from '@arco-design/web-react';

import './styles/index.css'

import zhCN from '@arco-design/web-react/es/locale/zh-CN';
import enUS from '@arco-design/web-react/es/locale/en-US';

import useStorage from './utils/useStorage';
import {GlobalContext} from "./context";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Background from "@/components/background";
import useRoute, {getFlattenRoutes} from "@/routes";
import Workbench from "@/components/workbench";
import useDragSelect from "@/utils/useDragSelect";
import {IWorkbenchSetting, useWorkbenchSetting} from "@/store/workbench";
import ImagePreviewer from "@/components/imagePreviewer";
import LoginManagement from "@/utils/loginManagement";
import {IUser, useUser} from "@/store/user";
import lazyload from "@/utils/lazyload";
import Websocket from "@/websocket";

function App() {
    const [lang, setLang] = useStorage('arco-lang', 'zh-CN');
    const [theme, setTheme] = useStorage('arco-theme', 'light');
    const [bodyDragSelect, setBodyDragSelect] = useState(false)
    const [imageViewerVisible, setImageViewerVisible] = useState(false);
    const [workbenchVisible, setWorkbenchVisible] = useState(false);
    const userPermission = useUser((state: IUser) => state.userPerms)

    const workbenchWrapperInDrawer = useWorkbenchSetting(
        (state: IWorkbenchSetting) => state.wrapperInDrawer
    )

    const [routes, defaultRoute] = useRoute(userPermission);
    const flattenRoutes = useMemo(() => getFlattenRoutes(routes) || [], [routes]);


    const getArcoLocale = () => {
        switch (lang) {
            case 'zh-CN':
                return zhCN;
            case 'en-US':
                return enUS;
            default:
                return zhCN;
        }
    }
    const setArcoTheme = (theme: string) => {
        if (theme === 'dark') {
            document.body.setAttribute('arco-theme', 'dark');
        } else {
            document.body.removeAttribute('arco-theme');
        }
    }
    useEffect(() => {
        setArcoTheme(theme);
    }, [theme])


    const contextValue = {
        lang,
        setLang,
        theme,
        setTheme,
        bodyDragSelect,
        setBodyDragSelect,
        imageViewerVisible,
        setImageViewerVisible,
        workbenchVisible,
        setWorkbenchVisible,
    };

    const {setElDragSelect} = useDragSelect(document.body)


    return (
        <BrowserRouter>
            <ConfigProvider
                locale={getArcoLocale()}
                componentConfig={{
                    Card: {
                        bordered: false,
                    },
                    List: {
                        bordered: false,
                    },
                    Table: {
                        border: false,
                    },
                }}
            >
                <GlobalContext.Provider value={contextValue}>
                    <Background/>
                    <LoginManagement/>
                    <ResizeBox.Split
                        panes={[
                            <div
                                id={'left-main-wrapper'}
                                style={{
                                    width: '100%',
                                    height: '100vh',
                                    overflowX: 'hidden',
                                    overflowY: 'auto'
                                }}
                            >
                                <Header/>
                                <Switch>
                                    {
                                        flattenRoutes.map((route) => {
                                            return (
                                                <Route
                                                    key={route.key}
                                                    path={'/' + route.key}
                                                    component={route.component}
                                                />
                                            )
                                        })
                                    }
                                    <Route exact path="/">
                                        <Redirect to={`/${defaultRoute}`}/>
                                    </Route>
                                    <Route
                                        path="*"
                                        component={lazyload(() => import('@/pages/exception/index'))}
                                    />
                                </Switch>
                                <Footer/>
                                <ImagePreviewer/>
                                <Websocket/>
                            </div>,
                            <>
                                <Workbench/>
                            </>
                        ]}
                        style={{height: '100vh', overflow: 'hidden'}}
                        onMovingStart={() => {
                            setElDragSelect(false)
                        }}
                        onMovingEnd={() => {
                            setElDragSelect(true)
                        }}
                        disabled={!(workbenchVisible && !workbenchWrapperInDrawer)}
                        size={(workbenchVisible && !workbenchWrapperInDrawer) ? 0.7 : 1.01}
                    />
                </GlobalContext.Provider>
            </ConfigProvider>
        </BrowserRouter>
    );
}

export default App;
