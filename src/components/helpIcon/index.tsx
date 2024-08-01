import {Popover} from "@arco-design/web-react";
import {IconQuestionCircle} from "@arco-design/web-react/icon";

const HelpIcon = (props: { title?: string, text: string }) => {
    return (
        <Popover
            title={props.title}
            content={props.text}
        >
            <IconQuestionCircle/>
        </Popover>
    )
}

export default HelpIcon