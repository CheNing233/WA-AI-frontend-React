import {Button, Card, Space} from "@arco-design/web-react";
import ImageWaterfall from "@/components/imageWaterfall";
import {useRef, useState} from "react";

const History = () => {

    const containerRef = useRef(null);
    const [data, setData] = useState([]);

    const getItems = async (nextGroupKey: number) => {
        const count = 20;
        const nextItems = [];
        const nextKey = (nextGroupKey - 1) * count;

        for (let i = 0; i < count; ++i) {
            nextItems.push({groupKey: nextGroupKey, key: nextKey + i});
        }

        setData([
            ...data,
            ...nextItems,
        ]);
    }

    return (
        <Space
            style={{top: '0', width: '100%'}}
            direction="vertical"
        >
            <Card
                title={<span style={{fontSize: '14px'}}>任务记录</span>}
                bordered={false}
                size={'small'}
                extra={<Button size={'small'} type={'text'}>多选</Button>}
                style={{width: '100%',}}
            >
                <div
                    ref={containerRef}
                    style={{
                        width: '100%',
                        height: 'calc(100vh - 136px)',
                        overflowX: 'hidden',
                        overflowY: 'auto',
                    }}
                >
                    <ImageWaterfall
                        cols={{
                            xs: 1,
                            sm: 2,
                            md: 3,
                            lg: 4,
                            xl: 4,
                            xxl: 4,
                            xxxl: 5,
                        }}
                        rowGap={24}
                        colGap={24}
                        data={data}
                        hasNoMore={false}
                        scrollContainer={containerRef}
                        onAppend={getItems}
                    />
                </div>
            </Card>
        </Space>
    )
}

export default History