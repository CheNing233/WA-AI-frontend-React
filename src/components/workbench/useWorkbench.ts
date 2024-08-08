import {useContext} from "react";
import {GlobalContext} from '@/context';

export type IWorkbench = {
    workbenchShow: boolean,
    setWorkbenchShow: (visible: boolean) => void
}

const useWorkbench = (): IWorkbench => {
    const {workbenchVisible, setWorkbenchVisible} = useContext(GlobalContext);

    const setWorkbenchShow = (visible: boolean) => {
        setWorkbenchVisible(visible);
    }

    return {workbenchShow: workbenchVisible, setWorkbenchShow: setWorkbenchShow}
}

export default useWorkbench