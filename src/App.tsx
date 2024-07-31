import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import {ConfigProvider} from '@arco-design/web-react';

import zhCN from '@arco-design/web-react/es/locale/zh-CN';
import enUS from '@arco-design/web-react/es/locale/en-US';

import {Provider} from 'react-redux';
import {createStore} from 'redux';
import rootReducer from './store';
import useStorage from './utils/useStorage';
import {GlobalContext} from "./context";

import LoginIndex from "@/pages/login";


const store = createStore(rootReducer);

function App() {
    const [lang, setLang] = useStorage('arco-lang', 'zh-CN');
    const [theme, setTheme] = useStorage('arco-theme', 'light');

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
                        <Switch>
                            <Route path="/login" component={LoginIndex}/>
                        </Switch>
                    </GlobalContext.Provider>
                </Provider>
            </ConfigProvider>
        </BrowserRouter>
    );
}

export default App;
