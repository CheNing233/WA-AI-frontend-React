import {Button, Card, Collapse, Grid, InputNumber, Space, Tabs} from "@arco-design/web-react";
import {
    AdjustmentIcon,
    ControlPlatformIcon,
    Fullscreen1Icon,
    ImageIcon,
    LayersIcon,
    TextboxIcon
} from "tdesign-icons-react";
import {IconToTop} from "@arco-design/web-react/icon";
import SidebarWrapper from "@/components/workbench/components/sidebarWrapper";
import ModelPanel from "@/components/workbench/components/modelPanel";
import PromptPanel from "@/components/workbench/components/promptPanel";
import SettingsPanel from "@/components/workbench/components/settingsPanel";
import HiresPanel from "@/components/workbench/components/hiresPanel";
import {
    IWorkbenchParams,
    IWorkbenchSetting,
    useWorkbenchModels,
    useWorkbenchParams,
    useWorkbenchSetting
} from "@/store/workbench";
import ImagePanel from "@/components/workbench/components/imagePanel";
import ExtraImagePanel from "@/components/workbench/components/extraImagePanel";
import ExtraSettingPanel from "@/components/workbench/components/extraSettingPanel";
import {packParams} from "@/components/workbench/utils/sd";
import api from "@/services/export";
import {loadingMessage} from "@/utils/loadingMessage";
import {useState} from "react";
import eventbus from "@/eventbus";

const removeObjectKey = (objectToModify: Record<string, any>, keysToRemove: string[]): Record<string, any> => {
    const {...updatedObject} = objectToModify;

    keysToRemove.forEach(key => {
        if (key in updatedObject) {
            delete updatedObject[key];
        }
    });

    return updatedObject;
}


