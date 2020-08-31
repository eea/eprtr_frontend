/* REACT */
import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

function isColor(strColor) {
  return /^#[0-9A-F]{6}$/i.test(strColor);
}

const components = {
  h1: (text, color) => (
    <h1 className="query-param-text" style={{ color: color }}>
      {text}
    </h1>
  ),
  h2: (text, color) => (
    <h2 className="query-param-text" style={{ color: color }}>
      {text}
    </h2>
  ),
  h3: (text, color) => (
    <h3 className="query-param-text" style={{ color: color }}>
      {text}
    </h3>
  ),
  p: (text, color) => (
    <p className="query-param-text" style={{ color: color }}>
      {text}
    </p>
  ),
};

const View = ({ content, ...props }) => {
  const { data } = props;
  const {
    component = 'h1',
    queryParam = '',
    leftText = '',
    rightText = '',
    color = '#000',
  } = data;
  const queryText = props.search[queryParam] || '';

  const text = `${leftText} ${queryText} ${rightText}`;

  return (
    <div>
      {props.mode === 'edit' ? !queryText ? <p>Query param text</p> : '' : ''}
      {components[component]
        ? components[component](text, isColor(color) ? color : '#000')
        : ''}
    </div>
  );
};

export default compose(
  connect((state, props) => ({
    query: state.router.location.search,
    content:
      state.prefetch?.[state.router.location.pathname] || state.content.data,
    search: state.discodata_query.search,
  })),
)(View);
