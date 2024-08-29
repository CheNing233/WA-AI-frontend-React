import {IconClose, IconMoreVertical} from "@arco-design/web-react/icon";
import {Button, Collapse, Grid, Message, Space} from "@arco-design/web-react";
import ModelCard from "@/components/workbench/components/modelCard";
import {AddIcon} from "tdesign-icons-react";
import {IWorkbenchModel, useWorkbenchModels} from "@/store/workbench";
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
        target: 'txt2img' | 'img2img',
        checkpoint: IWorkbenchModel,
        vae: IWorkbenchModel,
        extraModels: IWorkbenchModel[]
    }
) => {
    const [
        setModel, deleteModel, changeModel
    ] = useWorkbenchModels((state) => {
        return [
            state.setModel, state.deleteModel, state.changeModel
        ]
    })
    const [modelSelectableBoxVisible, setModelSelectableBoxVisible] = useState(false)
    const [modelSelectableBoxSearchValue, setModelSelectableBoxSearchValue] = useState([])
    const {authWorkbench} = useWorkbench()


    useEffect(() => {
        const checkpoint = {...props.checkpoint}
        const vae = {...props.vae}
        const extraModels = [...props.extraModels]

        if (!checkpoint.bannerUrl) {
            getModelBannerUrl(checkpoint as IModel).then(newModel => {
                setModel(newModel, props.target)
            })
        }
        if (!vae.bannerUrl) {
            getModelBannerUrl(vae as IModel).then(newModel => {
                setModel(newModel, props.target)
            })
        }

        extraModels.forEach((model) => {
            if (!model.bannerUrl) {
                getModelBannerUrl(model as IModel).then(newModel => {
                    setModel(newModel, props.target)
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
                        setModel(data, props.target)
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

                <ModelCard
                    id={props.checkpoint.id}
                    name={props.checkpoint.title}
                    imageSrc={props.checkpoint.bannerUrl}
                    type={props.checkpoint.type}
                    allowSwitch={true}
                    onSwitch={() => {
                        setModelSelectableBoxSearchValue(['filter:Checkpoint'])
                        setModelSelectableBoxVisible(true)
                    }}
                    allowDelete={false}
                />
                <ModelCard
                    id={props.vae.id}
                    name={props.vae.title}
                    imageSrc={props.vae.bannerUrl}
                    type={props.vae.type}
                    allowSwitch={true}
                    onSwitch={() => {
                        setModelSelectableBoxSearchValue(['filter:VAE'])
                        setModelSelectableBoxVisible(true)
                    }}
                    allowDelete={false}
                />

                {props.extraModels.map((model) => {
                    return (
                        <ModelCard
                            id={model.id}
                            key={model.id}
                            name={model.title}
                            imageSrc={model.bannerUrl}
                            type={model.type}
                            allowSwitch={false}
                            allowDelete={true}
                            onDelete={(id) => {
                                deleteModel(id, props.target)
                                Message.success(`已删除「${model.title}」`)
                            }}
                        >
                            <ParamsRender params={[
                                {
                                    name: '作为负面模型使用',
                                    type: 'switch',
                                    settings: {
                                        checked: model.asNegative || false,
                                        onChange: () => {
                                            changeModel(model.id, props.target,
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
                                            changeModel(model.id, props.target,
                                                'weight', newValue)
                                        }
                                    }
                                }
                            ]}
                            />
                        </ModelCard>
                    )
                })}

                <Grid.Row gutter={[8, 8]}>
                    <Grid.Col flex={'1'}>
                        <Button type={'primary'} icon={<AddIcon/>} long
                                onClick={() => {
                                    setModelSelectableBoxSearchValue(['filter:LoRA'])
                                    setModelSelectableBoxVisible(true)
                                }}
                        >
                            添加LoRa
                        </Button>
                    </Grid.Col>
                    <Grid.Col flex={'1'}>
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
        </Collapse.Item>
    )
}

export default ModelPanel