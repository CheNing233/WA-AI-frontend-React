import {Button, Card, Collapse, Grid, InputNumber, Space, Tabs} from "@arco-design/web-react";
import {AdjustmentIcon, ControlPlatformIcon, Fullscreen1Icon, LayersIcon, TextboxIcon} from "tdesign-icons-react";
import {IconToTop} from "@arco-design/web-react/icon";
import SidebarWrapper from "@/components/workbench/components/sidebarWrapper";
import ModelPanel from "@/components/workbench/components/modelPanel";
import PromptPanel from "@/components/workbench/components/promptPanel";
import SettingsPanel from "@/components/workbench/components/settingsPanel";
import HiresPanel from "@/components/workbench/components/hiresPanel";
import {IWorkbenchSetting, useWorkbenchModels, useWorkbenchSetting} from "@/store/workbench";

const Work = () => {
    const [activeTab, setActiveTab] = useWorkbenchSetting(
        (state: IWorkbenchSetting) => [state.activeTab, state.setActiveTab]
    )

    const [txt2imgActivePanel, setTxt2imgActivePanel] = useWorkbenchSetting(
        (state: IWorkbenchSetting) => [state.txt2imgActivePanel, state.setTxt2imgActivePanel]
    )


    const handleMenuClick = (key: string) => {
        const panelName = `${activeTab}-${key}`
        const panelNameArr = [...txt2imgActivePanel, panelName]
        setTxt2imgActivePanel(panelNameArr)
    }

    const [
        txt2imgCheckpoint, txt2imgVae, txt2imgExtraModel
    ] = useWorkbenchModels((state) => {
        return [
            state.txt2imgCheckpoint, state.txt2imgVae, state.txt2imgExtraModel
        ]
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
                        activeKey={txt2imgActivePanel}
                        defaultActiveKey={txt2imgActivePanel}
                        onChange={(activePanel, activePanels) => {
                            setTxt2imgActivePanel(activePanels)
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
                                    target={'txt2img'}
                                    checkpoint={txt2imgCheckpoint}
                                    vae={txt2imgVae}
                                    extraModels={txt2imgExtraModel}
                                />
                            </div>
                            <div key={'prompt'}>
                                <PromptPanel name={'txt2img-prompt'}/>
                            </div>
                            <div key={'settings'}>
                                <SettingsPanel name={'txt2img-settings'}/>
                            </div>
                            <div key={'hires'}>
                                <HiresPanel name={'txt2img-hires'}/>
                            </div>
                        </SidebarWrapper>
                    </Collapse>
                </Tabs.TabPane>
                <Tabs.TabPane key={'img2img'} title={'图生图'}>
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