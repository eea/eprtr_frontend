import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { isString } from 'lodash';
import { Link } from 'react-router-dom';
import qs from 'query-string';
import { Table, Pagination } from 'semantic-ui-react';
import downSVG from '@plone/volto/icons/down-key.svg';
import upSVG from '@plone/volto/icons/up-key.svg';
import { Icon } from '@plone/volto/components';
import { DiscodataSqlBuilderView } from '@eeacms/volto-datablocks/components';
import { setQueryParam } from '@eeacms/volto-datablocks/actions';
import { Dimmer, Loader } from 'semantic-ui-react';
import LinearProgress from '@material/react-linear-progress';

import '@material/react-linear-progress/dist/linear-progress.css';

const components = {
  object_link_length: (schemaMetadata, itemMetadata, item) => {
    return (
      <a
        href={item[schemaMetadata.urlFieldId]}
        target="_blank"
        rel="noopener noreferrer"
      >
        {item[itemMetadata] && Object.keys(item[itemMetadata]).length}{' '}
        {schemaMetadata.title}
      </a>
    );
  },
  object_link_keys: (schemaMetadata, itemMetadata, item) => {
    return (
      <>
        {item[itemMetadata] &&
          Object.keys(item[itemMetadata])?.map(
            (key, index) =>
              index < 3 && <span key={`${index}_keyslist_${key}`}>{key}</span>,
          )}
        {item[itemMetadata] && Object.keys(item[itemMetadata]).length > 3 && (
          <a
            href={item[schemaMetadata.urlFieldId]}
            target="_blank"
            rel="noopener noreferrer"
          >
            {Object.keys(item[itemMetadata]).length - 3} {schemaMetadata.title}
          </a>
        )}
      </>
    );
  },
  textarea_link_value: (schemaMetadata, itemMetadata, item) => {
    return (
      <>
        <div dangerouslySetInnerHTML={{ __html: item[itemMetadata] }} />
        <a
          href={item[schemaMetadata.urlFieldId]}
          target="_blank"
          rel="noopener noreferrer"
        >
          {schemaMetadata.title}
        </a>
      </>
    );
  },
  button_link_value: (schemaMetadata, itemMetadata, item, props) => {
    const { search } = props.discodata_query;
    let newSearch = { ...search };
    let updatedSearch = false;
    schemaMetadata.queriesToSet.forEach((key, index) => {
      if (
        schemaMetadata.discodataQueriesKeys[index] &&
        (!newSearch[key] ||
          (newSearch[key] &&
            newSearch[key] !==
              item[schemaMetadata.discodataQueriesKeys[index]]))
      ) {
        updatedSearch = true;
        newSearch[key] = item[schemaMetadata.discodataQueriesKeys[index]];
      }
    });
    return (
      <div className="flex align-center flex-grow">
        <Link
          className={schemaMetadata.className}
          onClick={() => {
            if (updatedSearch) props.setQueryParam({ queryParam: newSearch });
          }}
          to={
            schemaMetadata.urlFieldId +
            (newSearch
              ? `?${qs.stringify({
                  siteInspireId: newSearch.siteInspireId,
                  siteName: newSearch.siteName,
                  siteReportingYear: newSearch.siteReportingYear,
                })}`
              : '')
          }
        >
          {schemaMetadata.title}
        </Link>
      </div>
    );
  },
  default: (schemaMetadata, itemMetadata, item) => {
    if (Array.isArray(item[itemMetadata])) return item[itemMetadata].join(', ');
    if (typeof item[itemMetadata] === 'object' && item[itemMetadata] !== null)
      return Object.keys(item[itemMetadata]).join(', ');
    return <p className="mb-0">{item[itemMetadata]}</p>;
  },
};

