import React from 'react';
import { useRouter } from 'next/router';
import { useRequest } from '../../../lib/custom-hooks';
import DefaultLayout from '../../../layouts/DefaultLayout';
import Router, { withRouter } from 'next/router';
import {
  Space,
  Card,
  Table,
  Descriptions, 
  Skeleton,
  Button, 
} from 'antd'
const moment = require('moment');
const Product = props => {
  const router = useRouter()
  const { id } = router.query

  const { data: token, error: err } = useRequest({
      url: `/user`,
    }
  );

  const { data: storeRequest, error: productError } = useRequest(
    id && token
      ? {
          url: `/api/stores/${id}?token=${token.token}`,
        }
      : null
  );

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
          
        </Space>
      ),
    },
  ]; 

  const store = storeRequest ? storeRequest.store : null
  console.log('store', store)
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
          <Descriptions.Item label="Created at">
            {moment(store.createdAt).format("dddd, MMMM Do YYYY, h:mm:ss a")}
          </Descriptions.Item>
          <Descriptions.Item label="Updated at">
            {moment(store.updatedAt).format("dddd, MMMM Do YYYY, h:mm:ss a")}
          </Descriptions.Item>
        </Descriptions>
        <br />
        <Table
            scroll={{ x: 1100 }}
            columns={columns}
            rowKey={product => `product-${product.id}`}
            dataSource={store.products}
            bordered
          />
        {/* <Descriptions title="Store Info" bordered>
          <Descriptions.Item label="Location">
            {store.storeDetail.location}
          </Descriptions.Item>
          <Descriptions.Item label="Product Type">
            {store.storeDetail.category}
          </Descriptions.Item>
          <Descriptions.Item label="Price Range">
            ${store.storeDetail.priceRangeLowest} ~ ${store.storeDetail.priceRangeHighest} 
          </Descriptions.Item>
        </Descriptions> */}
      </div>
    : <div>
        <Skeleton/>
      </div>
  )
}

class Page extends React.Component {
  state: any = {
    loading: false,
  }

  render () {
    return (
      <DefaultLayout>
        <div>
          <Product/>
        </div>
      </DefaultLayout>
    )
  }
}

export default Page;