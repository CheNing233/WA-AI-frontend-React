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
     * 处理滚动事件，确定当前可见的子元素
     *
     * 遍历所有子元素的引用，通过判断元素的top位置是否大于0来确定当前可见的子元素
     * 当找到第一个可见的子元素时，调用回调函数通知父组件，并更新当前可见子元素的状态
     */
    const handleScroll = () => {
        // 遍历当前所有子元素的引用
        for (const key in childRefs.current) {
            // 使用console.log输出元素的key和top位置
            // console.log(`${key} ${Math.round(childRefs.current[key].getBoundingClientRect().top)}`);

            // 如果元素的top位置大于0，则认为该元素是当前可见的
            if (childRefs.current[key].getBoundingClientRect().top > 0) {
                // 调用回调函数，通知父组件当前可见的子元素的key
                onVisibleItemChange && onVisibleItemChange(key);
                // 更新当前可见子元素的状态
                setCurrentVisibleItem(key);
                // 终止遍历，只处理第一个可见的子元素
                break;
            }
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
        if (ref && key) {
            childRefs.current[key] = ref;
        }
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
                        </>
                    );
                })
            }
        </div>
    );
};

export default ScrollTracker;