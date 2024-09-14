import {Modal} from "@arco-design/web-react";
import {FC} from "react";
import {ReactSketchCanvas} from "react-sketch-canvas";

interface ImageInfo {
    base64: string;
    width: number;
    height: number;
}

interface ImageEditorProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    imageInf: ImageInfo
}

const ImageEditor: FC<ImageEditorProps> = (props) => {
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
            {props.imageInf.base64 && props.imageInf.width > 0 && props.imageInf.height > 0 && (
                <ReactSketchCanvas
                    width={`${props.imageInf.width}px`}
                    height={`${props.imageInf.height}px`}
                    backgroundImage={props.imageInf.base64}
                    strokeWidth={5}
                    strokeColor="black"
                    eraserWidth={50}
                />
            )}
        </Modal>
    )
}

export default ImageEditor