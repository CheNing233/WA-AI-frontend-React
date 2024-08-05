import {Button, Card, Carousel, Grid, Image, List} from "@arco-design/web-react";
import {Fullscreen1Icon, ImageIcon, TranslateIcon} from "tdesign-icons-react";
import ImageCard from "@/components/imageCard";

const Home = () => {

    const {GridItem} = Grid;

    return (
        <div style={{padding: '32px 48px 32px 48px'}}>
            <Grid
                cols={{
                    xs: 1,
                    sm: 1,
                    md: 1,
                    lg: 9,
                    xl: 12,
                    xxl: 12,
                }}
                colGap={24}
                rowGap={24}
                style={{width: '100%'}}
                collapsed={true}
                collapsedRows={1}
            >
                <GridItem
                    span={6}
                >
                    <Carousel
                        style={{width: '100%', aspectRatio: '6/4'}}
                        autoPlay={true}
                        indicatorType={'line'}
                        indicatorPosition={'outer'}
                    >
                        <img
                            src={'https://obj.glcn.top/wa-image/1718369431376.png?imageMogr2/auto-orient/thumbnail/1536x1536%3E/format/webp/blur/1x0/quality/100'}
                            alt={'wa'}
                            style={{width: '100%', height: '100%', objectFit: 'cover'}}
                        />
                        <img
                            src={'https://obj.glcn.top/wa-image/1718369431376.png?imageMogr2/auto-orient/thumbnail/1536x1536%3E/format/webp/blur/1x0/quality/100'}
                            alt={'wa'}
                            style={{width: '100%', height: '100%', objectFit: 'cover'}}
                        />
                    </Carousel>
                </GridItem>
                <GridItem
                    span={3}
                >
                    <Card
                        bordered={true}
                        style={{width: '100%', aspectRatio: '3/4.14'}}
                    >
                        <ImageCard
                            width={'100%'}
                            // fit={'cover'}
                        />
                    </Card>
                </GridItem>
                <GridItem
                    span={3}
                >
                    <Card
                        bordered={true}
                        style={{width: '100%', aspectRatio: '3/4.14', overflowY: 'auto', overflowX: 'hidden'}}
                    >
                        <List
                            style={{margin: '0 0 0 0'}}
                            dataSource={[
                                {
                                    icon: <TranslateIcon/>,
                                    title: '文生图',
                                    description: '使用英文提示词，调用大模型和各式附加模型生成各式各样的风格图片。',
                                },
                                {
                                    icon: <ImageIcon/>,
                                    title: '图生图',
                                    description: '图生图支持局部重绘、蒙版重绘，并可附加Lora等附加模型。',
                                },
                                {
                                    icon: <Fullscreen1Icon/>,
                                    title: '超分放大',
                                    description: '超分基于 SD 内置的 Upscaler，可用于将图片放大。',
                                }
                            ]}
                            render={(item, index) => (
                                <List.Item
                                    key={index}
                                >
                                    <List.Item.Meta
                                        title={<Button
                                            icon={item.icon}
                                            shape='round'
                                            type='outline'
                                            size='small'>
                                            {item.title} {'>'}
                                        </Button>}
                                        description={item.description}
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </GridItem>
            </Grid>
        </div>
    )
}

export default Home