import {Button, Collapse, Grid, Space, Tag, Typography} from "@arco-design/web-react";
import {IconDelete, IconInfoCircle, IconSwap} from "@arco-design/web-react/icon";
import {getQiniuImageWithParams} from "@/utils/qiniuImage";

export type IModelCardProps = {
    id: string | number,
    name: string,
    imageSrc: string,
    type: string,
    children?: any,
    allowSwitch?: boolean,
    allowDelete?: boolean,
    onSwitch?: (id: string | number) => void,
    onDelete?: (id: string | number) => void,
}

const ModelCard = (props: IModelCardProps) => {

    return (
        <Grid.Row style={{width: '100%'}} gutter={[0, 8]} align={'center'}>
            <Grid.Col flex={'shrink'}>
                <img
                    src={getQiniuImageWithParams({
                        imageUrl: props.imageSrc,
                        width: 128,
                        height: 128,
                        quality: 50,
                    }) || require('@/assets/placeholder/noPreview.png')}
                    alt={''}
                    style={{
                        objectFit: 'cover', width: '72px', height: '72px', borderRadius: '4px',
                        marginBottom: '-8px'
                    }}
                />
            </Grid.Col>

            <Grid.Col flex={'1'} style={{width: '100%', marginLeft: '12px'}}>
                <Space direction={'vertical'} style={{width: '100%'}}>
                    <Grid.Row gutter={[8, 8]}>
                        <Grid.Col flex={'shrink'}>
                            <Tag color={'arcoblue'}>
                                {props.type}
                            </Tag>
                        </Grid.Col>
                        <Grid.Col flex={'shrink'}>
                            <Button type={'dashed'} size={'mini'} icon={<IconInfoCircle/>}/>
                        </Grid.Col>
                        <Grid.Col flex={'1'}/>
                        {props.allowDelete && <Grid.Col flex={'shrink'}>
                            <Button status={'danger'} size={'mini'} icon={<IconDelete/>}
                                    onClick={() => props.onDelete(props.id)}
                            >
                                删除模型
                            </Button>
                        </Grid.Col>}
                        {props.allowSwitch && <Grid.Col flex={'shrink'}>
                            <Button type={'primary'} size={'mini'} icon={<IconSwap/>}
                                    onClick={() => props.onSwitch(props.id)}
                            >
                                切换模型
                            </Button>
                        </Grid.Col>}
                    </Grid.Row>

                    <Collapse
                        defaultActiveKey={props.children ? props.name : ''}
                    >
                        <Collapse.Item
                            name={props.name}
                            header={
                                <div style={{height: '24px', userSelect: 'none'}}>
                                    <Typography.Ellipsis
                                        style={{
                                            width: 'calc(100% - 40px)',
                                            position: 'absolute',
                                            left: '32px',
                                            height: '24px',
                                            fontWeight: 'bold',
                                            fontSize: '16px',
                                            zIndex: '10'
                                        }}
                                        rows={1}
                                        expandable={false}
                                    >
                                        {props.name}
                                    </Typography.Ellipsis>
                                </div>
                            }
                        >
                            {props.children}
                            {!props.children && '暂无可调参数'}
                        </Collapse.Item>
                    </Collapse>
                </Space>
            </Grid.Col>
        </Grid.Row>
    )
}

export default ModelCard