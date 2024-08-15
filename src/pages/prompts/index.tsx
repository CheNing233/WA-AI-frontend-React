import {Affix, Button, Card, Popover, Radio, Space} from "@arco-design/web-react";
import ContentWrapper from "@/components/contentWrapper";
import Banner from "@/components/banner";
import Searcher from "@/components/searcher";
import {useState} from "react";
import TagWaterfall from "@/components/tagWaterfall";
import {IconCopy, IconDelete, IconDown, IconLaunch} from "@arco-design/web-react/icon";

const Prompts = () => {

    const [data, setData] = useState([]);

    const getItems = async (nextGroupKey: number) => {
        const nextKey = (nextGroupKey - 1);
        let nextItems = {groupKey: nextGroupKey, key: nextKey, data: []};

        for (let i = 0; i < 100; ++i) {
            nextItems.data.push({label: `${nextKey}-${i}`})
        }

        setData([
            ...data,
            nextItems,
        ]);
    }

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
                <Card
                    bordered={true}
                >
                    <Searcher
                    />
                </Card>

                <Affix
                    offsetTop={60}
                    target={() => document.getElementById('left-main-wrapper')}
                >
                    <Card
                        bordered={true}
                        title={'购物车'}
                        extra={
                            <Space>
                                <Button.Group>
                                    <Button icon={<IconLaunch/>} size={'small'}
                                            shape={'round'} type={'primary'}
                                    >
                                        推到工作台</Button>
                                    <Popover
                                        unmountOnExit={false}
                                        position={'bottom'}
                                        content={
                                            <Radio.Group defaultValue={'merge'}>
                                                <Radio value={'merge'}>合并</Radio>
                                                <Radio value={'replace'}>替换</Radio>
                                            </Radio.Group>
                                        }
                                    >
                                        <Button icon={<IconDown/>} size={'small'}
                                                shape={'round'} type={'primary'}/>
                                    </Popover>
                                </Button.Group>
                                <Button icon={<IconCopy/>} size={'small'}
                                        shape={'round'}
                                >
                                    复制
                                </Button>
                                <Button icon={<IconDelete/>} size={'small'}
                                        shape={'round'} status={'danger'}
                                />
                            </Space>
                        }
                    >
                        <p>单击下面的提示词，将其加入到购物车中；单击 + 按钮即可增加权重，单击 - 按钮减少权重，单击 × 按钮删除；使用右上方的“推到工作台”和“复制”按钮获得提示词进行绘图。</p>
                    </Card>
                </Affix>
                <Card bordered={true} title={'提示词云'} style={{position: 'relative'}}>
                    <TagWaterfall
                        key={'tag-waterfall'}
                        cols={{
                            xs: 1,
                            sm: 2,
                            md: 3,
                            lg: 4,
                            xl: 4,
                            xxl: 4,
                            xxxl: 5,
                        }}
                        rowGap={8}
                        colGap={8}
                        data={data}
                        hasNoMore={false}
                        onAppend={getItems}
                        scrollContainer={
                            document.getElementById('left-main-wrapper')
                        }
                    />
                </Card>
            </Space>
        </ContentWrapper>
    )
}

export default Prompts