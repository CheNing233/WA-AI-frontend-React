import {IconMoreVertical} from "@arco-design/web-react/icon";
import {Collapse, Space} from "@arco-design/web-react";
import ParamsRender from "@/components/workbench/components/paramsRender";
import {SdHiresUpScalers} from "@/constants/sd";

export interface IExtraSettingPanelProps {
    name: string;
    params: any
    setParams: (params: any) => void
}


const ExtraSettingPanel = (props: IExtraSettingPanelProps) => {
    const params = props.params
    const setParams = props.setParams

    return (
        <Collapse.Item
            header={<div style={{userSelect: 'none'}}>超分设置</div>}
            name={props.name}
            extra={<IconMoreVertical/>}
            style={{width: '100%', overflow: 'hidden'}}
        >
            <Space
                direction={'vertical'}
                style={{width: '100%', padding: '12px 0 16px 0', transform: 'translateX(-12px)'}}
                size={16}
            >
                <ParamsRender params={[
                    {
                        name: '缩放模式',
                        type: 'radios',
                        settings: {
                            radioOptions: [
                                {label: '按原图倍数缩放', value: 0},
                                {label: '指定宽高', value: 1}
                            ],
                            value: params.resize_mode,
                            onChange: (value: string) => {
                                setParams({...params, resize_mode: parseInt(value)})
                            }
                        }
                    },
                    {
                        name: '宽度',
                        type: 'slider',
                        subItem: true,
                        hide: params.resize_mode !== 1,
                        settings: {
                            min: 32,
                            max: 4096,
                            step: 8,
                            value: params.upscaling_resize_w,
                            onChange: (value: number) => {
                                setParams({...params, upscaling_resize_w: value})
                            }
                        }
                    },
                    {
                        name: '高度',
                        type: 'slider',
                        subItem: true,
                        hide: params.resize_mode !== 1,
                        settings: {
                            min: 32,
                            max: 4096,
                            step: 8,
                            value: params.upscaling_resize_h,
                            onChange: (value: number) => {
                                setParams({...params, upscaling_resize_h: value})
                            }
                        }
                    },
                    {
                        name: '缩放倍数',
                        type: 'slider',
                        subItem: true,
                        hide: params.resize_mode !== 0,
                        settings: {
                            min: 0,
                            max: 8,
                            step: 0.1,
                            value: params.upscaling_resize,
                            onChange: (value: number) => {
                                setParams({...params, upscaling_resize: value})
                            }
                        }
                    },
                    {
                        name: '放大算法Ⅰ',
                        type: 'select',
                        settings: {
                            selectOptions: [
                                ...SdHiresUpScalers
                            ],
                            value: params.upscaler_1,
                            onChange: (value: string) => {
                                setParams({...params, upscaler_1: value})
                            }
                        },
                    },
                    {
                        name: '放大算法Ⅱ',
                        type: 'select',
                        settings: {
                            selectOptions: [
                                ...SdHiresUpScalers
                            ],
                            value: params.upscaler_2,
                            onChange: (value: string) => {
                                setParams({...params, upscaler_2: value})
                            }
                        },
                    },
                    {
                        name: '放大算法Ⅱ 比重',
                        type: 'slider',
                        subItem: true,
                        settings: {
                            min: 0,
                            max: 1,
                            step: 0.001,
                            value: params.extras_upscaler_2_visibility,
                            onChange: (value: number) => {
                                setParams({...params, extras_upscaler_2_visibility: value})
                            }
                        }
                    },
                ]}
                />
            </Space>
        </Collapse.Item>
    )
}

export default ExtraSettingPanel