import {useContext, useState} from 'react';
import {GlobalContext} from '@/context';


/**
 * 使用拖动选择功能的钩子函数
 * 此函数用于启用或禁用给定元素或全局的拖动选择功能
 * @param element 指定需要应用拖动选择功能的元素，默认为undefined，表示全局应用
 */
function useDragSelect(element?: HTMLElement) {
    // 状态变量，用于跟踪指定元素的拖动选择功能是否启用
    const [elementDragSelect, setElementDragSelect] = useState(false)
    // 从全局上下文获取拖动选择功能的状态和设置方法
    const {bodyDragSelect, setBodyDragSelect} = useContext(GlobalContext);

    /**
     * 设置元素的可拖动选择状态
     * @param enable 是否启用拖动选择功能
     */
    const setElDragSelect = (enable: boolean) => {
        // 如果指定了具体元素，则修改该元素的userSelect样式，并更新状态
        if (element) {
            element.style.userSelect = enable ? 'auto' : 'none';
            element.style.webkitUserSelect = enable ? 'auto' : 'none';
            setElementDragSelect(enable);
        } else {
            // 如果未指定元素，则修改全局body的userSelect样式，并通过上下文更新全局状态
            document.body.style.userSelect = enable ? 'auto' : 'none';
            document.body.style.webkitUserSelect = enable ? 'auto' : 'none';
            console.log("setBodyDragSelect hook", setBodyDragSelect)
            setBodyDragSelect(enable);
        }
    }

    // 根据是否指定了具体元素，返回不同的值
    if (element) {
        // 如果指定了元素，返回该元素的拖动选择状态和设置方法
        return {elementDragSelect, setElDragSelect}
    } else {
        // 如果未指定元素，返回全局的拖动选择状态和设置方法
        return {bodyDragSelect, setElDragSelect}
    }
}


export default useDragSelect;

