import {Modal} from "@arco-design/web-react";
import {FC, ReactNode} from 'react'

interface IDialogFrameProps {
    id: string,
    visible: boolean,
    onClose: () => void,
    children: ReactNode,
}

const DialogFrame: FC<IDialogFrameProps> = (props) => {
    return (
        <Modal
            title={null}
            footer={null}
            visible={props.visible}
            unmountOnExit={true}
            closable={false}
            autoFocus={true}
            focusLock={true}
            onCancel={props.onClose}
            alignCenter={true}
            style={{
                position: 'relative',
                width: '90%',
                height: '90%',
                overflow: 'hidden',
            }}
        >
            <div
                id={props.id}
                style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: 'calc(90vw - 32px)',
                    height: 'calc(90vh - 32px)',
                    overflow: 'scroll',
                    padding: '16px'
                }}
            >
                {props.children}
            </div>
        </Modal>
    );
}


export default DialogFrame