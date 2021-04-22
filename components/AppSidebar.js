import React from 'react';
import { Drawer } from 'antd';
import AppNavigation from './AppNavigation';

const AppSidebar = props => {
  const { visible, setVisibility } = props;

  const onClose = () => {
    setVisibility(false);
  };

  return (
    <Drawer
      placement="left"
      closable
      onClose={onClose}
      visible={visible}
      bodyStyle={{ padding: 0 }}
    >
      <AppNavigation {...props} />
    </Drawer>
  );
};

export default AppSidebar;
