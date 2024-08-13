import React, { useEffect, useState } from 'react';
import { Card, Grid } from '@arco-design/web-react';
import { IconUser, IconFile, IconCommon, IconImage } from '@arco-design/web-react/icon';
import { useHistory } from 'react-router-dom';

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

const containerStyle: React.CSSProperties = {
    width: '80%',
    margin: '0px auto',
    borderRadius: '8px',
    padding: '20px',
};

const SystemPanel: React.FC = () => {
    const [data, setData] = useState<SystemPanelData | null>(null);
    const [loading, setLoading] = useState(true);
    const history = useHistory(); // 获取历史对象

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

    const handleCardClick = (key: string) => {
        history.push(`/dashboard/data?tab=${key}`); // 使用查询参数进行导航
    };

    const renderCard = (title: string, count: number, icon: React.ReactNode, key: string) => (
        <Card
            hoverable
            bordered={true} // 将 bordered 设置为 true，以确保有边框
            onClick={() => handleCardClick(key)}
            style={{
                borderRadius: '20px',
                textAlign: 'center',
                padding: '20px 10px',
                height: '100%',
                margin: '5px 15px',
                cursor: 'pointer',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)', // 添加阴影效果
                border: '1px solid #e8e8e8', // 设置边框样式和颜色
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
        { title: '用户总数 >', count: data?.userCount ?? 0, icon: <IconUser />, key: 'user' },
        { title: '模型总数 >', count: data?.modelCount ?? 0, icon: <IconFile />, key: 'model' },
        { title: '帖子总数 >', count: data?.postCount ?? 0, icon: <IconFile />, key: 'posts' },
        { title: '评论总数 >', count: data?.commentCount ?? 0, icon: <IconCommon />, key: 'comments' },
        { title: '任务总数 >', count: data?.taskCount ?? 0, icon: <IconFile />, key: 'tasks' },
        { title: 'SD图片总数 >', count: data?.sdImageCount ?? 0, icon: <IconImage />, key: 'sd-images' },
    ];

    return (
        <div style={containerStyle}>
            <div style={{ marginBottom: 20 }}>
                <h2 style={{ margin: 0, color: 'var(--color-text-2)'}}>数据统计</h2>
            </div>
            <Grid.Row gutter={[10, 10]}>
                {items.map((item, index) => (
                    <Grid.Col key={index} span={8} xs={12} sm={8} md={8} lg={8}>
                        {renderCard(item.title, item.count, item.icon, item.key)}
                    </Grid.Col>
                ))}
            </Grid.Row>
        </div>
    );
};

export default SystemPanel;
