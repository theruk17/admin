import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NumericFormat } from 'react-number-format';
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from '@ant-design/icons';
import { Space, Table, Switch, Modal, Divider, message, Row, Col, Form, Checkbox, Input, InputNumber, Select, Upload, Popconfirm, Tag } from 'antd';

import '../App.css';

const API_URL = import.meta.env.VITE_API_URL

const Brand = [
  { val: 'AEROCOOL' },
  { val: 'ANTEC' },
  { val: 'ASUS' },
  { val: 'AXEL' },
  { val: 'AZZA' },
  { val: 'BE QUIET' },
  { val: 'COOLER MASTER' },
  { val: 'CORSAIR' },
  { val: 'DARKFLASH' },
  { val: 'FRACTAL' },
  { val: 'GIGABYTE' },
  { val: 'LIAN LI' },
  { val: 'INWIN' },
  { val: 'iHAVECPU' },
  { val: 'MONTECH' },
  { val: 'NEOLUTION' },
  { val: 'MSI' },
  { val: 'OCPC' },
  { val: 'NZXT' },
  { val: 'PLENTY' },
  { val: 'SILVERSTONE' },
  { val: 'THERMALTAKE' },
  { val: 'TSUNAMI' },
  { val: 'VENUS' },
  { val: 'XIGMATEK' },
  { val: 'ZALMAN' },

]

const Color = [
  { val: '(BLACK)' },
  { val: '(WHITE)' },
  { val: '(RED)' },
  { val: '(BLUE)' },
  { val: '(SNOW WHITE)' },
  { val: '(BLACK/RED)' },
  { val: '(BLACK/WHITE)' },
  { val: '(GRAY)' },
  { val: '(CYAN)' },
  { val: '(PURPLE)' },
  { val: '(PINK)' },
  { val: '(SILVER)' },
  { val: '(MATTE BLACK)' },
  { val: '(MATTE WHITE)' },
  { val: '(MESH BLACK)' },
  { val: '(MESH WHITE)' },
  { val: '(RAZER EDITION)' },
  { val: '(YELLOW)' },

]


const Group = [
  { val: 'ZONE iHAVECPU' },
  { val: 'ZONE A' },
  { val: 'ZONE B' },
  { val: 'ZONE C' },
  { val: 'ZONE ITX' },
]

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 1;
  if (!isLt2M) {
    message.error('Image must smaller than 1MB!');
  }
  return isJpgOrPng && isLt2M;
};

