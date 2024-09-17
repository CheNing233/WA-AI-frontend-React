import React, {useState, useEffect, FC} from "react";

interface PaintCursorProps {
    brushSize: number;
    brushColor: string;
    offsetX?: number;
    offsetY?: number;
    disabled?: boolean;
    containerRef?: any;
    icon?: any;
}

const PaintCursor: FC<PaintCursorProps> = (
    {
        brushSize,
        brushColor,
        offsetX = 0,
        offsetY = 0,
        disabled = false,
        containerRef = null,
        icon = null,
    }
) => {
    const [mousePosition, setMousePosition] = useState({x: 0, y: 0});

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            if (disabled) return;
            if (!containerRef || !containerRef.current) {
                const targetX = event.clientX + (offsetX);
                const targetY = event.clientY + (offsetY);

                setMousePosition({
                    x: targetX,
                    y: targetY
                });
            } else if (containerRef.current) {
                const targetX = event.clientX - containerRef.current.getBoundingClientRect().x;
                const targetY = event.clientY - containerRef.current.getBoundingClientRect().y;

                setMousePosition({
                    x: targetX,
                    y: targetY
                });
            }
        };

        // 添加鼠标移动监听器
        window.addEventListener("mousemove", handleMouseMove);

        // 清除鼠标移动监听器
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [offsetX, offsetY, disabled]);

    return (
        <div
            style={{
                position: "absolute",
                display: disabled ? "none" : "flex",
                top: mousePosition.y - brushSize / 2, // 圆心与鼠标对齐
                left: mousePosition.x - brushSize / 2,
                width: brushSize,
                height: brushSize,
                borderRadius: "50%", // 让元素呈现为圆形
                backgroundColor: brushColor,
                pointerEvents: "none", // 确保这个元素不影响鼠标事件
                zIndex: 1, // 确保在最上层
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.5)"
            }}
        >
            {icon}
        </div>
    );
};

export default PaintCursor;
