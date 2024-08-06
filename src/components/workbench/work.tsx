import {Tabs} from "@arco-design/web-react";

const Work = () => {
    return (
        <Tabs
            style={{height: 'calc(100vh - 72px)', overflowY: 'scroll', overflowX: 'hidden'}}
        >
            <Tabs.TabPane title={'Work'}>
            </Tabs.TabPane>
        </Tabs>
    )
}

export default Work