import React, { useEffect, useState } from 'react';
import { 
  Table, 
  Tag, 
  Button, 
  Space, 
  message, 
  Popconfirm, 
  Empty, 
  Card, 
  Avatar, 
  Dropdown, 
  Menu,
  Badge,
  Input,
  Select,
  DatePicker,
  Modal
} from 'antd';
import { 
  DownloadOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  MoreOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  DeleteOutlined,
  FilterOutlined,
  SearchOutlined,
  EyeOutlined
} from '@ant-design/icons';
import API from '../../../../utils/API';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const EmployerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [pagination, setPagination] = useState({ 
    current: 1, 
    pageSize: 10, 
    total: 0 
  });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: null,
    dateRange: null,
    search: ''
  });
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
        status: filters.status,
        search: filters.search,
        ...(filters.dateRange && {
          from: dayjs(filters.dateRange[0]).startOf('day').toISOString(),
          to: dayjs(filters.dateRange[1]).endOf('day').toISOString()
        })
      };

      const response = await API.get('/api/protected/employe/user/applications', { params });
      const responseData = response.data?.data || response.data;
      const apps = Array.isArray(responseData.applications) 
        ? responseData.applications 
        : Array.isArray(responseData.data) 
          ? responseData.data 
          : Array.isArray(responseData) 
            ? responseData 
            : [];
      
      setApplications(normalizeApplications(apps));
      setPagination(prev => ({
        ...prev,
        total: responseData.total || apps.length || 0
      }));
    } catch (error) {
      message.error('Failed to fetch applications');
      console.error('Fetch applications error:', error);
    } finally {
      setLoading(false);
    }
  };

  const normalizeApplications = (apps) => {
    if (!apps || !Array.isArray(apps)) return [];
    
    return apps.map(app => ({
      ...app,
      key: app._id,
      jobTitle: app.jobId?.title || 'Unknown Job',
      jobDescription: app.jobId?.description || 'No description available',
      applicantName: app.userId 
        ? `${app.userId.fname || ''} ${app.userId.lname || ''}`.trim() 
        : app.fullName || 'Unknown Applicant',
      applicantEmail: app.userId?.email || app.email || 'No email',
      phone: app.userId?.mobile || app.phone || 'Not provided',
      status: app.status || 'Pending',
      appliedAt: app.appliedAt || app.createdAt || new Date(),
      resumeUrl: app.resumeUrl || null,
      coverLetter: app.coverLetter || 'No cover letter provided',
      hasResume: !!app.resumeUrl
    }));
  };

  const handleStatusChange = async (id, status) => {
    try {
      if (!id || !status) {
        throw new Error('Application ID and status are required');
      }

      // API call with ID in query params and status in body
      const response = await API.put(
        `/api/protected/employe/user/applications/status?id=${id}`,
        { status }
      );

      if (response.data?.error) {
        throw new Error(response.data.message);
      }

      message.success(`Application status updated to ${status}`);
      fetchApplications(); // Refresh the data
    } catch (error) {
      console.error('Status update error:', error.response?.data || error);
      message.error(error.response?.data?.message || `Failed to update status: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await API.delete(`/api/protected/employe/user/applications/${id}`);
      if (response.data?.error) {
        throw new Error(response.data.message);
      }
      message.success('Application deleted successfully');
      fetchApplications();
    } catch (error) {
      console.error('Delete error:', error.response?.data || error);
      message.error(error.response?.data?.message || `Failed to delete application: ${error.message}`);
    }
  };

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setIsModalVisible(true);
  };

  const handleContactApplicant = (email, phone) => {
    message.info(`Preparing to contact applicant at ${email}`);
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      status: null,
      dateRange: null,
      search: ''
    });
  };

  useEffect(() => {
    fetchApplications();
  }, [pagination.current, filters]);

  const statusMenu = (record) => (
    <Menu>
      <Menu.Item 
        icon={<CheckCircleOutlined />} 
        onClick={() => handleStatusChange(record.key, 'Shortlisted')}
        disabled={record.status === 'Shortlisted'}
      >
        Shortlist
      </Menu.Item>
      <Menu.Item 
        icon={<CloseCircleOutlined />}
        onClick={() => handleStatusChange(record.key, 'Rejected')}
        disabled={record.status === 'Rejected'}
      >
        Reject
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item 
        icon={<DeleteOutlined />}
        onClick={() => handleDelete(record.key)}
        danger
      >
        Delete
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: 'Job Title',
      dataIndex: 'jobTitle',
      key: 'jobTitle',
      render: (text, record) => (
        <Button 
          type="link" 
          onClick={() => handleViewDetails(record)}
          style={{ padding: 0, fontWeight: 500 }}
        >
          {text}
        </Button>
      ),
      sorter: (a, b) => a.jobTitle.localeCompare(b.jobTitle),
    },
    {
      title: 'Applicant',
      key: 'applicant',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar 
            size="large" 
            style={{ 
              backgroundColor: '#1890ff', 
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {record.applicantName.charAt(0).toUpperCase()}
          </Avatar>
          <div>
            <div style={{ fontWeight: 500 }}>{record.applicantName}</div>
            <div style={{ color: '#666', fontSize: 12 }}>
              <MailOutlined /> {record.applicantEmail}
            </div>
            <div style={{ color: '#666', fontSize: 12 }}>
              <PhoneOutlined /> {record.phone}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusConfig = {
          Pending: { color: 'gold', text: 'Pending', icon: <MoreOutlined /> },
          Shortlisted: { color: 'green', text: 'Shortlisted', icon: <CheckCircleOutlined /> },
          Rejected: { color: 'red', text: 'Rejected', icon: <CloseCircleOutlined /> }
        };
        const config = statusConfig[status] || { color: 'default', text: status };
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
      filters: [
        { text: 'Pending', value: 'Pending' },
        { text: 'Shortlisted', value: 'Shortlisted' },
        { text: 'Rejected', value: 'Rejected' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Applied Date',
      dataIndex: 'appliedAt',
      key: 'appliedAt',
      render: (date) => (
        <div style={{ lineHeight: 1.4 }}>
          <div>{dayjs(date).format('MMM D, YYYY')}</div>
          <div style={{ color: '#999', fontSize: 12 }}>{dayjs(date).format('h:mm A')}</div>
        </div>
      ),
      sorter: (a, b) => new Date(a.appliedAt) - new Date(b.appliedAt),
    },
    {
      title: 'Resume',
      key: 'resume',
      render: (_, record) => (
        record.resumeUrl ? (
          <Button 
            type="link" 
            icon={<DownloadOutlined />} 
            href={record.resumeUrl} 
            target="_blank"
            style={{ color: '#1890ff' }}
          >
            Download
          </Button>
        ) : (
          <Tag icon={<CloseCircleOutlined />} color="default">No Resume</Tag>
        )
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
            title="View Details"
          />
          <Button
            type="text"
            icon={<MailOutlined />}
            onClick={() => handleContactApplicant(record.applicantEmail, record.phone)}
            title="Contact Applicant"
          />
          <Dropdown overlay={statusMenu(record)} trigger={['click']}>
            <Button type="text" icon={<MoreOutlined />} title="More Actions" />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card 
        title={<h2 style={{ margin: 0, fontWeight: 600 }}>Job Applications</h2>}
        style={{ 
          borderRadius: 8, 
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          width: '100%'
        }}
        extra={
          <Button 
            type="primary" 
            icon={<FilterOutlined />}
            onClick={fetchApplications}
            loading={loading}
          >
            Refresh
          </Button>
        }
      >
        <div style={{ 
          display: 'flex', 
          gap: 12, 
          marginBottom: 20, 
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <Input
            placeholder="Search applicants or jobs..."
            prefix={<SearchOutlined />}
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            style={{ flex: 1, minWidth: 200 }}
            allowClear
          />
          
          <Select
            placeholder="Filter by status"
            allowClear
            value={filters.status}
            onChange={(value) => handleFilterChange('status', value)}
            style={{ width: 180 }}
          >
            <Option value="Pending">Pending</Option>
            <Option value="Shortlisted">Shortlisted</Option>
            <Option value="Rejected">Rejected</Option>
          </Select>
          
          <RangePicker 
            onChange={(dates) => handleFilterChange('dateRange', dates)}
            style={{ width: 250 }}
            disabledDate={(current) => current && current > dayjs().endOf('day')}
          />
          
          <Button onClick={handleResetFilters}>Reset Filters</Button>
        </div>

        <Table
          columns={columns}
          dataSource={applications}
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} applications`,
            style: { marginTop: 24 },
            pageSizeOptions: ['10', '20', '50', '100']
          }}
          onChange={(pagination) => {
            setPagination(pagination);
          }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  loading ? 'Loading applications...' : 'No applications found'
                }
              />
            )
          }}
          rowClassName={(record) => `status-${record.status.toLowerCase()}`}
          onRow={(record) => ({
            style: {
              backgroundColor: record.status === 'Pending' ? '#fffbe6' : 
                              record.status === 'Shortlisted' ? '#f6ffed' : 
                              record.status === 'Rejected' ? '#fff1f0' : 'inherit',
              cursor: 'pointer'
            },
            onClick: () => handleViewDetails(record)
          })}
          scroll={{ x: true }}
        />
      </Card>

      {/* Application Details Modal */}
      <Modal
        title="Application Details"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>,
          selectedApplication?.resumeUrl && (
            <Button 
              key="download" 
              icon={<DownloadOutlined />} 
              href={selectedApplication.resumeUrl} 
              target="_blank"
              type="primary"
            >
              Download Resume
            </Button>
          )
        ]}
        width={800}
      >
        {selectedApplication && (
          <div>
            <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ marginBottom: 8 }}>Job Information</h3>
                <p><strong>Title:</strong> {selectedApplication.jobTitle}</p>
                <p><strong>Description:</strong> {selectedApplication.jobDescription}</p>
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ marginBottom: 8 }}>Applicant Information</h3>
                <p><strong>Name:</strong> {selectedApplication.applicantName}</p>
                <p><strong>Email:</strong> {selectedApplication.applicantEmail}</p>
                <p><strong>Phone:</strong> {selectedApplication.phone}</p>
                <p><strong>Status:</strong> 
                  <Tag 
                    color={
                      selectedApplication.status === 'Pending' ? 'gold' : 
                      selectedApplication.status === 'Shortlisted' ? 'green' : 'red'
                    } 
                    style={{ marginLeft: 8 }}
                  >
                    {selectedApplication.status}
                  </Tag>
                </p>
              </div>
            </div>
            
            <h3 style={{ marginBottom: 8 }}>Cover Letter</h3>
            <TextArea 
              value={selectedApplication.coverLetter} 
              autoSize={{ minRows: 4, maxRows: 8 }}
              readOnly
              style={{ background: '#f9f9f9', padding: 12 }}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EmployerApplications;