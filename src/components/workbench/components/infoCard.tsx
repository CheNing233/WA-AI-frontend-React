import {Button, Collapse, Grid, Space, Tag, Typography} from "@arco-design/web-react";
import {IconInfoCircle} from "@arco-design/web-react/icon";
import {getQiniuImageWithParams} from "@/utils/qiniuImage";
import {useEffect, useState} from "react";

export type IInfoCard = {
    id: string,
    title: string,
    imageSrc: string,
    useRawImageSrc?: boolean,
    type: string,
    children?: any,
    extra?: any
    disabled?: boolean
}

const InfoCard = (props: IInfoCard) => {
    const [imageSrc, setImageSrc] = useState(require('@/assets/placeholder/noPreview.png'));
    const [active, setActive] = useState(
        [props.disabled
            ? ''
            : props.children ? props.id : '']
    );

    useEffect(() => {
        const src = props.useRawImageSrc
            ? props.imageSrc
            : getQiniuImageWithParams({
                imageUrl: props.imageSrc,
                width: 128,
                height: 128,
                quality: 50,
            })

        if (src && props.imageSrc) {
            setImageSrc(src)
        }
    }, [props.imageSrc])

    useEffect(() => {
        if (props.disabled)
            setActive([])
        else
            setActive([props.children ? props.id : ''])
    }, [props.disabled])

    return (
        <Grid.Row style={{width: '100%'}} gutter={[0, 8]} align={'center'}>
            <Grid.Col flex={'shrink'}>
                <img
                    src={imageSrc}
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
                        {/*<Grid.Col flex={'shrink'}>*/}
                        {/*    <Button type={'dashed'} size={'mini'} icon={<IconInfoCircle/>}/>*/}
                        {/*</Grid.Col>*/}
                        <Grid.Col flex={'1'}/>
                        <Grid.Col flex={'shrink'}>
                            {props.extra}
                        </Grid.Col>
                    </Grid.Row>

                    <Collapse
                        defaultActiveKey={active}
                        activeKey={active}
                        onChange={(activeKey, activeKeyList) => {
                            setActive(activeKeyList)
                        }}
                    >
                        <Collapse.Item
                            name={props.id}
                            disabled={props.disabled}
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
                                        {props.title}
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

export default InfoCard