import React, { useState, useEffect } from 'react';
import { Table, Pagination, Typography } from '@arco-design/web-react';
import axios from 'axios';

const { Text } = Typography;

const UserManagement: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageSize = 10;

    const fetchData = async (pageNum: number) => {
        try {
            const token = '949b4a88-0e5d-4897-9fd4-375d1d89ecaf'; // Replace with your actual token
            const response = await axios.get('http://***REMOVED***:5050/user/getList', {
                params: {
                    pageNum,
                    pageSize,
                },
                headers: {
                    Authorization: `Bearer ${token}`, // 在请求头中添加 token
                },
                withCredentials: true,
            });
            const { records, total } = response.data.data;
            setData(records);
            setTotal(total);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '用户名',
            dataIndex: 'userName',
            key: 'userName',
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: '注册时间',
            dataIndex: 'createTime',
            key: 'createTime',
            render: (text: string) => {
                const date = new Date(text);
                return <Text>{date.toISOString().split('T')[0]}</Text>;
            },
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <Table
                columns={columns}
                data={data}
                pagination={false}
                rowKey="id"
                style={{ marginBottom: '20px' }}
            />
            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={total}
                onChange={handlePageChange}
                style={{ textAlign: 'right' }}
            />
        </div>
    );
};

export default UserManagement;
