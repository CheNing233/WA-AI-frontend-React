import TagWaterfall from "@/components/tagWaterfall";
import {useState} from "react";
import api from "@/services/export";
import {Affix, Button, Card, Grid, Popover, Radio, Space} from "@arco-design/web-react";
import Searcher from "@/components/searcher";
import {IconClose, IconCopy, IconDelete, IconDown, IconLaunch} from "@arco-design/web-react/icon";
import {ISdTag} from "@/services/modules/prompts";

export interface IPromptDataRenderProps {
    searchQuery?: string;
}

const PromptDataRender = (props: IPromptDataRenderProps) => {
    const [data, setData] = useState([]);
    const [dataFinished, setDataFinished] = useState(false);
    const [searcherValues, setSearcherValues] = useState([]);
    const [searchQuery, setSearchQuery] = useState('')
    const [waterfallKey, setWaterfallKey] = useState(0)

    const [selectedTag, setSelectedTag] = useState([

        {
            "id": 1,
            "nameEn": "1girl",
            "nameCn": "1个女孩",
            "numberRefe": 3663973
        },
        {
            "id": 2,
            "nameEn": "solo",
            "nameCn": "独奏",
            "numberRefe": 3053641
        },
    ]);

    const getItems = (nextGroupKey: number, resolve: () => void) => {
        const nextPage = nextGroupKey;
        let pageData = {groupKey: nextGroupKey, key: nextPage, data: []};

        api.prompts.getSdTags(searchQuery || '', nextPage, 100)
            .then(res => {
                const list = res.data.data.imageTags;

                if (list.length > 0) {
                    pageData.data = list

                    setData([
                        ...data,
                        pageData,
                    ]);
                } else {
                    setDataFinished(true);
                }
            })
            .finally(() => {
                resolve()
            })
    }

    const handleSearch = () => {
        setSearchQuery(searcherValues.join(' '))
        setWaterfallKey((waterfallKey + 1) % 8)
        setDataFinished(false)
        setData([])
    }

    const handleShopTagClick = (tag: ISdTag) => {
        setSelectedTag([
            ...selectedTag,
            tag
        ])
    }

    const handleCartTagClick = (e: MouseEvent, tag: ISdTag) => {
        e.preventDefault()
        e.stopPropagation()
        // document.oncontextmenu = (e) => {
        //     console.log(e)
        //     return false
        // }
        console.log('cancel', e.cancelable)
        if (e.button === 0) {
            console.log('Left mouse button clicked');
        } else if (e.button === 2) {
            console.log('Right mouse button clicked');
        }
    }

    return (
        <Space direction={'vertical'} style={{width: '100%'}} size={36}>
            <Affix
                offsetTop={60}
                target={() => document.getElementById('left-main-wrapper')}
            >
                <Card
                    bordered={true}
                    title={
                        <div style={{marginRight: '16px'}}>
                            <Searcher
                                size={'small'}
                                values={searcherValues}
                                onChange={setSearcherValues}
                                onSearch={handleSearch}
                            />
                        </div>
                    }
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
                    {selectedTag.length === 0
                        ? <p>单击下面的提示词，将其加入到购物车中；单击 + 按钮即可增加权重，单击 - 按钮减少权重，单击 ×
                            按钮删除；使用右上方的“推到工作台”和“复制”按钮获得提示词进行绘图。</p>
                        : <Grid.Row gutter={[20, 24]}>
                            {selectedTag.map((tag: ISdTag, index: number) => {
                                return (
                                    <Grid.Col key={index} flex={'shrink'}>
                                        <Button
                                            style={{height: 'auto', padding: '8px 16px', position: 'relative'}}
                                            type={'dashed'}
                                            onClick={(e: MouseEvent) => {
                                                handleCartTagClick(e, tag)
                                            }}
                                        >
                                            {tag.nameEn} <br/>
                                            {tag.nameCn}

                                            <div style={{position: 'absolute', top: '-12px', right: '-12px'}}>
                                                <Button shape={'circle'} status={'danger'} size={'mini'}
                                                        icon={<IconClose/>}
                                                />
                                            </div>

                                            <div style={{position: 'absolute', bottom: '-12px', right: '-12px'}}>
                                                <Button shape={'round'} size={'mini'}
                                                        status={'success'}
                                                >
                                                    {tag.weight || '1.0'}
                                                </Button>
                                            </div>
                                        </Button>
                                    </Grid.Col>
                                )
                            })}
                        </Grid.Row>
                    }
                </Card>
            </Affix>

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
                rowGap={16}
                colGap={8}
                data={data}
                hasNoMore={dataFinished}
                onAppend={getItems}
                onTagClick={handleShopTagClick}
                scrollContainer={
                    document.getElementById('left-main-wrapper')
                }
            />
        </Space>
    )
}

export default PromptDataRender