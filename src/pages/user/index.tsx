import ContentWrapper from "@/components/contentWrapper";
import GridExt from "@/components/gridExt";
import {Alert, Avatar, Button, Card, Descriptions, Divider, Grid, Link, Space, Tabs, Tag} from "@arco-design/web-react";
import {IconEdit} from "@arco-design/web-react/icon";
import Updates from "@/pages/user/component/updates";

const User = () => {
    return (
        <ContentWrapper>
            <Alert
                banner
                type='warning'
                showIcon
                title='本页正在施工中'
                content='点「关于」页联系我们，加入我们的开发喵~'
                style={{ marginBottom: 20 }}
            />
            <GridExt
                cols={{xs: 1, sm: 1, md: 15, lg: 15, xl: 15, xxl: 15}}
                refContainerWidth={true}
                colGap={16}
                rowGap={16}
                style={{width: '100%'}}
            >
                <Grid.GridItem span={4}>
                    <Card bordered={true}>
                        <Space direction={'vertical'} style={{width: '100%'}}>
                            <Space direction={'vertical'} style={{width: '100%'}} align={'center'}>
                                <Avatar size={96} triggerIcon={<IconEdit/>}>
                                    WA
                                </Avatar>
                                <h1 style={{margin: '0'}}>xChenNing</h1>
                                <p style={{
                                    margin: '-10px 0 0 0', fontSize: '20px',
                                    fontWeight: '200',
                                }}
                                >
                                    @chenning233
                                </p>
                                <Tag>
                                    0 粉丝 · 0 关注
                                </Tag>
                            </Space>
                        </Space>
                        <Divider style={{margin: '20px 0 8px 0'}}/>
                        <Space direction={'vertical'} style={{width: '100%'}}>
                            <Descriptions
                                column={1}
                                title={
                                    <Grid.Row style={{width: '100%'}}>
                                        <Grid.Col flex={'shrink'}>个人资料</Grid.Col>
                                        <Grid.Col flex={'1'}/>
                                        <Grid.Col flex={'shrink'}>
                                            <Button type={'text'} size={'small'} icon={<IconEdit/>}>
                                                编辑
                                            </Button>
                                        </Grid.Col>

                                    </Grid.Row>
                                }
                                data={[
                                    {
                                        label: '昵称',
                                        value: 'xChenNing',
                                    },
                                    {
                                        label: '性别',
                                        value: '未知',
                                    },
                                    {
                                        label: '描述',
                                        value: '一条系统描述送个每一位喵~',
                                    },
                                    {
                                        label: '邮箱',
                                        value: 'chennning@foxmail.com',
                                    },
                                ]}
                                style={{marginTop: '12px'}}
                                labelStyle={{paddingRight: 36}}
                                valueStyle={{wordBreak: 'break-all'}}
                            />
                            <Descriptions
                                column={1}
                                title='账号相关'
                                data={[
                                    {
                                        label: 'Github 账号',
                                        value: <p style={{margin: '0'}}>未绑定，<Link>点此绑定</Link></p>,
                                    },
                                ]}
                                style={{marginTop: '8px'}}
                                labelStyle={{paddingRight: 36}}
                                valueStyle={{wordBreak: 'break-all'}}
                            />
                        </Space>
                    </Card>
                </Grid.GridItem>
                <Grid.GridItem span={11}>
                    <Space direction={'vertical'} style={{width: '100%'}}
                           size={16}
                    >
                        <Card bordered={true}>
                            <Tabs type={'rounded'} defaultActiveTab={'updates'}
                                  overflow={'dropdown'} style={{marginLeft: '-6px'}}
                            >
                                <Tabs.TabPane key='updates' title='我的动态' style={{padding: '0 6px 0 6px'}}/>
                                <Tabs.TabPane key='favourites' title='我的收藏' style={{padding: '0 6px 0 6px'}}/>
                                <Tabs.TabPane key='images' title='我的图片' style={{padding: '0 6px 0 6px'}}/>
                                <Tabs.TabPane key='posts' title='我的帖子' style={{padding: '0 6px 0 6px'}}/>
                            </Tabs>
                        </Card>
                        <Updates/>
                    </Space>
                </Grid.GridItem>
            </GridExt>
        </ContentWrapper>
    )
}

export default User