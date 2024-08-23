import React, {useState} from 'react';

import './styles/index.css'
import {Avatar, Button, Skeleton, Space, Typography} from "@arco-design/web-react";
import {getQiniuImageWithParams} from "@/utils/qiniuImage";

export interface IBottomBarProps {
    name: string,
    value: string,
    icon: React.ReactNode,
    onClick: () => void
}

export interface IImageCardProps {
    id: string | number,
    src: string,
    author: string,
    authorAvatar?: string,
    title: string,
    time?: string,
    fit?: boolean,
    bottomBar?: IBottomBarProps[],
    onImageClick?: (id: string | number) => void
}


const ImageCard = (props: IImageCardProps | any) => {
    const [maskMouseOver, setMaskMouseOver] = useState(false);

    const [onLoaded, setOnLoaded] = useState(false)

    const handleImageOnClick = () => {
        props.onImageClick && props.onImageClick(props.id)
    }

    const handleMaskMouseOver = () => {
        setMaskMouseOver(true)
    }

    const handleMaskMouseOut = () => {
        setMaskMouseOver(false)
    }

    const handleImageLoaded = () => {
        setOnLoaded(true)
    }

    return (
        <div className={'image-container'}>
            {/*image*/}
            <img
                src={
                    onLoaded
                        ? getQiniuImageWithParams({
                            imageUrl: props.src,
                            width: 768,
                            height: 768,
                            quality: 60,
                        })
                        : getQiniuImageWithParams({
                            imageUrl: props.src,
                            width: 128,
                            height: 128,
                            quality: 8,
                        })
                    // getQiniuImageWithParams({
                    //     imageUrl: props.src,
                    //     width: 768,
                    //     height: 768,
                    //     quality: 50
                    // })
                }
                className={'image-box' + (props.fit ? ' fit-cover' : '')}
                alt={'img'}
                onLoad={handleImageLoaded}
                style={{visibility: onLoaded ? 'visible' : 'hidden'}}
            />

            {/*loading*/}
            {!onLoaded && <Skeleton
                style={{width: '100%', height: '500px', position: 'absolute', zIndex: 66}}
                animation={true}
                image={{
                    style: {
                        width: '100vh',
                        height: '100vh'
                    },
                    shape: 'square',
                }}
                text={false}
            />}

            {/*caption*/}
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
                    <Space align={'center'}>
                        {props.authorAvatar && <Avatar
                            shape={'square'}
                            size={40}
                        >
                            <img src={props.authorAvatar} alt={'avatar'}/>
                        </Avatar>}
                        <Space direction={'vertical'} size={1}>
                            <span className={'image-box-author-text'}>
                                {props.author}
                            </span>
                            {props.time && <span className={'image-box-author-text'}>
                                {props.time}
                            </span>}
                        </Space>
                    </Space>

                    {/*title*/}
                    <Typography.Ellipsis
                        rows={1}
                        expandable={false}
                        style={{width: '100%'}}
                        className={'image-box-title-text'}
                    >
                        {props.title}
                    </Typography.Ellipsis>

                    {/*options*/}
                    {props.bottomBar && <Space>
                        {props.bottomBar.map((item: IBottomBarProps, index: number) => (
                            <Button
                                icon={item.icon}
                                key={item.name}
                                size={'mini'}
                                shape={'round'}
                                style={{background: 'rgba(0,0,0,0.15)', color: 'white'}}
                            >
                                {item.value}
                            </Button>
                        ))}
                    </Space>}
                </Space>
            </div>

            {/*mask*/}
            <div
                className={'image-box-mask' + (maskMouseOver ? ' on-hover' : '')}
                onMouseOver={handleMaskMouseOver}
                onMouseOut={handleMaskMouseOut}
                onClick={handleImageOnClick}
            >

            </div>
        </div>
    )
}

export default ImageCard