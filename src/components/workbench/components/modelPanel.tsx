import {IconClose, IconDelete, IconMoreVertical, IconSwap} from "@arco-design/web-react/icon";
import {Button, Collapse, Grid, Message, Space} from "@arco-design/web-react";
import InfoCard from "@/components/workbench/components/infoCard";
import {AddIcon} from "tdesign-icons-react";
import {IWorkbenchModel} from "@/store/workbench";
import {getModelBannerUrl} from "@/services/utils/models";
import {useEffect, useState} from "react";
import {IModel} from "@/services/modules/models";
import ParamsRender from "@/components/workbench/components/paramsRender";
import DialogFrame from "@/components/dialogFrame";
import {ModelDataRender} from "@/pages/models/dataRender";
import ImageCard from "@/components/imageCard";
import {convertUTCTime} from "@/utils/time";
import useWorkbench from "@/components/workbench/useWorkbench";


const ModelPanel = (
    props: {
        name: string,
        setModel: (model: any) => void,
        deleteModel: (modelId: string | number) => void,
        changeModel: (model: any, key: string, value: any) => void,
        checkpoint: IWorkbenchModel,
        vae: IWorkbenchModel,
        extraModels: IWorkbenchModel[]
    }
) => {
    // const [
    //     setModel, deleteModel, changeModel
    // ] = useWorkbenchModels((state) => {
    //     return [
    //         state.setModel, state.deleteModel, state.changeModel
    //     ]
    // })

    const setModel = props.setModel
    const deleteModel = props.deleteModel
    const changeModel = props.changeModel

    const [modelSelectableBoxVisible, setModelSelectableBoxVisible] = useState(false)
    const [modelSelectableBoxSearchValue, setModelSelectableBoxSearchValue] = useState([])
    const {authWorkbench} = useWorkbench()


    useEffect(() => {
        const checkpoint = {...props.checkpoint}
        const vae = {...props.vae}
        const extraModels = [...props.extraModels]

        if (!checkpoint.bannerUrl) {
            getModelBannerUrl(checkpoint as IModel).then(newModel => {
                setModel(newModel)
            })
        }
        if (!vae.bannerUrl) {
            getModelBannerUrl(vae as IModel).then(newModel => {
                setModel(newModel)
            })
        }

        extraModels.forEach((model) => {
            if (!model.bannerUrl) {
                getModelBannerUrl(model as IModel).then(newModel => {
                    setModel(newModel)
                })
            }
        })
    });

    const dataElement = (data: IModel | any) => {
        return (
            <ImageCard
                width={'100%'}
                id={data.id}
                author={data.nickName}
                authorAvatar={data.userAvatarUrl}
                title={data.title}
                time={convertUTCTime(data.updateTime)}
                src={data.bannerUrl}
                maskContent={(
                    <Space
                        align={'center'}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            userSelect: 'none'
                        }}
                        direction={'vertical'}
                    >
                        <AddIcon
                            style={{
                                color: 'white',
                            }}
                            size={48}
                        />
                        <span
                            style={{
                                color: 'white',
                                fontSize: '20px',
                                textShadow: '0 0 6px rgba(0, 0, 0, 1)'
                            }}
                        >
                            添加到工作台
                        </span>
                    </Space>
                )}
                onImageClick={() => {
                    authWorkbench(() => {
                        setModel(data)
                        Message.success(`已添加 ${data.type} 「${data.title}」`)
                    })
                }}
            >
            </ImageCard>
        )
    }


    return (
        <Collapse.Item
            header={<div style={{userSelect: 'none'}}>模型</div>}
            name={props.name}
            extra={<IconMoreVertical/>}
            style={{width: '100%', overflow: 'hidden'}}
        >
            <Space
                direction={'vertical'}
                style={{width: '100%', padding: '12px 0 16px 0', transform: 'translateX(-12px)'}}
                size={16}
            >
                <InfoCard
                    id={`${props.checkpoint.id}`}
                    title={props.checkpoint.title}
                    imageSrc={props.checkpoint.bannerUrl}
                    type={props.checkpoint.type}
                    extra={
                        <Button type={'primary'} size={'mini'} icon={<IconSwap/>}
                                onClick={() => {
                                    setModelSelectableBoxSearchValue(['filter:Checkpoint'])
                                    setModelSelectableBoxVisible(true)
                                }}
                        >
                            切换主模型
                        </Button>
                    }
                />
                <InfoCard
                    id={`${props.vae.id}`}
                    title={props.vae.title}
                    imageSrc={props.vae.bannerUrl}
                    type={props.vae.type}
                    extra={
                        <Button type={'primary'} size={'mini'} icon={<IconSwap/>}
                                onClick={() => {
                                    setModelSelectableBoxSearchValue(['filter:VAE'])
                                    setModelSelectableBoxVisible(true)
                                }}
                        >
                            切换VAE
                        </Button>
                    }
                />

                {props.extraModels.map((model) => {
                    return (
                        <InfoCard
                            id={`${model.id}`}
                            key={model.id}
                            title={model.title}
                            imageSrc={model.bannerUrl}
                            type={model.type}
                            extra={
                                <Button status={'danger'} size={'mini'} icon={<IconDelete/>}
                                        onClick={() => {
                                            deleteModel(model.id)
                                            Message.success(`已删除「${model.title}」`)
                                        }}
                                >
                                    删除模型
                                </Button>
                            }
                        >
                            <ParamsRender params={[
                                {
                                    name: '作为负面模型使用',
                                    type: 'switch',
                                    settings: {
                                        checked: model.asNegative || false,
                                        onChange: () => {
                                            changeModel(model.id,
                                                'asNegative', !model.asNegative)
                                        }
                                    }
                                },
                                {
                                    name: '权重',
                                    type: 'slider',
                                    settings: {
                                        min: 0,
                                        max: 2.5,
                                        step: 0.01,
                                        value: model.weight || 1,
                                        onChange: (newValue: number) => {
                                            changeModel(model.id,
                                                'weight', newValue)
                                        }
                                    }
                                }
                            ]}
                            />
                        </InfoCard>
                    )
                })}

                <Grid.Row gutter={[8, 8]}>
                    <Grid.Col flex={'shrink'}>
                        <Button type={'primary'} icon={<AddIcon/>} long
                                onClick={() => {
                                    setModelSelectableBoxSearchValue(['filter:LoRA'])
                                    setModelSelectableBoxVisible(true)
                                }}
                        >
                            添加LoRa
                        </Button>
                    </Grid.Col>
                    <Grid.Col flex={'shrink'}>
                        <Button type={'primary'} icon={<AddIcon/>} long
                                onClick={() => {
                                    setModelSelectableBoxSearchValue(['filter:Embedding'])
                                    setModelSelectableBoxVisible(true)
                                }}
                        >
                            添加Embedding
                        </Button>
                    </Grid.Col>
                    <Grid.Col flex={'1'}>
                        <Button icon={<AddIcon/>} long
                                onClick={() => {
                                    setModelSelectableBoxSearchValue([])
                                    setModelSelectableBoxVisible(true)
                                }}
                        >
                            添加其他...
                        </Button>
                    </Grid.Col>
                </Grid.Row>
            </Space>

            <div style={{position: 'absolute'}}>
                <DialogFrame
                    id={'model-selectable-box'}
                    visible={modelSelectableBoxVisible}
                    onClose={() => {
                        setModelSelectableBoxVisible(false)
                    }}
                >
                    <ModelDataRender
                        dataElement={dataElement}
                        searcherProps={{
                            popupPosition: 'bottom',
                            stickyContainer: () => document.getElementById('model-selectable-box'),
                            rightChildren: (
                                <Button type={'secondary'} icon={<IconClose/>} status={'danger'}
                                        onClick={() => {
                                            setModelSelectableBoxVisible(false)
                                        }}
                                />
                            )
                        }}
                        waterfallProps={{
                            scrollContainer: 'model-selectable-box'
                        }}
                        initialSearchValues={modelSelectableBoxSearchValue}
                    />
                </DialogFrame>
            </div>
        </Collapse.Item>
    )
}

export default ModelPanel