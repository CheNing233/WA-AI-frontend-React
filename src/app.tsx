import React, {useEffect, useMemo, useState} from 'react';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';

import {ConfigProvider, ResizeBox} from '@arco-design/web-react';

import zhCN from '@arco-design/web-react/es/locale/zh-CN';
import enUS from '@arco-design/web-react/es/locale/en-US';

import {Provider} from 'react-redux';
import {createStore} from 'redux';
import rootReducer from './store';
import useStorage from './utils/useStorage';
import {GlobalContext} from "./context";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Background from "@/components/background";
import useRoute, {getFlattenRoutes} from "@/routes";
import Workbench from "@/components/workbench";
import useDragSelect from "@/utils/useDragSelect";
import {IWorkbenchSetting, useWorkbenchSetting} from "@/store/workbench";


const store = createStore(rootReducer);


function App() {
    const [lang, setLang] = useStorage('arco-lang', 'zh-CN');
    const [theme, setTheme] = useStorage('arco-theme', 'light');
    const [bodyDragSelect, setBodyDragSelect] = useState(false)
    const [workbenchVisible, setWorkbenchVisible] = useState(false);

    const workbenchWrapperInDrawer = useWorkbenchSetting(
        (state: IWorkbenchSetting) => state.wrapperInDrawer
    )

    const [routes, defaultRoute] = useRoute();
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
                <Provider store={store}>
                    <GlobalContext.Provider value={contextValue}>
                        <Background/>

                        <ResizeBox.Split
                            panes={[
                                <>
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
                                        <Route path="/">
                                            <Redirect to={`/${defaultRoute}`}/>
                                        </Route>
                                    </Switch>
                                    <Footer/>
                                </>,
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
                            size={workbenchVisible ? 0.7 : 1.01}
                        />
                    </GlobalContext.Provider>
                </Provider>
            </ConfigProvider>
        </BrowserRouter>
    );
}

export default App;
