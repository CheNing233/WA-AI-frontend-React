import {useContext} from "react";
import {GlobalContext} from '@/context';

export type IWorkbench = {
    imageViewerShow: boolean,
    setImageViewerShow: (visible: boolean) => void
}

const useImagePreviewer = (): IWorkbench => {
    const {imageViewerVisible, setImageViewerVisible} = useContext(GlobalContext);

    const setImageViewerShow = (visible: boolean) => {
        setImageViewerVisible(visible);
    }

    return {imageViewerShow: imageViewerVisible, setImageViewerShow: setImageViewerShow}
}

export default useImagePreviewer