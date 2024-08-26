import {Button, Message, Space} from "@arco-design/web-react";
import {IconClose} from "@arco-design/web-react/icon";


/**
 * 显示加载消息，并在异步操作完成后关闭消息。
 *
 * 此函数用于在执行异步操作时显示一段加载中的消息，同时可提供取消操作的选项。
 * 完成后，根据操作的成功与否显示成功或错误消息。
 *
 * @param key 消息的唯一标识符，用于区分不同消息。
 * @param text 加载中消息的内容。
 * @param loadingFunc 异步操作函数，接受一个回调函数作为参数，当操作完成后调用该回调。
 * @param allowCancel 是否允许显示取消按钮，默认为false。如果为true，则显示取消按钮。
 * @param onCancel 取消按钮的点击事件处理函数。当用户点击取消按钮时执行。
 */
export const loadingMessage = (
    key: string,
    text: string,
    loadingFunc: (resolve: (success?: boolean | 'waiting', text?: string) => void) => void,
    allowCancel?: boolean,
    onCancel?: (messageClose: () => void) => void
) => {
    // 显示加载中的消息框，包含关闭逻辑和可选的取消按钮。
    const messageClose = Message.loading({
        id: key,
        content: (
            <Space size={12}>
                <span>{text}</span>
                {allowCancel &&
                    <Button icon={<IconClose/>} type={'dashed'} size={'mini'} status={'danger'}
                            onClick={() => {
                                onCancel(messageClose)
                            }}
                    >
                        取消
                    </Button>
                }
            </Space>
        ),
        duration: 0
    });

    // 定义一个处理异步操作完成的回调函数，根据操作结果展示成功或错误消息。
    const handleResolve = (success?: boolean | 'waiting', text?: string) => {
        if (!text) {
            messageClose()
            return;
        }
        if (success) {
            if (success === 'waiting')
                Message.loading({
                    id: key,
                    content: text,
                    duration: 0,
                })
            else
                Message.success({
                    id: key,
                    content: text,
                    duration: 3000,
                })
        } else {
            Message.error({
                id: key,
                content: text,
                duration: 3000,
            })
        }
    }

    // 执行异步操作函数，传入处理完成的回调函数。
    loadingFunc(handleResolve)
}
