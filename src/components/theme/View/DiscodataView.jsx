/* REACT IMPORTS */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import qs from 'query-string';
/* ROOT IMPORTS */
import MosaicView from 'volto-mosaic/components/theme/View';
import DB from 'volto-datablocks/DataBase/DB';
//  SVGS
/* LOCAL IMPORTS */
import {
  getDiscodataResource,
  setDiscodataQuery,
} from 'volto-datablocks/actions';
/* =================================================== */

const DiscodataView = props => {
  const query = qs.parse(props.location.search);

  useEffect(() => {
    const { sql_query, endpoint_url } = props.content;
    const {
      search,
      key,
      resourceKey,
      where,
      groupBy,
    } = props.discodata_query.data;
    const whereStatements =
      where?.length > 0 &&
      where.map(param => {
        return {
          discodataKey: param,
          value: props.discodata_query.data.search?.[param],
        };
      });
    const url = DB.table(sql_query, endpoint_url, {
      p: query.p,
      nrOfHits: query.nrOfHits,
    })
      .where(whereStatements)
      .encode()
      .get();
    if (!props.discodata_resources.loading) {
      const request = {
        url,
        search: search || {},
        resourceKey: resourceKey || '',
        key: key || '',
        groupBy: groupBy || [],
      };
      if (
        request.url &&
        !props.discodata_resources.data?.[key]?.[
          props.discodata_query.data.search?.[key]
        ]
      ) {
        props.getDiscodataResource(request);
      }
    }
    /* eslint-disable-next-line */
  }, [props.discodata_query.data])

  return (
    <div id="mosaic-view">
      <MosaicView {...props} />
    </div>
  );
};

export default connect(
  (state, props) => ({
    discodata_query: state.discodata_query,
    discodata_resources: state.discodata_resources,
    content:
      state.prefetch?.[state.router.location.pathname] || state.content.data,
  }),
  { getDiscodataResource, setDiscodataQuery },
)(DiscodataView);
