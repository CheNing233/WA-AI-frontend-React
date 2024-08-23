import ContentWrapper from "@/components/contentWrapper";
import Banner from "@/components/banner";
import {Button, Grid, Select, Space, Typography} from "@arco-design/web-react";
import Searcher, {ISearcherChildProps} from "@/components/searcher";
import {FC, useState} from "react";
import ImageWaterfall from "@/components/imageWaterfall";
import ImageCard from "@/components/imageCard";
import api from "@/services/export";
import {getModelsExtraInfo} from "@/services/utils/models";
import {convertUTCTime} from "@/utils/time";
import {IModel} from "@/services/modules/models";

const Models = () => {

    const [data, setData] = useState([]);

    const dataItemElement = (data: IModel | any) => {
        return (
            <ImageCard
                width={'100%'}
                id={data.id}
                author={data.nickName}
                authorAvatar={data.userAvatarUrl}
                title={data.title}
                time={convertUTCTime(data.updateTime)}
                src={data.bannerUrl}
                onImageClick={() => {

                }}
            />
        )
    }

    const getItems = async (nextGroupKey: number, resolve: () => void) => {
        const count = 20;
        const nextKey = (nextGroupKey - 1) * count;

        api.models.getSdModelsList(nextGroupKey, count)
            .then(modelsRes => {
                const list = modelsRes.data.data.models;

                if (list) {
                    getModelsExtraInfo(
                        list,
                        (finalModels) => {
                            const newModels = []

                            for (let i = 0; i < finalModels.length; ++i) {
                                newModels.push({
                                    groupKey: nextGroupKey, key: nextKey + i,
                                    ...finalModels[i]
                                });
                            }

                            setData([
                                ...data,
                                ...newModels,
                            ]);

                            resolve()
                        }
                    )
                }
            })
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
                        title={'模型'}
                        description={'SDWebUI使用开源的AI模型生成图片，你可以任意组合不同的模型和提示词，生成各种不同风格的图片。'}
                        extra={
                            <Space>
                                <Button shape={'round'} type={'primary'}>打开工作台</Button>
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

export default Models