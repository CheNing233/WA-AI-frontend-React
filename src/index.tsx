import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import "@arco-design/web-react/dist/css/arco.css";

const consoleError = console.error;

// 屏蔽 React 警告
console.error = function (...args) {
    const message = args.join(' ');

    if (typeof message === 'string') {
        // 屏蔽 嵌套子组件
        if (message.includes('cannot appear as a descendant of'))
            return;
    }
    consoleError.apply(console, args);
};

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    // <React.StrictMode>
    <App/>
    // </React.StrictMode>
);
