import {IconMoreVertical} from "@arco-design/web-react/icon";
import {Collapse, Space} from "@arco-design/web-react";
import ParamsRender from "@/components/workbench/components/paramsRender";

export interface IHiresPanelProps {
    name: string
    params: any,
    setParams: (params: any) => void
}

const HiresPanel = (props: IHiresPanelProps) => {
    const params = props.params
    const setParams = props.setParams

    return (
        <Collapse.Item
            header={<div style={{userSelect: 'none'}}>高清修复</div>}
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
                        name: '放大倍数',
                        type: 'buttons',
                        settings: {
                            buttons: [
                                {
                                    name: '1x', onClick: () => {
                                        setParams({...params, hr_scale: 1})
                                    }
                                },
                                {
                                    name: '1.5x', onClick: () => {
                                        setParams({...params, hr_scale: 1.5})
                                    }
                                },
                                {
                                    name: '2x', onClick: () => {
                                        setParams({...params, hr_scale: 2})
                                    }
                                },
                                {
                                    name: '3x', onClick: () => {
                                        setParams({...params, hr_scale: 3})
                                    }
                                },
                                {
                                    name: '4x', onClick: () => {
                                        setParams({...params, hr_scale: 4})
                                    }
                                },
                            ]
                        }
                    },
                    {
                        name: '倍数',
                        type: 'slider',
                        subItem: true,
                        settings: {
                            min: 0,
                            max: 4,
                            step: 0.1,
                            value: params.hr_scale,
                            onChange: (value: number) => {
                                setParams({...params, hr_scale: value})
                            }
                        }
                    },
                    {
                        name: '重绘算法',
                        type: 'select',
                        settings: {
                            selectOptions: [
                                {label: 'Latent', value: 'Latent'},
                                {label: 'Latent (antialiased)', value: 'Latent (antialiased)'},
                                {label: 'Latent (bicubic)', value: 'Latent (bicubic)'},
                                {label: 'Latent (bicubic antialiased)', value: 'Latent (bicubic antialiased)'},
                                {label: 'Latent (nearest)', value: 'Latent (nearest)'},
                                {label: 'Latent (nearest-exact)', value: 'Latent (nearest-exact)'},
                                {label: 'None', value: 'None'},
                                {label: 'Lanczos', value: 'Lanczos'},
                                {label: 'Nearest', value: 'Nearest'},
                                {label: 'ESRGAN_4x', value: 'ESRGAN_4x'},
                                {label: 'LDSR', value: 'LDSR'},
                                {label: 'R-ESRGAN 4x+', value: 'R-ESRGAN 4x+'},
                                {label: 'R-ESRGAN 4x+ Anime6B', value: 'R-ESRGAN 4x+ Anime6B'},
                                {label: 'ScuNET GAN', value: 'ScuNET GAN'},
                                {label: 'ScuNET PSNR', value: 'ScuNET PSNR'},
                                {label: 'SwinIR 4x', value: 'SwinIR 4x'},
                            ],
                            value: params.hr_upscaler,
                            onChange: (value: string) => {
                                setParams({...params, hr_upscaler: value})
                            }
                        },

                    },
                    {
                        name: '采样次数',
                        type: 'slider',
                        settings: {
                            min: 1,
                            max: 150,
                            step: 1,
                            value: params.hr_second_pass_steps,
                            onChange: (value: number) => {
                                setParams({...params, hr_second_pass_steps: value})
                            }
                        }
                    },
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
                ]}
                />
            </Space>
        </Collapse.Item>
    )
}

export default HiresPanel