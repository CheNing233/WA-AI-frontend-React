import {IconMoreVertical} from "@arco-design/web-react/icon";
import {Button, Collapse, Space} from "@arco-design/web-react";
import ModelCard from "@/components/workbench/components/modelCard";
import {AddIcon} from "tdesign-icons-react";

const ModelPanel = () => {
    return (
        <Collapse.Item
            header={<div style={{userSelect: 'none'}}>模型</div>}
            name='ModelPanel'
            extra={<IconMoreVertical/>}
            style={{width: '100%', overflow: 'hidden'}}
        >
            <Space
                direction={'vertical'}
                style={{width: '100%', padding: '12px 0 16px 0', transform: 'translateX(-12px)'}}
                size={16}
            >
                <ModelCard
                    id={'1'}
                    name={'tmndMix_tmndMixSPRAINBOW'}
                    imageSrc={'https://obj.glcn.top/wa-image/1718249775686.png?imageMogr2/auto-orient/thumbnail/1536x1536%3E/format/webp/blur/1x0/quality/100'}
                    type={'基础模型'}
                    allowSwitch={true}
                    allowDelete={false}
                />
                <ModelCard
                    id={'1'}
                    name={'tmndMix_tmndMixSPRAINBOW'}
                    imageSrc={'https://obj.glcn.top/wa-image/1718249775686.png?imageMogr2/auto-orient/thumbnail/1536x1536%3E/format/webp/blur/1x0/quality/100'}
                    type={'VAE'}
                    allowSwitch={true}
                    allowDelete={false}
                />
                <ModelCard
                    id={'1'}
                    name={'tmndMix_tmndMixSPRAINBOW'}
                    imageSrc={'https://obj.glcn.top/wa-image/1718249775686.png?imageMogr2/auto-orient/thumbnail/1536x1536%3E/format/webp/blur/1x0/quality/100'}
                    type={'LORA'}
                    allowSwitch={false}
                    allowDelete={true}
                >
                    <Button>123</Button>
                </ModelCard>

                <Button
                    shape={'round'} type={'primary'} icon={<AddIcon/>}
                    long
                >
                    添加模型
                </Button>

            </Space>
        </Collapse.Item>
    )
}

export default ModelPanel