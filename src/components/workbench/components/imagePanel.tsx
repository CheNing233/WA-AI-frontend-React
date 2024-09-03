import ImageUploadRender, {ImageInfo} from "@/components/workbench/components/imageUploadRender";
import ParamsRender from "@/components/workbench/components/paramsRender";
import {useEffect, useState} from "react";
import {IconMoreVertical} from "@arco-design/web-react/icon";
import {Collapse, Space} from "@arco-design/web-react";

export interface IImagePanelProps {
    name: string;
    params: any;
    setParams: (params: any) => void;
}

const ImagePanel = (props: IImagePanelProps) => {
    const params = props.params
    const setParams = props.setParams
    const [image, setImage] = useState<ImageInfo>({
        base64: '',
        width: 0,
        height: 0,
    })

    useEffect(() => {
        if (params.scaleByOriginal) {
            const newWidth = Math.round(image.width * params.scaleNumber)
            const newHeight = Math.round(image.height * params.scaleNumber)
            setParams({
                ...params,
                width: newWidth,
                height: newHeight,
            })
        }
    }, [image.base64]);

    const handleImageChange = (image: ImageInfo) => {
        setImage(image)
        setParams({...params, init_images: [image.base64]})
    }

    const handleMaskChange = (mask: ImageInfo) => {
        setParams({...params, mask: mask.base64})
    }

    return (
        <Collapse.Item
            header={<div style={{userSelect: 'none'}}>图片</div>}
            name={props.name}
            extra={<IconMoreVertical/>}
            style={{width: '100%', overflow: 'hidden'}}
        >
            <Space
                direction={'vertical'}
                style={{width: '100%', padding: '12px 0 16px 0', transform: 'translateX(-12px)'}}
                size={16}
            >
                <ImageUploadRender
                    imageChildren={
                        <ParamsRender params={[
                            {
                                name: '重绘幅度',
                                type: 'slider',
                                settings: {
                                    min: 0,
                                    max: 1,
                                    step: 0.01,
                                    value: params.denoising_strength,
                                    onChange: (value: number) => {
                                        setParams({...params, denoising_strength: value})
                                    }
                                }
                            },
                            {
                                name: '缩放模式',
                                type: 'radios',
                                settings: {
                                    radioOptions: [
                                        {label: '按原图倍数缩放', value: true},
                                        {label: '指定宽高', value: false}
                                    ],
                                    value: params.scaleByOriginal,
                                    onChange: (value: string) => {
                                        setParams({...params, scaleByOriginal: value})
                                    }
                                }
                            },
                            {
                                name: '宽度',
                                type: 'slider',
                                subItem: true,
                                hide: params.scaleByOriginal,
                                settings: {
                                    min: 32,
                                    max: 4096,
                                    step: 8,
                                    value: params.width,
                                    onChange: (value: number) => {
                                        setParams({...params, width: value})
                                    }
                                }
                            },
                            {
                                name: '高度',
                                type: 'slider',
                                subItem: true,
                                hide: params.scaleByOriginal,
                                settings: {
                                    min: 32,
                                    max: 4096,
                                    step: 8,
                                    value: params.height,
                                    onChange: (value: number) => {
                                        setParams({...params, height: value})
                                    }
                                }
                            },
                            {
                                name: '缩放倍数',
                                type: 'slider',
                                subItem: true,
                                hide: !params.scaleByOriginal,
                                settings: {
                                    min: 0,
                                    max: 4,
                                    step: 0.1,
                                    value: params.scaleNumber,
                                    onChange: (value: number) => {
                                        if (params.scaleByOriginal) {
                                            const newWidth = Math.round(image.width * value)
                                            const newHeight = Math.round(image.height * value)
                                            setParams({
                                                ...params,
                                                width: newWidth,
                                                height: newHeight,
                                                scaleNumber: value
                                            })
                                        } else {
                                            setParams({...params, scaleNumber: value})
                                        }
                                    }
                                }
                            },
                        ]}
                        />
                    }
                    maskChildren={
                        <ParamsRender params={[
                            {
                                name: '边缘模糊',
                                type: 'slider',
                                settings: {
                                    min: 0,
                                    max: 64,
                                    step: 1,
                                    value: params.mask_blur,
                                    onChange: (value: number) => {
                                        setParams({...params, mask_blur: value})
                                    }
                                }
                            },
                            {
                                name: '模式',
                                type: 'radios',
                                settings: {
                                    radioOptions: [
                                        {label: '重绘蒙版(白色)内容', value: 0},
                                        {label: '重绘非蒙版(黑色)内容', value: 1}
                                    ],
                                    value: params.inpainting_mask_invert,
                                    onChange: (value: string) => {
                                        setParams({...params, inpainting_mask_invert: value})
                                    }
                                }
                            },
                            {
                                name: '内容处理',
                                type: 'radios',
                                settings: {
                                    radioOptions: [
                                        {label: '填充', value: 0},
                                        {label: '原版', value: 1},
                                        {label: '潜空间噪声', value: 2},
                                        {label: '空白潜空间', value: 3}
                                    ],
                                    value: params.inpainting_fill,
                                    onChange: (value: string) => {
                                        setParams({...params, inpainting_fill: value})
                                    }
                                }
                            },
                            {
                                name: '仅重绘蒙版区域',
                                type: 'switch',
                                settings: {
                                    checked: params.inpaint_full_res,
                                    onChange: (checked: boolean) => {
                                        setParams({...params, inpaint_full_res: checked})
                                    }
                                }
                            },
                            {
                                name: '边缘预留像素(仅重绘蒙版区域时)',
                                type: 'slider',
                                subItem: true,
                                hide: !params.inpaint_full_res,
                                settings: {
                                    min: 0,
                                    max: 256,
                                    step: 1,
                                    value: params.inpaint_full_res_padding,
                                    onChange: (value: number) => {
                                        setParams({...params, inpaint_full_res_padding: value})
                                    }
                                }
                            },
                        ]}
                        />
                    }
                    useMask={true}
                    allowMask={params.allowMask}
                    setAllowMask={(allowMask: boolean) => {
                        setParams({...params, allowMask: allowMask})
                    }}
                    onImageChange={handleImageChange}
                    imageTitleTargetWidth={params.width}
                    imageTitleTargetHeight={params.height}
                    onMaskChange={handleMaskChange}
                />
            </Space>
        </Collapse.Item>
    )
}

export default ImagePanel