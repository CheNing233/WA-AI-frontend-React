import {Button, Card, Collapse, Grid, InputNumber, Space, Tabs} from "@arco-design/web-react";
import {ControlPlatformIcon, TranslateIcon} from "tdesign-icons-react";
import {IconSettings, IconToTop} from "@arco-design/web-react/icon";
import SidebarWrapper from "@/components/workbench/components/sidebarWrapper";
import ModelPanel from "@/components/workbench/components/modelPanel";
import PromptPanel from "@/components/workbench/components/promptPanel";
import SettingsPanel from "@/components/workbench/components/settingsPanel";

const Work = () => {
    return (
        <Space style={{top: '0', width: '100%'}} direction={'vertical'}>
            <Tabs>
                <Tabs.TabPane title={'Work'}>
                    <Collapse
                        style={{width: 'calc(100% - 2px)', overflow: 'visible'}}
                        bordered={true}
                        destroyOnHide={false}
                    >
                        <SidebarWrapper
                            menu={[
                                {
                                    key: 'model',
                                    title: '模型',
                                    icon: <ControlPlatformIcon/>
                                },
                                {
                                    key: 'prompt',
                                    title: '提示词',
                                    icon: <TranslateIcon/>
                                },
                                {
                                    key: 'settings',
                                    title: '设置',
                                    icon: <IconSettings/>
                                }
                            ]}
                            style={{width: '100%', padding: '12px 0 12px 0'}}
                        >
                            <div key={'model'}>
                                <ModelPanel/>
                            </div>
                            <div key={'prompt'}>
                                <PromptPanel/>
                            </div>
                            <div key={'settings'}>
                                <SettingsPanel/>
                            </div>
                        </SidebarWrapper>
                    </Collapse>
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