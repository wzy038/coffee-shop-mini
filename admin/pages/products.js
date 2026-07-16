import { Layout, Table, Button, Modal, Form, Input, Select, InputNumber, message } from 'antd'
import { Plus, Edit, Delete, Coffee } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import axios from 'axios'

const { Header, Content, Sider } = Layout
const { Option } = Select

const API_BASE = process.env.API_BASE || 'http://localhost:5000/api'

export default function Products() {
  const [products, setProducts] = useState([])
  const [visible, setVisible] = useState(false)
  const [form] = Form.useForm()
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE}/products`)
      setProducts(response.data.data.products || [])
    } catch (error) {
      message.error('获取商品列表失败')
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
      await axios.delete(`${API_BASE}/products/${id}`)
      message.success('删除成功')
      fetchProducts()
    } catch (error) {
      message.error('删除失败')
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (editingId) {
        await axios.put(`${API_BASE}/products/${editingId}`, values)
        message.success('更新成功')
      } else {
        await axios.post(`${API_BASE}/products`, values)
        message.success('创建成功')
      }
      setVisible(false)
      fetchProducts()
    } catch (error) {
      message.error('提交失败')
    }
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '商品名称', dataIndex: 'name', key: 'name' },
    { title: '价格', dataIndex: 'price', key: 'price', render: (text) => `¥${text}` },
    { title: '原价', dataIndex: 'original_price', key: 'original_price', render: (text) => `¥${text}` },
    { title: '分类', dataIndex: 'category_name', key: 'category_name' },
    { title: '库存', dataIndex: 'stock', key: 'stock' },
    { title: '销量', dataIndex: 'sales', key: 'sales' },
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
              <h2 style={{ margin: 0 }}><Coffee /> 商品管理</h2>
              <Button icon={<Plus />} onClick={handleAdd} type="primary">新增商品</Button>
            </div>
            <Table columns={columns} dataSource={products} rowKey="id" />
          </Content>
        </Layout>
      </Layout>

      <Modal
        title={editingId ? '编辑商品' : '新增商品'}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={handleSubmit}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="商品名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="商品描述">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="price" label="价格" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="original_price" label="原价">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="category_id" label="分类">
            <Select>
              <Option value={1}>咖啡</Option>
              <Option value={2}>奶茶</Option>
              <Option value={3}>果汁</Option>
              <Option value={4}>甜点</Option>
            </Select>
          </Form.Item>
          <Form.Item name="stock" label="库存">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  )
}