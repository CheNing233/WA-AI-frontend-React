import {Button, Grid, Input, Radio, Select, Slider, Space, Switch, Tag} from "@arco-design/web-react";

export type ISliderSetting = {
    min: number,
    max: number,
    step: number,
    value: number,
    onChange: (value: number) => void,
}

export type IInputSetting = {
    placeholder: string,
    value: string,
    onChange: (value: string) => void,
}

export type ISelectOptionSetting = {
    label: string,
    value: string,
}

export type ISelectSetting = {
    selectOptions: ISelectOptionSetting[],
    value: string,
    onChange: (value: string) => void,
}

export type IRadioOptionSetting = {
    label: string,
    value: any,
}

export type IRadioGroupSetting = {
    radioOptions: IRadioOptionSetting[]
    value: string,
    onChange: (value: string) => void,
}

export type IButtonSetting = {
    name: string,
    onClick: (name: string) => void,
}

export type IButtonGroupSetting = {
    buttons: IButtonSetting[]
}

export type ISwitchSetting = {
    checked: boolean,
    onChange: (checked: boolean) => void,
}

export type IParams = {
    name: string,
    type: 'slider' | 'select' | 'radios' | 'switch' | 'buttons' | 'input',
    visible?: boolean,
    settings?: ISliderSetting | IInputSetting | ISelectSetting | IRadioGroupSetting | IButtonGroupSetting | ISwitchSetting,
    [key: string]: any
}

export type IParamsRenderProps = {
    params: IParams[],
    children?: any,
}


const ParamsRender = (props: IParamsRenderProps) => {


    return (
        <Space
            direction={'vertical'}
            style={{width: '100%'}}
        >
            {props.params.map(param => {
                switch (param.type) {
                    case 'slider':
                        const sliderSettings = param.settings as ISliderSetting;
                        return (
                            <Grid.Row key={`${param.name}-GridComponent`} gutter={[0, 16]} style={{width: '100%'}}
                                      align={'center'}>
                                <Grid.Col flex={'shrink'}>
                                    <Tag size={'medium'} color={'arcoblue'}>{param.name}</Tag>
                                </Grid.Col>
                                <Grid.Col flex={'1'} style={{marginLeft: '16px'}}>
                                    <Slider
                                        key={param.name}
                                        min={sliderSettings.min}
                                        max={sliderSettings.max}
                                        step={sliderSettings.step}
                                        value={sliderSettings.value}
                                        onChange={sliderSettings.onChange}
                                        showInput={{
                                            hideControl: false,
                                            mode: 'button',
                                            size: 'small',
                                            style: {width: '128px'}
                                        }}
                                        style={{width: '100%'}}
                                    />
                                </Grid.Col>
                            </Grid.Row>
                        );
                    case "input":
                        const inputSettings = (param.settings as IInputSetting);
                        return (
                            <Grid.Row key={`${param.name}-GridComponent`} gutter={[0, 16]} style={{width: '100%'}}
                                      align={'center'}>
                                <Grid.Col flex={'shrink'}>
                                    <Tag size={'medium'} color={'arcoblue'}>{param.name}</Tag>
                                </Grid.Col>
                                <Grid.Col flex={'1'} style={{marginLeft: '16px'}}>
                                    <Input
                                        size={'small'}
                                        placeholder={inputSettings.placeholder}
                                        value={inputSettings.value}
                                        onChange={inputSettings.onChange}
                                    >
                                    </Input>
                                </Grid.Col>
                            </Grid.Row>
                        )
                    case 'select':
                        const selectOptions = (param.settings as ISelectSetting).selectOptions;
                        return (
                            /* Render select component with param.settings.options */
                            <Grid.Row key={`${param.name}-GridComponent`} gutter={[0, 16]} style={{width: '100%'}}
                                      align={'center'}>
                                <Grid.Col flex={'shrink'}>
                                    <Tag size={'medium'} color={'arcoblue'}>{param.name}</Tag>
                                </Grid.Col>
                                <Grid.Col flex={'1'} style={{marginLeft: '16px'}}>
                                    <Select
                                        key={`${param.name}-SelectComponent`}
                                        size={'small'}
                                        triggerProps={{
                                            autoAlignPopupWidth: false,
                                            autoAlignPopupMinWidth: true,
                                            position: 'bl'
                                        }}
                                        value={(param.settings as ISelectSetting).value}
                                        onChange={(param.settings as ISelectSetting).onChange}
                                    >
                                        {selectOptions.map((option: any) => (
                                            <Select.Option
                                                key={`${param.name}-${option.value}`}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Grid.Col>
                            </Grid.Row>
                        );
                    case 'radios':
                        const radioOptions = (param.settings as IRadioGroupSetting).radioOptions;
                        return (
                            /* Render radio buttons with param.settings.options */
                            <Space key={`${param.name}-SpaceComponent`}>
                                <Tag size={'medium'} color={'arcoblue'}>{param.name}</Tag>
                                <Radio.Group
                                    size={'small'}
                                    value={(param.settings as IRadioGroupSetting).value}
                                    onChange={(param.settings as IRadioGroupSetting).onChange}
                                >
                                    {radioOptions.map((option: any) => (
                                        <Radio
                                            key={`${param.name}-${option.value}`}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </Radio>
                                    ))}
                                </Radio.Group>
                            </Space>
                        );
                    case "buttons":
                        const buttonOptions: IButtonSetting[] = (param.settings as IButtonGroupSetting).buttons;
                        return (
                            <Space key={`${param.name}-SpaceComponent`}>
                                <Tag size={'medium'} color={'arcoblue'}>{param.name}</Tag>
                                <Button.Group>
                                    {buttonOptions.map((option) => (
                                        <Button
                                            size={'small'}
                                            key={`${param.name}-${option.name}`}
                                            onClick={() => {
                                                option.onClick(option.name)
                                            }}
                                        >
                                            {option.name}
                                        </Button>
                                    ))}
                                </Button.Group>
                            </Space>
                        )
                    case "switch":
                        const switchSettings = (param.settings as ISwitchSetting);
                        return (
                            <Space key={`${param.name}-SpaceComponent`}>
                                <Tag size={'medium'} color={'arcoblue'}>{param.name}</Tag>
                                <Switch
                                    checked={switchSettings.checked}
                                    onChange={switchSettings.onChange}
                                />
                            </Space>
                        )
                    default:
                        return null;
                }
            })}
        </Space>
    )
}

export default ParamsRender