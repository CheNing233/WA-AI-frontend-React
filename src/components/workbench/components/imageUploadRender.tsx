import {Button, Message, Space, Switch} from "@arco-design/web-react";
import InfoCard from "@/components/workbench/components/infoCard";
import {EditIcon, UploadIcon} from "tdesign-icons-react";
import {ReactNode, useEffect, useRef, useState} from "react";
import ImageEditor from "@/components/imageEditor";

export interface IImageUploadRenderProps {
    imageChildren?: ReactNode,
    maskChildren?: ReactNode,
    useMask?: boolean,
    allowMask?: boolean,
    setAllowMask?: (allowMask: boolean) => void,
    onImageChange?: (image: ImageInfo) => void,
    onMaskChange?: (mask: ImageInfo) => void,
    imageTitleTargetWidth?: number,
    imageTitleTargetHeight?: number,
}

export interface ImageInfo {
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


const ImageUploadRender = (props: IImageUploadRenderProps) => {
    const fileRef = useRef(null)
    const [loadImageTo, setLoadImageTo] = useState('')
    const [image, setImage] = useState<ImageInfo>({
        base64: '',
        width: 0,
        height: 0,
    })
    const [imageBackup, setImageBackup] = useState<ImageInfo>({
        base64: '',
        width: 0,
        height: 0,
    })
    const getImageTitle = (): string => {
        if (image.base64) {
            if (props.imageTitleTargetWidth && props.imageTitleTargetHeight) {
                return `图片：${image.width}×${image.height} > ${props.imageTitleTargetWidth}×${props.imageTitleTargetHeight}`
            } else {
                return `图片：${image.width}×${image.height}`
            }
        } else {
            return '图片'
        }
    }
    const [imageTitle, setImageTitle] = useState(getImageTitle())
    const imageEditorRef = useRef(null)
    const [imageEditorVisible, setImageEditorVisible] = useState(false)

    const [mask, setMask] = useState<ImageInfo>({
        base64: '',
        width: 0,
        height: 0,
    })

    // 处理标题
    useEffect(() => {
        setImageTitle(getImageTitle())
    }, [image.width, image.height, props.imageTitleTargetWidth, props.imageTitleTargetHeight])

    // 处理图片变更
    useEffect(() => {
        props.onImageChange && props.onImageChange(image)
    }, [image.base64]);

    // 处理蒙版变更
    useEffect(() => {
        props.onMaskChange && props.onMaskChange(mask)
    }, [mask.base64]);

    // 处理图片编辑器保存
    useEffect(() => {
        if (imageEditorVisible === false) {
            const getImagePromise = imageEditorRef.current?.getCurrentImageBase64()
            if (getImagePromise) {
                getImagePromise
                    .then((newImage: string) => {
                        if (newImage && newImage !== image.base64) {
                            setImage({
                                ...image,
                                base64: newImage
                            })
                            Message.success('图片已更新')
                        }
                    })
                    .catch(() => {
                    })
            }
            // const newImage = imageEditorRef.current?.getCurrentImageBase64()
            // if (newImage && newImage !== image.base64) {
            //     setImage({
            //         ...image,
            //         base64: newImage
            //     })
            //     Message.success('图片已更新')
            // }
        }
    }, [imageEditorVisible]);

    const handleLocalFileInput = () => {
        const file = fileRef.current.files[0]
        if (file) {
            convert2Base64(file, (imageInfo: ImageInfo) => {
                switch (loadImageTo) {
                    case 'image':
                        setImage(imageInfo)
                        setImageBackup(imageInfo)
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

    const handleEditImage = (target: string) => {
        setImageEditorVisible(true)
    }

    return (
        <Space direction={'vertical'} size={props.useMask ? 16 : 0} style={{width: '100%'}}>
            <InfoCard id={'image-card'}
                      title={imageTitle}
                      imageSrc={image.base64 || ''}
                      useRawImageSrc={true}
                      type={'图片'}
                      extra={
                          <Space>
                              <Button size={'mini'} type={'primary'} icon={<EditIcon/>}
                                      disabled={image.base64 === ''}
                                      onClick={() => {
                                          handleEditImage('')
                                      }}
                              >
                                  编辑
                              </Button>
                              <Button size={'mini'} type={'primary'} icon={<UploadIcon/>}
                                      onClick={() => {
                                          handleOpenLocalFile('image')
                                      }}
                              >
                                  上传
                              </Button>
                              {/*<Button size={'mini'} type={'primary'} icon={<ImageSearchIcon/>}>我的图片</Button>*/}
                          </Space>
                      }
            >
                {props.imageChildren}
            </InfoCard>

            {props.useMask && <InfoCard
                id={'image-mask'}
                title={mask.base64
                    ? `蒙版：${mask.width}×${mask.height}`
                    : '蒙版'
                }
                imageSrc={mask.base64 || ''}
                useRawImageSrc={true}
                type={'蒙版'}
                disabled={!props.allowMask}
                extra={
                    <Space>
                        <Button size={'mini'} type={'primary'} disabled={!props.allowMask}
                                onClick={() => {
                                    handleOpenLocalFile('mask')
                                }}
                                icon={<UploadIcon/>}>上传</Button>
                        {/*<Button size={'mini'} type={'primary'} disabled={!params.allowMask}*/}
                        {/*        icon={<ImageSearchIcon/>}>我的图片</Button>*/}
                        <Switch
                            checkedText={'启用'}
                            uncheckedText={'禁用'}
                            checked={props.allowMask}
                            onChange={(value) => {
                                props.setAllowMask(value)
                            }}
                        />
                    </Space>
                }
            >
                {props.maskChildren}
            </InfoCard>}

            <input
                style={{position: 'absolute', display: 'none'}}
                ref={fileRef}
                type={'file'}
                onChange={handleLocalFileInput}
            />

            <ImageEditor
                ref={imageEditorRef}
                visible={imageEditorVisible}
                setVisible={setImageEditorVisible}
                imageInf={imageBackup}
            />
        </Space>
    )
}

export default ImageUploadRender