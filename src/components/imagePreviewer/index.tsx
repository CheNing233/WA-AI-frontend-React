import useImagePreviewer from "@/components/imagePreviewer/useImagePreviewer";
import {Avatar, Button, Card, Descriptions, Grid, Image, Modal, Space, Tag, Typography} from "@arco-design/web-react";
import React, {useEffect, useRef, useState} from "react";
import {IconClose, IconCopy, IconLeft, IconRight, IconStar, IconThumbUp} from "@arco-design/web-react/icon";
import {ControlPlatformIcon} from "tdesign-icons-react";
import {useImagePreviewerSetting} from "@/store/imagePreviewer";
import {convertUTCTime} from "@/utils/time";
import {flattenObject, splitObject} from "@/components/imagePreviewer/utils/object";

const getParamsBoxArray = (obj: any) => {
    const arr = [];

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            arr.push({label: key, value: obj[key]});
        }
    }

    return arr
}

const ParamsRender = (props: { params?: Map<any, any>, index?: number | string }) => {
    const [promptBox, setPromptBox] = useState(null)
    const [mainBox, setMainBox] = useState(null)
    const [otherBox, setOtherBox] = useState(null)


    useEffect(() => {
        if (props.params[props.index]) {
            const params = flattenObject(props.params[props.index])

            let [prompts, second] = splitObject(params, [
                'prompt',
                'negative_prompt'
            ])

            let [main, others] = splitObject(second, [
                "steps",
                "seed",
                "sampler_name",
                "cfg_scale",
                "width",
                "height",
                'sd_model_name',
                'sd_vae_name'
            ])

            if (prompts)
                setPromptBox(prompts)
            if (main)
                setMainBox(main)
            if (others)
                setOtherBox(others)
        } else {
            setPromptBox(null)
            setMainBox(null)
            setOtherBox(null)
        }
    }, [props.params, props.index]);


    return (
        <Space direction={'vertical'}>
            {/*prompt*/}
            {promptBox && <Card
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
                            <span>{promptBox.prompt}</span>
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
                            <span>{promptBox.negative_prompt}</span>
                        </Typography.Ellipsis>
                    </Grid.Col>
                </Grid.Row>
            </Card>}

            {/*main metadata*/}
            {mainBox && <Card
                title={'主要参数'}
                bordered={true}
            >
                <Descriptions
                    column={1}
                    data={getParamsBoxArray(mainBox)}
                    style={{paddingTop: '12px'}}
                    labelStyle={{paddingRight: 24}}
                    valueStyle={{wordBreak: 'break-all'}}
                />
            </Card>}

            {/*other metadata*/}
            {otherBox && <Card
                title={'其他参数'}
                bordered={true}
            >
                <Descriptions
                    column={1}
                    data={getParamsBoxArray(otherBox)}
                    style={{paddingTop: '12px'}}
                    labelStyle={{paddingRight: 24}}
                    valueStyle={{wordBreak: 'break-all'}}
                />
            </Card>}
        </Space>
    )
}


const ImagePreviewer = () => {
    const smallLayoutThres = 1024

    const {imageViewerShow, setImageViewerShow} = useImagePreviewer()
    const imageContainer = useRef(null)

    const [paramsCardShow, setParamsCardShow] = useState(true)
    const [smallLayout, setSmallLayout] = useState(false)

    const imageUser = useImagePreviewerSetting(
        (state) => state.imageUser
    )
    const imageExtra = useImagePreviewerSetting(
        (state) => state.imageExtra
    )
    const imageList = useImagePreviewerSetting(
        (state) => state.imageList
    )
    const [imageListIndex, setImageListIndex] = useState(0)
    const [
        imageParams, setImageParams, clearImageParams
    ] = useImagePreviewerSetting(
        (state) => [state.imageParams, state.setImageParams, state.clearImageParams]
    )
    const onParamsRequest = useImagePreviewerSetting(
        (state) => state.onParamsRequest
    )
    const abortController = useImagePreviewerSetting(
        (state) => state.abortController
    )

    const handleResize = () => {
        const width = window.innerWidth
        if (smallLayout === false && width < smallLayoutThres) {
            setParamsCardShow(false)
        }
        setSmallLayout(width < smallLayoutThres)
    }

    const handleParamsResolve = (params: any, index: number | string) => {
        setImageParams(index, params)
    }

    useEffect(() => {
        setImageListIndex(0)
        clearImageParams()
        if (imageList.length > 0)
            onParamsRequest(imageList[0], 0, handleParamsResolve, abortController)
        if (imageList.length > 1)
            onParamsRequest(imageList[1], 1, handleParamsResolve, abortController)
    }, [imageList]);

    useEffect(() => {
        if (!imageParams[imageListIndex])
            onParamsRequest(imageList[imageListIndex], imageListIndex, handleParamsResolve, abortController)
        if (imageListIndex - 2 >= 0 && !imageParams[imageListIndex - 2])
            onParamsRequest(imageList[imageListIndex - 2], imageListIndex - 2, handleParamsResolve, abortController)
        if (imageListIndex - 1 >= 0 && !imageParams[imageListIndex - 1])
            onParamsRequest(imageList[imageListIndex - 1], imageListIndex - 1, handleParamsResolve, abortController)
        if (imageListIndex + 1 < imageList.length && !imageParams[imageListIndex + 1])
            onParamsRequest(imageList[imageListIndex + 1], imageListIndex + 1, handleParamsResolve, abortController)
        if (imageListIndex + 2 < imageList.length && !imageParams[imageListIndex + 2])
            onParamsRequest(imageList[imageListIndex + 2], imageListIndex + 2, handleParamsResolve, abortController)
    }, [imageListIndex]);


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
                            userSelect: 'none'
                        }}
                    >
                        <Image.PreviewGroup
                            srcList={imageList.map((item) => item.url)}
                            current={imageListIndex}
                            visible={true}
                            closable={false}
                            resetTranslate={false}
                            onChange={(index) => {
                                setImageListIndex(index)
                            }}
                            getPopupContainer={() => imageContainer.current}
                            actions={[
                                {
                                    key: 'count',
                                    content: (
                                        <span style={{fontSize: '13px'}}>
                                            {`第 ${imageListIndex + 1}/${imageList.length} 张`}
                                        </span>
                                    )
                                },
                                {
                                    key: 'thumbUp',
                                    content: <IconThumbUp/>
                                },
                                {
                                    key: 'favourite',
                                    content: <IconStar/>
                                },
                            ]}
                            actionsLayout={[
                                'fullScreen', 'zoomIn', 'zoomOut', 'originalSize', 'count', 'thumbUp', 'favourite'
                            ]}
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
                                            {
                                                imageUser.avatarUrl
                                                    ? <img alt={'avatar'} src={imageUser.avatarUrl}/>
                                                    : 'WA'
                                            }
                                        </Avatar>
                                        <Space direction={'vertical'} size={1}>
                                            <span style={{color: 'var(--color-text-1)'}}>
                                                {imageUser.nickName}
                                            </span>
                                            <span style={{color: 'var(--color-text-1)'}}>
                                                {convertUTCTime(imageExtra.updateTime)}
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

                            <ParamsRender params={imageParams} index={imageListIndex}/>

                        </Space>
                    </Card>
                </Grid.Col>}
            </Grid.Row>
        </Modal>
    )
}

export default ImagePreviewer