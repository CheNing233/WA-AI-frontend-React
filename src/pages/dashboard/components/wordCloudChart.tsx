import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import 'echarts-wordcloud';
import { Select, Space } from '@arco-design/web-react';

const Option = Select.Option;

const WordCloudChart = ({ timeRange, setTimeRange }) => {
    const chartRef = useRef(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const resizeObserverLoopErr = () => {
            const observer = new ResizeObserver(() => {});
            observer.observe(document.body);
            observer.disconnect();
        };

        resizeObserverLoopErr();

        const chartInstance = echarts.init(chartRef.current);

        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://***REMOVED***:5050/dashboard/wordFrequency?startTime=${timeRange.startTime}&endTime=${timeRange.endTime}&limit=${timeRange.limit}`);
                const data = await response.json();

                const wordCloudData = data.data.map(item => ({
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

    const handleDayChange = (value) => {
        const currentTime = Date.now();
        const dayInMilliseconds = 86400000;
        const newTimeRange = {
            ...timeRange,
            startTime: currentTime - value * dayInMilliseconds,
            endTime: currentTime,
        };
        setTimeRange(newTimeRange);
    };

    const handleLimitChange = (value) => {
        setTimeRange({
            ...timeRange,
            limit: value,
        });
    };

    return (
        <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 1, margin: 0, height: 31.5 }}>
                <h2 style={{ margin: 0 }}>热门搜索词</h2>
            </div>

            <div style={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }}>
                <Space>
                    <Select
                        addBefore='选择期限'
                        placeholder='选择天数'
                        style={{ width: 180 }}
                        onChange={handleDayChange}
                        defaultValue={7}
                    >
                        <Option value={7}>7天</Option>
                        <Option value={30}>30天</Option>
                        <Option value={90}>90天</Option>
                        <Option value={365}>1年</Option>
                    </Select>
                    <Select
                        addBefore='选择数量'
                        placeholder='选择数量'
                        style={{ width: 180 }}
                        onChange={handleLimitChange}
                        defaultValue={10}
                    >
                        <Option value={10}>前10</Option>
                        <Option value={50}>前50</Option>
                        <Option value={100}>前100</Option>
                        <Option value={200}>前200</Option>
                    </Select>
                </Space>
            </div>

            {loading && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>加载中...</div>}
            <div
                ref={chartRef}
                style={{ width: '100%', height: '400px', opacity: loading ? 0.5 : 1, transition: 'opacity 0.3s ease' }}
            ></div>
        </div>
    );
};

export default WordCloudChart;
