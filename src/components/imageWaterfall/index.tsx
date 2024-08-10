import * as React from "react";
import {useEffect} from "react";
import {MasonryInfiniteGrid} from "@egjs/react-infinitegrid";

import ImageCard from "@/components/imageCard";
import {Grid} from "@arco-design/web-react";
import GridExt from "@/components/gridExt";

function getItems(nextGroupKey: number, count: number) {
    const nextItems = [];
    const nextKey = nextGroupKey * count;

    for (let i = 0; i < count; ++i) {
        nextItems.push({groupKey: nextGroupKey, key: nextKey + i});
    }
    return nextItems;
}

const Item = ({num, itemWidth}: any) => (
    <div
        style={{
            width: itemWidth,
        }}
    >
        <ImageCard
            src={`https://naver.github.io/egjs-infinitegrid/assets/image/${(num % 33) + 1}.jpg`}
            alt="egjs"
        />
    </div>);

function ImageWaterfall() {
    const masonryRef = React.useRef(null);
    const referenceBoxRef = React.useRef(null);
    const [items, setItems] = React.useState(() => getItems(0, 10));
    const [itemWidth, setItemWidth] = React.useState(0);

    const handleScroll = () => {
        console.log('handleScroll')
        masonryRef.current.renderItems();
    }

    useEffect(() => {
        const handleResize = () => {
            if (referenceBoxRef.current) {
                const width = Math.floor(referenceBoxRef.current.getBoundingClientRect().width);
                setItemWidth(width)
                console.log('handleResize', width)
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
        const scroller = document.getElementById('left-main-wrapper')
        console.log('scroller', scroller)
        if (scroller) {
            scroller.addEventListener('scroll', handleScroll);
        }
        return () => {
            scroller.removeEventListener('scroll', handleScroll);
        }
    },[])

    return (
        <div
            style={{width: "100%", position: 'relative'}}
            // onWheel={handleScroll}
        >
            <GridExt
                style={{
                    position: 'absolute',
                    width: "100%",
                    visibility: 'hidden'
                }}
                cols={{
                    xs: 4,
                    sm: 4,
                    md: 4,
                    lg: 4,
                    xl: 4,
                    xxl: 4,
                    xxxl: 4
                }}
                colGap={16}
                rowGap={16}
                refContainerWidth={true}
            >
                <Grid.GridItem span={1}>
                    <div ref={referenceBoxRef} style={{width: '100%'}}>123</div>
                </Grid.GridItem>
            </GridExt>
            <MasonryInfiniteGrid
                ref={masonryRef}
                style={{
                    width: "100%",
                }}
                gap={{
                    vertical: 16,
                    horizontal: 16
                }}
                useTransform={false}
                useResizeObserver={true}
                observeChildren={true}
                onRequestAppend={(e) => {
                    const nextGroupKey = (+e.groupKey! || 0) + 1;

                    console.log('onRequestAppend')

                    setItems([
                        ...items,
                        ...getItems(nextGroupKey, 10),
                    ]);
                }}
            >
                {
                    items.map((item) => {
                        return (
                            <Item
                                data-grid-groupkey={item.groupKey}
                                key={item.key}
                                num={item.key}
                                itemWidth={itemWidth}
                            />
                        )
                    })
                }
            </MasonryInfiniteGrid>
        </div>
    )
}

export default ImageWaterfall