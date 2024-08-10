import useImagePreviewer from "@/components/imagePreviewer/useImagePreviewer";
import {Avatar, Button, Card, Descriptions, Grid, Image, Modal, Space, Tag, Typography} from "@arco-design/web-react";
import React, {useEffect, useRef, useState} from "react";
import {IconClose, IconCopy, IconLeft, IconRight, IconStar, IconThumbUp} from "@arco-design/web-react/icon";
import {ControlPlatformIcon} from "tdesign-icons-react";

const ImagePreviewer = () => {
    const smallLayoutThres = 1024

    const {imageViewerShow, setImageViewerShow} = useImagePreviewer()
    const imageContainer = useRef(null)
    const [paramsCardShow, setParamsCardShow] = useState(true)
    const [smallLayout, setSmallLayout] = useState(false)

    const handleResize = () => {
        const width = window.innerWidth
        if (smallLayout === false && width < smallLayoutThres) {
            setParamsCardShow(false)
        }
        setSmallLayout(width < smallLayoutThres)
    }

    useEffect(() => {
        const resizeObserver = new ResizeObserver(handleResize);
        if (document.body) {
            resizeObserver.observe(document.body);
            handleResize()
        }
        return () => {
            resizeObserver.disconnect();
        }
    }, [])


    return (
        <Modal
            title={null}
            footer={null}
            visible={imageViewerShow}
            onOk={() => setImageViewerShow(false)}
            onCancel={() => setImageViewerShow(false)}
            unmountOnExit={false}
            closable={false}
            autoFocus={true}
            focusLock={true}
            style={{
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
            }}
        >
            {/*right-top bar*/}
            <Space
                style={{
                    position: 'absolute',
                    top: '18px',
                    right: '22px',
                    zIndex: 3,
                }}
            >
                <Button
                    icon={paramsCardShow ? <IconRight/> : <IconLeft/>}
                    onClick={() => {
                        handleResize()
                        setParamsCardShow(!paramsCardShow)
                    }}
                />
                <Button
                    type={'primary'}
                    icon={<IconClose/>}
                    onClick={() => setImageViewerShow(false)}
                />
            </Space>

            {/*content*/}
            <Grid.Row
                style={{
                    position: 'absolute',
                    left: '0',
                    top: '0',
                    width: '100vw',
                    height: '100vh',
                }}
            >
                {/*image content*/}
                <Grid.Col
                    {...(paramsCardShow && smallLayout ? {span: 0} : {flex: '1'})}
                >
                    <div
                        ref={imageContainer}
                        style={{
                            position: 'relative',
                            width: '100%',
                            height: '100vh',
                            overflow: 'hidden',
                        }}
                    >
                        <Image.Preview
                            src='https://obj.glcn.top/wa-image/1718357537691.png?imageMogr2/auto-orient/thumbnail/1536x1536%3E/format/webp/blur/1x0/quality/100'
                            visible={true}
                            closable={false}
                            getPopupContainer={() => imageContainer.current}
                        />
                    </div>
                </Grid.Col>

                {/*params card*/}
                {paramsCardShow && <Grid.Col flex={'shrink'}>
                    <Card
                        bordered={true}
                        style={{
                            width: smallLayout ? '100vw' : '30vw',
                            height: '100vh',
                            overflowX: 'hidden',
                            overflowY: 'auto',
                        }}
                    >
                        <Space direction={'vertical'} style={{width: '100%'}}>
                            {/*author*/}
                            <Grid.Row>
                                <Grid.Col flex={'shrink'}>
                                    <Space align={'center'} style={{paddingBottom: '8px'}}>
                                        <Avatar
                                            shape={'square'}
                                            size={40}
                                        >
                                            WA
                                        </Avatar>
                                        <Space direction={'vertical'} size={1}>
                                        <span style={{color: 'var(--color-text-1)'}}>
                                            author
                                        </span>
                                            <span style={{color: 'var(--color-text-1)'}}>
                                            2024年6月14日 20:43:21 创建
                                        </span>
                                        </Space>
                                    </Space>
                                </Grid.Col>
                            </Grid.Row>

                            {/*operation bar*/}
                            <Card
                                bordered={true}
                                style={{width: '100%'}}
                            >
                                <Grid.Row gutter={[0, 8]} style={{width: '100%'}}>
                                    <Grid.Col flex={'shrink'} style={{paddingRight: '8px'}}>
                                        <Button icon={<IconThumbUp/>}>
                                            点赞
                                        </Button>
                                    </Grid.Col>
                                    <Grid.Col flex={'shrink'} style={{paddingRight: '8px'}}>
                                        <Button icon={<IconStar/>}>
                                            收藏
                                        </Button>
                                    </Grid.Col>
                                    <Grid.Col flex={'1'}>
                                        <Button type={'primary'} icon={<ControlPlatformIcon/>} long>
                                            做同款
                                        </Button>
                                    </Grid.Col>
                                </Grid.Row>
                            </Card>

                            {/*prompt*/}
                            <Card
                                title={'提示词'}
                                bordered={true}
                            >
                                <Grid.Row gutter={[0, 8]}>
                                    <Grid.Col flex={'shrink'}>
                                        <Tag size={'medium'} color={'arcoblue'}>正向提示词</Tag>
                                    </Grid.Col>
                                    <Grid.Col flex={'1'}/>
                                    <Grid.Col flex={'shrink'}>
                                        <Button size={'small'} icon={<IconCopy/>}/>
                                    </Grid.Col>
                                    <Grid.Col span={24}>
                                        <Typography.Ellipsis
                                            rows={3}
                                            expandable={true}
                                        >
                                            <span>
                                                {'1girl, (mature female), solo, medium full shot, long hair, hair ornament, grey hair, hair between eyes, black hairband, blue eyes, blush, bangs, smile, t-shirt, off shoulder, medium breasts, cleavage, thighhighs, zettai ryouiki, miniskirt, standing, fighting stance,, <lora:firefly_firefly _(honkai_ star rail_), 1girl, solo, long hair, blue eyes, bangs, dress, long sleeves, hair ornament, grey hair,black hairband, medium breasts, hair between eyes:1>, <lora:$5_fixhands:0.2>'}
                                            </span>
                                        </Typography.Ellipsis>
                                    </Grid.Col>
                                    <Grid.Col flex={'shrink'}>
                                        <Tag size={'medium'} color={'arcoblue'}>反向提示词</Tag>
                                    </Grid.Col>
                                    <Grid.Col flex={'1'}/>
                                    <Grid.Col flex={'shrink'}>
                                        <Button size={'small'} icon={<IconCopy/>}/>
                                    </Grid.Col>
                                    <Grid.Col span={24}>
                                        <Typography.Ellipsis
                                            rows={3}
                                            expandable={true}
                                        >
                                            <span>
                                                {'lowres,bad anatomy,bad hands,text,error,missing fingers,extra digit,fewer digits,cropped,worst quality,low quality,normal quality,jpeg artifacts,signature,watermark,username,blurry,missing fingers,bad hands,missing arms'}
                                            </span>
                                        </Typography.Ellipsis>
                                    </Grid.Col>
                                </Grid.Row>
                            </Card>

                            {/*main metadata*/}
                            <Card
                                title={'主要参数'}
                                bordered={true}
                            >
                                <Descriptions
                                    column={1}
                                    data={
                                        [
                                            {
                                                label: 'steps',
                                                value: '28'
                                            },
                                            {
                                                label: 'seed',
                                                value: '1995474192'
                                            },
                                            {
                                                label: 'sampler_name',
                                                value: 'Euler a'
                                            },
                                            {
                                                label: 'cfg_scale',
                                                value: '7'
                                            },
                                            {
                                                label: 'width',
                                                value: '512'
                                            },
                                            {
                                                label: 'height',
                                                value: '768'
                                            },
                                            {
                                                label: 'sd_model_name',
                                                value: 'firefly_firefly',
                                                span: 2
                                            },
                                            {
                                                label: 'sd_vae_name',
                                                value: 'firefly_firefly',
                                                span: 2
                                            }
                                        ]
                                    }
                                    style={{paddingTop: '12px'}}
                                    labelStyle={{paddingRight: 24}}
                                    valueStyle={{wordBreak: 'break-all'}}
                                />
                            </Card>

                            {/*other metadata*/}
                            <Card
                                title={'其他参数'}
                                bordered={true}
                            >
                                <Descriptions
                                    column={1}
                                    data={
                                        [
                                            {
                                                label: 'steps',
                                                value: '28'
                                            },
                                            {
                                                label: 'seed',
                                                value: '1995474192'
                                            },
                                            {
                                                label: 'sampler_name',
                                                value: 'Euler a'
                                            },
                                            {
                                                label: 'cfg_scale',
                                                value: '7'
                                            },
                                            {
                                                label: 'width',
                                                value: '512'
                                            },
                                            {
                                                label: 'height',
                                                value: '768'
                                            },
                                            {
                                                label: 'sd_model_name',
                                                value: 'firefly_firefly',
                                                span: 2
                                            },
                                            {
                                                label: 'sd_vae_name',
                                                value: 'firefly_firefly',
                                                span: 2
                                            }
                                        ]
                                    }
                                    style={{paddingTop: '12px'}}
                                    labelStyle={{paddingRight: 24}}
                                    valueStyle={{wordBreak: 'break-all'}}
                                />
                            </Card>

                        </Space>
                    </Card>
                </Grid.Col>}
            </Grid.Row>
        </Modal>
    )
}

export default ImagePreviewer