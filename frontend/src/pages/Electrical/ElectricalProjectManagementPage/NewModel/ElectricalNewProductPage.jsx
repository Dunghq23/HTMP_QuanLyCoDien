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
  Modal,
  Form,
  Input,
  Upload,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  FileExcelOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import modelService from '~/services/modelService';
import CreateNewModelModal from '~/pages/Electrical/ElectricalProjectManagementPage/NewModel/CreateNewModelModal';
import CreateNewProcessModal from '~/pages/Electrical/ElectricalProjectManagementPage/NewModel/CreateNewProcessModal';
import ProcessTabs from '~/pages/Electrical/ElectricalProjectManagementPage/NewModel/ProcessTabs';
import Search from 'antd/es/input/Search';
import productService from '~/services/productService';

const useExpandable = () => {
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [expandedData, setExpandedData] = useState({});
  const [loadingExpandedRow, setLoadingExpandedRow] = useState({});
  const [modelId, setModelId] = useState(null);

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
    modelId,
  };
};

function ElectricalNewProductPage() {
  const [selectedModelId, setSelectedModelId] = useState(null);
  const [isCreateNewModelModalOpen, setIsCreateNewModelModalOpen] = useState(false);
  const [isCreateNewProcessModalOpen, setIsCreateNewProcessModalOpen] = useState(false);
  const [models, setModels] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  const [isModalProductEditOpen, setIsModalProductEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);


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

  const fetchProductList = async () => {
    if (expandedRowKeys.length > 0) {
      const currentModelId = expandedRowKeys[0]; // vì bạn chỉ expand 1 model một lúc
      await loadProducts(currentModelId);        // gọi lại API để load lại products
    }
  };


  const handleSearch = async (keyword) => {
    if (keyword !== '') {
      console.log(keyword);

      const data = await modelService.searchByProductCodeOrMoldCode(keyword);
      setModels(data);
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
  ];

  if (localStorage.getItem("role") !== 'ROLE_EMPLOYEE') {
    modelColumns.push({
      title: 'Hành động',
      width: '10%',
      render: (_, record) => (
        <Space>
          {(localStorage.getItem("role") === 'ROLE_ADMIN' || localStorage.getItem("role") === 'ROLE_MANAGER') && (
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
    });
  }

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
    { title: 'Trạng thái', dataIndex: 'status' },
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
          <Button icon={<EditOutlined />}

            onClick={() => {
              setSelectedProduct(record);
              setIsModalProductEditOpen(true);
            }} />
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
          fetchProductList();
        }}
        productId={selectedProductId}
      />

      {/* Cập nhật thông tin sản phẩm */}
      <Modal
        title={`Cập nhật hình ảnh sản phẩm`}
        open={isModalProductEditOpen}
        onOk={async () => {
          if (!selectedImageFile || !selectedProduct?.id) {
            message.error('Thiếu ảnh hoặc sản phẩm chưa được chọn');
            return;
          }

          const formData = new FormData();
          formData.append('file', selectedImageFile);

          try {
            setIsLoading(true);
            await productService.uploadProductImage(selectedProduct.id, formData);
            message.success('Cập nhật ảnh thành công');
            setIsModalProductEditOpen(false);
            fetchProductList();
          } catch (error) {
            message.error(error.message || 'Lỗi khi cập nhật ảnh');
          } finally {
            setIsLoading(false);
          }
        }}
        onCancel={() => {
          setIsModalProductEditOpen(false);
          setSelectedImageFile(null);
          setPreviewImage(null);
        }}
        confirmLoading={isLoading}
      >
        <Form layout="vertical">
          <Form.Item label="Hình ảnh sản phẩm">
            <Upload
              listType="picture-card"
              showUploadList={false}
              beforeUpload={(file) => {
                setSelectedImageFile(file);
                const reader = new FileReader();
                reader.onload = () => {
                  setPreviewImage(reader.result);
                };
                reader.readAsDataURL(file);
                return false; // chặn upload mặc định
              }}
            >
              {previewImage || selectedProduct?.image ? (
                <img
                  src={
                    previewImage
                      ? previewImage
                      : `${process.env.REACT_APP_UPLOAD_URL}/${selectedProduct.image}`
                  }
                  alt="Ảnh sản phẩm"
                  style={{ width: '100%' }}
                />
              ) : (
                <div>+ Tải ảnh</div>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>


    </>
  );
}

export default ElectricalNewProductPage;
