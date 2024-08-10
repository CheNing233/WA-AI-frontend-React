import {Grid} from "@arco-design/web-react";
import ImageBlurWrapper from "@/components/imageBlurWrapper";
import ImageList from "@/components/imageList";
import {useEffect, useRef, useState} from "react";

const ImageSlider = () => {
    const smallLayoutThres = 768

    const sliderContainerRef = useRef(null)
    const imageContainerRef = useRef(null)
    const [sliderContainerWidth, setSliderContainerWidth] = useState(0)
    const [imageContainerHeight, setImageContainerHeight] = useState('100%')


    const handleImageContainerResize = (entries: ResizeObserverEntry[]) => {
        // 处理 图片 容器大小变化的回调逻辑，用于设置 imageList 组件高度
        entries.forEach(entry => {
            setImageContainerHeight(`${entry.contentRect.height}px`)
        });
    };

    const handleSliderContainerResize = (entries: ResizeObserverEntry[]) => {
        // 处理 该组件 容器大小变化的回调逻辑
        setSliderContainerWidth(entries[0].contentRect.width)
    }

    useEffect(() => {
        const resizeObserver = new ResizeObserver(handleImageContainerResize);

        if (imageContainerRef.current) {
            resizeObserver.observe(imageContainerRef.current);
        }

        return () => {
            resizeObserver.disconnect();
        }
    }, [imageContainerRef])

    useEffect(() => {
        const resizeObserver = new ResizeObserver(handleSliderContainerResize);

        if (sliderContainerRef.current) {
            resizeObserver.observe(sliderContainerRef.current);
        }

        return () => {
            resizeObserver.disconnect();
        }
    }, [sliderContainerRef])

    return (
        <Grid.Row ref={sliderContainerRef}>
            <Grid.Col
                {...(sliderContainerWidth <= smallLayoutThres ?
                    {span: 24} : {flex: '1'})}
            >
                <ImageBlurWrapper
                    ref={imageContainerRef}
                    src={'https://obj.glcn.top/wa-image/1718369431376.png?imageMogr2/auto-orient/thumbnail/1536x1536%3E/format/webp/blur/1x0/quality/100'}
                    style={{width: '100%', height: 'calc(100vh - 200px)'}}
                />
            </Grid.Col>

            <Grid.Col
                {...(sliderContainerWidth <= smallLayoutThres ?
                    {span: 24} : {flex: 'shrink'})}
                style={
                    sliderContainerWidth <= smallLayoutThres ?
                        {marginTop: '12px'} : {marginLeft: '12px'}
                }
            >
                <ImageList
                    direction={
                        sliderContainerWidth <= smallLayoutThres ?
                            'horizontal' : 'vertical'
                    }
                    style={{
                        width: sliderContainerWidth <= smallLayoutThres ?
                            '100%' : '128px',
                        height: sliderContainerWidth <= smallLayoutThres ?
                            '100%' : imageContainerHeight
                    }}
                />
            </Grid.Col>
        </Grid.Row>
    )
}

export default ImageSlider