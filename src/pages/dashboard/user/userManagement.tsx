import React, { useState, useEffect } from 'react';
import {
    Table,
    Pagination,
    Typography,
    Spin,
    Space,
    Button,
    Modal,
    Form,
    Message,
    Input,
} from '@arco-design/web-react';
import axios from 'axios';
import Backend_URL from "@/pages/dashboard/config";

import CryptoJS from 'crypto-js';
import {IconDelete, IconPlus, IconSync} from "@arco-design/web-react/icon";

const { Text } = Typography;

const UserManagement: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [total, setTotal] = useState<number>(0);

    const [pageNum, setPageNum] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);

    const [loading, setLoading] = useState(true);

    const [visibleAdd, setVisibleAdd] = useState<boolean>(false);
    const [visibleDelete, setVisibleDelete] = useState<boolean>(false);
    const [visibleUpdate, setVisibleUpdate] = useState<boolean>(false);

    const [form] = Form.useForm();
    const [deleteForm] = Form.useForm(); // 用于删除用户的表单
    const [updateForm] = Form.useForm(); // 用于更新用户的表单

    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

    const fetchData = async (pageNum: number, pageSize: number) => {
        setLoading(true);
        try {
            const response = await axios.get(`${Backend_URL}/user/getList`, {
                params: { pageNum, pageSize },
                withCredentials: true,
            });
            const { records, total } = response.data.data;
            setData(
                records.map((record, index) => ({
                    ...record,
                    ordinal: index + 1 + pageSize * (pageNum - 1)
                }))
            );
            setTotal(total);
        } catch (error) {
            console.error('获取用户数据时出错:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(pageNum, pageSize);
    }, [pageNum, pageSize]);

    const handlePageChange = (page: number) => {
        setPageNum(page);
    };

    function handlePageSizeChange(pageSize: number) {
        setPageSize(pageSize);
        setPageNum(1);
    }

    // 添加用户的确认按钮
    function onOk() {
        form.validate().then(async (res) => {
            setConfirmLoading(true);
            try {
                const { userName, nickName, email, password } = res;
                const encryptedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);  // 对密码进行加密

                await axios.post('http://***REMOVED***:5050/user/add', {
                    id: 0,
                    userName,
                    nickName,
                    email,
                    role: 1,
                    isDelete: 0,
                    password: encryptedPassword
                }, { withCredentials: true });
                Message.success('添加成功！');
                setVisibleAdd(false);
                fetchData(pageNum, pageSize);
            } catch (error) {
                Message.error(error);
            } finally {
                setConfirmLoading(false);
            }
        });
    }

    // 删除用户的事件
    function onDeleteOk() {
        deleteForm.validate().then(async (res) => {
            setConfirmLoading(true);
            try {
                const { deleteId } = res;
                const response = await axios.delete(`http://***REMOVED***:5050/user/delete`, {
                    params: { deleteId: deleteId },
                    withCredentials: true
                });

                const { data, success, errorMsg } = response.data;

                if (success) {
                    Message.success(data);
                } else {
                    Message.error(errorMsg || '删除失败，请重试！');
                }

                setVisibleDelete(false);
                fetchData(pageNum, pageSize); // 刷新用户表
            } catch (error) {
                Message.error(error);
            } finally {
                setConfirmLoading(false);
            }
        });
    }

    // 更新用户的事件
    function onUpdateOk(){
        updateForm.validate().then(async (res) => {
            setConfirmLoading(true);
            try {
                const { id, userName, nickName, email, role, password } = res;
                const encryptedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);  // 对密码进行加密

                const response = await axios.put('http://***REMOVED***:5050/user/update',{
                    id,
                    userName,
                    nickName,
                    email,
                    role,
                    password: encryptedPassword,
                }, { withCredentials: true });

                const { data, success, errorMsg } = response.data;
                if (success) {
                    Message.success(data);
                } else {
                    Message.error(errorMsg || '删除失败，请重试！');
                }
                setVisibleUpdate(false);
                fetchData(pageNum, pageSize);
            } catch (error) {
                Message.error(error);
            } finally {
                setVisibleUpdate(false);
            }
        })
    }

    const formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: '用户名', dataIndex: 'userName', key: 'userName' },
        { title: '邮箱', dataIndex: 'email', key: 'email' },
        { title: '角色(1用户、2管理员)', dataIndex: 'role', key: 'role'},
        {
            title: '注册时间', dataIndex: 'createTime', key: 'createTime',
            render: (text: string) => {
                const date = new Date(text);
                return <Text>{date.toISOString().split('T')[0]}</Text>;
            },
        },
    ];

    return (
        <div style={{ padding: '0 20px' }}>
            <Space style={{ marginBottom: '10px' }}>
                {/*添加用户按钮*/}
                <Button
                    icon={<IconPlus />}
                    onClick={() => setVisibleAdd(true)}
                    type='primary'
                >
                    添加用户
                </Button>
                <Modal
                    title='添加用户'
                    visible={visibleAdd}
                    onOk={onOk}
                    confirmLoading={confirmLoading}
                    onCancel={() => setVisibleAdd(false)}
                >
                    <Form {...formItemLayout} form={form}>
                        <Form.Item
                            label='用户名'
                            field='userName'
                            rules={[{ required: true, message: '请输入用户名' }]}>
                            <Input placeholder='请输入用户名' />
                        </Form.Item>
                        <Form.Item
                            label='昵称'
                            field='nickName'
                            rules={[{ required: true, message: '请输入昵称' }]}>
                            <Input placeholder='请输入昵称' />
                        </Form.Item>
                        <Form.Item
                            label='邮箱'
                            field='email'
                            rules={[{ required: true, message: '请输入邮箱' }]}>
                            <Input placeholder='请输入邮箱' />
                        </Form.Item>
                        <Form.Item
                            label='密码'
                            field='password'
                            rules={[{ required: true, message: '请输入密码' }]}>
                            <Input type='password' placeholder='请输入密码' />
                        </Form.Item>
                    </Form>
                </Modal>

                {/*删除用户按钮*/}
                <Button
                    type='primary'
                    icon={<IconDelete />}
                    onClick={() => setVisibleDelete(true)}
                >
                    删除用户
                </Button>
                <Modal
                    title='删除用户'
                    visible={visibleDelete}
                    onOk={onDeleteOk}
                    confirmLoading={confirmLoading}
                    onCancel={() => setVisibleDelete(false)}
                >
                    <Form {...formItemLayout} form={deleteForm}>
                        <Form.Item
                            label='用户ID'
                            field='deleteId'
                            rules={[{ required: true, message: '请输入用户ID' }]}>
                            <Input placeholder='请输入要删除的用户ID' />
                        </Form.Item>
                    </Form>
                </Modal>

                {/*更新用户按钮*/}
                <Button
                    type='primary'
                    icon={<IconSync />}
                    onClick={() => setVisibleUpdate(true)}
                >
                    更新用户
                </Button>
                <Modal
                    title='更新用户'
                    visible={visibleUpdate}
                    onOk={onUpdateOk}
                    confirmLoading={confirmLoading}
                    onCancel={() => setVisibleUpdate(false)}
                >
                    <Form {...formItemLayout} form={updateForm}>
                        <Form.Item
                            label='用户ID'
                            field='id'
                            rules={[{ required: true, message: '请输入用户ID' }]}>
                            <Input placeholder='请输入要更新用户的ID' />
                        </Form.Item>
                        <Form.Item
                            label='用户名'
                            field='userName'
                            rules={[{ required: true, message: '请输入用户名' }]}>
                            <Input placeholder='请输入用户名' />
                        </Form.Item>
                        <Form.Item
                            label='昵称'
                            field='nickName'
                            rules={[{ required: true, message: '请输入昵称' }]}>
                            <Input placeholder='请输入昵称' />
                        </Form.Item>
                        <Form.Item
                            label='邮箱'
                            field='email'
                            rules={[{ required: true, message: '请输入邮箱' }]}>
                            <Input placeholder='请输入邮箱' />
                        </Form.Item>
                        <Form.Item
                            label='角色'
                            field='role'
                            rules={[{ required: true, message: '请输入角色(1或2)' }]}>
                            <Input placeholder='请输入角色(1或2)' />
                        </Form.Item>
                        <Form.Item
                            label='密码'
                            field='password'
                            rules={[{ required: true, message: '请输入密码' }]}>
                            <Input type='password' placeholder='请输入密码' />
                        </Form.Item>
                    </Form>
                </Modal>
            </Space>

            {loading ? (
                <Spin tip="加载中..." style={{ display: 'block', margin: '210px auto' }} />
            ) : (
                <Table
                    columns={columns}
                    data={data}
                    pagination={false}
                    rowKey="id"
                    style={{ marginBottom: '20px', minHeight: '420px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}
                    scroll={{ y: 420 }}
                />
            )}
            <Pagination
                current={pageNum}
                pageSize={pageSize}
                total={total}
                onPageSizeChange={handlePageSizeChange}
                onChange={handlePageChange}
                showTotal
                sizeCanChange
                style={{ marginBottom: 20, marginRight: 40, minWidth: 550 }}
            />
        </div>
    );
};

export default UserManagement;
