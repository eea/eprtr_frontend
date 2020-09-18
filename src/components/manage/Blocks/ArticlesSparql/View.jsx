import React, { useState, useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import { Link } from 'react-router-dom';
import { getSparqlData } from '~/actions';
import { Image } from 'semantic-ui-react';
import moment from 'moment';
import cx from 'classnames';
import downSVG from '@plone/volto/icons/down.svg';
import upSVG from '@plone/volto/icons/up.svg';
import placeholderImage from './placeholder.png';
import './style.css';

const View = (props) => {
  const [activeItem, setActiveItem] = useState(1);
  const { page = '/', redirectPage = null, preview = false } = props.data || {};
  const items = props.sparql_data[page]?.items || [];

  useEffect(() => {
    if (!props.sparql_data[page]) {
      props.getSparqlData(page);
    }
    /* eslint-disable-next-line */
  }, []);

  const isVisible = (index) => {
    if (!preview) return true;
    if (activeItem === 0) {
      return index < 3;
    } else {
      return Math.abs(index - activeItem) < 2;
    }
  };

  return (
    <div className="articles-sparql">
      {props.mode === 'edit' && !props.data.page ? (
        <p>Select SPARQL data from sidebar</p>
      ) : (
        ''
      )}
      {props.mode === 'edit' && props.data.page && !items.length ? (
        <p>There is no SPARQL data</p>
      ) : (
        ''
      )}
      {items.length ? (
        <div className="grid-layout articles">
          {items.map((item, index) =>
            isVisible(index) ? (
              <div
                className={cx(
                  'row articles-row mb-1 sm-height-fit-content',
                  index !== activeItem && preview ? 'can-be-half' : '',
                )}
                key={`sparql-row-${index}-${item.title}`}
              >
                <div className="column-4 sm-12 article hero pa-1">
                  <Image src={item.image || placeholderImage} />
                </div>
                <div className="column-8 sm-12 article pa-1">
                  <div className="article-header">
                    <h3 className="mb-0">{item.title}</h3>
                  </div>
                  <div className="article-metadata  mb-1">
                    <p className="info">
                      {moment(item.time).format('DD MMM YYYY')}
                    </p>
                  </div>
                  <div className="article-description mb-1">
                    <p>{item.description}</p>
                  </div>
                  <div className="article-footer">
                    <a
                      className="outline dark-blue display-inline-block"
                      href={item.resource}
                      target="_blank"
                      rel="noreferrer"
                    >
                      READ ARTICLE
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              ''
            ),
          )}
        </div>
      ) : (
        ''
      )}
      {preview && redirectPage && items.length ? (
        <Link
          className="solid dark-blue articles-redirect"
          as="a"
          to={redirectPage}
          title="READ MORE"
        >
          READ MORE
        </Link>
      ) : (
        ''
      )}
      {/* {items.length > 2 ? (
        <div className="articles-slideshow">
          {activeItem > 1 ? (
            <Icon
              onClick={() => {
                setActiveItem(activeItem - 1);
              }}
              name={upSVG}
              size="24px"
            />
          ) : (
            ''
          )}
          {activeItem < items.length - 1 ? (
            <Icon
              onClick={() => {
                setActiveItem(activeItem + 1);
              }}
              name={downSVG}
              size="24px"
            />
          ) : (
            ''
          )}
        </div>
      ) : (
        ''
      )} */}
    </div>
  );
};

export default compose(
  connect(
    (state, props) => ({
      sparql_data: state.sparql.items,
    }),
    { getSparqlData },
  ),
)(View);
