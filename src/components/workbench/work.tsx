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

    return (
        <Space style={{top: '0', width: '100%'}} direction={'vertical'}>
            <Tabs
                defaultActiveTab={'txt2img'}
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
                                    allowMask={true}
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
                </Tabs.TabPane>
            </Tabs>
            <Card
                bordered={true}
                style={{width: '100%', height: '64px'}}
            >
                <Grid.Row gutter={[8, 8]}>
                    <Grid.Col flex={'1'}>
                        <Button icon={<ControlPlatformIcon/>} type={'primary'} long>
                            立即生成
                        </Button>
                    </Grid.Col>
                    <Grid.Col flex={'shrink'}>
                        <Space direction={'vertical'} size={0}>
                            <InputNumber
                                mode='button'
                                defaultValue={1}
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