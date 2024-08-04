import React, {useState} from 'react';

import './styles/index.css'
import {Avatar, Button, Space, Typography} from "@arco-design/web-react";
import {ChatBubble1Icon, ControlPlatformIcon} from "tdesign-icons-react";
import {IconHeart, IconStar} from "@arco-design/web-react/icon";

const ImageCard = (props: any) => {
    const [maskMouseOver, setMaskMouseOver] = useState(false);

    const handleMaskMouseOver = () => {
        setMaskMouseOver(true)
    }

    const handleMaskMouseOut = () => {
        setMaskMouseOver(false)
    }

    return (
        <div className={'image-container'}>
            <img
                src='https://obj.glcn.top/wa-image/1718369431376.png?imageMogr2/auto-orient/thumbnail/1536x1536%3E/format/webp/blur/1x0/quality/100'
                className={'image-box'}
                alt={'img'}
            />

            <div
                className={'image-box-caption-bar'}
                onMouseOver={handleMaskMouseOver}
                onMouseOut={handleMaskMouseOut}
            >
                <Space
                    style={{width: '100%'}}
                    direction={'vertical'}
                >

                    {/*author*/}
                    <Space>
                        <Avatar
                            shape={'square'}
                            size={36}
                        >
                            WA
                        </Avatar>
                        <Space direction={'vertical'} size={1}>
                        <span className={'image-box-author-text'}>
                            author
                        </span>
                            <span className={'image-box-author-text'}>
                            2023-07-01
                        </span>
                        </Space>
                    </Space>

                    {/*title*/}
                    <Typography.Ellipsis
                        rows={1}
                        expandable={false}
                        style={{width: '100%'}}
                        className={'image-box-title-text'}
                    >
                        111111111111111111111111111111111111111111111111111111111111111111111111111111111111
                    </Typography.Ellipsis>

                    {/*options*/}
                    <Space>
                        <Button
                            icon={<ControlPlatformIcon/>}
                            size={'mini'}
                            shape={'round'}
                            style={{background: 'rgba(0,0,0,0.15)', color: 'white'}}
                        >
                            1
                        </Button>
                        <Button
                            icon={<IconStar/>}
                            size={'mini'}
                            shape={'round'}
                            style={{background: 'rgba(0,0,0,0.15)', color: 'white'}}
                        >
                            1
                        </Button>
                        <Button
                            icon={<IconHeart/>}
                            size={'mini'}
                            shape={'round'}
                            style={{background: 'rgba(0,0,0,0.15)', color: 'white'}}
                        >
                            1
                        </Button>
                        <Button
                            icon={<ChatBubble1Icon/>}
                            size={'mini'}
                            shape={'round'}
                            style={{background: 'rgba(0,0,0,0.15)', color: 'white'}}
                        >
                            1
                        </Button>
                    </Space>

                </Space>
            </div>

            {/*mask*/}
            <div
                className={'image-box-mask' + (maskMouseOver ? ' on-hover' : '')}
                onMouseOver={handleMaskMouseOver}
                onMouseOut={handleMaskMouseOut}
            >

            </div>
        </div>
    )
}

export default ImageCard