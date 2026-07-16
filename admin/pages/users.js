import { Layout, Table, Users } from 'antd'
import { useState, useEffect } from 'react'
import axios from 'axios'

const { Header, Content, Sider } = Layout

const API_BASE = process.env.API_BASE || 'http://localhost:5000/api'

export default function Users() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE}/auth/users`)
      setUsers(response.data.data || [])
    } catch (error) {
      console.error('获取用户列表失败')
    }
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
    { title: '手机号', dataIndex: 'phone', key: 'phone' },
    { title: '注册时间', dataIndex: 'created_at', key: 'created_at' }
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
            <h2 style={{ margin: '0 0 20px' }}><Users /> 用户管理</h2>
            <Table columns={columns} dataSource={users} rowKey="id" />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}