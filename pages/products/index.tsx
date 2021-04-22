import React, { useState } from 'react'
import axios from '../../lib/axios'
import { handleRequestError } from '../../lib/utils'
import { useIsAuthenticated, useFormErrors } from '../../lib/custom-hooks';
import Router, { withRouter } from 'next/router';
import DefaultLayout from '../../layouts/DefaultLayout';
import AppStoreSearch from '../../components/AppStoreSearch'

import {
  Table,
  Button,
  Form,
  Input,
  InputNumber,
  Radio,
  Space,
  Modal,
  Divider,
  Select,
  Descriptions,
  Skeleton
} from 'antd';

const { Option } = Select
const { Search } = Input;

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

function onChange(value) {
  console.log(`selected ${value}`);
}

function onBlur() {
  console.log('blur');
}

function onFocus() {
  console.log('focus');
}

function onSearchSelect(value) {
  console.log('onsearch select', value)
}

const ChosenStore = props => {
  const store = props.store ? props.store : null
  return (
    store
    ? <div>
        <Descriptions title="Store Info" bordered>
          <Descriptions.Item label="ID">
            {store.id}
          </Descriptions.Item>
          <Descriptions.Item label="Store Name">
            {store.name}
          </Descriptions.Item>
          <Descriptions.Item label="Product Type">
            {store.productType}
          </Descriptions.Item>
        </Descriptions>
        <br />
        <Descriptions title="Store Details" bordered>
          <Descriptions.Item label="Location">
            {store.storeDetail.location}
          </Descriptions.Item>
          <Descriptions.Item label="Product Type">
            {store.storeDetail.category}
          </Descriptions.Item>
          <Descriptions.Item label="Price Range">
            ${store.storeDetail.priceRangeLowest} ~ ${store.storeDetail.priceRangeHighest} 
          </Descriptions.Item>
        </Descriptions>
      </div>
    : <div>
        
      </div>
  )
}

class Page extends React.Component{
  state : any = {
    data: [],
    products: [],
    stores: [],
    token: '',
    loading: false,
    form: {
      // id: '',
      name: '',
      price: 0,
      perishable: false,
      vendorId: '',
    },
    chosenStore: null,
    updateForm: {
      id: '',
      name: '',
      price: 0,
      perishable: false,
      product_detail: {
        category: '',
        vendor: {
          id: '',
          name: '',
        }
      }
    },
    params: {
      search: ''
    },
    updateModal: false,
    hasError: false,
  }

  componentDidMount () {
    this.fetch()
  }

  onSearch = async (value) => {
    await this.setState({
      params:{
        search: value,
      }
    })

    await this.fetch()
  }

  onChoosingStore = async (value) => {
    console.log(`onChoosingStore ${value}`);
    await axios.get(`/api/stores/${value}?token=${this.state.token}`).then(res => {
      console.log('res', res)
      this.setState({
        chosenStore: res.data.data.store
      })
    })
  }

  showUpdateModal = async (item) => {
    await this.setState({
      updateForm: {
        id: item.id,
        name: item.name,
        price: item.price,
        perishable: item.perishable,
        product_detail: {
          category: item.productDetail.category,
          vendor: {
            id: item.productDetail.vendor.id,
            name: item.productDetail.vendor.name,
          }
        }
      },
      updateModal: true
    })

    console.log('updatestate', this.state.updateForm)
  }

