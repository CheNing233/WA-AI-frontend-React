import {Skeleton} from "@arco-design/web-react";
import {ForwardedRef, forwardRef, useState} from "react";

const ImageBlurWrapper = forwardRef((props: {
    src: string,
    alt?: string,
    style?: any,
}, ref: ForwardedRef<HTMLDivElement>) => {

    const [loaded, setLoaded] = useState(false);

    return (
        <div ref={ref} style={props.style}>
            {/*relative container*/}
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '4px'
                }}
            >
                {!loaded && <Skeleton
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                    animation={true}
                    image={{
                        style: {
                            width: '100vh',
                            height: '100vh'
                        },
                        shape: 'square',
                    }}
                />}
                {/*blur background*/}
                <img
                    src={props.src}
                    alt={`${props.alt}-background`}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                    onLoad={() => setLoaded(true)}
                />
                {/*blur*/}
                <div
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        right: 0,
                        bottom: 0,
                        backdropFilter: 'blur(30px)',
                        background: 'rgba(0,0,0,0)'
                    }}
                />
                {/*image content*/}
                <img
                    src={loaded ? props.src : ''}
                    alt={props.alt}
                    style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        maxWidth: '100%',
                        maxHeight: '100%'
                    }}
                />
            </div>
        </div>
    );
});

export default ImageBlurWrapper;