import React, { useEffect, useState } from 'react';
import {
  Table,
  Tag,
  Button,
  Row,
  Col,
  Space,
  message,
  Spin,
  Image,
  Popconfirm,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  FileExcelOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import modelService from '~/services/modelService';
import CreateNewModelModal from '~/components/CreateNewModelModal';
import CreateNewProcessModal from '~/components/CreateNewProcessModal';
import ProcessTabs from '~/components/ProcessTabs';
import Search from 'antd/es/transfer/search';

const useExpandable = () => {
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [expandedData, setExpandedData] = useState({});
  const [loadingExpandedRow, setLoadingExpandedRow] = useState({});
  const [productId, setModelId] = useState(null);

  const loadProducts = async (id) => {
    setLoadingExpandedRow((prev) => ({ ...prev, [id]: true }));
    try {
      const items = await modelService.getProductByModelId(id);
      setExpandedData((prev) => ({ ...prev, [id]: items }));
    } catch {
      message.error('Không thể tải danh sách sản phẩm');
    } finally {
      setLoadingExpandedRow((prev) => ({ ...prev, [id]: false }));
    }
  };

  return {
    expandedRowKeys,
    setExpandedRowKeys,
    expandedData,
    loadingExpandedRow,
    loadProducts,
    setModelId,
    productId,
  };
};

function ElectricalNewProductPage() {
  const [selectedModelId, setSelectedModelId] = useState(null);
  const [isCreateNewModelModalOpen, setIsCreateNewModelModalOpen] = useState(false);
  const [isCreateNewProcessModalOpen, setIsCreateNewProcessModalOpen] = useState(false);
  const [models, setModels] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const {
    expandedRowKeys,
    setExpandedRowKeys,
    expandedData,
    loadingExpandedRow,
    loadProducts,
    setModelId,
  } = useExpandable();

  const fetchModel = async () => {
    try {
      const data = await modelService.getAllModel();
      setModels(data);
    } catch (error) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    fetchModel();
  }, []);

  const handleDownloadTemplate = async () => {
    try {
      await modelService.downloadTemplate();
      message.success('Tải file mẫu thành công');
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleSearch = async (keyword) => {
    if (keyword === '') {
      fetchModel();
    }
  };

  const modelColumns = [
    { title: 'ID', dataIndex: 'id', width: '10%' },
    { title: 'Mã model', dataIndex: 'code', width: '20%' },
    { title: 'Tên Model', dataIndex: 'name', width: '25%' },
    { title: 'Khách hàng', dataIndex: 'customerName', width: '35%' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: '10%',
      render: (status) => <Tag color="blue">{status}</Tag>,
    },
    {
      title: 'Hành động',
      width: '10%',
      render: (_, record) => (
        <Space>
          {localStorage.getItem('role') === 'ROLE_ADMIN' && (
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa model này không?"
              description="Hành động này không thể hoàn tác."
              okText="Xóa"
              cancelText="Hủy"
              onConfirm={() => {
                modelService.deleteModel(record.id)
                  .then(() => {
                    message.success('Xóa model thành công');
                    fetchModel();
                  })
                  .catch((error) => {
                    message.error(error.message);
                  });
              }}
            >
              <Button danger icon={<DeleteOutlined />}>
                Xóa
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    }

  ];

  const productColumns = [
    { title: 'Mã sản phẩm', dataIndex: 'code' },
    { title: 'Tên sản phẩm', dataIndex: 'name' },
    { title: 'Mã khuôn', dataIndex: 'moldCode' },
    { title: 'Loại gate', dataIndex: 'gateType' },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      align: 'center',
      render: (text, record) =>
        text ? (
          <Image.PreviewGroup>
            <Image width={100} src={`${process.env.REACT_APP_UPLOAD_URL}/${record.image}`} />
          </Image.PreviewGroup>
        ) : (
          '-'
        ),
    },
    {
      title: 'Hành động',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedProductId(record.id);
              setIsCreateNewProcessModalOpen(true);
            }}
          />
          <Button icon={<EditOutlined />} />
        </Space>
      ),
    },
  ];

  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsCreateNewModelModalOpen(true)}
            >
              Thêm New Model
            </Button>
            <Button
              icon={<FileExcelOutlined />}
              style={{ backgroundColor: '#52c41a', color: '#fff' }}
              onClick={handleDownloadTemplate}
            >
              Tải mẫu new model
            </Button>
          </Space>
        </Col>
        <Col>
          <Search
            placeholder="Tìm kiếm..."
            allowClear
            enterButton={<SearchOutlined />}
            onSearch={handleSearch}
            style={{ width: 300 }}
            onChange={(e) => e.target.value === '' && fetchModel()}
          />
        </Col>
      </Row>

      <Table
        dataSource={models}
        rowKey="id"
        columns={modelColumns}
        expandable={{
          expandedRowKeys,
          onExpand: async (expanded, record) => {
            setExpandedRowKeys([]);
            if (expanded) {
              setModelId(record.id);
              await loadProducts(record.id);
              setExpandedRowKeys([record.id]);
            }
          },
          expandedRowRender: (record) =>
            loadingExpandedRow[record.id] ? (
              <Spin />
            ) : (
              <Table
                dataSource={expandedData[record.id] || []}
                columns={productColumns}
                pagination={false}
                rowKey="id"
                size="small"
                expandable={{
                  expandedRowRender: (product) => (
                    <ProcessTabs productId={product.id} />
                  ),
                }}
              />
            ),
          rowExpandable: () => true,
        }}
      />

      <CreateNewModelModal
        open={isCreateNewModelModalOpen}
        onCancel={() => setIsCreateNewModelModalOpen(false)}
        onSuccess={() => {
          setIsCreateNewModelModalOpen(false);
          fetchModel();
        }}
      />

      <CreateNewProcessModal
        open={isCreateNewProcessModalOpen}
        onCancel={() => setIsCreateNewProcessModalOpen(false)}
        onSuccess={() => {
          setIsCreateNewProcessModalOpen(false);
          fetchModel();
        }}
        productId={selectedProductId}
      />
    </>
  );
}

export default ElectricalNewProductPage;