const EditForm = ({ visible, onCreate, onCancel, record }) => {
  const [form] = Form.useForm();
  const [switchValue, setSwitchValue] = useState(false);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    setSwitchValue(record.status === "Y")
    setFileList([{ url: API_URL + '/' + record.case_img }])
    form.setFieldsValue({
      group: record.case_group,
      brand: record.case_brand,
      model: record.case_model,
      color: record.case_color,
      price_srp: record.product_price,
      href: record.case_href,
      status: record.status,
    });
  }, [record, form]);


  const onStatusChange = (checked) => {
    setSwitchValue(checked);
    form.setFieldsValue({ status: checked ? 'Y' : 'N' });
  };

  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const handleUpload = ({ file, onSuccess, onError, onProgress }) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('id', record.case_id);
    formData.append('t_name', 'case');
    formData.append('c_name', 'case');

    try {
      axios.post(API_URL + '/uploadimg', formData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress({ percent });
        }
      })
        .then(res => {
          console.log(res);
          const imageUrl = res.data.secure_url;
          message.success("Upload Image to Server " + res.statusText);
          onSuccess(imageUrl);

        })

    } catch (error) {
      console.error(error);
      message.error('Image upload failed!');
      onError();
    }
  };
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  return (
    <Modal
      open={visible}
      width={1000}
      title="Edit Data"
      okText="Save"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            onCreate(values);
            form.resetFields();
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Divider />
      <Form form={form} name="form_in_modal">
        <Row gutter={20}>
          <Col span={12}>
            <Form.Item label="Brand" name="brand"
              rules={[
                {
                  required: true,
                  message: 'Please input your Brand!',
                },
              ]}>
              <Select placeholder="Brand" allowClear>
                {Brand.map(item => (
                  <Select.Option key={item.val} value={item.val}>{item.val}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="model" label="Model" >
              <Input placeholder='Model' allowClear />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={20}>
          <Col span={6}>
            <Form.Item label="Color" name="color">
              <Select placeholder="Size" allowClear>
                {Color.map(item => (
                  <Select.Option key={item.val} value={item.mnt_val}>{item.val}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={20}>
          <Col span={6}>
            <Form.Item label="Group" name="group">
              <Select placeholder="Group" allowClear>
                {Group.map(item => (
                  <Select.Option key={item.val} value={item.val}>{item.label}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Price" name="price_srp">
              <InputNumber
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                min={0} readOnly
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={20}>
          <Col span={6}>
            <Form.Item label="Status" name="status">
              <Switch checkedChildren="On" unCheckedChildren="Off" checked={switchValue} onChange={onStatusChange} ></Switch>
            </Form.Item>
          </Col>
          <Col span={18}>
            <Form.Item name="href" label="Link" >
              <Input placeholder='Link' allowClear />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Upload Image">
          <Upload listType="picture-card"
            fileList={fileList}
            customRequest={handleUpload}
            onPreview={handlePreview}
            onChange={handleChange}
            beforeUpload={beforeUpload}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
          <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
            <img
              alt="example"
              style={{
                width: '100%',
              }}
              src={previewImage}
            />
          </Modal>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const CaseData = () => {
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [record, setRecord] = useState({});
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    pageSize: 100
  });

  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  const init = () => {
    axios
      .post(API_URL + "/admin_data", { t_name: 'case', c_name: 'case' })
      .then((res) => {
        setData(res.data);
        setLoading(false);
      });
  }

  useEffect(() => {
    setLoading(true);
    init()

  }, []);

  const showModal = (record) => {
    setVisible(true);
    setRecord(record);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleDelete = id => {
    axios
      .delete(API_URL + `/admin_del_case/${id}`)
      .then(res => {
        setData(data.filter(item => item.case_id !== id));
        message.success(res.data);
      });
  };

  const handleCreate = (values) => {
    axios.put(API_URL + '/edit_case/' + record.case_id, values)
      .then(res => {
        setVisible(false)
        message.success(res.data);
        init()
      })
      .catch(err => {
        console.log(err);
        message.error('Error updating data');
      });
  };




  const handleStatusChange = (key) => {
    setLoading(true)
    const newData = [...data];
    const target = newData.find((item) => item.product_id === key);
    if (target) {
      target.status = target.status === 'Y' ? 'N' : 'Y';
      setData(newData);
      axios.put(API_URL + '/edit_status_case/' + key, { status: target.status })
        .then(res => {
          message.success(res.data);
          setLoading(false)
          init()
        })
        .catch(err => {
          console.log(err);
          message.error('Error updating data');
        });
    };
  };

  const Column = [

    {
      title: 'Image',
      dataIndex: 'case_img',
      key: 'case_img',
      width: 80,
      align: 'center',
      render: (imageUrl) => <img src={API_URL + '/' + imageUrl} alt="thumbnail" width="30" height="30" />,
    },
    {
      title: 'Brand', dataIndex: 'case_brand', key: 'case_brand',
      render: (text, record) => <a href={record.case_href} target='_blank'>{text}</a>,
      sorter: (a, b) => a.case_brand.localeCompare(b.case_brand),
      sortDirections: ['descend'],
    },
    {
      title: 'Model', dataIndex: 'case_model', key: 'case_model',
    },
    {
      title: 'Color', dataIndex: 'case_color', key: 'case_color',

    },
    {
      title: 'STOCK',
      children: [
        {
          title: 'นครนายก', dataIndex: 'stock_nny', key: 'stock_nny', align: 'center',
          sorter: (a, b) => a.stock_nny - b.stock_nny,
          render(text, record) {
            return {
              props: {
                style: { background: parseInt(text) === 0 ? "#ffccc7" : "" }
              },
              children: <div>{text}</div>
            };
          }
        },
        {
          title: 'รามอินทรา', dataIndex: 'stock_ramintra', key: 'stock_ramintra', align: 'center',
          sorter: (a, b) => a.stock_ramintra - b.stock_ramintra,
          render(text, record) {
            return {
              props: {
                style: { background: parseInt(text) === 0 ? "#ffccc7" : "" }
              },
              children: <div>{text}</div>
            };
          }
        },
        {
          title: 'บางพลัด', dataIndex: 'stock_bangphlat', key: 'stock_bangphlat', align: 'center',
          sorter: (a, b) => a.stock_bangphlat - b.stock_bangphlat,
          render(text, record) {
            return {
              props: {
                style: { background: parseInt(text) === 0 ? "#ffccc7" : "" }
              },
              children: <div>{text}</div>
            };
          }
        },
        {
          title: 'เดอะโฟล์ท', dataIndex: 'stock_thefloat', key: 'stock_thefloat', align: 'center',
          sorter: (a, b) => a.stock_thefloat - b.stock_thefloat,
          render(text, record) {
            return {
              props: {
                style: { background: parseInt(text) === 0 ? "#ffccc7" : "" }
              },
              children: <div>{text}</div>
            };
          }
        },
        {
          title: 'รังสิต', dataIndex: 'stock_rangsit', key: 'stock_rangsit', align: 'center',
          sorter: (a, b) => a.stock_rangsit - b.stock_rangsit,
          render(text, record) {
            return {
              props: {
                style: { background: parseInt(text) === 0 ? "#ffccc7" : "" }
              },
              children: <div>{text}</div>
            };
          }
        },
        {
          title: 'บางแสน', dataIndex: 'stock_bangsaen', key: 'stock_bangsaen', align: 'center',
          sorter: (a, b) => a.stock_bangsaen - b.stock_bangsaen,
          render(text, record) {
            return {
              props: {
                style: { background: parseInt(text) === 0 ? "#ffccc7" : "" }
              },
              children: <div>{text}</div>
            };
          }
        },
        {
          title: 'รวม', dataIndex: 'sumstock', key: 'sumstock', align: 'center', sorter: (a, b) => a.sumstock - b.sumstock,
          render(text, record) {
            return {
              props: {
                style: { background: parseInt(text) === 0 ? "#ffccc7" : "" }
              },
              children: <div>{text}</div>
            };
          }
        },
      ]
    },

    {
      title: 'Price SRP', dataIndex: 'product_price', key: 'product_price', align: 'right',
      sorter: (a, b) => a.product_price - b.product_price,
      render: (value) => (
        <NumericFormat style={{ color: "#0958d9" }} value={value} displayType={'text'} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
      )
    },
    {
      title: 'Status', dataIndex: 'status', key: 'status', align: 'center',
      render: (text, record) => (
        <Switch checkedChildren="On" unCheckedChildren="Off" checked={record.status === 'Y'} onChange={() => handleStatusChange(record.product_id)}
        />
      )
    },
    {
      title: 'Action', dataIndex: 'action', key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a key={record} onClick={() => showModal(record)}><EditTwoTone twoToneColor="#ffa940" /></a>
          <Popconfirm
            title="Delete the item"
            onConfirm={() => handleDelete(record.case_id)}
            placement="topRight"
            description="Are you sure you want to delete this item?"
            okText="Yes"
            cancelText="No"
          >
            <a><DeleteTwoTone twoToneColor="#eb2f96" /></a>
          </Popconfirm>
        </Space>
      )
    },
  ]
  return (
    <div>
      <Table bordered loading={loading} dataSource={data} columns={Column} rowKey={record => record.case_id} pagination={pagination} onChange={onChange} size="small"></Table>
      <EditForm
        visible={visible}
        onCreate={handleCreate}
        onCancel={handleCancel}
        record={record}
      />
    </div>
  );
};

export default CaseData;