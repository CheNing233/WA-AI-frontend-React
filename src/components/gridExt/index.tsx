import {Grid} from "@arco-design/web-react";
import {useEffect, useRef, useState} from "react";

/**
 * GridExt 组件根据屏幕尺寸或容器宽度动态调整栅格列数
 *
 * @param props 组件的props
 * @param props.cols 指定不同屏幕尺寸下的列数
 * @param props.refContainerWidth 是否引用容器宽度来调整列数
 * @param props.children 子组件或元素
 * @returns 栅格系统组件
 */
const GridExt = (props: {
    cols: { xxxl?: number, xxl?: number, xl?: number, lg?: number, md?: number, sm?: number, xs?: number },
    refContainerWidth?: boolean,
    onColsChange?: (cols: number) => void,
    children: any,
    [key: string]: any
}) => {

    // 从props中解构出cols, refContainerWidth，其余的作为restProps传递给Grid组件
    const {cols, refContainerWidth, ...restProps} = props;

    // 使用ref引用DOM元素，用于ResizeObserver观察
    const gridRef = useRef(null);
    // 初始化列数为12
    const [columns, setColumns] = useState(12);

    // 使用ResizeObserver观察容器尺寸变化
    useEffect(() => {
        // 创建ResizeObserver实例
        const observer = new ResizeObserver((entries: any) => {
            for (let entry of entries) {
                // 获取容器宽度
                const width = entry.contentRect.width;

                // 根据宽度设置列数
                let newColumns = props.cols.xs;
                if (width >= 576) newColumns = props.cols.sm;
                if (width >= 768) newColumns = props.cols.md;
                if (width >= 992) newColumns = props.cols.lg;
                if (width >= 1200) newColumns = props.cols.xl;
                if (width >= 1600) newColumns = props.cols.xxl;
                if (width >= 2000) newColumns = props.cols.xxxl;

                // 抛出事件
                if (columns !== newColumns) {
                    props.onColsChange && props.onColsChange(newColumns);
                }
                // 更新列数
                setColumns(newColumns);
            }
        });
        // 获取当前的gridRef
        const gridRefCurrent = gridRef.current;

        // 开始观察
        if (gridRef.current) {
            observer.observe(gridRef.current);
            // 初始化的同时抛出事件
            props.onColsChange && props.onColsChange(columns);
        }

        // 返回清理函数，用于停止观察
        return () => {
            if (gridRefCurrent) {
                observer.unobserve(gridRefCurrent);
            }
        };
    }, [props, refContainerWidth, columns]);

    // 渲染组件
    return (
        <Grid
            ref={gridRef}
            cols={refContainerWidth ? columns : cols}
            {...restProps}
        >
            {restProps.children}
        </Grid>
    )
}


export default GridExt