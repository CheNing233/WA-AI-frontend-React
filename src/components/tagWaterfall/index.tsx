import {useEffect, useRef, useState} from "react";
import {MasonryInfiniteGrid} from "@egjs/react-infinitegrid";

import {Button, Divider, Grid, Space, Spin} from "@arco-design/web-react";
import {ISdTag} from "@/services/modules/prompts";

export type ITagWaterfallProps = {
    cols: { xxxl?: number, xxl?: number, xl?: number, lg?: number, md?: number, sm?: number, xs?: number },
    rowGap: number,
    colGap: number,
    data: { key: number, groupKey: number, data: [] }[],
    hasNoMore: boolean,
    onAppend: (nextGroupKey: number, resolve: () => void) => void;
    onTagClick?: (tag: ISdTag) => void;
    scrollContainer: any,
}

const generateColorValue = (number: number) => {
    const colorRange = [
        '#4aa800', // 紫色
        '#8dbd00', // 靛蓝色
        '#b5bb00', // 绿色
        '#daaf00', // 黄色
        '#ffa500', // 橙色
        'rgba(255,65,0,0.75)', // 红色
    ];

    // 计算每一等分的跨度
    const span = 100000 / colorRange.length;

    // 确保数字在范围内
    number = number > 100000 ? 99999 : number;
    number = Math.min(Math.max(0, number), 100000);

    // 根据数字映射到对应颜色
    const colorIndex = Math.floor(number / span);

    return colorRange[colorIndex];
}

const Item = ({num, data, onTagClick}: any) => (
    <div style={{width: '100%'}}>
        <Grid.Row
            align={'start'}
            gutter={[16, 16]}
            style={{width: '100%', justifyContent: 'space-evenly'}}
        >
            {data.map((item: ISdTag, index: number) => {
                return (
                    <Grid.Col key={index} flex={'shrink'}>
                        {/*<Badge count={item.numberRefe} maxCount={999999999999999} offset={[-4, -4]}*/}
                        {/*       dotStyle={{*/}
                        {/*           fontSize: '10px',*/}
                        {/*           backgroundColor: generateColorValue(item.numberRefe)*/}
                        {/*       }}*/}
                        {/*>*/}
                        <Button
                            style={{height: 'auto', padding: '8px 16px'}}
                            onClick={()=>{
                                onTagClick && onTagClick(item)
                            }}
                        >
                            {item.nameEn} <br/>
                            {item.nameCn}
                        </Button>
                        {/*</Badge>*/}
                    </Grid.Col>
                )
            })}
        </Grid.Row>
        <Divider
            orientation={'center'}
            style={{marginBottom: '0'}}
        >
            {`TOP ${(num) * 100}`}
        </Divider>
    </div>
)


const TagWaterfall = (props: ITagWaterfallProps) => {
    const masonryRef = useRef(null);
    const [rendering, setRendering] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleScroll = () => {
        if (rendering) return;
        setRendering(true)
        masonryRef.current?.renderItems();
    }

    const handleRenderComplete = () => {
        setRendering(false);
    }

    const handleRequestAppend = (e: any) => {
        if (props.hasNoMore) return;
        const nextGroupKey = (+e.groupKey! || 0) + 1;

        const handleResolve = () => {
            setLoading(false);
            e.ready();
        }

        e.wait();
        setLoading(true);
        props.onAppend(nextGroupKey, handleResolve);
    }

    useEffect(() => {
        const scroller = props.scrollContainer;

        if (scroller) {
            scroller.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (!scroller) return;
            scroller.removeEventListener('scroll', handleScroll);
        }
    }, [props.scrollContainer])

    return (
        <div style={{width: "100%", position: 'relative'}}>
            <MasonryInfiniteGrid
                ref={masonryRef}
                style={{width: "100%"}}
                gap={{
                    vertical: props.rowGap,
                    horizontal: props.colGap,
                }}
                column={1}
                useTransform={true}
                useResizeObserver={true}
                observeChildren={true}
                onRequestAppend={handleRequestAppend}
                onRenderComplete={handleRenderComplete}
            >
                {
                    props.data.map((item) => {
                        return (
                            <Item
                                data-grid-groupkey={item.groupKey}
                                key={item.key}
                                num={item.key}
                                data={item.data}
                                onTagClick={props.onTagClick}
                            />
                        )
                    })
                }
            </MasonryInfiniteGrid>
            {loading && <div
                style={{width: '100%', height: '128px', position: 'relative'}}
            >
                <Space style={{top: '50%', left: '50%', transform: 'translate(-50%, -50%)', position: 'absolute'}}>
                    <Spin/>
                    <span>正在加载喵...</span>
                </Space>
            </div>}
        </div>
    )
}

export default TagWaterfall