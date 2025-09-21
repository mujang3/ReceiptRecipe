import React, { useState } from 'react';
import { 
  Card, 
  Upload, 
  Button, 
  Typography, 
  Space, 
  Progress, 
  Table, 
  message,
  Divider,
  Row,
  Col
} from 'antd';
import { 
  UploadOutlined, 
  FileTextOutlined, 
  CheckCircleOutlined,
  ClockCircleOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { receiptApi, ocrApi } from '../services/api';
import { OcrResult } from '../types';

const { Title, Text, Paragraph } = Typography;
const { Dragger } = Upload;

interface UploadState {
  uploading: boolean;
  progress: number;
  file: File | null;
}


const ReceiptUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [uploadState, setUploadState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    file: null
  });
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleUpload = async (file: File) => {
    setUploadState({
      uploading: true,
      progress: 0,
      file
    });

    // 진행률 시뮬레이션
    const progressInterval = setInterval(() => {
      setUploadState(prev => ({
        ...prev,
        progress: Math.min((prev.progress || 0) + 10, 90)
      }));
    }, 200);

    try {
      // 파일 업로드
      console.log('영수증 업로드 시작:', file);
      const response = await receiptApi.uploadReceipt(file);
      console.log('영수증 업로드 응답:', response);
      
      clearInterval(progressInterval);
      setUploadState(prev => ({ ...prev, progress: 100 }));

      message.success('영수증이 성공적으로 업로드되었습니다!');

      // OCR 처리
      setProcessing(true);
      try {
        const ocrResponse = await ocrApi.processWithGemini(response.receiptId.toString());
        setOcrResult(ocrResponse);
        message.success('영수증 분석이 완료되었습니다!');
      } catch (ocrError) {
        console.error('OCR 처리 실패:', ocrError);
        message.error('영수증 분석에 실패했습니다.');
      } finally {
        setProcessing(false);
      }

    } catch (error) {
      clearInterval(progressInterval);
      console.error('업로드 실패:', error);
      message.error('영수증 업로드에 실패했습니다.');
      setUploadState({
        uploading: false,
        progress: 0,
        file: null
      });
    }
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    accept: 'image/*,.pdf',
    beforeUpload: (file: File) => {
      const isImage = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf';
      const isLt10M = file.size / 1024 / 1024 < 10;

      if (!isImage && !isPdf) {
        message.error('이미지 파일 또는 PDF만 업로드 가능합니다!');
        return false;
      }

      if (!isLt10M) {
        message.error('파일 크기는 10MB 이하여야 합니다!');
        return false;
      }

      handleUpload(file);
      return false; // 자동 업로드 방지
    },
    showUploadList: false
  };

  const columns = [
    {
      title: '상품명',
      dataIndex: 'itemName',
      key: 'itemName',
    },
    {
      title: '수량',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80,
      render: (quantity: number) => `${quantity}개`,
    },
    {
      title: '가격',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      width: 100,
      render: (price: number) => (
        <Text strong style={{ color: '#1890ff' }}>
          {price.toLocaleString()}원
        </Text>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* 헤더 */}
      <div style={{ marginBottom: '32px' }}>
        <Title level={2} style={{ marginBottom: '8px' }}>
          <FileTextOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
          영수증 업로드
        </Title>
        <Paragraph type="secondary">
          영수증을 업로드하면 자동으로 재료를 분석하여 레시피를 추천해드립니다.
        </Paragraph>
      </div>

      <Row gutter={[24, 24]}>
        {/* 업로드 섹션 */}
        <Col xs={24} lg={12}>
          <Card title="영수증 업로드" style={{ height: '100%' }}>
            {!uploadState.uploading && !ocrResult ? (
              <Dragger {...uploadProps} style={{ padding: '40px 20px' }}>
                <p className="ant-upload-drag-icon">
                  <UploadOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                </p>
                <p className="ant-upload-text" style={{ fontSize: '16px', marginBottom: '8px' }}>
                  영수증을 드래그하거나 클릭하여 업로드
                </p>
                <p className="ant-upload-hint" style={{ color: '#999' }}>
                  JPG, PNG, PDF 파일을 지원합니다 (최대 10MB)
                </p>
              </Dragger>
            ) : uploadState.uploading ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <ClockCircleOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
                <Title level={4} style={{ marginBottom: '16px' }}>
                  업로드 중...
                </Title>
                <Progress 
                  percent={uploadState.progress} 
                  status={uploadState.progress === 100 ? 'success' : 'active'}
                  style={{ marginBottom: '16px' }}
                />
                <Text type="secondary">
                  {uploadState.file?.name}
                </Text>
              </div>
            ) : processing ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <ClockCircleOutlined style={{ fontSize: '48px', color: '#fa8c16', marginBottom: '16px' }} />
                <Title level={4} style={{ marginBottom: '16px' }}>
                  영수증 분석 중...
                </Title>
                <Text type="secondary">
                  AI가 영수증을 분석하고 있습니다.
                </Text>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <CheckCircleOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }} />
                <Title level={4} style={{ marginBottom: '16px' }}>
                  분석 완료!
                </Title>
                <Space>
                  <Button 
                    type="primary" 
                    onClick={() => navigate('/recipes')}
                  >
                    레시피 보기
                  </Button>
                  <Button 
                    onClick={() => {
                      setOcrResult(null);
                      setUploadState({ uploading: false, progress: 0, file: null });
                    }}
                  >
                    다시 업로드
                  </Button>
                </Space>
              </div>
            )}
          </Card>
        </Col>

        {/* 분석 결과 섹션 */}
        <Col xs={24} lg={12}>
          <Card title="분석 결과" style={{ height: '100%' }}>
            {ocrResult ? (
              <div>
                {/* 매장 정보 */}
                <div style={{ marginBottom: '24px' }}>
                  <Title level={5} style={{ marginBottom: '12px' }}>
                    <ShoppingCartOutlined style={{ marginRight: '8px' }} />
                    매장 정보
                  </Title>
                  <Row gutter={[16, 8]}>
                    <Col span={12}>
                      <Text strong>매장명:</Text>
                      <br />
                      <Text>{ocrResult.storeName || '정보 없음'}</Text>
                    </Col>
                    <Col span={12}>
                      <Text strong>구매일:</Text>
                      <br />
                      <Text>{ocrResult.purchaseDate || '정보 없음'}</Text>
                    </Col>
                    <Col span={24}>
                      <Text strong>총 금액:</Text>
                      <br />
                      <Text style={{ fontSize: '18px', color: '#1890ff', fontWeight: 'bold' }}>
                        {ocrResult.totalAmount ? `${ocrResult.totalAmount.toLocaleString()}원` : '정보 없음'}
                      </Text>
                    </Col>
                  </Row>
                </div>

                <Divider />

                {/* 구매 상품 목록 */}
                <div>
                  <Title level={5} style={{ marginBottom: '12px' }}>
                    구매 상품 목록
                  </Title>
                  <Table
                    columns={columns}
                    dataSource={ocrResult.items.map((item, index) => ({
                      ...item,
                      key: index
                    }))}
                    pagination={false}
                    size="small"
                    style={{ marginBottom: '16px' }}
                  />
                </div>

                <Divider />

                {/* 액션 버튼 */}
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button 
                    type="primary" 
                    block
                    onClick={() => navigate('/recipes')}
                  >
                    레시피 추천 받기
                  </Button>
                  <Button 
                    block
                    onClick={() => navigate('/ingredients')}
                  >
                    재료 관리로 이동
                  </Button>
                </Space>
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px 20px',
                color: '#999'
              }}>
                <FileTextOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                <div>영수증을 업로드하면 분석 결과가 여기에 표시됩니다.</div>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* 사용법 안내 */}
      <Card title="사용법 안내" style={{ marginTop: '24px' }}>
        <Row gutter={[24, 16]}>
          <Col xs={24} sm={8}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '32px', 
                marginBottom: '8px',
                color: '#1890ff'
              }}>
                1️⃣
              </div>
              <Title level={5}>영수증 업로드</Title>
              <Text type="secondary">
                촬영한 영수증 사진이나 PDF 파일을 업로드하세요.
              </Text>
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '32px', 
                marginBottom: '8px',
                color: '#52c41a'
              }}>
                2️⃣
              </div>
              <Title level={5}>자동 분석</Title>
              <Text type="secondary">
                AI가 영수증을 분석하여 구매한 재료를 추출합니다.
              </Text>
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '32px', 
                marginBottom: '8px',
                color: '#fa8c16'
              }}>
                3️⃣
              </div>
              <Title level={5}>레시피 추천</Title>
              <Text type="secondary">
                구매한 재료로 만들 수 있는 레시피를 추천해드립니다.
              </Text>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ReceiptUploadPage;