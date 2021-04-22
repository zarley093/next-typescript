import React, { useState } from 'react'
import axios from '../../lib/axios'
import { handleRequestError } from '../../lib/utils'
import { useIsAuthenticated, useFormErrors } from '../../lib/custom-hooks';
import Router, { withRouter } from 'next/router';
import DefaultLayout from '../../layouts/DefaultLayout';

import {
  Layout, 
  Table,
  Button,
  Form,
  Input,
  InputNumber,
  Radio,
  Space,
  Modal,
  Cascader,
  AutoComplete,
  Checkbox,
  Divider,
  Alert,
  message,
  Select, 
} from 'antd';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const { Option } = Select;

function onChange(value) {
  console.log('changed', value);
}


class Page extends React.Component{
  state : any = {
    data: [],
    stores: [],
    token: '',
    loading: false,
    form: {
      name: '',
      product_type: '',
      store_detail: {
        location: '',
        category:'',
        price_range_highest: '',
        price_range_lowest: '',
      }
    },
    updateForm: {
      id: '',
      name: '',
      product_type: '',
      store_detail: {
        location: '',
        category:'',
        price_range_highest: '',
        price_range_lowest: '',
      }
    },
    updateModal: false,
    hasError: false,
  }

  componentDidMount () {
    this.fetch()
  }

  showUpdateModal = async (item) => {
    console.log('item', item)
    await this.setState({
      updateForm: {
        id: item.id,
        name: item.name,
        product_type: item.product_type,
        store_detail: {
          location: item.location,
          category:item.category,
          price_range_highest: item.price_range_highest,
          price_range_lowest: item.price_range_lowest,
          }
      },
      updateModal: true
    })

    console.log('updatestate', this.state.updateForm)
  }
  
  handleOk = () => {
    this.setState({
      updateModal: false
    })
  };

  handleCancel = () => {
    this.setState({
      updateModal: false
    })
  };

  fetch = async (params = {}) => {
    this.setState({ loading: true });
    await axios.get(`/`) .then(res => {
      this.setState({
        data: res.data.hello
      })
    })
    await axios.get(`/user`).then(res => {
      this.setState({
        token: res.data.data.token
      })
    })

    await axios.get(`/api/stores?token=${this.state.token}`).then(res => {
      this.setState({
        loading: false,
        stores: res.data.data.stores
      })
      console.log('res', res)
    })
  }

  deleteItem = async (item) => {
    await axios.delete(`/api/stores/${item.id}?token=${this.state.token}`)
      // await axios.post(`/api/products`, this.state.form)
      .then(res => {
        console.log('success', this.state.form)
        this.fetch()
      })
      .catch(err => {
        // handleRequestError(err, setErrors, errorMessage => {
        //   message.error({ content: errorMessage });
        // });
        console.log('state', this.state)
        console.log('sOMETHING wENt WrOng', this.state.hasError)
      })
  }

