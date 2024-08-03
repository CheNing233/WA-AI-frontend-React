import React, {useEffect, useMemo} from 'react';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';

import {ConfigProvider} from '@arco-design/web-react';

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


const store = createStore(rootReducer);


function App() {
    const [lang, setLang] = useStorage('arco-lang', 'zh-CN');
    const [theme, setTheme] = useStorage('arco-theme', 'light');

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
    };

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
                    </GlobalContext.Provider>
                </Provider>
            </ConfigProvider>
        </BrowserRouter>
    );
}

export default App;
