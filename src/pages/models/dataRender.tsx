import {FC, ReactNode, useState} from 'react'
import {Space} from "@arco-design/web-react";
import Searcher, {ISearcherProps} from "@/components/searcher";
import ImageWaterfall, {IImageWaterfallProps} from "@/components/imageWaterfall";
import {IModel} from "@/services/modules/models";
import api from "@/services/export";
import {getModelsExtraInfo} from "@/services/utils/models";


interface IModelDataRenderProps {
    dataElement: (item: IModel) => ReactNode;
    searcherProps?: ISearcherProps | any,
    waterfallProps?: IImageWaterfallProps | any,

}

export const ModelDataRender: FC<IModelDataRenderProps> = (props) => {
    const [data, setData] = useState([]);

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

    return (
        <Space direction={'vertical'}
               style={{width: '100%'}}>
            <Searcher
                allowDate={false}
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
                        ]
                    },
                ]}
                {...props.searcherProps}
            />

            <div style={{width: '100%', marginTop: '12px'}}>
                <ImageWaterfall
                    key={'model-waterfall'}
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
                    dataItemElement={props.dataElement}
                    hasNoMore={false}
                    onAppend={getItems}
                    {...props.waterfallProps}
                />
            </div>
        </Space>
    )
}