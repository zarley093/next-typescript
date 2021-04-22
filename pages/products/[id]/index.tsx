import React from 'react';
import { useRouter } from 'next/router';
import { useRequest } from '../../../lib/custom-hooks';
import DefaultLayout from '../../../layouts/DefaultLayout';

import {
  Space,
  Card,
  Descriptions, 
  Skeleton,
  Button 
} from 'antd'
const moment = require('moment');

const Product = props => {
  const router = useRouter()
  const { id } = router.query

  const { data: token, error: err } = useRequest({
      url: `/user`,
    }
  );

  const { data: productRequest, error: productError } = useRequest(
    id && token
      ? {
          url: `/api/products/${id}?token=${token.token}`,
        }
      : null
  );

  const product = productRequest ? productRequest.product : null
  
  const ProductDetail = props => {
    return (product.productDetail.store 
    ? <div>
        <br />
        <Descriptions title="Vendor Info" bordered>
          <Descriptions.Item label="Vendor ID">
            {product.productDetail.store.id}
          </Descriptions.Item>
          <Descriptions.Item label="Vendor Name">
            {product.productDetail.store.name}
          </Descriptions.Item>
          <Descriptions.Item label="Vendor Product Category">
            {product.productDetail.store.productType}
          </Descriptions.Item>
        </Descriptions>
        <br />
        <Descriptions title="Store Info" bordered>
          <Descriptions.Item label="Location">
            {product.productDetail.store.storeDetail.location}
          </Descriptions.Item>
          <Descriptions.Item label="Product Type">
            {product.productDetail.store.storeDetail.category}
          </Descriptions.Item>
          <Descriptions.Item label="Price Range">
            ${product.productDetail.store.storeDetail.priceRangeLowest} ~ ${product.productDetail.store.storeDetail.priceRangeHighest} 
          </Descriptions.Item>
        </Descriptions>
        
      </div>
    : <div>
        Store not found
      </div> )
  }
  
  return (
    product 
    ? <div>
        <Descriptions title="Product Info" bordered>
          <Descriptions.Item label="Product ID">
            {product.id}
          </Descriptions.Item>
          <Descriptions.Item label="Product Name">
            {product.name}
          </Descriptions.Item>
          <Descriptions.Item label="Price">
            {product.price}
          </Descriptions.Item>
          <Descriptions.Item label="Category">
            {product.productDetail.category}
          </Descriptions.Item>
          <Descriptions.Item label="Created at">
            {moment(product.createdAt).format("dddd, MMMM Do YYYY, h:mm:ss a")}
          </Descriptions.Item>
          <Descriptions.Item label="Updated at">
            {moment(product.updatedAt).format("dddd, MMMM Do YYYY, h:mm:ss a")}
          </Descriptions.Item>
        </Descriptions>
        <ProductDetail/>
      </div>
    : <div>
        Product not loaded
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