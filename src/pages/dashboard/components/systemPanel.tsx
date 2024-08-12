import React, { useEffect, useState } from 'react';
import { Card, Grid } from '@arco-design/web-react';
import { IconUser, IconFile, IconCommon, IconImage } from '@arco-design/web-react/icon';

interface SystemPanelData {
    userCount: number;
    userAddCount: number;
    modelCount: number;
    modelAddCount: number;
    postCount: number;
    postAddCount: number;
    commentCount: number;
    commentAddCount: number;
    taskCount: number;
    taskAddCount: number;
    sdImageCount: number;
    sdImageAddCount: number;
}

const SystemPanel: React.FC = () => {
    const [data, setData] = useState<SystemPanelData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://***REMOVED***:5050/dashboard/systemPanel');
                const result = await response.json();
                setData(result.data);
            } catch (error) {
                console.error('获取数据出错:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const renderCard = (title: string, count: number, icon: React.ReactNode) => (
        <Card
            hoverable
            bordered={false}
            style={{
                backgroundColor: '#f0faff',
                borderRadius: '20px',  // Increased border radius for more rounded corners
                textAlign: 'center',
                padding: '20px 10px',
                height: '100%',
                margin: '5px 15px',  // Added margin for spacing between cards
            }}
        >
            <div style={{ fontSize: '30px', marginBottom: '-25px' }}>{icon}</div>
            <h4 style={{ color: '#8f8f8f', marginBottom: '5px', fontSize: '20px' }}>{title}</h4>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#00aaff', margin: 0 }}>
                {loading ? '-' : count}
            </p>
        </Card>
    );

    const items = [
        { title: '用户总数 >', count: data?.userCount ?? 0, icon: <IconUser /> },
        { title: '模型总数 >', count: data?.modelCount ?? 0, icon: <IconFile /> },
        { title: '帖子总数 >', count: data?.postCount ?? 0, icon: <IconFile /> },
        { title: '评论总数 >', count: data?.commentCount ?? 0, icon: <IconCommon /> },
        { title: '任务总数 >', count: data?.taskCount ?? 0, icon: <IconFile /> },
        { title: 'SD图片总数 >', count: data?.sdImageCount ?? 0, icon: <IconImage /> },
    ];

    return (
        <div>
            <div style={{ marginBottom: 20 }}>
                <h2 style={{ margin: 0 }}>数据统计</h2>
            </div>
            <Grid.Row gutter={[10, 10]}>
                {items.map((item, index) => (
                    <Grid.Col key={index} span={8} xs={12} sm={8} md={8} lg={8}>
                        {renderCard(item.title, item.count, item.icon)}
                    </Grid.Col>
                ))}
            </Grid.Row>
        </div>
    );
};

export default SystemPanel;
