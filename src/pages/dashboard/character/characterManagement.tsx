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

import { IconDelete, IconPlus, IconSync } from "@arco-design/web-react/icon";

const { Text } = Typography;

const CharacterManagement: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [pageNum, setPageNum] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [loading, setLoading] = useState(true);
    const [visibleAdd, setVisibleAdd] = useState<boolean>(false);
    const [visibleDelete, setVisibleDelete] = useState<boolean>(false);
    const [visibleUpdate, setVisibleUpdate] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [deleteForm] = Form.useForm();
    const [updateForm] = Form.useForm();
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

    const fetchData = async (pageNum: number, pageSize: number) => {
        setLoading(true);
        try {
            const response = await axios.get(`${Backend_URL}/role/getList`, {
                params: { pageNum, pageSize },
                withCredentials: true,
            });
            const { records, total } = response.data.data;
            setData(records.map((record, index) => ({
                ...record,
                ordinal: index + 1 + pageSize * (pageNum - 1)
            })));
            setTotal(total);
        } catch (error) {
            console.error('获取角色数据时出错:', error);
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

    const handlePageSizeChange = (pageSize: number) => {
        setPageSize(pageSize);
        setPageNum(1);
    };

    const onOk = () => {
        form.validate().then(async (res) => {
            setConfirmLoading(true);
            try {
                const { roleName, description } = res;
                await axios.post(`${Backend_URL}/role/add`, { roleName, description, isDelete: 0 }, { withCredentials: true });
                Message.success('添加成功！');
                setVisibleAdd(false);
                fetchData(pageNum, pageSize);
            } catch (error) {
                Message.error(error);
            } finally {
                setConfirmLoading(false);
            }
        });
    };

    const onDeleteOk = () => {
        deleteForm.validate().then(async (res) => {
            setConfirmLoading(true);
            try {
                const { deleteId } = res;
                await axios.delete(`${Backend_URL}/role/delete`, {
                    params: { deleteId },
                    withCredentials: true
                });
                Message.success('删除成功！');
                setVisibleDelete(false);
                fetchData(pageNum, pageSize);
            } catch (error) {
                Message.error(error);
            } finally {
                setConfirmLoading(false);
            }
        });
    };

    const onUpdateOk = () => {
        updateForm.validate().then(async (res) => {
            setConfirmLoading(true);
            try {
                const { id, roleName, description } = res;
                await axios.put(`${Backend_URL}/role/update`, { id, roleName, description }, { withCredentials: true });
                Message.success('更新成功！');
                setVisibleUpdate(false);
                fetchData(pageNum, pageSize);
            } catch (error) {
                Message.error(error);
            } finally {
                setConfirmLoading(false);
            }
        });
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: '角色名称', dataIndex: 'roleName', key: 'roleName' },
        { title: '角色描述', dataIndex: 'description', key: 'description' },
        {
            title: '创建时间', dataIndex: 'createTime', key: 'createTime',
            render: (text: string) => <Text>{new Date(text).toISOString().split('T')[0]}</Text>,
        },
    ];

    return (
        <div style={{ padding: '0 20px' }}>
            <Space style={{ marginBottom: '10px' }}>
                <Button icon={<IconPlus />} onClick={() => setVisibleAdd(true)} type='primary'>添加角色</Button>
                <Modal title='添加角色' visible={visibleAdd} onOk={onOk} confirmLoading={confirmLoading} onCancel={() => setVisibleAdd(false)}>
                    <Form form={form}>
                        <Form.Item label='角色名称' field='roleName' rules={[{ required: true, message: '请输入角色名称' }]}>
                            <Input placeholder='请输入角色名称' />
                        </Form.Item>
                        <Form.Item label='角色描述' field='description' rules={[{ required: true, message: '请输入角色描述' }]}>
                            <Input placeholder='请输入角色描述' />
                        </Form.Item>
                    </Form>
                </Modal>

                <Button type='primary' icon={<IconDelete />} onClick={() => setVisibleDelete(true)}>删除角色</Button>
                <Modal title='删除角色' visible={visibleDelete} onOk={onDeleteOk} confirmLoading={confirmLoading} onCancel={() => setVisibleDelete(false)}>
                    <Form form={deleteForm}>
                        <Form.Item label='角色ID' field='deleteId' rules={[{ required: true, message: '请输入角色ID' }]}>
                            <Input placeholder='请输入要删除的角色ID' />
                        </Form.Item>
                    </Form>
                </Modal>

                <Button type='primary' icon={<IconSync />} onClick={() => setVisibleUpdate(true)}>更新角色</Button>
                <Modal title='更新角色' visible={visibleUpdate} onOk={onUpdateOk} confirmLoading={confirmLoading} onCancel={() => setVisibleUpdate(false)}>
                    <Form form={updateForm}>
                        <Form.Item label='角色ID' field='id' rules={[{ required: true, message: '请输入角色ID' }]}>
                            <Input placeholder='请输入要更新角色的ID' />
                        </Form.Item>
                        <Form.Item label='角色名称' field='roleName' rules={[{ required: true, message: '请输入角色名称' }]}>
                            <Input placeholder='请输入角色名称' />
                        </Form.Item>
                        <Form.Item label='角色描述' field='description' rules={[{ required: true, message: '请输入角色描述' }]}>
                            <Input placeholder='请输入角色描述' />
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
                style={{ marginBottom: 20, marginRight: 40, minWidth: 550 }}
            />
        </div>
    );
};

export default CharacterManagement;
