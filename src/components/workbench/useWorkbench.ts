import {useContext} from "react";
import {GlobalContext} from '@/context';

const useWorkbench = (): [boolean, (visible: boolean) => void] => {
    const {workbenchVisible, setWorkbenchVisible} = useContext(GlobalContext);

    const setWorkbenchShow
        = (visible: boolean) => {
        setWorkbenchVisible(visible);
    }

    return [workbenchVisible, setWorkbenchShow]
}

export default useWorkbench