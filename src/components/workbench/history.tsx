import {Button, Card, Message, Space, Tag} from "@arco-design/web-react";
import ImageWaterfall from "@/components/imageWaterfall";
import {useEffect, useRef, useState} from "react";
import ImageCard from "@/components/imageCard";
import api from "@/services/export";
import {convertUTCTime} from "@/utils/time";
import {convertTask2Post, getTasksExtraInfo} from "@/services/utils/tasks";
import useWorkbench from "@/components/workbench/useWorkbench";
import {TaskStatus} from "@/services/modules/tasks";
import useImagePreviewerTools from "@/components/imagePreviewer/useImagePreviewerTools";
import {require} from "ace-builds";
import eventbus from "@/eventbus";
import {IconRefresh} from "@arco-design/web-react/icon";

const History = () => {
    const {workbenchShow} = useWorkbench();
    const containerRef = useRef(null);
    const [data, setData] = useState([]);
    const [dataFinished, setDataFinished] = useState(false);

    const {openPost} = useImagePreviewerTools()

    const dataItemElement = (data: any) => {
        const renderStatus = (status: number) => {
            switch (status) {
                case TaskStatus.created:
                    return (<Tag bordered={true}>
                        创建中
                    </Tag>)
                case TaskStatus.running:
                    return (<Tag color={'arcoblue'} bordered={true}>
                        生成中
                    </Tag>)
                case TaskStatus.success:
                    return (<Tag color={'green'} bordered={true}>
                        已生成
                    </Tag>)
                case TaskStatus.failed:
                    return (<Tag color={'red'} bordered={true}>
                        失败
                    </Tag>)
                case TaskStatus.deleted:
                    return (<Tag color={'gray'} bordered={true}>
                        已删除
                    </Tag>)
                default:
                    return null
            }
        }

        return (
            <ImageCard
                width={'100%'}
                id={data.id}
                title={data.id}
                time={convertUTCTime(data.updateTime)}
                src={data.status !== TaskStatus.success
                    ? require('@/assets/placeholder/noPreview.png')
                    : data.bannerUrl
                }
                onImageClick={() => {
                    if (data.status !== TaskStatus.success) {
                        Message.warning('打不开喵')
                        return
                    }
                    openPost(convertTask2Post(data))
                }}
            >
                <Space style={{position: "absolute", top: '12px', left: '12px'}}
                       direction={'vertical'}
                       align={'end'}
                >
                    {renderStatus(data.status)}
                </Space>
            </ImageCard>
        )
    }

    const getItems = (nextGroupKey: number, resolve: () => void) => {
        const count = 20;
        const nextItems = [];
        const nextKey = (nextGroupKey - 1) * count;

        api.tasks.getTaskByUser(
            nextGroupKey,
            count,
            true
        )
            .then(tasksRes => {
                const list = tasksRes.data.data.list;
                const success = tasksRes.data.success;

                if (list.length > 0) {
                    getTasksExtraInfo(
                        list,
                        (finalTasks) => {
                            const newTasks = []

                            for (let i = 0; i < finalTasks.length; ++i) {
                                newTasks.push({
                                    groupKey: nextGroupKey, key: nextKey + i,
                                    ...finalTasks[i]
                                });
                            }

                            setData([
                                ...data,
                                ...newTasks,
                            ]);

                            resolve()
                        }
                    )
                } else if (success) {
                    setDataFinished(true)
                    resolve()
                }

            })


        for (let i = 0; i < count; ++i) {
            nextItems.push({groupKey: nextGroupKey, key: nextKey + i});
        }

        setData([
            ...data,
            ...nextItems,
        ]);

        resolve();
    }

    useEffect(() => {
        const handleHistoryRefresh = () => {
            setData([])
            setDataFinished(false)
        }
        eventbus.on('workbench.history.refresh', handleHistoryRefresh)
        return () => {
            eventbus.off('workbench.history.refresh', handleHistoryRefresh)
        }
    }, []);

    return (
        <Space
            style={{top: '0', width: '100%'}}
            direction="vertical"
        >
            <Card
                title={<span style={{fontSize: '14px'}}>任务记录</span>}
                bordered={false}
                size={'small'}
                extra={
                    <Space>
                        {/*<Button size={'mini'} shape={'round'} icon={<IconList/>} type={'dashed'}*/}
                        {/*>*/}
                        {/*    多选*/}
                        {/*</Button>*/}
                        <Button size={'mini'} shape={'round'} icon={<IconRefresh/>} type={'dashed'}
                                onClick={() => {
                                    eventbus.emit('workbench.history.refresh')
                                }}
                        >
                            刷新
                        </Button>
                    </Space>
                }
                style={{width: '100%',}}
            >
                <div
                    ref={containerRef}
                    style={{
                        width: '100%',
                        height: 'calc(100vh - 136px)',
                        overflowX: 'hidden',
                        overflowY: 'scroll',
                    }}
                >
                    <ImageWaterfall
                        key={'workbench-waterfall'}
                        cols={{
                            xs: 1,
                            sm: 2,
                            md: 3,
                            lg: 4,
                            xl: 4,
                            xxl: 4,
                            xxxl: 5,
                        }}
                        rowGap={16}
                        colGap={16}
                        data={data}
                        useObserver={true}
                        lock={!workbenchShow}
                        dataItemElement={dataItemElement}
                        hasNoMore={dataFinished}
                        scrollContainer={containerRef.current}
                        onAppend={getItems}
                    />
                </div>
            </Card>
        </Space>
    )
}

export default History