import {Button, Card, Grid, InputNumber, Space, Tabs} from "@arco-design/web-react";
import {ControlPlatformIcon} from "tdesign-icons-react";
import {IconToTop} from "@arco-design/web-react/icon";
import SidebarWrapper from "@/components/workbench/components/sidebarWrapper";

const Work = () => {
    return (
        <Space style={{top: '0', width: '100%'}} direction={'vertical'}>
            <Tabs>
                <Tabs.TabPane title={'Work'}>
                    <SidebarWrapper
                        menu={[
                            {
                                key: '123',
                                title: '123',
                                icon: <ControlPlatformIcon/>
                            },
                            {
                                key: '456',
                                title: '456',
                                icon: <ControlPlatformIcon/>
                            },
                            {
                                key: '789',
                                title: '789',
                                icon: <ControlPlatformIcon/>
                            },
                        ]}
                    >
                        <div key={'123'} style={{backgroundColor: 'arcoblue', height: '600px'}}>123</div>
                        <div key={'456'} style={{backgroundColor: 'arcoblue', height: '600px'}}>456</div>
                        <div key={'789'} style={{backgroundColor: 'arcoblue', height: '600px'}}>789</div>
                    </SidebarWrapper>

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