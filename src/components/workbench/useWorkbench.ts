import {useContext} from "react";
import {GlobalContext} from '@/context';
import {useUser} from "@/store/user";
import {useHistory} from "react-router-dom";
import authentication from "@/utils/authentication";
import {Message} from "@arco-design/web-react";

export type IWorkbench = {
    workbenchShow: boolean,
    setWorkbenchShow: (visible: boolean) => void,
    authWorkbench: (
        protectFunction: () => void,
        actions?: string[]
    ) => void
}

const useWorkbench = (): IWorkbench => {
    const {workbenchVisible, setWorkbenchVisible} = useContext(GlobalContext);
    const permission = useUser((state) => {
        return state.userPerms
    })
    const history = useHistory()

    const authWorkbench = (
        protectFunction: () => void,
        actions: string[] = ['txt2img', 'img2img', 'extra']
    ) => {
        const result = authentication({
            srcAndActList: [{resource: 'wa.workbench', actions: actions}],
            oneOfPerm: true,
        }, permission)

        if (result) {
            protectFunction()
        } else {
            Message.info('请先登录喵~')
            history.push('/login')
        }
    }

    const setWorkbenchShow = (visible: boolean) => {
        authWorkbench(() => {
            setWorkbenchVisible(visible)
        })
    }

    return {
        workbenchShow: workbenchVisible,
        setWorkbenchShow: setWorkbenchShow,
        authWorkbench: authWorkbench,
    }
}

export default useWorkbench