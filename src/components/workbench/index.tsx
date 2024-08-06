import {Button, Card, Drawer, Grid, Radio, Space, Tag} from "@arco-design/web-react";

import useWorkbench from './useWorkbench'
import {IWorkbenchSetting, useWorkbenchSetting} from "@/store/workbench";
import {IconClose, IconHistory} from "@arco-design/web-react/icon";
import {ControlPlatformIcon, FullscreenExitIcon, FullscreenIcon} from "tdesign-icons-react";
import GridExt from "@/components/gridExt";
import {useState} from "react";
import History from "@/components/workbench/history";
import Work from "@/components/workbench/work";

const Workbench = () => {
    const [workbenchShow, setWorkbenchShow] = useWorkbench();
    const workbenchSetting: IWorkbenchSetting = useWorkbenchSetting((state) => state);

    const [mobileDisplay, setMobileDisplay] = useState(false)
    const [currentContent, setCurrentContent] = useState('workbench')

    const handleColsChange = (cols: number) => {
        setMobileDisplay(cols === 5)
    }

    const content = () => {
        return (
            <Space direction={'vertical'} style={{width: '100%', height: '100%', overflow: 'hidden'}}>
                {/*option-bar*/}
                <Grid.Row gutter={[8, 8]} align={'center'}>
                    <Grid.Col flex={'shrink'}>
                        {mobileDisplay
                            ? <Radio.Group
                                size='default'
                                type='button'
                                value={currentContent}
                                defaultValue={'workbench'}
                                onChange={(value) => {
                                    setCurrentContent(value)
                                }}
                            >
                                <Radio value='workbench'><ControlPlatformIcon/></Radio>
                                <Radio value='history'><IconHistory/></Radio>
                            </Radio.Group>
                            : <Tag size={'large'} color={'arcoblue'}>
                                WA酱工作台
                            </Tag>
                        }
                    </Grid.Col>

                    <Grid.Col flex={'1'}/>

                    <Grid.Col flex={'shrink'} style={{float: 'right'}}>
                        <Space>
                            <Button
                                icon={workbenchSetting.wrapperInDrawer ?
                                    <FullscreenExitIcon/> :
                                    <FullscreenIcon/>
                                }
                                onClick={() => {
                                    workbenchSetting.setWrapperInDrawer(!workbenchSetting.wrapperInDrawer)
                                }}
                            />
                            <Button type={'primary'} icon={<IconClose/>}
                                    onClick={() => {
                                        setWorkbenchShow(false)
                                    }}
                            />
                        </Space>
                    </Grid.Col>
                </Grid.Row>

                {/*content*/}
                <GridExt
                    cols={{
                        xxxl: 12,
                        xxl: 12,
                        xl: 12,
                        lg: 12,
                        md: 12,
                        sm: 12,
                        xs: 5,
                    }}
                    refContainerWidth={true}
                    onColsChange={handleColsChange}
                    colGap={16}
                    rowGap={16}
                    style={{width: '100%'}}
                    collapsed={true}
                    collapsedRows={1}
                >
                    <Grid.GridItem
                        span={mobileDisplay
                            ? (currentContent === 'workbench' ? 5 : 0)
                            : 5
                        }
                    >
                        <Work/>
                    </Grid.GridItem>
                    <Grid.GridItem
                        span={mobileDisplay
                            ? (currentContent === 'history' ? 5 : 0)
                            : 7
                        }
                    >
                        <History/>
                    </Grid.GridItem>
                </GridExt>
            </Space>
        )
    }

    if (workbenchSetting.wrapperInDrawer) {
        return (
            <Drawer
                title={null}
                footer={null}
                closable={false}
                width={workbenchSetting.width}
                visible={workbenchShow}
                onOk={() => {
                    setWorkbenchShow(false)
                }}
                onCancel={() => {
                    setWorkbenchShow(false)
                }}
                // style={{padding: '4px 0 4px 0'}}
            >
                {content()}
            </Drawer>
        )
    } else {
        return (
            // <div style={{position: "relative", width: '100%'}}>
            <Card style={{width: '100%', overflow: 'hidden'}}>
                {content()}
            </Card>
            // </div>
        )
    }
}


export default Workbench