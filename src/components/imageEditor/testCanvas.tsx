import React, {useRef, useEffect, useState, forwardRef, useImperativeHandle, FC} from 'react';
import PaintCursor from "@/components/paintCursor";
import {IconEraser} from "@arco-design/web-react/icon";

interface CanvasEditorProps {
    ref: any;
    width: number;
    height: number;
    brushSize?: number;
    brushColor?: string;
    eraserSize?: number;
    mode?: 'brush' | 'eraser' | 'move';  // 新的 mode prop
    imageBase64?: string;
}

const CanvasEditor: FC<CanvasEditorProps> = forwardRef((
    {
        width,
        height,
        brushSize = 5,
        brushColor = '#000000',
        eraserSize = 20,
        imageBase64, // 外部传入的 base64 图片
        mode = 'brush', // 默认绘画模式
    },
    ref
) => {
    const imageCanvasRef = useRef<HTMLCanvasElement>(null); // 用于绘制图片的canvas
    const drawCanvasRef = useRef<HTMLCanvasElement>(null); // 用于绘制路径的canvas
    const containerRef = useRef<HTMLDivElement>(null);

    const [isMouseDown, setIsMouseDown] = useState(false);
    const [paths, setPaths] = useState([]); // 存储用户绘制的路径
    const [redoPaths, setRedoPaths] = useState([]); // 用于redo的路径

    const [imageNaturalDimensions, setImageNaturalDimensions] = useState({width: 0, height: 0})
    const [imageFitScale, setImageFitScale] = useState(1); // 图片适应画布的缩放比例
    const [imageUserScale, setImageUserScale] = useState(1); // 用户缩放图片比例
    const [imageTranslateX, setImageTranslateX] = useState(0);
    const [imageTranslateY, setImageTranslateY] = useState(0);
    const imageInitialMoveXY = useRef({x: 0, y: 0})

    useEffect(() => {
        const imageCanvas = imageCanvasRef.current;
        const drawCanvas = drawCanvasRef.current;
        imageCanvas.width = width;
        imageCanvas.height = height;
        drawCanvas.width = width;
        drawCanvas.height = height;

        if (imageBase64) {
            renderImageCanvas();
        }
    }, [imageBase64, width, height]);

    useEffect(() => {
        // 仅当缩放或平移时，重新绘制图像和路径
        if (imageBase64) {
            renderImageCanvas();
        }
        renderPaths(
            paths,
            drawCanvasRef.current,
            imageUserScale, imageTranslateX, imageTranslateY
        );
    }, [imageUserScale, imageTranslateX, imageTranslateY]);

    useEffect(() => {
        renderPaths(
            paths,
            drawCanvasRef.current,
            imageUserScale, imageTranslateX, imageTranslateY
        );
    }, [paths]);

    // 绘制图片
    const renderImageCanvas = () => {
        const imageCanvas = imageCanvasRef.current;
        const imageCtx = imageCanvas.getContext('2d');
        const img = new Image();
        img.src = imageBase64;

        img.onload = () => {
            const {naturalWidth, naturalHeight} = img; // 获取图片的原始宽高
            setImageNaturalDimensions({width: naturalWidth, height: naturalHeight});

            // 计算缩放比例，使图片适应给定的画布尺寸
            const imageFitScaleFactor = Math.min(width / naturalWidth, height / naturalHeight);
            setImageFitScale(imageFitScaleFactor);

            // 设置图片的显示宽高
            const displayWidth = naturalWidth * imageFitScaleFactor * imageUserScale;
            const displayHeight = naturalHeight * imageFitScaleFactor * imageUserScale;

            // 清除画布并绘制缩放后的图片
            imageCtx.clearRect(0, 0, width, height);
            imageCtx.drawImage(img, imageTranslateX, imageTranslateY, displayWidth, displayHeight);
        };
    };

    // 只绘制新路径，增量更新
    const renderNewPaths = (
        path: any,
        context: CanvasRenderingContext2D,
        userScale = 1,
        translateX = 0,
        translateY = 0
    ) => {
        // const drawCanvas = drawCanvasRef.current;
        // const context = drawCanvas.getContext('2d');
        context.save();
        context.setTransform(userScale, 0, 0, userScale, translateX, translateY);

        context.beginPath();
        path.points.forEach(({x, y}, index: number) => {
            if (index < path.points.length - 1) {
                context.moveTo(x, y);
                const nextPoint = path.points[index + 1];
                context.lineTo(nextPoint.x, nextPoint.y);
            }
        });

        if (path.tool === 'eraser') {
            context.globalCompositeOperation = 'destination-out';
            context.lineWidth = path.eraserSize;
        } else {
            context.globalCompositeOperation = 'source-over';
            context.lineWidth = path.brushSize;
            context.strokeStyle = path.brushColor;
        }
        context.lineCap = 'round';
        context.stroke();
        context.closePath();

        context.restore();
    };

    // 绘制所有路径
    const renderPaths = (
        paths = [],
        canvas = drawCanvasRef.current,
        userScale = 1,
        translateX = 0,
        translateY = 0
    ) => {
        const context = canvas.getContext('2d');
        context.save();
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.setTransform(userScale, 0, 0, userScale, translateX, translateY);

        paths.forEach((path) => {
            renderNewPaths(
                path,
                context,
                userScale,
                translateX,
                translateY
            ); // 逐个绘制路径
        });

        context.restore();
    };

    const handleMouseDown = ({nativeEvent}) => {
        const {offsetX, offsetY} = nativeEvent;
        const adjustedX = (offsetX - imageTranslateX) / imageUserScale;
        const adjustedY = (offsetY - imageTranslateY) / imageUserScale;
        setIsMouseDown(true);

        const handleStartDrawing = (drawingTool: string) => {
            const newPath = {
                tool: drawingTool,
                points: [{x: adjustedX, y: adjustedY}, {x: adjustedX, y: adjustedY}],
                brushSize,
                brushColor,
                eraserSize,
            };
            setPaths((prevPaths) => [...prevPaths, newPath]);
            setRedoPaths([]); // 开始新绘制时清空redo路径
        };

        const handleStartMoving = () => {
            imageInitialMoveXY.current = {x: adjustedX, y: adjustedY};
        };

        switch (mode) {
            case 'brush':
                handleStartDrawing('brush');
                break;
            case 'eraser':
                handleStartDrawing('eraser');
                break;
            case 'move':
                handleStartMoving();
                break;
            default:
                break;
        }
    };

    const handleMouseUp = () => {
        setIsMouseDown(false);
    };

    const handleMouseMove = ({nativeEvent}) => {
        containerRef.current?.focus()
        if (!isMouseDown) return;
        const {offsetX, offsetY} = nativeEvent;
        const adjustedX = (offsetX - imageTranslateX) / imageUserScale;
        const adjustedY = (offsetY - imageTranslateY) / imageUserScale;

        const handleDrawing = () => {
            setPaths((prevPaths) => {
                const updatedPaths = [...prevPaths];
                const currentPath = updatedPaths[updatedPaths.length - 1];
                currentPath.points.push({x: adjustedX, y: adjustedY});
                return updatedPaths;
            });
            renderNewPaths(
                paths[paths.length - 1],
                drawCanvasRef.current.getContext('2d'),
                imageUserScale,
                imageTranslateX,
                imageTranslateY
            ); // 只绘制当前路径
        };

        const handleMoving = () => {
            const dx = adjustedX - imageInitialMoveXY.current.x;
            const dy = adjustedY - imageInitialMoveXY.current.y;
            setImageTranslateX((prevX) => prevX + dx);
            setImageTranslateY((prevY) => prevY + dy);
        }

        switch (mode) {
            case 'brush':
                handleDrawing();
                break;
            case 'eraser':
                handleDrawing();
                break;
            case 'move':
                handleMoving();
                break;
            default:
                break;
        }
    };

    // 处理鼠标滚轮事件
    const handleWheel = ({nativeEvent}) => {
        const {offsetX, offsetY, deltaY} = nativeEvent;
        const adjustedX = (offsetX - imageTranslateX) / imageUserScale;
        const adjustedY = (offsetY - imageTranslateY) / imageUserScale;

        // 滚轮向上表示放大，deltaY为负
        const newScaleFactor = imageUserScale - deltaY / 1000;
        const newX = adjustedX * (1 - newScaleFactor);
        const newY = adjustedY * (1 - newScaleFactor);

        setImageUserScale(newScaleFactor);
        setImageTranslateX(newX);
        setImageTranslateY(newY);
    };

    const undo = () => {
        if (paths.length > 0) {
            const newPaths = [...paths];
            const removedPath = newPaths.pop(); // 移除最后一条路径
            setRedoPaths((prevRedo) => [...prevRedo, removedPath]); // 将其加入redo栈
            setPaths(newPaths);
        }
        renderPaths(
            paths,
            drawCanvasRef.current,
            imageUserScale, imageTranslateX, imageTranslateY
        );
    };

    const redo = () => {
        if (redoPaths.length > 0) {
            const newRedoPaths = [...redoPaths];
            const restoredPath = newRedoPaths.pop(); // 从redo栈取出路径
            setPaths((prevPaths) => [...prevPaths, restoredPath]);
            setRedoPaths(newRedoPaths);
        }
        renderPaths(
            paths,
            drawCanvasRef.current,
            imageUserScale, imageTranslateX, imageTranslateY
        );
    };

    const clearCanvas = () => {
        setPaths([]);
        setRedoPaths([]);
        renderPaths(
            paths,
            drawCanvasRef.current,
            imageUserScale, imageTranslateX, imageTranslateY
        );
    };

    const resetTransform = () => {
        setImageUserScale(1);
        setImageTranslateX(0);
        setImageTranslateY(0);
    }

    // 导出完整图像（图片 + 路径）
    const exportImage = (onlyPaths = false) => {
        return new Promise((resolve) => {
            const naturalWidth = imageNaturalDimensions.width;
            const naturalHeight = imageNaturalDimensions.height;

            const exportImageCanvas = document.createElement('canvas');
            exportImageCanvas.width = naturalWidth;
            exportImageCanvas.height = naturalHeight;
            const exportImageCtx = exportImageCanvas.getContext('2d');

            const exportPathsCanvas = document.createElement('canvas');
            exportPathsCanvas.width = drawCanvasRef.current.width;
            exportPathsCanvas.height = drawCanvasRef.current.height;

            const img = new Image();
            img.src = imageBase64;

            img.onload = () => {
                // 绘制图片
                if (!onlyPaths) {
                    exportImageCtx.drawImage(img, 0, 0, naturalWidth, naturalHeight);
                }

                // 绘制路径
                renderPaths(
                    paths,
                    exportPathsCanvas,
                    1, 0, 0
                )
                exportImageCtx.drawImage(exportPathsCanvas, 0, 0, naturalWidth, naturalHeight)

                const dataUrl = exportImageCanvas.toDataURL('image/png');

                exportImageCanvas.remove();
                exportPathsCanvas.remove();

                resolve(dataUrl);
            };
        });
    };

    // 使用 useImperativeHandle 将 undo、redo、reset 暴露给父组件
    useImperativeHandle(ref, () => ({
        undo,
        redo,
        clearCanvas,
        resetTransform,
        exportImage,
    }));

    const computeCursorStyle = () => {
        switch (mode) {
            case 'brush':
                return 'crosshair'
            case 'eraser':
                return 'none'
            case 'move':
                return 'move'
            default:
                return 'default'
        }
    };

    return (
        <div
            ref={containerRef}
            style={{
                border: '1px solid black',
                width: width, height: height,
                position: 'relative',
                cursor: computeCursorStyle()
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseOut={handleMouseUp}
            onWheel={handleWheel}
        >
            <canvas ref={imageCanvasRef} style={{position: 'absolute', top: 0, left: 0}}/>
            <canvas ref={drawCanvasRef} style={{position: 'absolute', top: 0, left: 0}}/>
            {(mode === 'brush' || mode === 'eraser') && <PaintCursor
                brushSize={brushSize * imageUserScale}
                brushColor={mode === 'eraser' ? 'white' : brushColor}
                containerRef={containerRef}
                icon={mode === 'eraser' ? <IconEraser style={{fontSize: '2em', margin: '6px'}}/> : null}
            />}
        </div>
    );
});

export default CanvasEditor;
