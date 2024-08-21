import ContentWrapper from "@/components/contentWrapper";
import Banner from "@/components/banner";
import {Button, Grid, Select, Space, Typography} from "@arco-design/web-react";
import Searcher, {ISearcherChildProps} from "@/components/searcher";
import {FC, useState} from "react";
import ImageWaterfall from "@/components/imageWaterfall";
import ImageCard from "@/components/imageCard";

const Posts = () => {

    const [data, setData] = useState([]);

    const dataItemElement = (data: any) => {
        return (
            <ImageCard
                src={`https://naver.github.io/egjs-infinitegrid/assets/image/1.jpg`}
                alt="egjs"
            />
        )
    }

    const getItems = async (nextGroupKey: number) => {
        const count = 20;
        const nextItems = [];
        const nextKey = (nextGroupKey - 1) * count;

        for (let i = 0; i < count; ++i) {
            nextItems.push({groupKey: nextGroupKey, key: nextKey + i});
        }

        setData([
            ...data,
            ...nextItems,
        ]);
    }

    const SearcherExtra: FC<ISearcherChildProps> = ({sendValueToSearch}) => {
        return (
            <Grid.Row gutter={12} style={{marginTop: '12px', flexWrap: 'nowrap'}}>
                <Grid.Col flex={'shrink'}>
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
                        <Select.Option value={'all'}>全部</Select.Option>
                    </Select>
                </Grid.Col>
                <Grid.Col flex={'1'}>
                    <div style={{width: '100%', position: 'relative'}}>
                        <Typography.Ellipsis
                            style={{
                                position: 'absolute',
                                width: '100%',
                            }}
                            expandable={false}
                            showTooltip={false}
                        >
                            {[...Array(30)].map((_, index) => (
                                <Button
                                    key={index}
                                    shape={'round'}
                                    style={{marginRight: '8px'}}
                                >
                                    标签
                                </Button>
                            ))}
                        </Typography.Ellipsis>
                    </div>
                </Grid.Col>
            </Grid.Row>
        )
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
                    allowDate={true}
                    filters={[
                        {
                            groupName: '模型类型',
                            options: [
                                {label: 'Checkpoint', value: 'Checkpoint',},
                                {label: 'LoRa', value: 'LoRa',},
                                {label: 'Embedding', value: 'Embedding',},
                                {label: 'VAE', value: 'VAE',},
                            ]
                        },
                        {
                            groupName: '基底模型',
                            options: [
                                {label: 'SD 1.5', value: 'SD 1.5',},
                                {label: 'SDXL', value: 'SDXL',},
                            ]
                        },
                    ]}
                >
                    <SearcherExtra/>
                </Searcher>

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