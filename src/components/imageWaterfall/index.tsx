import {useEffect, useRef, useState} from "react";
import {MasonryInfiniteGrid} from "@egjs/react-infinitegrid";
import {Grid, Space, Spin} from "@arco-design/web-react";
import GridExt from "@/components/gridExt";


export type IImageWaterfallProps = {
    cols: { xxxl?: number, xxl?: number, xl?: number, lg?: number, md?: number, sm?: number, xs?: number },
    rowGap: number,
    colGap: number,
    data: {
        key: number,
        groupKey: number,
        [key: string]: any
    }[],
    dataItemElement: (data: any) => JSX.Element,
    hasNoMore: boolean,
    onAppend: (nextGroupKey: number) => Promise<void>;
    scrollContainer: any,
}

const Item = ({num, itemWidth, item, render}: any) => (
    <div style={{width: itemWidth - 1,}}>
        {render(item)}
        <div>num {num}</div>
    </div>
)

const ImageWaterfall = (props: IImageWaterfallProps) => {
    const masonryRef = useRef(null);
    const referenceBoxRef = useRef(null);
    const [itemWidth, setItemWidth] = useState(0);
    const [rendering, setRendering] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);


    const handleScroll = () => {
        if (rendering) return;
        setRendering(true)
        masonryRef.current?.renderItems();
    }

    const handleRenderComplete = () => {
        setRendering(false);
    }

    const handleRequestAppend = async (e: any) => {
        if (props.hasNoMore || itemWidth === 0) return;
        const nextGroupKey = (+e.groupKey! || 0) + 1;

        e.wait();
        setLoading(true);
        await props.onAppend(nextGroupKey);
        setLoading(false);
        e.ready();
    }

    useEffect(() => {
        const handleResize = () => {
            if (referenceBoxRef.current) {
                const width = Math.floor(referenceBoxRef.current.getBoundingClientRect().width);
                setItemWidth(width)
                masonryRef.current.renderItems();
            }
        }

        const resizeObserver = new ResizeObserver(handleResize);

        if (referenceBoxRef.current) {
            resizeObserver.observe(referenceBoxRef.current);
        }

        return () => {
            resizeObserver.disconnect();
        }
    }, [referenceBoxRef.current])

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
            <GridExt
                style={{
                    position: 'absolute',
                    width: "100%",
                    visibility: 'hidden'
                }}
                cols={props.cols}
                colGap={props.colGap}
                rowGap={props.rowGap}
                refContainerWidth={true}
            >
                <Grid.GridItem span={1}>
                    <div ref={referenceBoxRef} style={{width: '100%', height: '10px'}}/>
                </Grid.GridItem>
            </GridExt>
            <MasonryInfiniteGrid
                ref={masonryRef}
                // status={status ? status : undefined}
                style={{width: "100%"}}
                gap={{
                    vertical: props.rowGap,
                    horizontal: props.colGap,
                }}
                useTransform={false}
                useResizeObserver={false}
                observeChildren={false}
                resizeDebounce={0}
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
                                item={item}
                                render={props.dataItemElement}
                                itemWidth={itemWidth}
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

export default ImageWaterfall