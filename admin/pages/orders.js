import { Layout, Table, Button, Tag, ShoppingCart } from 'antd'
import { useState, useEffect } from 'react'
import axios from 'axios'

const { Header, Content, Sider } = Layout

const API_BASE = process.env.API_BASE || 'http://localhost:5000/api'

const statusMap = {
  pending: { color: 'orange', text: '待支付' },
  paid: { color: 'blue', text: '已支付' },
  preparing: { color: 'cyan', text: '制作中' },
  completed: { color: 'green', text: '已完成' },
  cancelled: { color: 'red', text: '已取消' }
}

export default function Orders() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_BASE}/orders`)
      setOrders(response.data.data.orders || [])
    } catch (error) {
      console.error('获取订单列表失败')
    }
  }

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(`${API_BASE}/orders/${id}/status`, { status })
      fetchOrders()
    } catch (error) {
      console.error('更新订单状态失败')
    }
  }

  const columns = [
    { title: '订单号', dataIndex: 'order_no', key: 'order_no' },
    { title: '总金额', dataIndex: 'total_amount', key: 'total_amount', render: (text) => `¥${text}` },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        <Tag color={statusMap[text]?.color}>{statusMap[text]?.text}</Tag>
      )
    },
    { title: '商品数量', key: 'item_count', render: (_, record) => record.items?.length || 0 },
    { title: '创建时间', dataIndex: 'created_at', key: 'created_at' },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <>
          {record.status === 'pending' && (
            <Button onClick={() => handleUpdateStatus(record.id, 'paid')}>确认支付</Button>
          )}
          {record.status === 'paid' && (
            <Button onClick={() => handleUpdateStatus(record.id, 'preparing')}>开始制作</Button>
          )}
          {record.status === 'preparing' && (
            <Button onClick={() => handleUpdateStatus(record.id, 'completed')}>完成</Button>
          )}
        </>
      )
    }
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: 'linear-gradient(135deg, #8B4513 0%, #D2691E 100%)', padding: '0 20px', display: 'flex', alignItems: 'center' }}>
        <div style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold' }}>☕ 咖啡店管理后台</div>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: '#fff' }} />
        <Layout style={{ padding: '24px' }}>
          <Content style={{ background: '#fff', padding: '24px' }}>
            <h2 style={{ margin: '0 0 20px' }}><ShoppingCart /> 订单管理</h2>
            <Table columns={columns} dataSource={orders} rowKey="id" />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}