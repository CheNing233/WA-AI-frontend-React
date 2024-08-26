import {Button, ButtonProps} from "@arco-design/web-react";
import {useState} from "react";

export const HoverButton = (
    props: ButtonProps
) => {
    const {children, icon, ...extraProps} = props;
    const [hover, setHover] = useState(false);

    return (
        <Button
            shape={'round'}
            onMouseOver={() => setHover(true)}
            onMouseOut={() => setHover(false)}
            icon={props.icon}
            {...extraProps}
        >
            {hover ? props.children : null}
        </Button>
    )
}