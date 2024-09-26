import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import 'echarts-wordcloud';
import { Spin, Select, Message } from '@arco-design/web-react';
import axios from 'axios';
import Backend_URL from "@/pages/dashboard/config";

const Option = Select.Option;

const containerStyle: React.CSSProperties = {
    width: '80%',
    margin: '0px auto',
    marginBottom: '20px',
    borderRadius: '8px',
    padding: '20px',
    position: 'relative',
};

const selectWrapperStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
};

const WordCloudChart = ({ timeRange, setTimeRange }) => {
    const chartRef = useRef<HTMLDivElement | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const chartInstance = echarts.init(chartRef.current!);

        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${Backend_URL}/dashboard/wordFrequency`, {
                    params: {
                        startTime: timeRange.startTime,
                        endTime: timeRange.endTime,
                        limit: timeRange.limit,
                    },
                });

                const wordCloudData = response.data.data.map(item => ({
                    name: item.word,
                    value: item.frequency,
                }));

                const option = {
                    tooltip: {
                        show: true,
                    },
                    series: [
                        {
                            type: 'wordCloud',
                            gridSize: 10,
                            sizeRange: [10, 50],
                            rotationRange: [-90, 90],
                            shape: 'circle',
                            width: '100%',
                            height: '100%',
                            drawOutOfBound: false,
                            textStyle: {
                                fontFamily: 'sans-serif',
                                fontWeight: 'bold',
                                color: function () {
                                    return `rgb(${[
                                        Math.round(Math.random() * 160),
                                        Math.round(Math.random() * 160),
                                        Math.round(Math.random() * 160)
                                    ].join(',')})`;
                                },
                            },
                            emphasis: {
                                textStyle: {
                                    shadowBlur: 10,
                                    shadowColor: '#333',
                                },
                            },
                            data: wordCloudData,
                        },
                    ],
                };

                chartInstance.setOption(option);
            } catch (error) {
                console.error('获取词云数据失败:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => {
            chartInstance.dispose();
        };
    }, [timeRange]);

    const handleDayChange = (value: string) => {
        const currentTime = Date.now();
        const dayInMilliseconds = 86400000;
        const newTimeRange = {
            ...timeRange,
            startTime: currentTime - parseInt(value) * dayInMilliseconds,
            endTime: currentTime,
        };
        setTimeRange(newTimeRange);

        Message.info({
            content: `您选择了 ${value}天`,
            showIcon: true,
        });
    };

    const handleLimitChange = (value: string) => {
        setTimeRange({
            ...timeRange,
            limit: parseInt(value),
        });

        Message.info({
            content: `您选择了前 ${value} 个词语`,
            showIcon: true,
        });
    };

    return (
        <div style={containerStyle}>
            <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 1, margin: 20, height: 31.5 }}>
                <h2 style={{ margin: 0, color: 'var(--color-text-2)' }}>热门搜索词</h2>
            </div>

            <div style={{ position: 'absolute', top: 0, right: 0, margin: 20, zIndex: 1 }}>
                <div style={{ display: 'flex', gap: '20px' }}>
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
                    <div style={selectWrapperStyle}>
                        <span style={{ fontWeight: 800, color: 'var(--color-text-2)' }}>数量选择 |</span>
                        <Select
                            placeholder='选择数量'
                            style={{ width: 100 }}
                            onChange={handleLimitChange}
                            defaultValue='10'
                        >
                            <Option value='10'>前10</Option>
                            <Option value='50'>前50</Option>
                            <Option value='100'>前100</Option>
                            <Option value='200'>前200</Option>
                        </Select>
                    </div>
                </div>
            </div>

            {loading && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}><Spin /></div>}
            <div
                ref={chartRef}
                style={{ width: '100%', height: '400px', opacity: loading ? 0.5 : 1, transition: 'opacity 0.3s ease' }}
            ></div>
        </div>
    );
};

export default WordCloudChart;
