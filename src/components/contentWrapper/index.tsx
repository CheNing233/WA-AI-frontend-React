/**
 * React 组件，用于包裹内容并根据布局大小调整内边距。
 * 通过阈值判断布局是否较小，并据此应用不同的内边距以适应空间变化。
 */

import {useEffect, useRef, useState} from "react";

/**
 * 定义组件属性接口
 */
interface Props {
    children: any;
}

/**
 * ContentWrapper 组件
 * @param props - 组件属性对象
 */
const ContentWrapper = (props: Props) => {
    // 布局尺寸阈值
    const smallLayoutThreshold = 768;
    // 用于引用容器元素的 Ref
    const containerRef = useRef(null);
    // 控制小布局状态的 state
    const [smallLayout, setSmallLayout] = useState(false);

    /**
     * 使用 useEffect Hook 来设置 ResizeObserver，当容器大小改变时更新 smallLayout 状态
     * @param current - 当前 DOM 节点的引用
     */
    useEffect(() => {
        const handleResize = () => {
            const width = containerRef.current?.getBoundingClientRect().width;
            setSmallLayout(width < smallLayoutThreshold);
        };

        const resizeObserver = new ResizeObserver(handleResize);

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            resizeObserver.disconnect();
        };
    }, [containerRef.current]);

    return (
        <div
            ref={containerRef}
            style={{
                padding: smallLayout ? '24px 24px 24px 24px' : '32px 48px 32px 48px',
            }}
        >
            {props.children}
        </div>
    );
};

export default ContentWrapper;
