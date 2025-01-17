import {IconMoreVertical} from "@arco-design/web-react/icon";
import {Collapse, Space} from "@arco-design/web-react";
import ParamsRender from "@/components/workbench/components/paramsRender";
import {SdSamplers} from "@/constants/sd";

export interface ISettingsPanelProps {
    name: string,
    params: any,
    setParams: (params: any) => void,
    allowWidthHeight?: boolean,
}

const SettingsPanel = (props: ISettingsPanelProps) => {
    const params = props.params
    const setParams = props.setParams

    return (
        <Collapse.Item
            header={<div style={{userSelect: 'none'}}>基本设置</div>}
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
                        name: '图片大小',
                        type: 'buttons',
                        hide: !props.allowWidthHeight,
                        settings: {
                            buttons: [
                                {
                                    name: '768x768', onClick: () => {
                                        setParams({...params, width: 768, height: 768})
                                    }
                                },
                                {
                                    name: '1024x768', onClick: () => {
                                        setParams({...params, width: 1024, height: 768})
                                    }
                                },
                                {
                                    name: '768x1024', onClick: () => {
                                        setParams({...params, width: 768, height: 1024})
                                    }
                                },
                                {
                                    name: '交换', onClick: () => {
                                        setParams({
                                            ...params,
                                            width: params.height,
                                            height: params.width
                                        })
                                    }
                                },
                            ]
                        }
                    },
                    {
                        name: '宽度',
                        type: 'slider',
                        subItem: true,
                        hide: !props.allowWidthHeight,
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
                        hide: !props.allowWidthHeight,
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
                        name: '采样方法',
                        type: 'select',
                        settings: {
                            selectOptions: [
                                ...SdSamplers
                            ],
                            value: params.sampler_name,
                            onChange: (value: string) => {
                                setParams({...params, sampler_name: value})
                            }
                        },
                    },
                    {
                        name: '采样步数',
                        type: 'slider',
                        settings: {
                            min: 1,
                            max: 150,
                            step: 1,
                            value: params.steps,
                            onChange: (value: number) => {
                                setParams({...params, steps: value})
                            }
                        }
                    },
                    {
                        name: '提示词相关度',
                        type: 'slider',
                        settings: {
                            min: 0,
                            max: 30,
                            step: 0.1,
                            value: params.cfg_scale,
                            onChange: (value: number) => {
                                setParams({...params, cfg_scale: value})
                            }
                        }
                    },
                    {
                        name: '种子',
                        type: 'input',
                        settings: {
                            placeholder: '留空和-1均为随机',
                            value: params.seed.toString(),
                            onChange: (value: string) => {
                                console.log(value)
                                let parsedValue: number = parseInt(value);
                                if (isNaN(parsedValue)) {
                                    // 如果无法解析为数字，则将 value 设置为 -1
                                    parsedValue = -1;
                                }
                                setParams({...params, seed: parsedValue});
                            }
                        }
                    },
                    {
                        name: 'CLIP',
                        type: 'select',
                        settings: {
                            selectOptions: [
                                {label: '0', value: '0'},
                                {label: '1', value: '1'},
                                {label: '2', value: '2'},
                            ],
                            value: params.override_settings.CLIP_stop_at_last_layers.toString(),
                            onChange: (value: string) => {
                                setParams(
                                    {
                                        ...params, override_settings: {
                                            ...params.override_settings,
                                            CLIP_stop_at_last_layers: parseInt(value)
                                        }
                                    }
                                )
                            }
                        },
                    },
                    {
                        name: 'ENSD',
                        type: 'select',
                        settings: {
                            selectOptions: [
                                {label: '0', value: '0'},
                                {label: '31337', value: '31337'},
                            ],
                            value: params.override_settings.eta_noise_seed_delta.toString(),
                            onChange: (value: string) => {
                                setParams({
                                    ...params, override_settings: {
                                        ...params.override_settings,
                                        eta_noise_seed_delta: parseInt(value)
                                    }
                                })
                            }
                        }
                    }
                ]}
                />
            </Space>
        </Collapse.Item>
    )
}

export default SettingsPanel