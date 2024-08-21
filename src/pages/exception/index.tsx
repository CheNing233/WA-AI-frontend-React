import React from 'react';
import {Button, Result, Space, Typography} from '@arco-design/web-react';
import locale from './locale';
import useLocale from '@/utils/useLocale';
import {IconHome, IconLeft, IconRefresh} from "@arco-design/web-react/icon";

function DefaultException() {
    const t = useLocale(locale);

    return (
        <div style={{
            margin: '48px 0 48px 0'
        }}>
            <Result
                status="error"
                subTitle={t['exception.result.default.description']}
                extra={
                    <Space>
                        <Button key="back" type="primary"
                                shape={'round'} icon={<IconLeft/>}
                                onClick={() => window.history.back()}
                        >
                            {t['exception.result.default.back']}
                        </Button>
                        <Button key="home" shape={'round'} icon={<IconHome/>}
                                onClick={() => window.location.href = '/'}
                        >
                            {t['exception.result.default.back.home']}
                        </Button>
                        <Button key="refresh" shape={'round'} icon={<IconRefresh/>}
                                onClick={() => window.location.reload()}
                        >
                            {t['exception.result.default.refresh']}
                        </Button>
                    </Space>
                }
            >
                <div style={{display: "flex", justifyContent: 'center', width: '100%', paddingTop: '36px'}}>
                    <Typography
                        style={{
                            background: 'var(--color-fill-2)', padding: '24px',
                            width: '608px', borderRadius: '8px'
                        }}
                    >
                        <Typography.Paragraph>{t['exception.result.default.try.title']}</Typography.Paragraph>
                        <ul>
                            <li> {t['exception.result.default.try.checkUrl']}</li>
                            <li> {t['exception.result.default.try.permission']}</li>
                            <li> {t['exception.result.default.try.internet']}</li>
                            <li> {t['exception.result.default.try.contact']}</li>
                        </ul>
                    </Typography>
                </div>
            </Result>
        </div>
    );
}

export default DefaultException;