  deleteItem = async (item) => {
    await axios.delete(`/api/products/${item.id}?token=${this.state.token}`, this.state.updateForm)
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
  
  handleOk = async() => {
    this.setState({
      updateModal: false
    })

    await axios.put(`/api/products/${this.state.updateForm.id}?token=${this.state.token}`, this.state.updateForm)
      // await axios.post(`/api/products`, this.state.form)
      .then(res => {
        console.log('success', this.state.form)
      })
      .catch(err => {
        // handleRequestError(err, setErrors, errorMessage => {
        //   message.error({ content: errorMessage });
        // });
        console.log('state', this.state)
        console.log('sOMETHING wENt WrOng', this.state.hasError)
      })
  };

  handleCancel = async () => {
    await this.setState({
      updateForm: {
        id: '',
        name: '',
        price: '',
        perishable: '',
        product_detail: {
          category: '',
          vendor: {
            id: '',
            name: '',
          }
        }
      },
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

    await axios.get(`/api/products?token=${this.state.token}`, {
      params: this.state.params
    }).then(res => {
      this.setState({
        loading: false,
        products: res.data.data.products
      })
    })

    await axios.get(`/api/stores?token=${this.state.token}`).then(res => {
      const results = res.data.data.stores
      const storeOptions = results.map(item => {
        return{
          label: item.name,
          value: item.id,
        }
      })

      console.log('storeOptions', storeOptions)
      this.setState({
        loading: false,
        stores: storeOptions,
      })
    })

  }

  render () {
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
      },
      {
        title: 'Product Name',
        dataIndex: 'name',
      },
      {
        title: 'Price',
        dataIndex: 'price',
      },
      {
        title: 'Product Category',
        dataIndex: ["productDetail", "category"],
      },
      {
        title: 'Action',
        key: 'action',
        render: item => (
          <Space size="middle">
            <Button onClick={e => {
                e.preventDefault();
                Router.push('/products/[id]', `/products/${item.id}`);
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
          // id: values.id,
          name: values.name,
          price: values.price,
          perishable: values.perishable,
          vendorId: values.vendorId,
        }
      })

      await axios.post(`/api/products?token=${this.state.token}`, this.state.form)
      .then(res => {
        console.log('success', this.state.form)
      })
      .catch(err => {
        console.log('state', this.state)
        console.log('sOMETHING wENt WrOng', this.state.hasError)
      })
      
      this.fetch()
    };

    const updateProduct = async (values: any) => {
      console.log('values', values)
      await this.setState({
        updateForm: {
          id: values.id,
          name: values.name,
          price: values.price,
          perishable: values.perishable,
          product_detail: {
            category: values.category,
            vendor: {
              id: values.vendorId,
              name: values.vendorName,
            }
          }
        }
      })
      
      await axios.put(`/api/products/${this.state.updateForm.id}?token=${this.state.token}`, this.state.updateForm)
      .then(res => {
        console.log('success', this.state.form)
      })
      .catch(err => {
        console.log('sOMETHING wENt WrOng')
        handleRequestError(err, [], []);
      })
      this.fetch()
    }
    return (
      <DefaultLayout>
        <div>              
          <div className="p-4 text-xl font-bold">
            Products
          </div>
          <Search
            placeholder="input search text"
            allowClear
            enterButton="Search"
            size="large"
            onSearch={this.onSearch}
          />

          <Table
            scroll={{ x: 1100 }}
            columns={columns}
            rowKey={product => `product-${product.id}`}
            dataSource={this.state.products}
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
            {/* <Form.Item
              name="id"
              label="ID"
              rules={[
                {
                  required: true,
                  message: 'Please input ID',
                },
              ]}
            >
              <Input value={this.state.form.id}/>
            </Form.Item> */}

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
              name="price"
              label="Price"
              rules={[
                {
                  required: true,
                  message: 'Please input Price',
                },
              ]}
            >
              <InputNumber 
                defaultValue={1000}
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                onChange={onChange}
                value={this.state.form.price}
              />
            </Form.Item>

            <Form.Item
              name="perishable"
              label="Perishable"
              tooltip="If item is perishable or not"
            >
              <Radio.Group onChange={onChange} value={this.state.form.perishable}>
                <Radio value={true}>True</Radio>
                <Radio value={false}>False</Radio>
              </Radio.Group>
            </Form.Item>
            
            <Form.Item
              name="vendorId"
              label="Vendor Id"
              rules={[
                {
                  required: true,
                  message: 'Please input vendor',
                },
              ]}
            >
             <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Select Store"
                optionFilterProp="children"
                onChange={this.onChoosingStore}
                onFocus={onFocus}
                onBlur={onBlur}
                onSearch={onSearchSelect}
                filterOption={(input, option) =>  
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 
                  || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {this.state.stores.map(item => <Option value={item.value}>{item.label}</Option>)}
              </Select>
            </Form.Item>
            <ChosenStore store={this.state.chosenStore}/>

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

          

          <Modal 
            title="Basic Modal" 
            visible={this.state.updateModal} 
            onCancel={this.handleCancel}
          >
            <Form
              // {...formItemLayout}
              name="update"
              onFinish={updateProduct}
              scrollToFirstError
            >
              <Form.Item
                name="id"
                label="ID"
                rules={[
                  {
                    required: true,
                    message: 'Please input ID',
                  },
                ]}
              >
                <Input value={this.state.updateForm.id}/>
              </Form.Item>

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
                <Input value={this.state.updateForm.name}/>
              </Form.Item>

              <Form.Item
                name="price"
                label="Price"
                rules={[
                  {
                    required: true,
                    message: 'Please input Price',
                  },
                ]}
              >
                <InputNumber
                  defaultValue={this.state.updateForm.price} 
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  onChange={onChange}
                  value={this.state.updateForm.price}
                />
              </Form.Item>

              <Form.Item
                name="perishable"
                label="Perishable"
                tooltip="If item is perishable or not"
              >
                <Radio.Group 
                  onChange={onChange} 
                  value={this.state.updateForm.perishable}
                >
                  <Radio value={true}>True</Radio>
                  <Radio value={false}>False</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                name="category"
                label="Category"
                rules={[
                  {
                    required: true,
                    message: 'Please input category',
                  },
                ]}
              >
                <Input 
                  value={this.state.updateForm.product_detail.category}
                />
              </Form.Item>
              
              <Form.Item
                name="vendorId"
                label="Vendor"
                rules={[
                  {
                    required: true,
                    message: 'Please input vendor',
                  },
                ]}
              >
                <Input
                  value={this.state.updateForm.product_detail.vendor.id}
                />
              </Form.Item>


              <Form.Item
                name="vendorName"
                label="Vendor Name"
                rules={[
                  {
                    required: true,
                    message: 'Please input vendor name',
                  },
                ]}
              >
                <Input
                  value={this.state.updateForm.product_detail.vendor.name}
                />
              </Form.Item>
                <Form.Item 
                  // {...tailFormItemLayout}
                >
                <Button 
                  type="primary" 
                  htmlType="submit"
                >
                  Confirm
                </Button>
              </Form.Item>
            </Form>
          </Modal>

        </div>
      </DefaultLayout>
    )
  }
}

export default Page