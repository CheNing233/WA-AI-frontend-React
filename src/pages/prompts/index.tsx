import {Button, Space} from "@arco-design/web-react";
import ContentWrapper from "@/components/contentWrapper";
import Banner from "@/components/banner";
import PromptDataRender from "@/pages/prompts/dataRender";

const Prompts = () => {
    return (
        <ContentWrapper>
            <Space
                style={{width: '100%'}}
                direction={'vertical'}
                size={24}
            >
                <div style={{width: '100%', height: '150px'}}>
                    <Banner
                        title={'提示词'}
                        description={
                            '提示词、标签其实都是一个意思，即「Prompt」，正向的用来告诉AI要生成哪些东西用到的单词，比如输入「1girl」，AI就会生成一个妹纸；' +
                            '相对应的反向提示词就是告诉AI不要生成哪些东西，比如「bad hands」告诉AI不要生成坏的手；' +
                            '由于AI的随机性，并不一定可以输入什么就输出什么。'
                        }
                        align={'center'}
                        extra={
                            <Space>
                                <Button shape={'round'} type={'primary'}>复制到工作台</Button>
                            </Space>
                        }
                    />
                </div>

                <div style={{position: 'relative'}}>
                    <PromptDataRender/>
                </div>

            </Space>
        </ContentWrapper>
    )
}

export default Prompts