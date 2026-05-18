import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import './i18n';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <>
        <script src="/env-config.js"></script>
        <React.StrictMode>
            <App/>
        </React.StrictMode>
    </>
);