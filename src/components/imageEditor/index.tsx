import {
    Button,
    ColorPicker,
    Divider,
    Grid, Message,
    Modal,
    Popconfirm,
    Popover,
    Slider,
    Space,
    Tag,
    Tooltip
} from "@arco-design/web-react";
import {FC, forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {IconClose, IconDelete, IconEraser, IconPen} from "@arco-design/web-react/icon";
import useEyeDropper from "@/utils/useEyeDropper";
import {DragMoveIcon, Fullscreen1Icon, HelpCircleIcon, RollbackIcon, RollfrontIcon, SipIcon} from "tdesign-icons-react";
import CanvasEditor from "@/components/imageEditor/testCanvas";
import {list} from "postcss";

interface ImageInfo {
    base64: string;
    width: number;
    height: number;
}

interface ImageEditorProps {
    ref: any;
    visible: boolean;
    setVisible: (visible: boolean) => void;
    imageInf: ImageInfo
}

interface PenPanelProps {
    ref?: any;
    brushSize: number;
    brushColor: string;
    brushHistory: string[];
    setHistory: (newColor: string) => void;
    setBrushSize: (size: number) => void;
    setBrushColor: (color: string) => void;
    noColorMode?: boolean;
}

const tooltips = {
    brush: <>键 <Tag color={'arcoblue'} bordered={true} size={'small'}>1</Tag> 画笔</>,
    eraser: <>键 <Tag color={'arcoblue'} bordered={true} size={'small'}>2</Tag> 橡皮擦</>,
    move: <>按住 <Tag color={'arcoblue'} bordered={true} size={'small'}>Space</Tag> 拖拽移动画布</>,
    scroll: <>滑动 <Tag color={'arcoblue'} bordered={true} size={'small'}>鼠标滚轮</Tag> 缩放画布</>,
    reset: <>键 <Tag color={'arcoblue'} bordered={true} size={'small'}>Q</Tag> 重置画布位置和缩放</>,
    undo: (
        <>
            键 <Tag color={'arcoblue'} bordered={true} size={'small'}>Ctrl</Tag>&nbsp;+&nbsp;
            <Tag color={'arcoblue'} bordered={true} size={'small'}>Z</Tag>
            &nbsp;撤销
        </>
    ),
    redo: (
        <>
            键 <Tag color={'arcoblue'} bordered={true} size={'small'}>Ctrl</Tag>&nbsp;+&nbsp;
            <Tag color={'arcoblue'} bordered={true} size={'small'}>Y</Tag>
            &nbsp;重做
        </>
    ),
};


const PenPanel: FC<PenPanelProps> = forwardRef((
    {
        brushSize,
        brushColor,
        brushHistory,
        setBrushSize,
        setBrushColor,
        setHistory,
        noColorMode = false
    }, ref
) => {
    const [{color}, open] = useEyeDropper();

    useEffect(() => {
        if (color && typeof color === 'string') {
            setBrushColor(color);
            setHistory(color);
        }
    }, [color]);

    const openSip = () => {
        open()
            .catch(() => {
            })
            .finally(() => {
            })
    }

    useImperativeHandle(ref, () => ({
        openSip
    }))

    const handleSlider = (value: number) => {
        setBrushSize(value);
    }

    const handleDragSize = (e: any) => {
        const startX = e.clientX;
        const startValue = brushSize;

        const handleMouseMove = (event: MouseEvent) => {
            const diff = event.clientX - startX;
            setBrushSize(Math.round(startValue + (diff / 20)));
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }

    return (
        <Space>
            {!noColorMode && <ColorPicker
                disabledAlpha={false}
                format={'rgb'}
                historyColors={brushHistory}
                showHistory={true}
                value={brushColor}
                onChange={setBrushColor}
                onVisibleChange={(visible) => {
                    if (!visible) {
                        setHistory(brushColor);
                    }
                }}
            />}

            {!noColorMode && <Popover content={
                <>键 <Tag color={'arcoblue'} bordered={true} size={'small'}>Alt</Tag> 屏幕取色</>
            }>
                <Button
                    type={'secondary'} icon={<SipIcon/>}
                    onClick={() => {
                        open().catch(() => { // 防止取消取色报错
                        });
                    }}
                />
            </Popover>}

            <Space size={20}>
                <Tooltip content={'左右拖拽可微调'}>
                    <Tag
                        size={"large"}
                        style={{
                            userSelect: 'none',
                            cursor: 'ew-resize'
                        }}
                        onMouseDown={handleDragSize}
                    >
                        画笔大小
                    </Tag>
                </Tooltip>
                <Slider
                    value={brushSize}
                    onChange={handleSlider}
                    max={200}
                    min={1}
                    step={1}
                    showInput={{
                        size: 'small',
                        suffix: 'px',
                        style: {width: '70px'}
                    }}
                    style={{minWidth: '200px'}}
                />
            </Space>
        </Space>
    )
})


const ImageEditor: FC<ImageEditorProps> = forwardRef((props, ref) => {
    const canvasRef = useRef(null);
    const penPanelRef = useRef(null);
    const [ratio, setRatio] = useState(1);
    const [penSize, setPenSize] = useState(32);
    const [penColor, setPenColor] = useState('rgb(0, 0, 0)');
    const [penColorHistory, setPenColorHistory] = useState([]);
    const [eraserSize, setEraserSize] = useState(32);
    const [currentTool, setCurrentTool] = useState('brush');
    const [prevTool, setPrevTool] = useState('brush');

    // imageInf 改变则重置画布
    useEffect(() => {
        canvasRef.current?.clearCanvas();
    }, [props.imageInf]);

    const getCurrentImageBase64 = () => {
        const b64 = canvasRef.current?.exportImage();
        if (b64) return b64;
        else return null
    }

    const resetEditor = () => {
        canvasRef.current?.clearCanvas();
    }

    // 导出函数
    useImperativeHandle(ref, () => ({
        getCurrentImageBase64,
        resetEditor
    }))

    const handleResize = () => {
        const container = window;

        if (props.imageInf.width !== 0 && props.imageInf.height !== 0
            && container !== null
        ) {
            if (container.innerWidth > container.innerHeight) {
                setRatio((container.innerHeight - 72) / props.imageInf.height)
            } else {
                setRatio((container.innerWidth) / props.imageInf.width)
            }
        }
    }

    useEffect(() => {
        handleResize();
    }, [props.imageInf, props.visible])


    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!props.visible) return;

            if (event.ctrlKey && event.key === 'z') {
                canvasRef.current?.undo();
            } else if (event.ctrlKey && event.key === 'y') {
                canvasRef.current?.redo();
            } else if (event.altKey) {
                event.preventDefault()
                event.stopPropagation()
                penPanelRef.current?.openSip();
            } else if (event.key === ' ') {
                if (currentTool === 'move') return;
                setPrevTool(currentTool);
                setCurrentTool('move')
            } else if (event.key === 'q') {
                canvasRef.current?.resetTransform()
            } else if (event.key === '1') {
                setCurrentTool('brush')
            } else if (event.key === '2') {
                setCurrentTool('eraser')
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            if (event.key === ' ') {
                setCurrentTool(prevTool)
            }
        }

        // 添加全局键盘事件监听器
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        // 在组件卸载时移除监听器
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [props.visible, currentTool, prevTool]);  // 空依赖数组，确保只在组件挂载和卸载时运行


    return (
        <Modal
            title={null}
            footer={null}
            visible={props.visible}
            onOk={() => props.setVisible(false)}
            onCancel={() => props.setVisible(false)}
            unmountOnExit={false}
            closable={false}
            autoFocus={true}
            focusLock={true}
            style={{
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
            }}
        >
            <Grid.Row
                style={{position: 'absolute', left: '12px', right: '12px', top: '12px'}}
                gutter={[12, 8]}
            >
                <Grid.Col flex={"shrink"}>
                    <Tag color={'arcoblue'} size={'large'}>
                        WA Editor &nbsp;
                        <Popover content={(
                            <>
                                {Object.keys(tooltips).map((key) => {
                                    return <>{tooltips[key]}<br/></>
                                })}
                                复杂需求请使用专业软件（如：Photoshop）完成后再导入
                            </>
                        )}>
                            <HelpCircleIcon/>
                        </Popover>
                    </Tag>
                </Grid.Col>

                <Grid.Col flex={1}>
                    <Divider style={{margin: '16px 0'}}/>
                </Grid.Col>

                <Grid.Col flex={"shrink"}>
                    <Popover content={tooltips.brush}>
                        <Button icon={<IconPen/>} type={currentTool === 'brush' ? 'primary' : 'default'}
                                onClick={() => setCurrentTool('brush')}
                        />
                    </Popover>
                </Grid.Col>

                <Grid.Col flex={"shrink"}>
                    <Popover content={tooltips.eraser}>
                        <Button icon={<IconEraser/>} type={currentTool === 'eraser' ? 'primary' : 'default'}
                                onClick={() => setCurrentTool('eraser')}
                        />
                    </Popover>
                </Grid.Col>

                <Grid.Col flex={"shrink"}>
                    <Popover content={
                        <>
                            {tooltips.move}
                            <br/>
                            {tooltips.scroll}
                        </>
                    }>
                        <Button icon={<DragMoveIcon/>} type={currentTool === 'move' ? 'primary' : 'default'}
                                onClick={() => setCurrentTool('move')}
                        />
                    </Popover>
                </Grid.Col>

                {(currentTool === 'brush' || currentTool === 'eraser') && <Grid.Col flex={"shrink"}>
                    <PenPanel
                        ref={penPanelRef}
                        brushSize={currentTool === 'brush' ? penSize : eraserSize}
                        brushColor={penColor}
                        brushHistory={penColorHistory}
                        setBrushSize={currentTool === 'brush' ? setPenSize : setEraserSize}
                        setBrushColor={currentTool === 'brush' ? setPenColor : undefined}
                        setHistory={(color: string) => {
                            // 定义一个函数，将颜色值转换为 rgba 格式
                            // const toRgba = (color: string) => {
                            //     // 如果颜色已经是 rgba 格式，直接返回
                            //     if (color.startsWith('rgba')) return color;
                            //
                            //     // 匹配 rgb 格式，并转换为 rgba（默认 alpha = 1）
                            //     const rgbToRgba = (rgb: string) => {
                            //         const result = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
                            //         if (result) {
                            //             // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            //             const [_, r, g, b] = result;
                            //             return `rgba(${r}, ${g}, ${b}, 1)`; // 默认为 alpha = 1
                            //         }
                            //         return rgb; // 如果不是 rgb 格式，直接返回原值
                            //     };
                            //
                            //     // 使用一个简单的正则来匹配 16 进制颜色并转换为 rgba
                            //     const hexToRgba = (hex: string) => {
                            //         let r = 0, g = 0, b = 0, a = 1; // 默认 alpha 为 1
                            //
                            //         // 处理 6 位和 8 位的 16 进制颜色
                            //         if (hex.length === 7 || hex.length === 9) {
                            //             r = parseInt(hex.slice(1, 3), 16);
                            //             g = parseInt(hex.slice(3, 5), 16);
                            //             b = parseInt(hex.slice(5, 7), 16);
                            //         }
                            //
                            //         // 处理带 alpha 通道的 16 进制颜色
                            //         if (hex.length === 9) {
                            //             a = parseInt(hex.slice(7, 9), 16) / 255;
                            //         }
                            //
                            //         return `rgba(${r}, ${g}, ${b}, ${a})`;
                            //     };
                            //
                            //     // 如果是 16 进制颜色，则转换为 rgba
                            //     if (color.startsWith('#')) return hexToRgba(color);
                            //
                            //     // 如果是 rgb 格式颜色，则转换为 rgba
                            //     if (color.startsWith('rgb(')) return rgbToRgba(color);
                            //
                            //     // 其他格式暂时不处理
                            //     return color;
                            // };

                            const toHexWithoutAlpha = (color: string) => {
                                // 辅助函数：将数值转换为两位 16 进制表示
                                const componentToHex = (c: number) => {
                                    const hex = c.toString(16);
                                    return hex.length === 1 ? '0' + hex : hex; // 确保两位数
                                };

                                // 处理 rgb 或 rgba 颜色
                                const rgbaToHex = (rgba: string) => {
                                    const result = rgba.match(/(\d+),\s*(\d+),\s*(\d+)/); // 匹配 r, g, b 三个值
                                    if (result) {
                                        const [_, r, g, b] = result;
                                        return `#${componentToHex(parseInt(r))}${componentToHex(parseInt(g))}${componentToHex(parseInt(b))}`;
                                    }
                                    return null; // 不是有效的 rgb/rgba 格式时返回 null
                                };

                                // 处理带 alpha 通道的 16 进制颜色
                                const hexToHexWithoutAlpha = (hex: string) => {
                                    if (hex.length === 9) {
                                        // 8 位的 16 进制 hex，去掉最后两位的 alpha 通道
                                        return hex.slice(0, 7);
                                    } else if (hex.length === 7) {
                                        // 已经是 6 位的 16 进制 hex，直接返回
                                        return hex;
                                    }
                                    return null;
                                };

                                // 如果是 rgba 或 rgb 颜色，转换为 16 进制 hex
                                if (color.startsWith('rgb')) {
                                    return rgbaToHex(color);
                                }

                                // 如果是 16 进制颜色，去除 alpha 通道
                                if (color.startsWith('#')) {
                                    return hexToHexWithoutAlpha(color);
                                }

                                return null; // 如果都不匹配，返回 null
                            };


                            // 将颜色转换为 rgba 格式
                            let newHistory: string[] = [...penColorHistory.slice(-10), toHexWithoutAlpha(color)];

                            // 去重
                            newHistory = [...new Set(newHistory)];

                            // 更新颜色历史和当前颜色
                            setPenColorHistory(newHistory);
                        }}
                        noColorMode={currentTool !== 'brush'}
                    />
                </Grid.Col>}

                <Grid.Col flex={"shrink"}>
                    <Popover content={tooltips.reset}>
                        <Button icon={<Fullscreen1Icon/>}
                                onClick={() => canvasRef.current?.resetTransform()}
                        />
                    </Popover>
                </Grid.Col>

                <Grid.Col flex={"shrink"}>
                    <Popover content={tooltips.undo}>
                        <Button icon={<RollbackIcon/>}
                                onClick={() => canvasRef.current?.undo()}
                        />
                    </Popover>
                </Grid.Col>

                <Grid.Col flex={"shrink"}>
                    <Popover content={tooltips.redo}>
                        <Button icon={<RollfrontIcon/>}
                                onClick={() => canvasRef.current?.redo()}
                        />
                    </Popover>
                </Grid.Col>

                <Grid.Col flex={"shrink"}>
                    <Popconfirm
                        focusLock
                        title='删除所有线条'
                        content='确认要删除所有线条吗？该操作无法撤销喵！'
                        onOk={() => {
                            canvasRef.current?.clearCanvas()
                            Message.success({
                                content: '已清除所有线条',
                            });
                        }}
                    >
                        <Button icon={<IconDelete/>} status={'danger'}/>
                    </Popconfirm>
                </Grid.Col>

                <Grid.Col flex={1}>
                    <Divider style={{margin: '16px 0'}}/>
                </Grid.Col>

                <Grid.Col flex={"shrink"}>
                    <Button shape={'square'} icon={<IconClose/>} type={'primary'}
                            onClick={() => props.setVisible(false)}
                    />
                </Grid.Col>
            </Grid.Row>

            <div
                style={{
                    position: 'absolute', display: 'flex', left: '12px', top: '56px', right: '12px',
                    overflow: 'hidden', height: 'calc(100vh - 70px)',
                    justifyContent: 'center', alignContent: 'center'
                }}
            >
                {props.imageInf.base64 && props.imageInf.width > 0 && props.imageInf.height > 0 && (
                    <CanvasEditor
                        ref={canvasRef}
                        width={props.imageInf.width * ratio}
                        height={props.imageInf.height * ratio}
                        brushSize={penSize}
                        brushColor={penColor}
                        eraserSize={eraserSize}
                        imageBase64={props.imageInf.base64}
                        mode={currentTool as 'brush' | 'eraser' | 'move'}
                    />
                )}
            </div>
        </Modal>
    )
})

export default ImageEditor