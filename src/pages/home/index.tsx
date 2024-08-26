import {Button, Grid, Message} from "@arco-design/web-react";
import {ControlPlatformIcon} from "tdesign-icons-react";
import ImageCard from "@/components/imageCard";
import GridExt from "@/components/gridExt";
import useWorkbench from "@/components/workbench/useWorkbench";
import ContentWrapper from "@/components/contentWrapper";
import Banner from "@/components/banner";

import './styles/index.css'
import {useEffect, useState} from "react";
import api from "@/services/export";
import {IPost} from "@/services/modules/posts";
import {getPostsExtraInfo} from "@/services/utils/posts";
import {convertUTCTime} from "@/utils/time";
import useImagePreviewerTools from "@/components/imagePreviewer/useImagePreviewerTools";

const Home = () => {
    const {setWorkbenchShow} = useWorkbench()
    const {GridItem} = Grid;

    const [posts, setPosts] = useState<Array<IPost>>([])

    const {openPost} = useImagePreviewerTools()

    useEffect(() => {
        api.posts.getPostLiteByTime(1, 12)
            .then((postsRes) => {
                const list: IPost[] = postsRes.data.data.list
                if (list) {
                    getPostsExtraInfo(
                        list,
                        (p) => {
                            setPosts(p)
                        }
                    )
                }
            })
            .catch((error) => {
                Message.error(`获取数据失败：${error.message}`)
            })
    }, []);


    const handleImageClick = (post: IPost) => {
        openPost(post)
    }

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
                                            onClick={
                                                () => {
                                                }
                                                // () => {
                                                //     setImageViewerShow(
                                                //         true,
                                                //         (resolve, abortController) => {
                                                //             setTimeout(() => {
                                                //                 if (!abortController.signal.aborted) {
                                                //                     resolve([
                                                //                         'https://obj.glcn.top/wa-image/1718369431376.png?imageMogr2/auto-orient/thumbnail/1536x1536%3E/format/webp/blur/1x0/quality/100',
                                                //                         'https://obj.glcn.top/wa-image/1718249700025.png?imageMogr2/auto-orient/thumbnail/1536x1536%3E/format/webp/blur/1x0/quality/100',
                                                //                         'https://obj.glcn.top/wa-image/1718249611312.png?imageMogr2/auto-orient/thumbnail/1536x1536%3E/format/webp/blur/1x0/quality/100',
                                                //                     ])
                                                //                     console.log('pushed')
                                                //                 } else {
                                                //                     console.log('aborted')
                                                //                 }
                                                //             }, 3000)
                                                //         })
                                                // }
                                            }
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

                {posts && posts.map((post, index) => {
                    return (
                        <GridItem span={3} key={`home-posts-${index}`}>
                            <div style={{
                                position: 'relative',
                                width: '100%',
                                aspectRatio: '3/4.14',
                                overflow: 'hidden'
                            }}>
                                <ImageCard
                                    width={'100%'}
                                    id={post.id}
                                    author={post.userNickName}
                                    authorAvatar={post.userAvatarUrl}
                                    title={post.title}
                                    time={convertUTCTime(post.updateTime)}
                                    src={post.bannerUrl}
                                    onImageClick={() => {
                                        handleImageClick(post)
                                    }}
                                />
                            </div>
                        </GridItem>
                    )
                })}


            </GridExt>
        </ContentWrapper>
    )
}

export default Home