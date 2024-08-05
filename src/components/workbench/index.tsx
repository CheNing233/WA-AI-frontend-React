import {Drawer} from "@arco-design/web-react";

import useWorkbench from './useWorkbench'

const Workbench = () => {
    const [workbenchShow, setWorkbenchShow] = useWorkbench();

    return (
        <Drawer
            title={null}
            footer={null}
            closable={false}
            width={'100vw'}
            visible={workbenchShow}
            onOk={() => {
                setWorkbenchShow(false)
            }}
            onCancel={() => {
                setWorkbenchShow(false)
            }}
        >
            <h1>Workbench</h1>
        </Drawer>
    )
}


export default Workbench