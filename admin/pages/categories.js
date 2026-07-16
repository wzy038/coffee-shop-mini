import { Layout, Table, Button, Modal, Form, Input, InputNumber, DollarCircle } from 'antd'
import { Plus, Edit, Delete } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import axios from 'axios'

const { Header, Content, Sider } = Layout

const API_BASE = process.env.API_BASE || 'http://localhost:5000/api'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [visible, setVisible] = useState(false)
  const [form] = Form.useForm()
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE}/categories`)
      setCategories(response.data.data || [])
    } catch (error) {
      console.error('获取分类列表失败')
    }
  }

  const handleAdd = () => {
    form.resetFields()
    setEditingId(null)
    setVisible(true)
  }

  const handleEdit = (record) => {
    form.setFieldsValue(record)
    setEditingId(record.id)
    setVisible(true)
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/categories/${id}`)
      fetchCategories()
    } catch (error) {
      console.error('删除失败')
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (editingId) {
        await axios.put(`${API_BASE}/categories/${editingId}`, values)
      } else {
        await axios.post(`${API_BASE}/categories`, values)
      }
      setVisible(false)
      fetchCategories()
    } catch (error) {
      console.error('提交失败')
    }
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '分类名称', dataIndex: 'name', key: 'name' },
    { title: '图标', dataIndex: 'icon', key: 'icon' },
    { title: '排序', dataIndex: 'sort_order', key: 'sort_order' },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <>
          <Button icon={<Edit />} onClick={() => handleEdit(record)} />
          <Button icon={<Delete />} onClick={() => handleDelete(record.id)} danger />
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
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ margin: 0 }}><DollarCircle /> 分类管理</h2>
              <Button icon={<Plus />} onClick={handleAdd} type="primary">新增分类</Button>
            </div>
            <Table columns={columns} dataSource={categories} rowKey="id" />
          </Content>
        </Layout>
      </Layout>

      <Modal
        title={editingId ? '编辑分类' : '新增分类'}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={handleSubmit}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="分类名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="icon" label="图标">
            <Input />
          </Form.Item>
          <Form.Item name="sort_order" label="排序">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  )
}