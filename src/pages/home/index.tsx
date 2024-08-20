import {Button, Grid} from "@arco-design/web-react";
import {ControlPlatformIcon} from "tdesign-icons-react";
import ImageCard from "@/components/imageCard";
import GridExt from "@/components/gridExt";
import useWorkbench from "@/components/workbench/useWorkbench";
import useImagePreviewer from "@/components/imagePreviewer/useImagePreviewer";
import ContentWrapper from "@/components/contentWrapper";
import Banner from "@/components/banner";

import './styles/index.css'

const Home = () => {
    const {setWorkbenchShow} = useWorkbench()
    const {setImageViewerShow} = useImagePreviewer()
    const {GridItem} = Grid;

    return (
        <ContentWrapper>
            <GridExt
                cols={{
                    xs: 1,
                    sm: 1,
                    md: 1,
                    lg: 9,
                    xl: 12,
                    xxl: 15,
                }}
                refContainerWidth={true}
                colGap={24}
                rowGap={24}
                style={{width: '100%'}}
                collapsed={true}
                collapsedRows={2}
            >
                <GridItem
                    span={6}
                >
                    <div style={{width: '100%', aspectRatio: '6/4'}}>
                        <Banner
                            title={'欢迎来到 WA，今天想画点什么？'}
                            description={'这里是 WA，一个基于 Stable Diffusion 的 AI 生成平台。我们在这里提供免费的图片生成服务，包括文生图、图生图、超分放大等。并提供各式各样的附加模型。如果你有更好的想法或是想加入开发，请及时联系我们。'}
                            extra={
                                <Grid.Row gutter={[8, 8]} align={'center'}>
                                    <Grid.Col flex={'shrink'}>
                                        <Button size={'large'} type={'primary'} shape={'round'}
                                                icon={<ControlPlatformIcon/>}
                                                onClick={() => {
                                                    setWorkbenchShow(true)
                                                }}
                                        >
                                            打开工作台
                                        </Button>
                                    </Grid.Col>
                                    <Grid.Col flex={'shrink'}>
                                        <Button
                                            size={'large'}
                                            shape={'round'}
                                            onClick={() => {
                                                setImageViewerShow(true)
                                            }}
                                        >
                                            探索所有帖子 {' >'}
                                        </Button>
                                    </Grid.Col>

                                    {/*<Grid.Col flex={'shrink'}>*/}
                                    {/*    <Button type={'text'} shape={'round'} size={'large'}*/}
                                    {/*            icon={*/}
                                    {/*                <>*/}
                                    {/*                    <MouseIcon/>*/}
                                    {/*                    <ChevronDownDoubleIcon className={'floating-down-arrow'}/>*/}
                                    {/*                </>*/}
                                    {/*            }*/}
                                    {/*    >*/}
                                    {/*        向下滚动，尝试画一下*/}
                                    {/*    </Button>*/}
                                    {/*</Grid.Col>*/}
                                </Grid.Row>
                            }
                        />
                    </div>
                </GridItem>
                <GridItem
                    span={3}
                >
                    <div style={{position: 'relative', width: '100%', aspectRatio: '3/4.14', overflow: 'hidden'}}>
                        <ImageCard
                            width={'100%'}

                            author={'glcn'}
                            title={'测试test'}
                            src={'https://obj.glcn.top/wa-image/1718369431376.png?imageMogr2/auto-orient/thumbnail/1536x1536%3E/format/webp/blur/1x0/quality/100'}

                        />
                    </div>
                </GridItem>
            </GridExt>
        </ContentWrapper>
    )
}

export default Home