import {useEffect, useRef, useState} from "react";
import {MasonryInfiniteGrid} from "@egjs/react-infinitegrid";

import {Button, Card, Grid, Space, Spin} from "@arco-design/web-react";

export type ITagWaterfallProps = {
    cols: { xxxl?: number, xxl?: number, xl?: number, lg?: number, md?: number, sm?: number, xs?: number },
    rowGap: number,
    colGap: number,
    data: { key: number, groupKey: number, data: [] }[],
    hasNoMore: boolean,
    onAppend: (nextGroupKey: number) => Promise<void>;
    scrollContainer: any,
}

const Item = ({num, data}: any) => (
    <Card style={{width: '100%'}} key={num} title={`TOP ${(num + 1) * 100}`} bordered={true}>
        <Grid.Row
            align={'start'}
            gutter={[16, 16]}
            style={{width: '100%', justifyContent: 'flex-start'}}
        >
            {data.map((item: any, index: number) => {
                return (
                    <Grid.Col key={index} flex={'shrink'}>
                        <Button>
                            tag-{item.label}
                        </Button>
                    </Grid.Col>
                )
            })}
        </Grid.Row>
    </Card>
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

    const handleRequestAppend = async (e: any) => {
        const nextGroupKey = (+e.groupKey! || 0) + 1;

        e.wait();
        setLoading(true);
        await props.onAppend(nextGroupKey);
        setLoading(false);
        e.ready();
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