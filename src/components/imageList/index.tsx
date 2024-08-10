import {Card, Grid} from "@arco-design/web-react";

import './styles/index.css'
import {useRef} from "react";

export type ImageListProps = {
    direction: 'horizontal' | 'vertical'
    style?: any
}

const ImageList = (props: ImageListProps) => {
    const containerRef = useRef(null);

    const handleMouseWheel = (e: any) => {
        e.stopPropagation();
        if (containerRef.current && props.direction === 'horizontal') {
            containerRef.current.scrollLeft += e.deltaY;
        }
    }

    return (
        <Card
            ref={containerRef}
            bodyStyle={{padding: '0'}}
            bordered={true}
        >
            <Grid.Row
                className={
                    'image-list' +
                    (props.direction === 'horizontal' ? ' horizontal' : ' vertical')
                }
                style={props.style}
                onWheel={handleMouseWheel}
            >
                {
                    Array.from({length: 9}, (_, index) => (
                        <Grid.Col
                            key={index}
                            {...(props.direction === 'horizontal'
                                    ? {
                                        xs: 8,
                                        sm: 6,
                                        md: 6,
                                        lg: 4,
                                        xl: 4,
                                        xxl: 4,
                                        xxxl: 4
                                    }
                                    : {span: 24}
                            )}
                            className={
                                'image-list-item' +
                                (props.direction === 'horizontal' ? ' horizontal' : ' vertical')
                            }
                        >
                            <img
                                src={'https://obj.glcn.top/wa-image/1718369431376.png?imageMogr2/auto-orient/thumbnail/1536x1536%3E/format/webp/blur/1x0/quality/100'}
                                alt={`item-${index}`}
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'cover',
                                    aspectRatio: '1',
                                    borderRadius: '4px'
                                }}
                            />
                        </Grid.Col>
                    ))
                }

            </Grid.Row>
        </Card>
    )
}

export default ImageList