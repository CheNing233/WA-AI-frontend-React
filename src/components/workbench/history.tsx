import {Card, Link, Space} from "@arco-design/web-react";
import ImageWaterfall from "@/components/imageWaterfall";
import {useRef, useState} from "react";
import ImageCard from "@/components/imageCard";

const History = () => {

    const containerRef = useRef(null);
    const [data, setData] = useState([]);

    const dataItemElement = (data: any) => {
        return (
            <ImageCard
                src={`https://naver.github.io/egjs-infinitegrid/assets/image/1.jpg`}
                alt="egjs"
            />
        )
    }

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
                extra={<Link>&nbsp;多选&nbsp;</Link>}
                style={{width: '100%',}}
            >
                <div
                    ref={containerRef}
                    style={{
                        width: '100%',
                        height: 'calc(100vh - 136px)',
                        overflowX: 'visible',
                        overflowY: 'auto',
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
                        dataItemElement={dataItemElement}
                        hasNoMore={false}
                        scrollContainer={containerRef.current}
                        onAppend={getItems}
                    />
                </div>
            </Card>
        </Space>
    )
}

export default History