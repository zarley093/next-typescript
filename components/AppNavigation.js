import React from 'react';
import { useRouter } from 'next/router';
import { Menu } from 'antd';

const AppNavigation = props => {
  const { authUser } = props;

  const router = useRouter();

  const onMenuItemSelected = ({
    item,
    key,
    keyPath,
    selectedKeys,
    domEvent,
  }) => {
    console.log({ item, key, keyPath, selectedKeys, domEvent });
    router.push(key);
  };

  const paths = [
    {
      name: 'Demo',
      link: '/next-typescript-demo',
    },
    {
      name: 'Products',
      link: '/products',
    },
    {
      name: 'Stores',
      link: '/stores',
    },
  ]
  

  return (
    <Menu
      defaultSelectedKeys={['0']}
      defaultOpenKeys={['/']}
      mode="inline"
      onSelect={onMenuItemSelected}
    >
      <Menu.Item
        style={{
          height: 'fit-content',
          marginTop: '50px',
          backgroundColor: 'transparent !important',
          border: 'none !important',
          paddingTop: '10px',
        }}
        key="/"
      >
        <div>
          <div>
            <img
              src="/favicon.ico" 
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                marginBottom: '5px',
              }}
              alt={authUser && authUser.email}
            />
            
          </div>
        </div>
      </Menu.Item>
      <hr
        style={{
          width: '90%',
          border: 'none',
          backgroundColor: '#f0f2f5',
          height: '2px',
        }}
      />

      {paths.map(path => {
        return <Menu.Item key={path.link}>{path.name}</Menu.Item>;
      })}
    </Menu>
  );
};

export default AppNavigation;