const Work = () => {
    const [activeTab, setActiveTab] = useWorkbenchSetting(
        (state: IWorkbenchSetting) => [state.activeTab, state.setActiveTab]
    )

    const [activePanel, setActivePanel] = useWorkbenchSetting(
        (state: IWorkbenchSetting) => [state.activePanel, state.setActivePanel]
    )

    const handleMenuClick = (key: string) => {
        const panelName = `${activeTab}-${key}`
        const panelNameArr = [...activePanel, panelName]
        setActivePanel(panelNameArr)
    }

    const [txt2imgCheckpoint, txt2imgVae, txt2imgExtraModel]
        = useWorkbenchModels((state) => {
        return [state.txt2imgCheckpoint, state.txt2imgVae, state.txt2imgExtraModel]
    })
    const [txt2imgParams, setTxt2imgParams] = useWorkbenchParams(
        (state: IWorkbenchParams) => [state.txt2imgParams, state.setTxt2imgParams]
    )

    const [img2imgCheckpoint, img2imgVae, img2imgExtraModel]
        = useWorkbenchModels((state) => {
        return [state.img2imgCheckpoint, state.img2imgVae, state.img2imgExtraModel]
    })
    const [img2imgParams, setImg2imgParams] = useWorkbenchParams(
        (state: IWorkbenchParams) => [state.img2imgParams, state.setImg2imgParams]
    )

    const [setModel, deleteModel, changeModel]
        = useWorkbenchModels((state) => {
        return [state.setModel, state.deleteModel, state.changeModel]
    })

    const [extraParams, setExtraParams] = useWorkbenchParams(
        (state: IWorkbenchParams) => [state.extraParams, state.setExtraParams]
    )

    const [generateCount, setGenerateCount] = useWorkbenchParams(
        (state: IWorkbenchParams) => [state.generateCount, state.setGenerateCount]
    )
    const [generateLoading, setGenerateLoading] = useState(false)

    const handleDraw = () => {
        let paramsToPost: any = null
        const refreshTime = 1000

        switch (activeTab) {
            case 'txt2img':
                paramsToPost = packParams(txt2imgParams, txt2imgCheckpoint, txt2imgVae, txt2imgExtraModel)

                loadingMessage(
                    'txt2img-process',
                    '正在请求喵~',
                    (resolve) => {
                        setGenerateLoading(true)
                        api.sd.txt2Image({txt2ImageOptions: paramsToPost, count: generateCount})
                            .then((res) => {
                                resolve(true, `成功压入队列喵，ID：${res.data.data}`)
                            })
                            .catch((err) => {
                                resolve(false, `请求失败喵，${err}`)
                            })
                            .finally(() => {
                                setGenerateLoading(false)

                                setTimeout(() => {
                                    eventbus.emit('workbench.history.refresh')
                                }, refreshTime)
                            })
                    }
                )
                return;
            case 'img2img':
                paramsToPost = packParams(img2imgParams, img2imgCheckpoint, img2imgVae, img2imgExtraModel)

                if (!paramsToPost.allowMask)
                    paramsToPost.mask = null

                paramsToPost = removeObjectKey(paramsToPost, [
                    'scaleByOriginal', 'scaleNumber', 'allowMask'
                ])

                loadingMessage(
                    'img2img-process',
                    '正在请求喵~',
                    (resolve) => {
                        setGenerateLoading(true)
                        api.sd.img2img(paramsToPost)
                            .then((res) => {
                                resolve(true, `成功压入队列喵，ID：${res.data.data}`)
                            })
                            .catch((err) => {
                                resolve(false, `请求失败喵，${err}`)
                            })
                            .finally(() => {
                                setGenerateLoading(false)

                                setTimeout(() => {
                                    eventbus.emit('workbench.history.refresh')
                                }, refreshTime)
                            })
                    }
                )
                return;
            case 'extra':
                paramsToPost = extraParams

                loadingMessage(
                    'extra-process',
                    '正在请求喵~',
                    (resolve) => {
                        setGenerateLoading(true)
                        api.sd.extraImage(paramsToPost)
                            .then((res) => {
                                resolve(true, `成功压入队列喵，ID：${res.data.data}`)
                            })
                            .catch((err) => {
                                resolve(false, `请求失败喵，${err}`)
                            })
                            .finally(() => {
                                setGenerateLoading(false)

                                setTimeout(() => {
                                    eventbus.emit('workbench.history.refresh')
                                }, refreshTime)
                            })
                    }
                )
                return;
        }
    }


    return (
        <Space style={{top: '0', width: '100%'}} direction={'vertical'}>
            <Tabs
                activeTab={activeTab}
                onChange={(key: string) => {
                    setActiveTab(key)
                }}
            >
                <Tabs.TabPane key={'txt2img'} title={'文生图'}>

                    <Collapse
                        style={{width: 'calc(100% - 2px)', overflow: 'visible'}}
                        bordered={true}
                        destroyOnHide={false}
                        activeKey={activePanel}
                        defaultActiveKey={activePanel}
                        onChange={(activePanel, activePanels) => {
                            setActivePanel(activePanels)
                        }}
                    >
                        <SidebarWrapper
                            menu={[
                                {
                                    key: 'model',
                                    title: '模型',
                                    icon: <LayersIcon/>
                                },
                                {
                                    key: 'prompt',
                                    title: '提示词',
                                    icon: <TextboxIcon/>
                                },
                                {
                                    key: 'settings',
                                    title: '基本设置',
                                    icon: <AdjustmentIcon/>
                                },
                                {
                                    key: 'hires',
                                    title: '高清修复',
                                    icon: <Fullscreen1Icon/>
                                }
                            ]}
                            onMenuClick={handleMenuClick}
                            style={{width: '100%', padding: '12px 0 12px 0'}}
                        >
                            <div key={'model'}>
                                <ModelPanel
                                    name={'txt2img-model'}
                                    setModel={(model) => {
                                        setModel(model, 'txt2img')
                                    }}
                                    deleteModel={(modelId) => {
                                        deleteModel(modelId, 'txt2img')
                                    }}
                                    changeModel={(model, key, value) => {
                                        changeModel(model, 'txt2img', key, value)
                                    }}
                                    checkpoint={txt2imgCheckpoint}
                                    vae={txt2imgVae}
                                    extraModels={txt2imgExtraModel}
                                />
                            </div>
                            <div key={'prompt'}>
                                <PromptPanel
                                    name={'txt2img-prompt'}
                                    prompt={txt2imgParams.prompt}
                                    setPromptFunction={(p: string) => {
                                        setTxt2imgParams({...txt2imgParams, prompt: p})
                                    }}
                                    negativePrompt={txt2imgParams.negative_prompt}
                                    setNegativePromptFunction={(p: string) => {
                                        setTxt2imgParams({...txt2imgParams, negative_prompt: p})
                                    }}
                                />
                            </div>
                            <div key={'settings'}>
                                <SettingsPanel
                                    name={'txt2img-settings'}
                                    params={txt2imgParams}
                                    setParams={(params: any) => {
                                        setTxt2imgParams(params)
                                    }}
                                    allowWidthHeight={true}
                                />
                            </div>
                            <div key={'hires'}>
                                <HiresPanel
                                    name={'txt2img-hires'}
                                    params={txt2imgParams}
                                    setParams={(params: any) => {
                                        setTxt2imgParams(params)
                                    }}
                                />
                            </div>
                        </SidebarWrapper>
                    </Collapse>

                </Tabs.TabPane>
                <Tabs.TabPane key={'img2img'} title={'图生图'}>

                    <Collapse
                        style={{width: 'calc(100% - 2px)', overflow: 'visible'}}
                        bordered={true}
                        destroyOnHide={false}
                        activeKey={activePanel}
                        defaultActiveKey={activePanel}
                        onChange={(activePanel, activePanels) => {
                            setActivePanel(activePanels)
                        }}
                    >
                        <SidebarWrapper
                            menu={[
                                {
                                    key: 'image',
                                    title: '图片',
                                    icon: <ImageIcon/>
                                },
                                {
                                    key: 'model',
                                    title: '模型',
                                    icon: <LayersIcon/>
                                },
                                {
                                    key: 'prompt',
                                    title: '提示词',
                                    icon: <TextboxIcon/>
                                },
                                {
                                    key: 'settings',
                                    title: '基本设置',
                                    icon: <AdjustmentIcon/>
                                }
                            ]}
                            onMenuClick={handleMenuClick}
                            style={{width: '100%', padding: '12px 0 12px 0'}}
                        >
                            <div key={'image'}>
                                <ImagePanel
                                    name={'img2img-image'}
                                    params={img2imgParams}
                                    setParams={(params: any) => {
                                        setImg2imgParams(params)
                                    }}
                                />
                            </div>
                            <div key={'model'}>
                                <ModelPanel
                                    name={'img2img-model'}
                                    setModel={(model) => {
                                        setModel(model, 'img2img')
                                    }}
                                    deleteModel={(modelId) => {
                                        deleteModel(modelId, 'img2img')
                                    }}
                                    changeModel={(model, key, value) => {
                                        changeModel(model, 'img2img', key, value)
                                    }}
                                    checkpoint={img2imgCheckpoint}
                                    vae={img2imgVae}
                                    extraModels={img2imgExtraModel}
                                />
                            </div>
                            <div key={'prompt'}>
                                <PromptPanel
                                    name={'img2img-prompt'}
                                    prompt={img2imgParams.prompt}
                                    setPromptFunction={(p: string) => {
                                        setImg2imgParams({...img2imgParams, prompt: p})
                                    }}
                                    negativePrompt={img2imgParams.negative_prompt}
                                    setNegativePromptFunction={(p: string) => {
                                        setImg2imgParams({...img2imgParams, negative_prompt: p})
                                    }}
                                />
                            </div>
                            <div key={'settings'}>
                                <SettingsPanel
                                    name={'img2img-settings'}
                                    params={img2imgParams}
                                    setParams={(params: any) => {
                                        setImg2imgParams(params)
                                    }}
                                />
                            </div>
                        </SidebarWrapper>
                    </Collapse>

                </Tabs.TabPane>
                <Tabs.TabPane key={'extra'} title={'超分放大'}>

                    <Collapse
                        style={{width: 'calc(100% - 2px)', overflow: 'visible'}}
                        bordered={true}
                        destroyOnHide={false}
                        activeKey={activePanel}
                        defaultActiveKey={activePanel}
                        onChange={(activePanel, activePanels) => {
                            setActivePanel(activePanels)
                        }}
                    >
                        <SidebarWrapper
                            menu={[
                                {
                                    key: 'image',
                                    title: '图片',
                                    icon: <ImageIcon/>
                                },
                                {
                                    key: 'settings',
                                    title: '超分设置',
                                    icon: <AdjustmentIcon/>
                                }
                            ]}
                            onMenuClick={handleMenuClick}
                            style={{width: '100%', padding: '12px 0 12px 0'}}
                        >
                            <div key={'image'}>
                                <ExtraImagePanel
                                    name={'extra-image'}
                                    params={extraParams}
                                    setParams={setExtraParams}
                                />
                            </div>
                            <div key={'settings'}>
                                <ExtraSettingPanel
                                    name={'extra-setting'}
                                    params={extraParams}
                                    setParams={(params: any) => {
                                        setExtraParams(params)
                                    }}
                                />
                            </div>
                        </SidebarWrapper>
                    </Collapse>

                </Tabs.TabPane>
            </Tabs>
            <Card
                bordered={true}
                style={{width: '100%', height: '64px'}}
                loading={generateLoading}
            >
                <Grid.Row gutter={[8, 8]}>
                    <Grid.Col flex={'1'}>
                        <Button icon={<ControlPlatformIcon/>} type={'primary'} long
                                onClick={handleDraw}
                        >
                            立即生成
                        </Button>
                    </Grid.Col>
                    <Grid.Col flex={'shrink'}>
                        <Space direction={'vertical'} size={0}>
                            <InputNumber
                                mode='button'
                                value={generateCount}
                                onChange={(value) => {
                                    setGenerateCount(value)
                                }}
                                max={10}
                                min={1}
                                size={'mini'}
                                style={{width: '96px'}}
                            />
                            <span style={{fontSize: '12px', color: '#999', padding: 0}}>生成数量</span>
                        </Space>
                    </Grid.Col>
                    <Grid.Col flex={'shrink'}>
                        <Button icon={<IconToTop/>}/>
                    </Grid.Col>
                </Grid.Row>
            </Card>
        </Space>
    )
}

export default Work