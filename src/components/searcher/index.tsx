import {
    Affix,
    Button,
    Card,
    Checkbox,
    DatePicker,
    Divider,
    Grid,
    InputTag,
    Popover,
    Space,
    Tooltip
} from "@arco-design/web-react";
import {IconCheck, IconDown, IconFilter, IconSearch, IconStop} from "@arco-design/web-react/icon";
import {Children, cloneElement, useEffect, useState} from "react";
import {getListUsePrefix} from "@/components/searcher/utils/prefix";
import {convertStringToDate} from "@/components/searcher/utils/date";

export type IFilterOption = {
    label: string;
    value: string;
}

export type IFilterGroup = {
    groupName: string;
    options: IFilterOption[]
}

export type ISearcherProps = {
    children?: any;
    leftChildren?: any;
    rightChildren?: any;
    filters?: IFilterGroup[];
    allowDate?: boolean;
    popupPosition?: 'top' | 'bottom',
    stickyContainer?: () => any,
    values?: string[],
    onChange?: (values: string[]) => void,
    onSearch?: () => void,
}

export type ISearcherChildProps = {
    sendValueToSearch?: (value: string) => void;
}

const PREFIX = {
    FILTER: 'filter:',
    DATE: 'date:',
}

const Searcher = (props: ISearcherProps) => {
    const [autoSearch, setAutoSearch] = useState(true)
    const searchMethodText = autoSearch ? '并回车' : '并按下「搜索」'
    const [searchValues, setSearchValues] = useState([])

    const setValues = (values: string[]) => {
        if (props.onChange) {
            props.onChange(values)
        } else {
            setSearchValues(values)
        }
    }

    const getValues = () => {
        if (props.onChange) {
            return props.values
        } else {
            return searchValues
        }
    }

    const [filters, setFilters] = useState(() => {
        let newFilters = {}
        props.filters?.forEach(group => {
            newFilters[group.groupName] = []
        })
        return newFilters
    })
    const [allFilters] = useState(() => {
        let newFilters = {}
        props.filters?.forEach(group => {
            newFilters[group.groupName] = [
                ...group.options.map(option => option.value)
            ]
        })
        return newFilters
    })
    const [week, setWeek] = useState(null)


    /**
     * 将新的过滤器条件合并到搜索输入中
     * @param newFilters 新的过滤器条件，格式为{ groupName: string[] }
     */
    const updateFiltersToSearch = (newFilters: { [key: string]: string[] }) => {
        // 初始化合并后的过滤器数组
        let newFiltersMerged = []
        // 初始化用于搜索的新过滤器数组
        let newFilterToSearch = []

        // 遍历新的过滤器条件对象，合并所有过滤器条件
        for (let filtersGroupName in newFilters) {
            newFiltersMerged = [
                ...newFiltersMerged,
                ...newFilters[filtersGroupName]
            ]
        }

        // 将合并后的过滤器条件转换为搜索用的字符串格式
        newFiltersMerged.forEach((filter: string) => {
            newFilterToSearch.push(`${PREFIX.FILTER}${filter}`)
        })

        // 创建一个新的搜索输入数组，排除已有的过滤器条件
        let newInputToSearch = [...getValues()]
        newInputToSearch = getListUsePrefix(PREFIX.FILTER, newInputToSearch, true)

        // 更新搜索输入数组，包括新的过滤器条件和保留的非过滤器条件
        setValues([
            ...newFilterToSearch,
            ...newInputToSearch,
        ])
    }

    /**
     * 同步搜索框中的过滤器关键字与当前的过滤器设置
     *
     * 此函数通过解析搜索值中的过滤器关键字，并与现有的过滤器组进行匹配
     * 来更新过滤器状态，确保用户在搜索框中指定的过滤器能够生效
     */
    const syncFiltersWithSearch = () => {
        // 从搜索值中提取过滤器关键字，去掉前缀
        let newFiltersMerged =
            getListUsePrefix(PREFIX.FILTER, getValues())
                .map(filter => filter.replace(PREFIX.FILTER, ''))

        // 初始化一个新的过滤器对象，用于存储解析后的过滤器
        let newFilters = {}
        props.filters.forEach(group => {
            newFilters[group.groupName] = []
        })

        // 遍历每个解析后的过滤器关键字
        newFiltersMerged.forEach((filter: string) => {
            // 遍历所有的过滤器组，查找当前关键字属于哪个组
            for (let filtersGroupName in allFilters) {
                // 如果当前过滤器组包含这个关键字
                if (allFilters[filtersGroupName].includes(filter)) {
                    // 将关键字添加到对应组的过滤器列表中
                    newFilters[filtersGroupName].push(filter)
                }
            }
        })

        // 更新过滤器状态，将解析并整理后的过滤器应用到组件中
        setFilters(newFilters)
    }

    const updateWeekToSearch = (date: string) => {
        // 创建一个新的搜索输入数组，排除已有的过滤器条件
        let newInputToSearch = [...getValues()]
        newInputToSearch = getListUsePrefix(PREFIX.DATE, newInputToSearch, true)

        if (date) {
            setValues([
                `${PREFIX.DATE}${date}`,
                ...newInputToSearch,
            ])
        } else {
            setValues([
                ...newInputToSearch,
            ])
        }
    }

    const syncWeekWithSearch = () => {
        const dateString = getListUsePrefix(PREFIX.DATE, getValues())
        if (dateString.length === 0) {
            setWeek('')
        } else {
            const dayjsObj = convertStringToDate(dateString[0]!.replace(PREFIX.DATE, ''))
            setWeek(dayjsObj)
        }
    }

    useEffect(() => {
        if (props.filters)
            syncFiltersWithSearch()
        if (props.allowDate)
            syncWeekWithSearch()
        if (props.onSearch && autoSearch)
            props.onSearch()
    }, [searchValues, props.values])

    const handleChildComponentValueSearch = (value: string) => {
        let newSearchValues = [...getValues(), value]
        newSearchValues = Array.from(new Set(newSearchValues))
        setValues(newSearchValues)
    }

    const filterGroupItem = (group: IFilterGroup, index: number) => {
        return (
            <Space style={{width: '100%'}} direction={'vertical'} key={index}>
                <div>
                    <span style={{paddingLeft: '6px'}}>{group.groupName}</span>
                    <Divider style={{margin: '8px 0 0 0'}}/>
                </div>
                <Checkbox.Group
                    options={group.options}
                    style={{width: '100%', userSelect: 'none'}}
                    value={filters[group.groupName]}
                    onChange={(values) => {
                        const newFilters = {...filters}
                        newFilters[group.groupName] = values
                        setFilters(newFilters)// 更新过滤器
                        updateFiltersToSearch(newFilters)// 将过滤器压进搜索框
                    }}
                />
            </Space>
        )
    }


    const render = () => {
        return (
            <>
                <Grid.Row gutter={[12, 12]} align={'center'}>

                    {props.leftChildren && <Grid.Col flex={'shrink'}>
                        {props.leftChildren}
                    </Grid.Col>}

                    {props.filters && <Grid.Col flex={'shrink'}>
                        <Popover
                            position={'bl'}
                            unmountOnExit={false}
                            content={
                                <Space
                                    style={{width: '308px'}}
                                    direction={'vertical'}
                                >
                                    {props.filters.map(filterGroupItem)}
                                </Space>
                            }
                        >
                            <Button icon={<IconFilter/>}>
                                筛选<IconDown/>
                            </Button>
                        </Popover>
                    </Grid.Col>}

                    <Grid.Col flex={'1'}>
                        <InputTag
                            autoFocus={true}
                            placeholder={'请输入搜索内容' + searchMethodText}
                            allowClear={true}
                            animation={false}
                            value={getValues()}
                            onChange={(values) => {
                                setValues(values)
                            }}
                            addAfter={
                                <Tooltip content={'内容变化后立即自动搜索'}
                                         position={props.popupPosition || 'top'}
                                >
                                    <Checkbox
                                        checked={autoSearch}
                                        onChange={(checked) => {
                                            setAutoSearch(checked)
                                        }}
                                    >
                                        {({checked}) => {
                                            return (<Button
                                                icon={checked ? <IconCheck/> : <IconStop/>}
                                                style={{
                                                    position: 'relative',
                                                    userSelect: 'none',
                                                    margin: '0 -12px 0 -17px',
                                                    left: '0',
                                                    top: '0',
                                                }}
                                            >
                                                自动搜索
                                            </Button>)
                                        }}
                                    </Checkbox>
                                </Tooltip>
                            }
                        />
                    </Grid.Col>

                    {props.allowDate && <Grid.Col flex={'shrink'}>
                        <DatePicker.WeekPicker
                            allowClear={true}
                            style={{width: '118px'}}
                            placeholder={'第几周'}
                            value={week ? week : ''}
                            onChange={(dateString, date) => {
                                setWeek(date)
                                updateWeekToSearch(dateString)
                            }}
                        />
                    </Grid.Col>}

                    <Grid.Col flex={'shrink'}>
                        <Button
                            icon={<IconSearch/>}
                            type={'primary'}
                            onClick={props.onSearch}
                        >
                            搜索
                        </Button>
                    </Grid.Col>

                    {props.rightChildren && <Grid.Col flex={'shrink'}>
                        {props.rightChildren}
                    </Grid.Col>}

                </Grid.Row>

                <div style={{width: '100%'}}>
                    {Children.map(props.children, child => {
                        return cloneElement(child, {
                            sendValueToSearch: handleChildComponentValueSearch
                        });
                    })}
                </div>
            </>
        )
    }


    return (
        <>
            {
                props.stickyContainer ?
                    <Affix
                        style={{width: '100%'}}
                        offsetTop={0}
                        target={props.stickyContainer}
                    >
                        <Card
                            style={{
                                width: '100%'
                            }}
                            bodyStyle={{
                                padding: '8px 0 8px 0'
                            }}
                            bordered={false}
                        >
                            {render()}
                        </Card>
                    </Affix>
                    : render()
            }
        </>
    )
}


export default Searcher