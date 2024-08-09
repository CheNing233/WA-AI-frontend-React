/*
* TODO: 这玩意可以和 scrollTracker 合并为一个组件，高亮提示和滚动到元素由于分了两个组件，信息传递巨难受
* */
import {Divider, Grid, Menu} from "@arco-design/web-react";
import ScrollTracker from "@/components/scrollTracker/scrollTracker";
import {useState} from "react";

interface IMenuProps {
    key: string,
    title: string,
    icon: any
}

const SidebarWrapper = (props: {
    children: any,
    menu: IMenuProps[],
    onMenuClick?: (key: string) => void,
    [key: string]: any
}) => {

    const [visibleItem, setVisibleItem] = useState('')
    const [currentScrollTo, setCurrentScrollTo] = useState({scrollTo: null})

    const handleScrollVisibleItemChange = (key: string) => {
        setVisibleItem(key)
    }

    const handleContainerOK = (
        scrollToFunc: (key: string) => void
    ) => {
        setCurrentScrollTo({scrollTo: scrollToFunc})
    }

    const handleClickMenuItem = (key: string) => {
        props.onMenuClick?.(key)
        currentScrollTo.scrollTo(key)
    }

    return (
        <Grid.Row
            style={{flexWrap: 'nowrap'}}
        >
            <Grid.Col flex={'shrink'}>
                <Menu
                    collapse={true}
                    style={{height: 'calc(100vh - 208px)'}}
                    selectedKeys={[visibleItem]}
                    onClickMenuItem={handleClickMenuItem}
                >
                    {
                        props.menu.map((item) => (
                            <Menu.Item key={item.key} renderItemInTooltip={() => item.title}>
                                {item.icon}
                            </Menu.Item>
                        ))
                    }
                </Menu>
            </Grid.Col>
            <Divider style={{height: 'calc(100vh - 208px)', margin: '0'}} type={'vertical'}/>
            <Grid.Col flex={'1'}>
                <ScrollTracker
                    onContainerOK={handleContainerOK}
                    onVisibleItemChange={handleScrollVisibleItemChange}
                    style={{
                        width: '100%', height: 'calc(100vh - 208px)',
                        overflowY: 'scroll', overflowX: 'hidden'
                    }}
                >
                    {props.children}
                </ScrollTracker>
            </Grid.Col>
        </Grid.Row>
    )
}

export default SidebarWrapper