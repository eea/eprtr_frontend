import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import _uniqueId from 'lodash/uniqueId';
import View from './View';

import InlineForm from '@plone/volto/components/manage/Form/InlineForm';
import { SidebarPortal } from '@plone/volto/components';

import { makeTextSchema } from '../schema';

const getSchema = (props) => {
  return makeTextSchema(props);
};

const Edit = (props) => {
  const [state, setState] = useState({
    schema: getSchema({ ...props }),
    id: _uniqueId('block_'),
  });

  useEffect(() => {
    const schema = getSchema({ ...props });
    setState({
      ...state,
      schema,
    });
    /* eslint-disable-next-line */
  }, [
    props.discodata_query.search,
    props.discodata_resources.data,
    JSON.stringify(props.data),
  ]);

  return (
    <div>
      <SidebarPortal selected={props.selected}>
        <InlineForm
          schema={state.schema}
          title={state.schema.title}
          onChangeField={(id, value) => {
            const { data } = props;
            props.onChangeBlock(props.block, {
              ...data,
              [id]: value,
            });
          }}
          formData={props.data}
          block={props.block}
        />
      </SidebarPortal>
      <View {...props} id={state.id} mode="edit" />
    </div>
  );
};

export default compose(
  connect((state, props) => ({
    pathname: state.router.location.pathname,
    discodata_resources: state.discodata_resources,
    discodata_query: state.discodata_query,
  })),
)(Edit);
