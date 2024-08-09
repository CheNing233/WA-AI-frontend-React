import useImagePreviewer from "@/components/imagePreviewer/useImagePreviewer";
import {Card, Grid, Image, Modal} from "@arco-design/web-react";
import {useRef} from "react";

const ImagePreviewer = () => {
    const {imageViewerShow, setImageViewerShow} = useImagePreviewer()

    const imageContainer = useRef(null)

    return (
        <Modal
            title={null}
            footer={null}
            visible={imageViewerShow}
            onOk={() => setImageViewerShow(false)}
            onCancel={() => setImageViewerShow(false)}
            // closable={false}
            autoFocus={true}
            focusLock={true}
            style={{
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
            }}
        >
            <Grid.Row
                style={{
                    position: 'absolute',
                    left: '0',
                    top: '0',
                    width: '100vw',
                    height: '100vh',
                }}
            >
                <Grid.Col flex={'1'}>
                    <div
                        ref={imageContainer}
                        style={{
                            position: 'relative',
                            width: '100%',
                            height: '100vh',
                            overflow: 'hidden',
                        }}
                    >
                        <Image.Preview
                            src='https://obj.glcn.top/wa-image/1718357537691.png?imageMogr2/auto-orient/thumbnail/1536x1536%3E/format/webp/blur/1x0/quality/100'
                            visible={true}
                            closable={false}
                            getPopupContainer={() => imageContainer.current}
                        />
                    </div>
                </Grid.Col>
                <Grid.Col flex={'shrink'}>
                    <Card
                        bordered={true}
                        style={{
                            width: '64px',
                            height: '300px',
                        }}
                    >

                    </Card>
                </Grid.Col>
            </Grid.Row>
        </Modal>
    )
}

export default ImagePreviewer