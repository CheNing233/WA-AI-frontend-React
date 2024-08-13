import React, { useState, useEffect } from 'react';
import { Tabs, Select, Typography, Message } from '@arco-design/web-react';
import '@arco-design/web-react/dist/css/arco.css';
import { CSSProperties } from 'react';
import ReactECharts from 'echarts-for-react';
import { useLocation } from 'react-router-dom';

const TabPane = Tabs.TabPane;
const Option = Select.Option;

const containerStyle: CSSProperties = {
    width: '80%',
    margin: '0px auto',
    marginBottom: '-60px',
    borderRadius: '8px',
    padding: '20px',
    position: 'relative',
};

const contentStyle: CSSProperties = {
    textAlign: 'center',
    marginTop: 20,
};

const selectWrapperStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
};

const Data: React.FC = () => {
    const location = useLocation();
    const [timeRange, setTimeRange] = useState<string>('7');
    const [selectedTab, setSelectedTab] = useState<string>('user');

    useEffect(() => {
        // Scroll to top when the component mounts or location changes
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 0);

        // Update selected tab based on URL query parameter
        const queryParams = new URLSearchParams(location.search);
        const tab = queryParams.get('tab');
        if (tab) {
            setSelectedTab(tab);
        }
    }, [location.search]);

    const titleText = `近${timeRange}天${selectedTab === 'user' ? '用户量' : selectedTab === 'model' ? '模型量' : selectedTab === 'posts' ? '帖子量' : selectedTab === 'comments' ? '评论量' : selectedTab === 'tasks' ? '任务量' : 'SD图片量'}`;

    const chartOptions = {
        tooltip: {
            trigger: 'axis',
        },
        legend: {
            data: [''],
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['08-01', '08-02', '08-03', '08-04', '08-05', '08-06', '08-07'],
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                name: '变化量',
                type: 'line',
                stack: '总量',
                data: [120, 132, 101, 134, 90, 230, 210],
            },
        ],
    };

    const handleDayChange = (value: string) => {
        setTimeRange(value);
        Message.info({
            content: `您选择了 ${value}天.`,
            showIcon: true,
        });
    };

    const handleTabChange = (key: string) => {
        setSelectedTab(key);
    };

    return (
        <div style={containerStyle}>
            <Tabs
                activeTab={selectedTab} // Use activeKey to control the active tab
                onChange={handleTabChange}
                extra={
                    <div style={selectWrapperStyle}>
                        <span style={{ fontWeight: 800, color: 'var(--color-text-2)' }}>时间选择 |</span>
                        <Select
                            placeholder='选择天数'
                            style={{ width: 100 }}
                            onChange={handleDayChange}
                            defaultValue='7'
                        >
                            <Option value='7'>7天</Option>
                            <Option value='30'>30天</Option>
                            <Option value='90'>90天</Option>
                            <Option value='365'>365天</Option>
                        </Select>
                    </div>
                }
            >
                <TabPane key="user" title="用户">
                    <Typography.Paragraph style={contentStyle}></Typography.Paragraph>
                </TabPane>
                <TabPane key="model" title="模型">
                    <Typography.Paragraph style={contentStyle}></Typography.Paragraph>
                </TabPane>
                <TabPane key="posts" title="帖子">
                    <Typography.Paragraph style={contentStyle}></Typography.Paragraph>
                </TabPane>
                <TabPane key="comments" title="评论">
                    <Typography.Paragraph style={contentStyle}></Typography.Paragraph>
                </TabPane>
                <TabPane key="tasks" title="任务">
                    <Typography.Paragraph style={contentStyle}></Typography.Paragraph>
                </TabPane>
                <TabPane key="sd-images" title="SD图片">
                    <Typography.Paragraph style={contentStyle}></Typography.Paragraph>
                </TabPane>
            </Tabs>

            <Typography.Title heading={6} style={{ margin: '0px 0px 0px 75px', textAlign: 'left', fontWeight: 'bold' }}>
                {titleText}
            </Typography.Title>

            <div>
                <ReactECharts option={chartOptions} style={{ height: 350 }} />
            </div>
        </div>
    );
};

export default Data;
