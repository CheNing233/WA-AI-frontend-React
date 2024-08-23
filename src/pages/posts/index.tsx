import ContentWrapper from "@/components/contentWrapper";
import Banner from "@/components/banner";
import {Button, Select, Space} from "@arco-design/web-react";
import Searcher from "@/components/searcher";
import {useState} from "react";
import ImageWaterfall from "@/components/imageWaterfall";
import ImageCard from "@/components/imageCard";
import api from "@/services/export";
import {convertUTCTime} from "@/utils/time";
import {getPostsExtraInfo} from "@/services/utils/posts";
import useImagePreviewerTools from "@/components/imagePreviewer/useImagePreviewerTools";

const Posts = () => {


    const {openPost} = useImagePreviewerTools();
    const [data, setData] = useState([]);

    const dataItemElement = (data: any) => {
        return (
            <ImageCard
                width={'100%'}
                id={data.id}
                author={data.userNickName}
                authorAvatar={data.userAvatarUrl}
                title={data.title}
                time={convertUTCTime(data.updateTime)}
                src={data.bannerUrl}
                onImageClick={() => {
                    openPost(data)
                }}
            />
        )
    }

    const getItems = (nextGroupKey: number, resolve: () => void) => {
        const count = 20;
        const nextKey = (nextGroupKey - 1) * count;

        api.posts.getPostLiteByLike(nextGroupKey, count)
            .then((postsRes) => {
                const list = postsRes.data.data.list

                if (list) {
                    getPostsExtraInfo(
                        list,
                        (finalPosts) => {
                            const newPosts = []

                            for (let i = 0; i < finalPosts.length; ++i) {
                                newPosts.push({
                                    groupKey: nextGroupKey, key: nextKey + i,
                                    ...finalPosts[i]
                                });
                            }

                            setData([
                                ...data,
                                ...newPosts,
                            ]);

                            resolve()
                        }
                    )
                }
            })
    }

    return (
        <ContentWrapper>
            <Space
                style={{width: '100%'}}
                direction={'vertical'}
            >
                <div style={{width: '100%', height: '150px'}}>
                    <Banner
                        title={'分享你的创作'}
                        description={'这里是「帖子」，魔法师们的 AI 创作内容将发布到此页，你也可以。'}
                        extra={
                            <Space>
                                <Button shape={'round'} type={'primary'}>立即发帖</Button>
                            </Space>
                        }
                        align={'center'}
                    />
                </div>

                <Searcher
                    allowDate={false}
                    leftChildren={(
                        <Select
                            style={{width: '104px'}}
                            defaultValue={'popular'}
                            triggerProps={{
                                autoAlignPopupWidth: false,
                                autoAlignPopupMinWidth: true,
                            }}
                        >
                            <Select.Option value={'popular'}>近期最热</Select.Option>
                            <Select.Option value={'recent'}>最新发布</Select.Option>
                        </Select>
                    )}
                />

                <div style={{width: '100%', marginTop: '12px'}}>
                    <ImageWaterfall
                        key={'post-waterfall'}
                        cols={{
                            xs: 1,
                            sm: 2,
                            md: 3,
                            lg: 4,
                            xl: 4,
                            xxl: 4,
                            xxxl: 5,
                        }}
                        rowGap={16}
                        colGap={16}
                        data={data}
                        dataItemElement={dataItemElement}
                        hasNoMore={false}
                        onAppend={getItems}
                        scrollContainer={
                            document.getElementById('left-main-wrapper')
                        }
                    />
                </div>
            </Space>
        </ContentWrapper>
    )
}

export default Posts