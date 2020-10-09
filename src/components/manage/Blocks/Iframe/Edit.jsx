import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import _uniqueId from 'lodash/uniqueId';
import RenderFields from 'volto-datablocks/Utils/RenderFields';
import View from './View';
import { settings } from '~/config';
import './style.css';

const getSchema = (props) => {
  return {
    desktopUrl: {
      title: 'Desktop url',
      type: 'text',
    },
    tabletUrl: {
      title: 'Tablet url',
      type: 'text',
    },
    mobileUrl: {
      title: 'Mobile url',
      type: 'text',
    },
    title: {
      title: 'Title',
      type: 'text',
    },
    width: {
      title: 'Width',
      type: 'text',
    },
    height: {
      title: 'Height',
      type: 'text',
    },
    hideToolbar: {
      title: 'Hide toolbar',
      type: 'boolean',
    },
    overflow: {
      title: 'Overflow',
      type: 'boolean',
    },
    preset: {
      title: 'Preset',
      type: 'array',
      choices: [['site_tableau', 'Site tableau']],
    },
    queryParameters: {
      title: 'Query parameters',
      type: 'schema',
      fieldSetTitle: 'Query parameters',
      fieldSetId: 'query_parameters',
      fieldSetSchema: {
        fieldsets: [
          {
            id: 'default',
            title: 'title',
            fields: ['title', 'id', 'queryParam'],
          },
        ],
        properties: {
          title: {
            title: 'Title',
            type: 'text',
          },
          id: {
            title: 'Id',
            type: 'text',
            description: 'This will be used as query param key for tableau',
          },
          queryParam: {
            title: 'Query to use',
            type: 'text',
          },
        },
        required: ['id', 'title', 'key'],
      },
      editFieldset: false,
      deleteFieldset: false,
    },
    flags: {
      title: 'Flags',
      type: 'schema',
      fieldSetTitle: 'Flags',
      fieldSetId: 'flags_parameters',
      fieldSetSchema: {
        fieldsets: [
          {
            id: 'default',
            title: 'title',
            fields: ['title', 'id', 'packageName', 'flag'],
          },
        ],
        properties: {
          title: {
            title: 'Title',
            type: 'text',
          },
          id: {
            title: 'Id',
            type: 'text',
          },
          packageName: {
            title: 'Package name',
            type: 'text',
          },
          flag: {
            title: 'Flag name',
            type: 'text',
          },
        },
        required: ['id', 'title', 'packageName', 'flag'],
      },
      editFieldset: false,
      deleteFieldset: false,
    },
  };
};

const Edit = (props) => {
  const [state, setState] = useState({
    schema: getSchema({ ...props, providerUrl: settings.providerUrl }),
    id: _uniqueId('block_'),
  });
  // useEffect(() => {

  // }, [discodata_query, flags]);
  return (
    <div>
      <RenderFields
        schema={state.schema}
        {...props}
        title="Iframe"
        noValueKey={true}
      />
      <View {...props} id={state.id} mode="edit" />
    </div>
  );
};

export default compose(
  connect((state, props) => ({
    pathname: state.router.location.pathname,
    flags: state.flags,
    discodata_query: state.discodata_query,
  })),
)(Edit);
