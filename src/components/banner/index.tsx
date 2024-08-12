/**
 * Banner 组件的属性类型定义。
 */
export type IBannerProps = {
    title: string; // 标题文本
    description: string; // 描述文本
    extra: any; // 额外的内容
    align?: 'left' | 'center'
};

const leftStyle = {
    top: '50%', // 顶部偏移量
    transform: 'translate(0, -55%)', // 变换位置
}

const centerStyle = {
    top: '50%',
    textAlign: 'center',
    transform: 'translate(0, -55%)',
}

/**
 * Banner 组件，用于展示标题、描述和额外内容。
 *
 * @param props - 组件的属性对象
 */
const Banner = (props: IBannerProps) => {

    const alignStyle = props.align === 'left' ? leftStyle : centerStyle;

    return (
        <div
            style={{
                position: 'relative', // 相对定位
                padding: '24px', // 内边距
                ...alignStyle
            }}
        >
            <h1 style={{color: 'var(--color-text-1)'}}>{props.title}</h1>
            <p style={{color: 'var(--color-text-1)'}}>{props.description}</p>
            <div style={{width: '100%', marginTop: '20px'}}>
                {props.extra}
            </div>
        </div>
    );
};

export default Banner;
