import {Card, Carousel, Grid} from "@arco-design/web-react";

const Home = () => {
    return (
        <div style={{padding: '32px 48px 32px 48px'}}>
            <Grid.Row gutter={[16, 16]}>
                <Grid.Col
                    xs={24}
                    sm={24}
                    md={16}
                    lg={16}
                    xl={16}
                    xxl={16}
                >
                    <Carousel
                        style={{width: '100%', aspectRatio: '16/9'}}
                    >
                        <Card style={{width: '100%', aspectRatio: '16/9'}} bordered={true}>
                            <img
                                src={'https://obj.glcn.top/wa-image/1718369431376.png?imageMogr2/auto-orient/thumbnail/1536x1536%3E/format/webp/blur/1x0/quality/100'}
                                alt={'wa'}
                                style={{width: '100%', height: '100%'}}
                            />
                        </Card>
                    </Carousel>
                </Grid.Col>
                <Grid.Col
                    xs={24}
                    sm={24}
                    md={8}
                    lg={8}
                    xl={8}
                    xxl={8}
                >
                </Grid.Col>
            </Grid.Row>
        </div>
    )
}

export default Home