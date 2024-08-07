export type ISliderSetting = {
    min: number,
    max: number,
    step: number,
}

export type ISelectSetting = {
    options: any
}

export type IRadioSetting = {
    options: any
}

export type IParams = {
    name: string,
    type: 'slider' | 'select' | 'radio' | 'switch' | 'custom',
    settings: ISliderSetting | ISelectSetting | IRadioSetting,
    [key: string]: any
}

export type IParamsRenderProps = {
    params: IParams[],
    children: any,
}


const ParamsRender = (props: IParamsRenderProps) => {
    return <div>{props.children}</div>
}

export default ParamsRender