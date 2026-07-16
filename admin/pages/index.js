import { Layout, Menu, Card, Row, Col, Statistic } from 'antd'
import { Coffee, ShoppingCart, Users, DollarCircle } from '@ant-design/icons'
import Link from 'next/link'

const { Header, Content, Sider } = Layout

export default function Home() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: 'linear-gradient(135deg, #8B4513 0%, #D2691E 100%)', padding: '0 20px', display: 'flex', alignItems: 'center' }}>
        <div style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold' }}>☕ 咖啡店管理后台</div>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.Item key="1">
              <Coffee />
              <Link href="/products">商品管理</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <ShoppingCart />
              <Link href="/orders">订单管理</Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Users />
              <Link href="/users">用户管理</Link>
            </Menu.Item>
            <Menu.Item key="4">
              <DollarCircle />
              <Link href="/categories">分类管理</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content style={{ background: '#f5f5f5', padding: '24px', minHeight: '280px' }}>
            <Row gutter={16}>
              <Col span={6}>
                <Card>
                  <Statistic title="商品总数" value={25} suffix="件" />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic title="今日订单" value={12} suffix="单" />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic title="注册用户" value={128} suffix="人" />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic title="今日销售额" value={896} prefix="¥" />
                </Card>
              </Col>
            </Row>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}