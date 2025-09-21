import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  ColorPicker, 
  message, 
  Popconfirm,
  Tag as AntTag,
  Space,
  Typography
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import api from '../services/api';

const { Title } = Typography;

interface Tag {
  id: number;
  name: string;
  color: string;
  description: string;
  createdAt: string;
}

const TagManagementPage: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tags');
      setTags(response.data);
    } catch (error) {
      message.error('태그 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingTag(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    form.setFieldsValue({
      name: tag.name,
      color: tag.color,
      description: tag.description
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/tags/${id}`);
      message.success('태그가 삭제되었습니다.');
      fetchTags();
    } catch (error) {
      message.error('태그 삭제에 실패했습니다.');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingTag) {
        await api.put(`/tags/${editingTag.id}`, values);
        message.success('태그가 수정되었습니다.');
      } else {
        await api.post('/tags', values);
        message.success('태그가 생성되었습니다.');
      }
      setModalVisible(false);
      fetchTags();
    } catch (error) {
      message.error('태그 저장에 실패했습니다.');
    }
  };

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: '태그명',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Tag) => (
        <Space>
          <AntTag color={record.color}>{name}</AntTag>
        </Space>
      ),
    },
    {
      title: '색상',
      dataIndex: 'color',
      key: 'color',
      render: (color: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '20px',
              height: '20px',
              backgroundColor: color,
              borderRadius: '4px',
              border: '1px solid #d9d9d9'
            }}
          />
          <span>{color}</span>
        </div>
      ),
    },
    {
      title: '설명',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '생성일',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: '작업',
      key: 'actions',
      render: (_: any, record: Tag) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            수정
          </Button>
          <Popconfirm
            title="이 태그를 삭제하시겠습니까?"
            onConfirm={() => handleDelete(record.id)}
            okText="예"
            cancelText="아니오"
          >
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              삭제
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Title level={2}>🏷️ 태그 관리</Title>
          <Space>
            <Input
              placeholder="태그 검색..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              태그 추가
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredTags}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}개`,
          }}
        />
      </Card>

      <Modal
        title={editingTag ? '태그 수정' : '태그 추가'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="태그명"
            rules={[{ required: true, message: '태그명을 입력해주세요.' }]}
          >
            <Input placeholder="태그명을 입력하세요" />
          </Form.Item>

          <Form.Item
            name="color"
            label="색상"
            rules={[{ required: true, message: '색상을 선택해주세요.' }]}
          >
            <ColorPicker showText />
          </Form.Item>

          <Form.Item
            name="description"
            label="설명"
          >
            <Input.TextArea
              placeholder="태그에 대한 설명을 입력하세요"
              rows={3}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                취소
              </Button>
              <Button type="primary" htmlType="submit">
                {editingTag ? '수정' : '추가'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TagManagementPage;
