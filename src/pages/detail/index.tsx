import {Avatar, Breadcrumb, Button, Card, Descriptions, Divider, Grid, Space, Tag} from "@arco-design/web-react";
import GridExt from "@/components/gridExt";
import ImageSlider from "@/components/imageSlider";
import {IconFullscreen, IconMoreVertical, IconStar, IconThumbUp} from "@arco-design/web-react/icon";
import {ControlPlatformIcon} from "tdesign-icons-react";
import ContentWrapper from "@/components/contentWrapper";

const DetailPage = () => {
    return (
        <ContentWrapper>
            <Space direction={'vertical'} size={16} style={{width: '100%'}}>
                <Breadcrumb>
                    <Breadcrumb.Item>上一级</Breadcrumb.Item>
                    <Breadcrumb.Item>Channel</Breadcrumb.Item>
                </Breadcrumb>

                <Grid.Row gutter={[12, 16]} align={'center'}>
                    <Grid.Col flex={'shrink'}>
                        <Avatar size={32}>
                            WA
                        </Avatar>
                    </Grid.Col>

                    <Grid.Col flex={'shrink'}>
                    <span style={{fontSize: '15px', color: 'var(--color-text-1)'}}>
                        xChenNing
                    </span>
                    </Grid.Col>

                    <Divider type={'vertical'} style={{margin: '0 6px 0 6px'}}/>

                    <Grid.Col flex={'shrink'}>
                        <h2 style={{
                            wordBreak: 'break-all',
                            margin: '0 0 0 0',
                            color: 'var(--color-text-1)'
                        }}>
                            title name
                        </h2>
                    </Grid.Col>

                    <Grid.Col flex={'shrink'}>
                        <Tag bordered={true}>
                            POST
                        </Tag>
                    </Grid.Col>

                    <Grid.Col flex={'shrink'}>
                        <span>
                            2024年6月14日 22:02:26 更新
                        </span>
                    </Grid.Col>

                    <Grid.Col flex={'1'}/>

                    <Grid.Col flex={'shrink'}>
                        <Button
                            type={'dashed'}
                            icon={<IconMoreVertical/>}
                        />
                    </Grid.Col>
                </Grid.Row>

                <GridExt
                    cols={{
                        xs: 1,
                        sm: 1,
                        md: 12,
                        lg: 12,
                        xl: 12,
                        xxl: 12,
                    }}
                    refContainerWidth={true}
                    colGap={24}
                    rowGap={24}
                    style={{width: '100%'}}
                >
                    <Grid.GridItem
                        span={8}
                    >
                        <ImageSlider
                        />
                    </Grid.GridItem>
                    <Grid.GridItem
                        span={4}
                    >
                        <Space direction={'vertical'} style={{width: '100%'}}>
                            <Card
                                bordered={true}
                                style={{width: '100%'}}
                            >
                                <Descriptions
                                    column={1}
                                    data={
                                        [
                                            {
                                                label: '类型',
                                                value: <Tag>Image</Tag>
                                            },
                                            {
                                                label: '标签',
                                                value: '无标签'
                                            },
                                            {
                                                label: '状态',
                                                value: (
                                                    <Grid.Row gutter={[8, 8]}>
                                                        <Grid.Col flex={'shrink'}>
                                                            <Tag color={'green'}>已发布</Tag>
                                                        </Grid.Col>
                                                        <Grid.Col flex={'shrink'}>
                                                            <Tag icon={<IconThumbUp/>}>0</Tag>
                                                        </Grid.Col>
                                                        <Grid.Col flex={'shrink'}>
                                                            <Tag icon={<IconStar/>}>0</Tag>
                                                        </Grid.Col>
                                                    </Grid.Row>
                                                )
                                            },
                                            {
                                                label: '参数',
                                                value: '无参数'
                                            },
                                            {
                                                label: '正向提示词',
                                                value: '无'
                                            },
                                            {
                                                label: '反向提示词',
                                                value: '无'
                                            },
                                        ]
                                    }
                                    style={{paddingTop: '12px'}}
                                    labelStyle={{paddingRight: 24}}
                                    valueStyle={{wordBreak: 'break-all'}}
                                />
                            </Card>
                            <Card
                                bordered={true}
                                style={{width: '100%'}}
                            >
                                <Grid.Row gutter={[8, 8]} style={{width: '100%'}}>
                                    <Grid.Col flex={'shrink'}>
                                        <Button icon={<IconThumbUp/>}>
                                            点赞
                                        </Button>
                                    </Grid.Col>
                                    <Grid.Col flex={'shrink'}>
                                        <Button icon={<IconStar/>}>
                                            收藏
                                        </Button>
                                    </Grid.Col>
                                    <Grid.Col flex={'shrink'}>
                                        <Button icon={<IconFullscreen/>}>
                                            查看大图
                                        </Button>
                                    </Grid.Col>
                                    <Grid.Col flex={'1'}>
                                        <Button type={'primary'} icon={<ControlPlatformIcon/>} long>
                                            做同款
                                        </Button>
                                    </Grid.Col>
                                </Grid.Row>
                            </Card>
                        </Space>
                    </Grid.GridItem>
                </GridExt>

                <Grid.Row gutter={[16, 16]}>
                    <Grid.Col
                        xs={24}
                        sm={24}
                        md={16}
                        lg={16}
                        xl={16}
                        xxl={16}
                        xxxl={16}
                    >
                        <Card bordered={true}>
                            123
                        </Card>
                    </Grid.Col>
                </Grid.Row>
            </Space>
        </ContentWrapper>
    )
}

export default DetailPage