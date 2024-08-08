import {IconMoreVertical} from "@arco-design/web-react/icon";
import {Collapse, Space} from "@arco-design/web-react";
import ParamsRender from "@/components/workbench/components/paramsRender";
import {IWorkbenchParams, useWorkbenchParams} from "@/store/workbench";

const SettingsPanel = (props: { name: string }) => {
    const [txt2imgParams, setTxt2imgParams] = useWorkbenchParams(
        (state: IWorkbenchParams) => [state.txt2imgParams, state.setTxt2imgParams]
    )

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
                        settings: {
                            buttons: [
                                {
                                    name: '768x768', onClick: () => {
                                        setTxt2imgParams({...txt2imgParams, width: 768, height: 768})
                                    }
                                },
                                {
                                    name: '1024x768', onClick: () => {
                                        setTxt2imgParams({...txt2imgParams, width: 1024, height: 768})
                                    }
                                },
                                {
                                    name: '768x1024', onClick: () => {
                                        setTxt2imgParams({...txt2imgParams, width: 768, height: 1024})
                                    }
                                },
                                {
                                    name: '交换', onClick: () => {
                                        setTxt2imgParams({
                                            ...txt2imgParams,
                                            width: txt2imgParams.height,
                                            height: txt2imgParams.width
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
                        settings: {
                            min: 32,
                            max: 4096,
                            step: 8,
                            value: txt2imgParams.width,
                            onChange: (value: number) => {
                                setTxt2imgParams({...txt2imgParams, width: value})
                            }
                        }
                    },
                    {
                        name: '高度',
                        type: 'slider',
                        subItem: true,
                        settings: {
                            min: 32,
                            max: 4096,
                            step: 8,
                            value: txt2imgParams.height,
                            onChange: (value: number) => {
                                setTxt2imgParams({...txt2imgParams, height: value})
                            }
                        }
                    },
                    {
                        name: '采样方法',
                        type: 'select',
                        settings: {
                            selectOptions: [
                                {label: 'Euler a', value: 'Euler a'},
                                {label: 'Euler', value: 'Euler'},
                                {label: 'DPM++ 2M Karras', value: 'DPM++ 2M Karras'},
                                {label: 'DPM++ SDE Karras', value: 'DPM++ SDE Karras'},
                                {label: 'DPM++ 2M SDE Exponential', value: 'DPM++ 2M SDE Exponential'},
                                {label: 'DPM++ 2M SDE Karras', value: 'DPM++ 2M SDE Karras'},
                                {label: 'LMS', value: 'LMS'},
                                {label: 'Heun', value: 'Heun'},
                                {label: 'DPM2', value: 'DPM2'},
                                {label: 'DPM2 a', value: 'DPM2 a'},
                                {label: 'DPM++ 2S a', value: 'DPM++ 2S a'},
                                {label: 'DPM++ 2M', value: 'DPM++ 2M'},
                                {label: 'DPM++ SDE', value: 'DPM++ SDE'},
                                {label: 'DPM++ 2M SDE', value: 'DPM++ 2M SDE'},
                                {label: 'DPM++ 2M SDE Heun', value: 'DPM++ 2M SDE Heun'},
                                {label: 'DPM++ 2M SDE Heun Karras', value: 'DPM++ 2M SDE Heun Karras'},
                                {label: 'DPM++ 2M SDE Heun Exponential', value: 'DPM++ 2M SDE Heun Exponential'},
                                {label: 'DPM++ 3M SDE', value: 'DPM++ 3M SDE'},
                                {label: 'DPM++ 3M SDE Karras', value: 'DPM++ 3M SDE Karras'},
                                {label: 'DPM++ 3M SDE Exponential', value: 'DPM++ 3M SDE Exponential'},
                                {label: 'DPM fast', value: 'DPM fast'},
                                {label: 'DPM adaptive', value: 'DPM adaptive'},
                                {label: 'LMS Karras', value: 'LMS Karras'},
                                {label: 'DPM2 Karras', value: 'DPM2 Karras'},
                                {label: 'DPM2 a Karras', value: 'DPM2 a Karras'},
                                {label: 'DPM++ 2S a Karras', value: 'DPM++ 2S a Karras'},
                                {label: 'Restart', value: 'Restart'},
                                {label: 'DDIM', value: 'DDIM'},
                                {label: 'PLMS', value: 'PLMS'},
                                {label: 'UniPC', value: 'UniPC'},
                                {label: 'LCM', value: 'LCM'},
                            ],
                            value: txt2imgParams.sampler_name,
                            onChange: (value: string) => {
                                setTxt2imgParams({...txt2imgParams, sampler_name: value})
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
                            value: txt2imgParams.steps,
                            onChange: (value: number) => {
                                setTxt2imgParams({...txt2imgParams, steps: value})
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
                            value: txt2imgParams.cfg_scale,
                            onChange: (value: number) => {
                                setTxt2imgParams({...txt2imgParams, cfg_scale: value})
                            }
                        }
                    },
                    {
                        name: '种子',
                        type: 'input',
                        settings: {
                            placeholder: '留空和-1均为随机',
                            value: txt2imgParams.seed.toString(),
                            onChange: (value: string) => {
                                console.log(value)
                                let parsedValue: number = parseInt(value);
                                if (isNaN(parsedValue)) {
                                    // 如果无法解析为数字，则将 value 设置为 -1
                                    parsedValue = -1;
                                }
                                setTxt2imgParams({...txt2imgParams, seed: parsedValue});
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
                            value: txt2imgParams.override_settings.CLIP_stop_at_last_layers.toString(),
                            onChange: (value: string) => {
                                setTxt2imgParams(
                                    {
                                        ...txt2imgParams, override_settings: {
                                            ...txt2imgParams.override_settings,
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
                            value: txt2imgParams.override_settings.eta_noise_seed_delta.toString(),
                            onChange: (value: string) => {
                                setTxt2imgParams({
                                    ...txt2imgParams, override_settings: {
                                        ...txt2imgParams.override_settings,
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