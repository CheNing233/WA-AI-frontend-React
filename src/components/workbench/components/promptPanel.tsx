import {IconCode, IconDelete, IconMoreVertical} from "@arco-design/web-react/icon";
import {Button, Collapse, Grid, Space, Switch, Tag} from "@arco-design/web-react";

import {useContext} from "react";
import {GlobalContext} from '@/context';

import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-chrome';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-plain_text';

import './styles/promptPanel.css'

const PromptPanel = (props: { name: string }) => {

    const {theme} = useContext(GlobalContext);


    const editorOptions = {
        useWorker: true, // 禁用语法检查
        enableBasicAutocompletion: true,//启动代码补全功能
        enableSnippets: false,//启动代码段
        enableLiveAutocompletion: true,//启用实时自动完成
        showLineNumbers: false,//不显示行号
        showGutter: false,
        wrapBehavioursEnabled: true,//不启用自动换行,
        wrap: true,
        tabSize: 0,
        fontSize: 16,
        showInvisibles: false,
    }

    const handlePromptChange = (value: string) => {
        console.log("prompt", value)
    }

    return (
        <Collapse.Item
            header={<div style={{userSelect: 'none'}}>提示词</div>}
            name={props.name}
            extra={<IconMoreVertical/>}
            style={{width: '100%', overflow: 'hidden'}}
        >
            <Space
                direction={'vertical'}
                style={{width: '100%', padding: '12px 0 16px 0', transform: 'translateX(-12px)'}}
                size={16}
            >
                {/*prompt*/}
                <Grid.Row gutter={[8, 8]}>
                    <Grid.Col flex={'shrink'}>
                        <Tag size={'medium'} color={'arcoblue'}>正向提示词</Tag>
                    </Grid.Col>
                    <Grid.Col flex={'1'}/>
                    <Grid.Col flex={'shrink'}>
                        <Button
                            shape={'round'}
                            size={'small'}
                            icon={<IconCode/>}
                        >
                            输入提示
                            <Switch style={{position: 'relative', top: '-1.5px', left: '6px'}} size={'small'}/>
                        </Button>
                    </Grid.Col>
                    <Grid.Col flex={'shrink'}>
                        <Button status={'danger'} size={'small'} icon={<IconDelete/>}/>
                    </Grid.Col>
                </Grid.Row>
                <AceEditor
                    mode="plain_text"
                    theme={theme === 'light' ? 'chrome' : 'monokai'}
                    onChange={handlePromptChange}
                    name="PromptInput"
                    setOptions={editorOptions}
                    className="prompt-box"
                />
                {/*negative prompt*/}
                <Grid.Row gutter={[8, 8]}>
                    <Grid.Col flex={'shrink'}>
                        <Tag size={'medium'} color={'arcoblue'}>反向提示词</Tag>
                    </Grid.Col>
                    <Grid.Col flex={'1'}/>
                    <Grid.Col flex={'shrink'}>
                        <Button status={'danger'} size={'small'} icon={<IconDelete/>}/>
                    </Grid.Col>
                </Grid.Row>
                <AceEditor
                    mode="plain_text"
                    theme={theme === 'light' ? 'chrome' : 'monokai'}
                    onChange={handlePromptChange}
                    name="NegativePromptInput"
                    setOptions={editorOptions}
                    className="ngt-prompt-box"
                />
            </Space>
        </Collapse.Item>
    )
}

export default PromptPanel