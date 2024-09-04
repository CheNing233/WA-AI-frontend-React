import {Avatar, Button, Card, Grid, Link, List, Popover, Typography} from "@arco-design/web-react";
import aboutList from "@/constants/about";
import {IconLaunch, IconQrcode} from "@arco-design/web-react/icon";

const About = () => {
    const render = (actions: any[], item: any, index: number) => (
        <List.Item key={index} actions={actions}>
            <List.Item.Meta
                avatar={
                    <Avatar shape='square'>
                        {!item.imageText && <img src={item.image}
                                                 alt={''}
                        />}
                        {item.imageText && item.imageText}
                    </Avatar>
                }
                title={item.title}
                description={item.desc}
            />
        </List.Item>
    );

    return (
        <Grid.Row style={{
            width: '100%', margin: '108px 0'
        }}>
            <Grid.Col
                xs={{offset: 0, span: 24}}
                sm={{offset: 2, span: 20}}
                md={{offset: 4, span: 16}}
                lg={{offset: 6, span: 12}}
                xl={{offset: 6, span: 12}}
                xxl={{offset: 6, span: 12}}
            >
                <Card bordered={true}>
                    <div style={{height: '150px'}}>
                        <img
                            style={{
                                position: 'absolute', left: '0', right: '0', top: '0', height: '150px',
                                objectFit: 'cover', width: '100%'
                            }}
                            src={require('@/assets/about/about.png')}
                            alt={'about-banner'}
                        />
                    </div>

                    <Card title={'项目简介'}>
                        <Typography.Paragraph>
                            <Link type="primary" target="_blank" href="https://wa.xcning.top/portal/wawa"
                                  style={{padding: '0', margin: '0 4px 0 0'}}
                            >
                                WA
                            </Link>
                            是基于开源项目
                            <Link type="primary" target="_blank"
                                  href="https://github.com/AUTOMATIC1111/stable-diffusion-webui">
                                stable-diffusion-webui
                            </Link>
                            开发的一个在线AI生成平台，
                            由踏浪团队的某个菜鸡闲的没事干搞得，
                            目前正处于删档内测阶段，欢迎体验。
                        </Typography.Paragraph>

                        <List
                            style={{width: '100%'}}
                            split={false}
                            dataSource={aboutList.repository}
                            render={(item, index) => {
                                return render([
                                    <Link
                                        target="_blank"
                                        href={item.repoLink}
                                        icon={<IconLaunch/>}
                                    >
                                        Github
                                    </Link>,
                                ], item, index)
                            }}
                        />
                    </Card>


                    <Card title={'开发人员'}>
                        <List
                            style={{width: '100%'}}
                            split={false}
                            dataSource={aboutList.developers}
                            render={(item, index) => {
                                return render([
                                    <Link
                                        target="_blank"
                                        href={item.git}
                                        icon={<IconLaunch/>}
                                    >
                                        Github
                                    </Link>,
                                ], item, index)
                            }}
                        />
                    </Card>

                    <Card title={'联系我们'}>
                        <List
                            style={{width: '100%'}}
                            split={false}
                            dataSource={aboutList.contactGroups}
                            render={(item, index) => {
                                return render([
                                    <Popover
                                        content={
                                            <img
                                                src={item.qrLink}
                                                alt={''}
                                            />
                                        }
                                    >
                                        {item.qrVisible && <Button
                                            type={'text'}
                                            icon={<IconQrcode/>}/>
                                        }
                                    </Popover>,
                                    <Button
                                        type={'text'}
                                        icon={<IconLaunch/>}
                                        onClick={() => {
                                            if (item.jumpMethod) {
                                                item.jumpMethod()
                                            } else {
                                                window.open(item.jumpLink)
                                            }
                                        }}
                                    />
                                ], item, index)
                            }}
                        />
                    </Card>
                </Card>
            </Grid.Col>
        </Grid.Row>
    )
}

export default About