import {Card, Space} from "@arco-design/web-react";
import {useState} from "react";
import ImageWaterfall from "@/components/imageWaterfall";
import ImageCard from "@/components/imageCard";

const Updates = () => {
    const [data, setData] = useState([]);
    const [pinnedHasNoMore, setPinnedHasNoMore] = useState(false)

    const dataItemElement = (data: any) => {
        return (
            <ImageCard
                src={`https://naver.github.io/egjs-infinitegrid/assets/image/1.jpg`}
                alt="egjs"
            />
        )
    }

    const getItems = async (nextGroupKey: number, resolve: () => void) => {
        const count = 5;
        const nextItems = [];
        const nextKey = (nextGroupKey - 1) * count;

        setPinnedHasNoMore(true);

        for (let i = 0; i < count; ++i) {
            nextItems.push({groupKey: nextGroupKey, key: nextKey + i});
        }

        setData([
            ...data,
            ...nextItems,
        ]);

        resolve();
    }


    return (
        <Space direction={'vertical'} style={{width: '100%'}}
               size={16}
        >
            <Card bordered={true} style={{width: '100%'}} title={'我的置顶'}>
                <ImageWaterfall
                    key={'user-pinned-waterfall'}
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
                    hasNoMore={pinnedHasNoMore}
                    onAppend={getItems}
                    scrollContainer={
                        document.getElementById('left-main-wrapper')
                    }
                />
            </Card>
            <Card bordered={true} style={{width: '100%'}} title={'今年运势'}>
                <Card bordered={true} style={{width: '100%', height: '150px'}}>此处为日历热力图</Card>
            </Card>
        </Space>
    )
}

export default Updates