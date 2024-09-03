import {IconMoreVertical} from "@arco-design/web-react/icon";
import {Collapse, Space} from "@arco-design/web-react";
import ImageUploadRender, {ImageInfo} from "@/components/workbench/components/imageUploadRender";

export interface IExtraImagePanelProps {
    name: string;
    params: any;
    setParams: (params: any) => void;
}


const ExtraImagePanel = (props: IExtraImagePanelProps) => {
    const params = props.params;
    const setParams = props.setParams;

    const handleImageChange = (image: ImageInfo) => {
        setParams({...params, image: image.base64})
    }

    return (
        <Collapse.Item
            header={<div style={{userSelect: 'none'}}>图片</div>}
            name={props.name}
            extra={<IconMoreVertical/>}
            style={{width: '100%', overflow: 'hidden'}}
        >
            <Space
                direction={'vertical'}
                style={{width: '100%', padding: '12px 0 16px 0', transform: 'translateX(-12px)'}}
                size={16}
            >
                <ImageUploadRender
                    useMask={false}
                    onImageChange={handleImageChange}
                />
            </Space>
        </Collapse.Item>
    )
}

export default ExtraImagePanel