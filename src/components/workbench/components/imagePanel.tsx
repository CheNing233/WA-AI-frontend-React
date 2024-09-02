import {IconMoreVertical} from "@arco-design/web-react/icon";
import {Button, Collapse, Space, Switch} from "@arco-design/web-react";
import ParamsRender from "@/components/workbench/components/paramsRender";
import InfoCard from "@/components/workbench/components/infoCard";
import {UploadIcon} from "tdesign-icons-react";
import {useEffect, useRef, useState} from "react";

export interface IImagePanelProps {
    name: string,
    params: any,
    setParams: (params: any) => void,
    allowMask?: boolean
}

interface ImageInfo {
    base64: string,
    width: number,
    height: number;
}

/**
 * 将文件转换为Base64编码格式
 * 此函数使用FileReader将文件读取为Data URL（Base64编码的字符串），然后通过回调函数返回图像的信息
 * @param file 要转换的文件对象
 * @param callback 回调函数，用于处理转换后的图像信息（Base64编码、宽度和高度）
 */
const convert2Base64 = (file: File, callback: Function) => {
    // 创建FileReader对象，用于读取文件
    const reader = new FileReader();

    // 当文件读取完成时的处理逻辑
    reader.onload = () => {
        // 创建Image对象，用于加载读取器读取的结果
        const image = new Image();
        // 将读取器的结果设置为图像的源
        image.src = reader.result as string;

        // 当图像加载完成时的处理逻辑
        image.onload = () => {
            // 创建一个对象，包含Base64编码的图像数据、宽度和高度
            const imageInfo = {
                base64: reader.result,
                width: image.width,
                height: image.height
            };
            // 调用回调函数，传递图像信息
            callback(imageInfo);
        };
    };
    // 使用FileReader读取文件为Data URL（Base64编码的字符串）
    reader.readAsDataURL(file);
}


const ImagePanel = (props: IImagePanelProps) => {
    const params = props.params
    const setParams = props.setParams

    const fileRef = useRef(null)
    const [loadImageTo, setLoadImageTo] = useState('')
    const [image, setImage] = useState<ImageInfo>({
        base64: '',
        width: 0,
        height: 0,
    })
    const [imageText, setImageText] = useState(
        image.base64
            ? `图片：${image.width}×${image.height} > ${params.width}×${params.height}`
            : '图片'
    )

    const [mask, setMask] = useState<ImageInfo>({
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

    useEffect(() => {
        setImageText(
            image.base64
                ? `图片：${image.width}×${image.height} > ${params.width}×${params.height}`
                : '图片'
        )
    }, [image.width, image.height, params.width, params.height, params.scaleNumber])

    const handleLocalFileInput = () => {
        const file = fileRef.current.files[0]
        if (file) {
            convert2Base64(file, (imageInfo: ImageInfo) => {
                switch (loadImageTo) {
                    case 'image':
                        setImage(imageInfo)
                        return
                    case 'mask':
                        setMask(imageInfo)
                        return
                }
            })
        }
    }

    const handleOpenLocalFile = (target: string) => {
        setLoadImageTo(target)
        fileRef.current.dispatchEvent(new MouseEvent('click'))
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
                <InfoCard id={'img2img-image-card'}
                          title={imageText}
                          imageSrc={image.base64 || ''}
                          useRawImageSrc={true}
                          type={'图片'}
                          extra={
                              <Space>
                                  <Button size={'mini'} type={'primary'} icon={<UploadIcon/>}
                                          onClick={() => {
                                              handleOpenLocalFile('image')
                                          }}
                                  >上传</Button>
                                  {/*<Button size={'mini'} type={'primary'} icon={<ImageSearchIcon/>}>我的图片</Button>*/}
                              </Space>
                          }
                >
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
                </InfoCard>

                {props.allowMask && <InfoCard
                    id={'img2img-image-mask'}
                    title={mask.base64
                        ? `蒙版：${mask.width}×${mask.height}`
                        : '蒙版'
                    }
                    imageSrc={mask.base64 || ''}
                    useRawImageSrc={true}
                    type={'蒙版'}
                    disabled={!params.allowMask}
                    extra={
                        <Space>
                            <Button size={'mini'} type={'primary'} disabled={!params.allowMask}
                                    onClick={() => {
                                        handleOpenLocalFile('mask')
                                    }}
                                    icon={<UploadIcon/>}>上传</Button>
                            {/*<Button size={'mini'} type={'primary'} disabled={!params.allowMask}*/}
                            {/*        icon={<ImageSearchIcon/>}>我的图片</Button>*/}
                            <Switch
                                checkedText={'启用'}
                                uncheckedText={'禁用'}
                                checked={params.allowMask}
                                onChange={(value) => {
                                    setParams({...params, allowMask: value})
                                }}
                            />
                        </Space>
                    }
                >
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
                </InfoCard>}

                <input
                    style={{position: 'absolute', display: 'none'}}
                    ref={fileRef}
                    type={'file'}
                    onChange={handleLocalFileInput}
                />

            </Space>
        </Collapse.Item>
    )
}

export default ImagePanel