  render () {
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
      },
      {
        title: 'Store Name',
        dataIndex: 'name',
      },
      {
        title: 'Product Type',
        dataIndex: 'productType',
      },
      {
        title: 'Action',
        key: 'action',
        render: item => (
          <Space size="middle">
            <Button onClick={e => {
                e.preventDefault();
                Router.push('/stores/[id]', `/stores/${item.id}`);
              }}>View</Button>
            <Button onClick={e=> {e.preventDefault(); this.showUpdateModal(item)}}>Update</Button>
            <Button danger onClick={e=> {e.preventDefault(); this.deleteItem(item)}}>Delete</Button>
            
          </Space>
        ),
      },
    ]; 
    
    const onFinish = async (values: any) => {
      await this.setState({
        form: {
          name: values.name,
          product_type: values.productType,
          store_detail: {
            location: values.location,
            category:values.category,
            price_range_highest: values.priceRangeHighest,
            price_range_lowest: values.priceRangeLowest,
          }
        }
      })

      await axios.post(`/api/stores?token=${this.state.token}`, this.state.form)
      // await axios.post(`/api/stores`, this.state.form)
      .then(res => {
        console.log('success', this.state.form)
      })
      .catch(err => {
        // handleRequestError(err, setErrors, errorMessage => {
        //   message.error({ content: errorMessage });
        // });
        console.log('state', this.state.form)
        console.log('sOMETHING wENt WrOng', this.state.hasError)
      })
      
      this.fetch()
    };

    const updateStore = async (values: any) => {
      await this.setState({
        form: {
          id: values.id,
          name: values.name,
          product_type: values.product_type,
          store_detail: {
            location: values.location,
            category:values.category,
            price_range_highest: values.price_range_highest,
            price_range_lowest: values.price_range_lowest,
          }
        }
      })

      await axios.post(`/api/stores?token=${this.state.token}`, this.state.form)
      .then(res => {
        console.log('success', this.state.form)
      })
      .catch(err => {
        console.log('sOMETHING wENt WrOng')
        handleRequestError(err, [], []);
      })
    }
    
    return (
      <DefaultLayout>
        <div>
        <div className="p-4 text-xl font-bold">
          Stores
        </div>
        <Table
          scroll={{ x: 1100 }}
          columns={columns}
          rowKey={store => `store-${store.id}`}
          dataSource={this.state.stores}
          pagination={this.state.pagination}
          loading={this.state.loading}
          bordered
        />
        <Divider orientation="left">Create Product</Divider>

        <Form
          // {...formItemLayout}
          name="register"
          onFinish={onFinish}
          scrollToFirstError
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: 'Please input Name',
              },
            ]}
          >
            <Input value={this.state.form.name}/>
          </Form.Item>
          <Form.Item
            name="productType"
            label="Product Type"
            rules={[
              {
                required: true,
                message: 'Please select Product Type',
              },
            ]}
          >
            <Select
              value={this.state.form.product_type} 
              style={{ width: 300 }} 
              allowClear
            >
              <Option value="Mobile and Computing">Mobile and Computing</Option>
              <Option value="Health and Wellness">Health and Wellness</Option>
              <Option value="Food and Beverage">Food and Beverages</Option>
              <Option value="Clothing and Apparel">Clothing and Apparel</Option>
              <Option value="Hardware & Home Improvement">Hardware & Home Improvement</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="category"
            label="Store Category"
            rules={[
              {
                required: true,
                message: 'Please select Store Category',
              },
            ]}
          >
            <Select
              value={this.state.form.category} 
              style={{ width: 300 }} 
              allowClear
            >
              <Option value="Department Store">Department Store</Option>
              <Option value="Specialty Store">Specialty Store</Option>
              <Option value="Supermarket">Supermarket</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="priceRangeLowest"
            label="Price Range Lowest"
            rules={[
              {
                required: true,
                message: 'Please input Price range lowest',
              },
            ]}
          >
            <InputNumber 
              defaultValue={1000}
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              onChange={onChange}
              value={this.state.form.store_detail.price_range_lowest}
            />
          </Form.Item>
          <Form.Item
            name="priceRangeHighest"
            label="Price Range Highest"
            rules={[
              {
                required: true,
                message: 'Please input Price range highest',
              },
            ]}
          >
            <InputNumber 
              defaultValue={1000}
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              onChange={onChange}
              value={this.state.form.store_detail.price_range_highest}
            />
          </Form.Item>

          <Form.Item
            name="location"
            label="Location"
            rules={[
              {
                required: true,
                message: 'Please input location',
              },
            ]}
          >
            <Input value={this.state.form.store_detail.location}/>
          </Form.Item>

          <Form.Item 
            // {...tailFormItemLayout}
          >
            <Button 
              type="primary" 
              htmlType="submit"
            >
              Post
            </Button>
          </Form.Item>
        </Form>
        
      </div>
      </DefaultLayout>
    )
  }
}

export default Page

