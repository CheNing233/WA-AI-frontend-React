import TagWaterfall from "@/components/tagWaterfall";
import {useState} from "react";
import api from "@/services/export";
import {Affix, Button, Card, Grid, Message, Popover, Radio, Space, Tag} from "@arco-design/web-react";
import Searcher from "@/components/searcher";
import {IconClose, IconCopy, IconDelete, IconDown, IconLaunch} from "@arco-design/web-react/icon";
import {ISdTag} from "@/services/modules/prompts";
import {removeDuplicateById, removeObjectById} from "@/utils/array";
import clipboard from "@/utils/clipboard";

export interface IPromptDataRenderProps {
    searchQuery?: string;
}

const generatePrompt = (tags: ISdTag[]) => {
    let prompts = '';

    tags.forEach((tag: ISdTag) => {
        const prompt = tag.weight && tag.weight !== 1 ? `(${tag.nameEn}:${tag.weight})` : tag.nameEn;
        prompts += `${prompt}, `;
    })

    return prompts
}


const PromptDataRender = (props: IPromptDataRenderProps) => {
    const [data, setData] = useState([]);
    const [dataFinished, setDataFinished] = useState(false);
    const [searcherValues, setSearcherValues] = useState([]);
    const [searchQuery, setSearchQuery] = useState('')
    const [waterfallKey, setWaterfallKey] = useState(0)

    const [selectedTag, setSelectedTag] = useState([]);

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
        setSelectedTag(
            removeDuplicateById([
                ...selectedTag,
                tag
            ])
        )
    }

    const handleCartTagDrag = (e: any, tag: ISdTag, index: number) => {
        const startX = e.clientX;
        const startValue = tag.weight || 1;

        const handleMouseMove = (event: MouseEvent) => {
            const diff = event.clientX - startX;
            const newTag: ISdTag[] = [
                ...selectedTag
            ];
            newTag[index].weight = Math.round((startValue + (diff / 2000)) * 100) / 100;
            setSelectedTag(newTag);
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }

    const handleCartTagDelete = (e: MouseEvent, tagId: number) => {
        e.stopPropagation();
        setSelectedTag(
            removeObjectById(tagId, selectedTag)
        )
    }

    const handleClearCart = () => {
        setSelectedTag([])
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
                                    onClick={() => {
                                        const prompt = generatePrompt(selectedTag);
                                        if (prompt !== '') {
                                            clipboard(prompt)
                                                .then(() => {
                                                    Message.success(`复制成功: ${prompt}`)
                                                })
                                                .catch(() => {
                                                    Message.error('复制失败')
                                                })
                                        } else {
                                            Message.warning('请先选择几个提示词进购物车喵~')
                                        }
                                    }}
                            >
                                复制
                            </Button>
                            <Button icon={<IconDelete/>} size={'small'}
                                    shape={'round'} status={'danger'}
                                    onClick={handleClearCart}
                            />
                        </Space>
                    }
                >
                    {selectedTag.length === 0
                        ? <p>单击下面的提示词，将其加入到购物车中；按住标签左右拖拽可调整权重，单击 ×
                            按钮删除；使用右上方的“推到工作台”和“复制”按钮获得提示词进行绘图。</p>
                        : <Grid.Row gutter={[20, 24]}>
                            {selectedTag.map((tag: ISdTag, index: number) => {
                                return (
                                    <Grid.Col key={index} flex={'shrink'}>
                                        <Button
                                            style={{
                                                height: 'auto', padding: '8px 16px', position: 'relative',
                                                cursor: 'ew-resize'
                                            }}
                                            type={'secondary'}
                                            onMouseDown={(e) => {
                                                handleCartTagDrag(e, tag, index)
                                            }}
                                        >
                                            {tag.weight && tag.weight !== 1 ? '(' : null}{tag.nameEn}
                                            {tag.weight && tag.weight !== 1
                                                ? <Tag color={'arcoblue'}
                                                       size={'small'}
                                                       style={{padding: '0 3px'}}>{`:${tag.weight}`}</Tag>
                                                : null}
                                            {tag.weight && tag.weight !== 1 ? ')' : null}
                                            <br/>
                                            {tag.nameCn}

                                            <div style={{position: 'absolute', top: '-12px', right: '-12px'}}>
                                                <Button shape={'circle'} status={'danger'} size={'mini'}
                                                        icon={<IconClose/>}
                                                        onClick={(e: MouseEvent) => {
                                                            handleCartTagDelete(e, tag.id)
                                                        }}
                                                />
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