const View = (props) => {
  const [state, setState] = useState({
    metadata: {},
    tableHeaders: 0,
    pagination: {
      activePage: 1,
      itemsPerPage: 25,
    },
    selectedItemIndex: -1,
  });
  const [collection, set_collection] = useState('');
  const [collection_count, set_collection_count] = useState('');
  const extent = props.discodata_query.search.extent || [
    -10686671.0000035,
    -2430148.00000588,
    6199975.99999531,
    10421410.9999871,
  ];
  const sqls = props.data?.sql?.value
    ? JSON.parse(props.data.sql.value).properties
    : {};
  const { activePage, itemsPerPage } = state.pagination;
  let items = [],
    totalItems = 0;
  if (
    (sqls && Object.keys(sqls).length >= 2 && items,
    props.data.itemsCountKey?.value)
  ) {
    const local_collection = Object.keys(sqls).filter(
      (key) => !key.includes('collection_count'),
    )[0];
    const local_collection_count = Object.keys(sqls).filter((key) =>
      key.includes('collection_count'),
    )[0];
    if (collection !== local_collection) {
      set_collection(local_collection);
    }
    if (collection_count !== local_collection_count) {
      set_collection_count(local_collection_count);
    }
    items = props.discodata_resources.data[local_collection] || [];
    totalItems =
      props.data.itemsCountKey?.value &&
      props.discodata_resources.data[local_collection_count] &&
      Array.isArray(props.discodata_resources.data[local_collection_count]) &&
      props.discodata_resources.data[local_collection_count].length > 0
        ? props.discodata_resources.data[local_collection_count].reduce(
            (acc, el) =>
              acc[props.data.itemsCountKey.value] +
              el[props.data.itemsCountKey.value],
          )[props.data.itemsCountKey.value]
        : 0;
  }
  useEffect(() => {
    const metadata = props.data?.metadata
      ? isString(props.data.metadata.value)
        ? JSON.parse(props.data.metadata.value)
        : props.data.metadata.value
      : {};
    setState({
      ...state,
      metadata,
      tableHeaders: metadata?.fieldsets?.[0]?.fields?.length,
    });
    /* eslint-disable-next-line */
  }, [props.data?.metadata?.value]);

  const loader =
    props.discodata_resources.pendingRequests[collection] ||
    props.discodata_resources.pendingRequests[collection_count];

  const additionalWhereStatements = [
    `shape_wm.STX >= ${extent[0]} AND shape_wm.STX <= ${extent[2]}`,
    `shape_wm.STY >= ${extent[1]} AND shape_wm.STY <= ${extent[3]}`,
  ];

  return (
    <div className={`browse-table ${props.className ? props.className : ''}`}>
      <DiscodataSqlBuilderView
        {...props}
        additionalWhereStatements={additionalWhereStatements}
        pagination={{ p: activePage, nrOfHits: itemsPerPage }}
      >
        {items?.length ? (
          <React.Fragment>
            <Table className="unstackable">
              {/* ==== TABLE HEADER ==== */}
              <Table.Header id="discodata-table-header">
                <Table.Row>
                  {state.metadata?.fieldsets?.[0]?.fields?.map(
                    (meta) =>
                      state.metadata.properties[meta].tableType ===
                        'Table header' && (
                        <Table.HeaderCell key={`header-${meta}`}>
                          {state.metadata.properties[meta].title}
                        </Table.HeaderCell>
                      ),
                  )}
                  <Table.HeaderCell />
                </Table.Row>
                {loader && (
                  <Table.Row>
                    <Table.HeaderCell colSpan={state.tableHeaders + 1}>
                      <LinearProgress indeterminate />
                    </Table.HeaderCell>
                  </Table.Row>
                )}
              </Table.Header>
              {/* ==== TABLE BODY ==== */}
              <Table.Body>
                {items?.map((item, trIndex) => (
                  <React.Fragment key={`item-${trIndex}`}>
                    {/* ==== TABLE ROW ====*/}
                    <Table.Row
                      key={`tr-${trIndex}`}
                      className={
                        state.selectedItemIndex === trIndex ? 'row-active' : ''
                      }
                    >
                      {state.metadata?.fieldsets?.[0]?.fields?.map(
                        (meta, cellIndex) => {
                          if (
                            state.metadata.properties[meta].tableType ===
                            'Table header'
                          ) {
                            const dataType =
                              state.metadata.properties[meta].dataType;
                            const show = state.metadata.properties[meta].show;

                            return (
                              <Table.Cell
                                key={`cell-${trIndex}-${cellIndex}-${meta}`}
                              >
                                {components[`${dataType}_${show}`]
                                  ? components[`${dataType}_${show}`](
                                      state.metadata.properties[meta],
                                      meta,
                                      item,
                                      props,
                                    )
                                  : components.default(
                                      state.metadata.properties[meta],
                                      meta,
                                      item,
                                      props,
                                    )}
                              </Table.Cell>
                            );
                          }
                          return null;
                        },
                      )}
                      <Table.Cell>
                        <button
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            if (state.selectedItemIndex === trIndex) {
                              setState({ ...state, selectedItemIndex: -1 });
                              return;
                            }
                            setState({ ...state, selectedItemIndex: trIndex });
                          }}
                        >
                          <Icon
                            name={
                              state.selectedItemIndex === trIndex
                                ? upSVG
                                : downSVG
                            }
                            size="3em"
                          />
                        </button>
                      </Table.Cell>
                    </Table.Row>
                    {/* ==== TABLE HIDDEN ROW ==== */}
                    <Table.Row
                      className={
                        state.selectedItemIndex === trIndex
                          ? 'hidden-row show'
                          : 'hidden-row hide'
                      }
                    >
                      <Table.Cell colSpan={state.tableHeaders + 1}>
                        <div className="hidden-row-container">
                          <div className="table-flex-container white">
                            {props.data?.hiddenRowTypes?.value
                              ?.filter((type) => type !== 'Action')
                              .map((type) => (
                                <div key={`hr-${trIndex}-${type}`}>
                                  {type !== 'Action' && (
                                    <span className="header">{type}</span>
                                  )}
                                  <div
                                    className="flex column"
                                    style={{
                                      height:
                                        type !== 'Action' ? 'auto' : '100%',
                                    }}
                                  >
                                    {state.metadata?.fieldsets?.[0]?.fields?.map(
                                      (meta) => {
                                        if (
                                          state.metadata.properties[meta]
                                            .tableType === 'Hidden row' &&
                                          state.metadata.properties[meta]
                                            .hiddenRowType === type
                                        ) {
                                          const dataType =
                                            state.metadata.properties[meta]
                                              .dataType;
                                          const show =
                                            state.metadata.properties[meta]
                                              .show;

                                          return (
                                            <React.Fragment
                                              key={`hidden_row_${meta}`}
                                            >
                                              {components[`${dataType}_${show}`]
                                                ? components[
                                                    `${dataType}_${show}`
                                                  ](
                                                    state.metadata.properties[
                                                      meta
                                                    ],
                                                    meta,
                                                    item,
                                                    props,
                                                  )
                                                : components.default(
                                                    state.metadata.properties[
                                                      meta
                                                    ],
                                                    meta,
                                                    item,
                                                    props,
                                                  )}
                                            </React.Fragment>
                                          );
                                        }
                                        return null;
                                      },
                                    )}
                                  </div>
                                </div>
                              ))}
                          </div>
                          <div className="table-flex-container action">
                            {props.data?.hiddenRowTypes?.value
                              ?.filter((type) => type === 'Action')
                              .map((type) => (
                                <div key={`hr-${trIndex}-${type}`}>
                                  <div
                                    className="flex column"
                                    style={{
                                      height: '100%',
                                    }}
                                  >
                                    {state.metadata?.fieldsets?.[0]?.fields?.map(
                                      (meta) => {
                                        if (
                                          state.metadata.properties[meta]
                                            .tableType === 'Hidden row' &&
                                          state.metadata.properties[meta]
                                            .hiddenRowType === type
                                        ) {
                                          const dataType =
                                            state.metadata.properties[meta]
                                              .dataType;
                                          const show =
                                            state.metadata.properties[meta]
                                              .show;

                                          return (
                                            <React.Fragment
                                              key={`hidden_row_${meta}`}
                                            >
                                              {components[`${dataType}_${show}`]
                                                ? components[
                                                    `${dataType}_${show}`
                                                  ](
                                                    state.metadata.properties[
                                                      meta
                                                    ],
                                                    meta,
                                                    item,
                                                    props,
                                                  )
                                                : components.default(
                                                    state.metadata.properties[
                                                      meta
                                                    ],
                                                    meta,
                                                    item,
                                                    props,
                                                  )}
                                            </React.Fragment>
                                          );
                                        }
                                        return null;
                                      },
                                    )}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  </React.Fragment>
                ))}
              </Table.Body>
              {/* ==== TABLE FOOTER ==== */}
              <Table.Footer>
                <Table.Row>
                  <Table.HeaderCell
                    colSpan={state.tableHeaders + 1}
                    style={{ textAlign: 'left' }}
                  >
                    <Pagination
                      activePage={activePage}
                      onPageChange={function (event, pagination) {
                        if (document.querySelector('.filters-container')) {
                          document
                            .querySelector('.filters-container')
                            .scrollIntoView();
                        } else if (
                          document.getElementById('discodata-table-header')
                        ) {
                          document
                            .getElementById('discodata-table-header')
                            .scrollIntoView();
                        }
                        setState({
                          ...state,
                          pagination: {
                            ...state.pagination,
                            activePage: pagination.activePage,
                          },
                          selectedItemIndex: -1,
                        });
                      }}
                      totalPages={Math.ceil(totalItems / itemsPerPage)}
                      firstItem={null}
                      lastItem={null}
                    />
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Footer>
            </Table>
          </React.Fragment>
        ) : !loader ? (
          <div style={{ width: '100%', height: '400px' }}>
            <h4
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              No data
            </h4>
          </div>
        ) : (
          <div style={{ width: '100%', height: '400px' }} />
        )}
      </DiscodataSqlBuilderView>
      {!items?.length ? (
        <Dimmer active={loader} inverted>
          <Loader inverted>European Environment Agency</Loader>
        </Dimmer>
      ) : (
        ''
      )}
    </div>
  );
};

export default compose(
  connect(
    (state, props) => ({
      discodata_query: state.discodata_query,
      discodata_resources: state.discodata_resources,
    }),
    { setQueryParam },
  ),
)(View);
