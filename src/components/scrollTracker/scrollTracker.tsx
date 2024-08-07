import React, {useEffect, useRef, useState} from 'react';

const ScrollTracker = (props: {
    children: any,
    onVisibleItemChange?: (key: string) => void,
    onContainerOK?: (
        handleScrollTo: (scrollToItemKey: string) => void
    ) => void,
    [key: string]: any
}) => {
    const {onVisibleItemChange, onContainerOK, children, ...restProps} = props;

    const containerRef = useRef(null);
    const childRefs = useRef({});

    const [currentVisibleItem, setCurrentVisibleItem] = useState('');

    /**
     * 处理滚动事件，以确定当前可见的子元素
     * 通过比较子元素和容器的滚动位置，判断哪个子元素在容器中最为可见
     * 如果有子元素部分可见，则更新当前可见子元素的状态，并通知父组件
     */
    const handleScroll = () => {
        // 获取容器的滚动顶部和底部位置
        const containerScrollTop = containerRef.current.getBoundingClientRect().top
        const containerScrollBottom = containerRef.current.getBoundingClientRect().bottom
        // 初始化当前项的顶部位置为无穷大，当前项的key为空
        let currentItemTop = Infinity;
        let currentItemKey = '';
        // 初始化前一项的顶部位置为负无穷小，前一项的key为空
        let prevItemTop = -Infinity;
        let prevItemKey = '';
        // 遍历当前所有子元素的引用
        for (const key in childRefs.current) {
            // 计算子元素顶部距离容器顶部的距离
            const childTop = childRefs.current[key].getBoundingClientRect().top - containerScrollTop
            // 如果子元素的顶部位置在前一项和容器顶部之间，则更新前一项
            if (childTop > prevItemTop && childTop < 0) {
                prevItemTop = childTop
                prevItemKey = key
            }
            // 如果子元素的顶部位置在容器顶部和底部之间，则更新当前项
            if (childTop < currentItemTop && childTop >= 0) {
                currentItemTop = childTop - containerScrollTop
                currentItemKey = key
            }
        }
        // 如果当前项的顶部位置小于容器可视区域的一半，则认为当前项是可见的
        if (currentItemTop < (containerScrollBottom - containerScrollTop) / 2) {
            // 调用回调函数，通知父组件当前可见的子元素的key
            onVisibleItemChange && onVisibleItemChange(currentItemKey);
            // 更新当前可见子元素的状态
            setCurrentVisibleItem(currentItemKey);
        } else {
            // 调用回调函数，通知父组件当前可见的子元素的key
            onVisibleItemChange && onVisibleItemChange(prevItemKey);
            // 更新当前可见子元素的状态
            setCurrentVisibleItem(prevItemKey);
        }
    }

    const handleScrollTo = (scrollToItemKey: string) => {
        const containerScrollTop = containerRef.current.getBoundingClientRect().top
        let targetItemTop: number;

        for (const key in childRefs.current) {
            if (key === scrollToItemKey) {
                targetItemTop = childRefs.current[key].getBoundingClientRect().top
                break;
            }
        }

        containerRef.current.scrollTop = containerRef.current.scrollTop + (targetItemTop - containerScrollTop)
    }

    // 初始化 ref 列表
    useEffect(() => {
        childRefs.current = {};

        if (containerRef.current) {
            containerRef.current.addEventListener('scroll', handleScroll);
        }

        const ref = containerRef.current

        return () => {
            ref.removeEventListener('scroll', handleScroll);
        }
    }, []);

    useEffect(() => {
        // 初始化时，调用一次滚动事件处理函数
        handleScroll();
    }, [childRefs.current]);

    useEffect(() => {
        onContainerOK && onContainerOK(
            handleScrollTo
        )
    }, [containerRef.current])

    // 收集子组件的 ref 函数
    const collectChildRefs = (key: string) => (ref) => {
        if (ref && key && !childRefs.current[key]) {
            childRefs.current[key] = ref;
        }
        // console.log("collect ref")
    };


    return (
        <div ref={containerRef} {...restProps}>
            {
                // 遍历子元素，为每个子元素收集 ref
                React.Children.map(children, (child) => {

                    const invisibleDiv = (
                        <div
                            key={`${child.key}-invisible`}
                            ref={collectChildRefs(child.key)}
                            style={{height: 0, visibility: 'hidden'}}
                        />
                    );

                    // return React.cloneElement(child, {
                    //     ref: collectChildRefs(child.key)
                    // });

                    return (
                        <>
                            {invisibleDiv}
                            {React.cloneElement(child)}
                            {/*{invisibleDiv}*/}
                        </>
                    );
                })
            }
        </div>
    );
};

export default ScrollTracker;