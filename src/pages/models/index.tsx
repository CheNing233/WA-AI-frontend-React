import ContentWrapper from "@/components/contentWrapper";
import Banner from "@/components/banner";
import {Button, Message, Space} from "@arco-design/web-react";
import ImageCard from "@/components/imageCard";
import {convertUTCTime} from "@/utils/time";
import {IModel} from "@/services/modules/models";
import {ImageIcon, TextboxIcon} from "tdesign-icons-react";
import {useWorkbenchModels} from "@/store/workbench";
import useWorkbench from "@/components/workbench/useWorkbench";
import {HoverButton} from "@/components/button/hoverButton";
import {ModelDataRender} from "@/pages/models/dataRender";


const Models = () => {
    const {authWorkbench} = useWorkbench()
    const [setModel] = useWorkbenchModels((state) => {
        return [state.setModel]
    })

    const dataElement = (data: IModel | any) => {
        return (
            <ImageCard
                width={'100%'}
                id={data.id}
                author={data.nickName}
                authorAvatar={data.userAvatarUrl}
                title={data.title}
                time={convertUTCTime(data.updateTime)}
                src={data.bannerUrl}
            >
                <Space style={{position: "absolute", top: '12px', right: '12px'}}
                       direction={'vertical'}
                       align={'end'}
                >
                    <HoverButton
                        icon={<TextboxIcon/>}
                        type={'secondary'}
                        size={'large'}
                        onClick={() => {
                            authWorkbench(() => {
                                setModel(data, 'txt2img')
                                Message.success(`文生图已添加 ${data.type} 「${data.title}」`)
                            })
                        }}
                    >
                        运行 文生图
                    </HoverButton>
                    <HoverButton
                        icon={<ImageIcon/>}
                        type={'secondary'}
                        size={'large'}
                        onClick={() => {
                            authWorkbench(() => {
                                setModel(data, 'img2img')
                                Message.success(`图生图已添加 ${data.type} 「${data.title}」`)
                            })
                        }}
                    >
                        运行 图生图
                    </HoverButton>
                </Space>
            </ImageCard>
        )
    }


    return (
        <ContentWrapper>
            <Space
                style={{width: '100%'}}
                direction={'vertical'}
            >
                <div style={{width: '100%', height: '150px'}}>
                    <Banner
                        title={'模型'}
                        description={'SDWebUI使用开源的AI模型生成图片，你可以任意组合不同的模型和提示词，生成各种不同风格的图片。'}
                        extra={
                            <Space>
                                <Button shape={'round'} type={'primary'}>打开工作台</Button>
                            </Space>
                        }
                        align={'center'}
                    />
                </div>

                <ModelDataRender
                    dataElement={dataElement}
                    waterfallProps={{
                        scrollContainer: document.getElementById('left-main-wrapper')
                    }}
                />
            </Space>
        </ContentWrapper>
    )
}

export default Models