import React from 'react';
import { Breadcrumb } from 'antd';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Navigations = () => {
  const router = useRouter();

  const crumbs = router.asPath.split('?')[0].split('/');
  const items = [];
  let link = '';

  for (let i = 1; i < crumbs.length; i += 1) {
    const crumb = crumbs[i];
    link = `${link}/${crumbs[i]}`;

    const data = {
      href: link,
      key: link,
    };

    const linkSplit = link.split('/');

    // Convert link to href and as when in dyamic breadcrumb
    if (linkSplit.length > 2) {
      data.as = data.href;
      linkSplit[2] = '[id]';
      data.href = linkSplit.join('/');
    }

    items.push({
      text: crumb,
      linkProps: data,
    });
  }

  return (
    <Breadcrumb
      style={{
        textAlign: 'right',
      }}
    >
      <Breadcrumb.Item>
        <Link href="/">
          <a style={{ textTransform: 'capitalize' }}>Navigation</a>
        </Link>
      </Breadcrumb.Item>
      {items.map(item => (
        <Breadcrumb.Item key={item.linkProps.key}>
          <Link {...item.linkProps}>
            <a style={{ textTransform: 'capitalize' }}>
              {item.text.replace('-', ' ')}
            </a>
          </Link>
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

export default Navigations;
