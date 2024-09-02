import {FC, ReactNode, useState} from 'react'
import {Space} from "@arco-design/web-react";
import Searcher, {ISearcherProps} from "@/components/searcher";
import ImageWaterfall, {IImageWaterfallProps} from "@/components/imageWaterfall";
import {IModel} from "@/services/modules/models";
import api from "@/services/export";
import {getModelsExtraInfo} from "@/services/utils/models";
import {getListUsePrefix} from "@/components/searcher/utils/prefix";


interface IModelDataRenderProps {
    dataElement: (item: IModel) => ReactNode;
    initialSearchValues?: string[];
    searcherProps?: ISearcherProps | any,
    waterfallProps?: IImageWaterfallProps | any,
}

const ModelTypes = [
    {label: 'Checkpoint', value: 'Checkpoint',},
    {label: 'LoRa', value: 'LoRa',},
    {label: 'Embedding', value: 'Embedding',},
    {label: 'VAE', value: 'VAE',},
]


export const ModelDataRender: FC<IModelDataRenderProps> = (props) => {
    const [data, setData] = useState([]);
    const [dataFinished, setDataFinished] = useState(false);
    const [searcherValues, setSearcherValues] = useState(
        props.initialSearchValues || []
    );
    const [searchType, setSearchType] = useState('');
    const [searchQuery, setSearchQuery] = useState('')
    const [waterfallKey, setWaterfallKey] = useState(0)

    const getItems = async (nextGroupKey: number, resolve: () => void) => {
        const count = 20;
        const nextKey = (nextGroupKey - 1) * count;

        api.models.getSdModelsList(
            nextGroupKey,
            count,
            searchQuery,
            searchType
        )
            .then(modelsRes => {
                const list = modelsRes.data.data.models;
                const success = modelsRes.data.success;

                if (list.length > 0) {
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
                } else if (success) {
                    setDataFinished(true)
                    resolve()
                }
            })
    }


    const handleSearch = () => {
        const filters = getListUsePrefix('filter:', searcherValues)
        const others = getListUsePrefix('filter:', searcherValues, true)

        setSearchType('')
        for (const modelType in ModelTypes) {
            if (filters.includes(`filter:${ModelTypes[modelType].value}`)) {
                setSearchType(ModelTypes[modelType].value)
                break;
            }
        }

        setSearchQuery(others.join(' '))
        setWaterfallKey((waterfallKey + 1) % 8)
        setDataFinished(false)
        setData([])
    }

    return (
        <Space direction={'vertical'}
               style={{width: '100%'}}>
            <Searcher
                allowDate={false}
                filters={[
                    {
                        groupName: '模型类型',
                        options: ModelTypes
                    },
                    {
                        groupName: '基底模型',
                        options: [
                            {label: 'SD 1.5', value: 'SD 1.5',},
                        ]
                    },
                ]}
                values={searcherValues}
                onChange={setSearcherValues}
                onSearch={handleSearch}
                {...props.searcherProps}
            />

            <div style={{width: '100%', marginTop: '12px'}}>
                <ImageWaterfall
                    key={`model-waterfall-${waterfallKey}`}
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
                    hasNoMore={dataFinished}
                    onAppend={getItems}
                    {...props.waterfallProps}
                />
            </div>
        </Space>
    )
}