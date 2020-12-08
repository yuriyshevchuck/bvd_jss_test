import React from 'react';
import Breadcrumb from 'react-bootstrap/Breadcrumb';

const Breadcrumbs = (props) => {
  // Query results in integrated GraphQL replace the normal `fields` data
  // i.e. with { data, }
  return (
    props.fields.data.allpath && (
      <Breadcrumb>
        {props.fields.data.allpath.breadcrumbs.map((breadcrumbitem, index) => {
          const isActive = index === (props.fields.data.allpath.breadcrumbs.length - 1);
          return <Breadcrumb.Item active={isActive} href={isActive ? breadcrumbitem.path : undefined}> 
                    {breadcrumbitem.name}
                  </Breadcrumb.Item>
        })}
      </Breadcrumb>
    )
  );
};

export default Breadcrumbs;