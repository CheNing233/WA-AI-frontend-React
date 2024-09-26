import React, { useState, useEffect } from 'react';
import { Tabs, Select, Typography, Message, Spin } from '@arco-design/web-react';
import '@arco-design/web-react/dist/css/arco.css';
import { CSSProperties } from 'react';
import ReactECharts from 'echarts-for-react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Backend_URL from "@/pages/dashboard/config";

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
    const [chartOptions, setChartOptions] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(false); // Loading state

    useEffect(() => {
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 0);

        const queryParams = new URLSearchParams(location.search);
        const tab = queryParams.get('tab');
        if (tab) {
            setSelectedTab(tab);
        }
    }, [location.search]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Start loading

            const endDate = new Date().toISOString().split('T')[0];
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - parseInt(timeRange));
            const startDateString = startDate.toISOString().split('T')[0];

            try {
                const response = await axios.get(`${Backend_URL}/dashboard`, {
                    params: {
                        startDate: startDateString,
                        endDate: endDate,
                        type: selectedTab,
                    },
                });

                const data = response.data.data;
                setChartOptions({
                    tooltip: {
                        trigger: 'axis',
                    },
                    legend: {
                        data: ['总数', '增量'],
                        textStyle: {
                            color: '#165DFF',
                        },
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: true,
                        data: data.date.map(date => date.split('-').slice(1).join('-')), // Format as MM-DD
                    },
                    yAxis: [
                        {
                            type: 'value',
                            name: '总数',
                        },
                        {
                            type: 'value',
                            name: '增量',
                        },
                    ],
                    series: [
                        {
                            name: '总数',
                            type: 'bar',
                            yAxisIndex: 0,
                            data: data.count,
                            itemStyle: {
                                color: '#73a0fa',
                            },
                        },
                        {
                            name: '增量',
                            type: 'line',
                            yAxisIndex: 1,
                            data: data.addCount,
                            itemStyle: {
                                color: '#fa5737',
                            },
                            smooth: true,
                        },
                    ],
                });
            } catch (error) {
                Message.error({
                    content: '数据加载失败，请稍后重试。',
                    showIcon: true,
                });
            } finally {
                setLoading(false); // End loading
            }
        };

        fetchData();
    }, [timeRange, selectedTab]);

    const handleDayChange = (value: string) => {
        setTimeRange(value);
        Message.info({
            content: `您选择了 ${value}天`,
            showIcon: true,
        });
    };

    const handleTabChange = (key: string) => {
        setSelectedTab(key);
    };

    const titleText = `近${timeRange}天${selectedTab === 'user' ? '用户量' : selectedTab === 'model' ? '模型量' : selectedTab === 'post' ? '帖子量' : selectedTab === 'comment' ? '评论量' : selectedTab === 'task' ? '任务量' : 'SD图片量'}`;

    return (
        <div style={containerStyle}>
            <Tabs
                activeTab={selectedTab}
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
                <TabPane key="post" title="帖子">
                    <Typography.Paragraph style={contentStyle}></Typography.Paragraph>
                </TabPane>
                <TabPane key="comment" title="评论">
                    <Typography.Paragraph style={contentStyle}></Typography.Paragraph>
                </TabPane>
                <TabPane key="task" title="任务">
                    <Typography.Paragraph style={contentStyle}></Typography.Paragraph>
                </TabPane>
                <TabPane key="image" title="SD图片">
                    <Typography.Paragraph style={contentStyle}></Typography.Paragraph>
                </TabPane>
            </Tabs>

            <Typography.Title heading={6} style={{ margin: '0px 0px 0px 75px', textAlign: 'left', fontWeight: 'bold' }}>
                {titleText}
            </Typography.Title>

            <div>
                {loading ? (
                    <Spin tip="加载中..." style={{ display: 'block', margin: '100px auto' }} />
                ) : (
                    <ReactECharts option={chartOptions} style={{ height: 350 }} />
                )}
            </div>
        </div>
    );
};

export default Data;
