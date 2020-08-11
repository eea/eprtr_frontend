/**
 * Document view component.
 * @module components/theme/View/DefaultView
 */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { defineMessages, injectIntl } from 'react-intl';
import { map, isMatch } from 'lodash';
import cx from 'classnames';
import SearchBlock from 'volto-addons/SearchBlock/View';
import { getBasePath } from '~/helpers';

import {
  Helmet,
  getBlocksFieldname,
  getBlocksLayoutFieldname,
  hasBlocksData,
} from '@plone/volto/helpers';

import { deepSearch } from '~/helpers';
import { blocks, settings } from '../../../config';

const messages = defineMessages({
  unknownBlock: {
    id: 'Unknown Block',
    defaultMessage: 'Unknown Block {block}',
  },
  closeMobileSidebar: {
    id: 'Close sidebar',
    defaultMessage: 'Close sidebar',
  },
  openMobileSidebar: {
    id: 'Open sidebar',
    defaultMessage: 'Open sidebar',
  },
});

const isActive = (url, pathname) => {
  return (
    (url === '' && pathname === '/') ||
    (url !== '' && isMatch(pathname?.split('/'), url?.split('/')))
  );
};

const DefaultView = props => {
  const { intl, content, navigation, lang } = props;
  const [state, setState] = useState({
    sidebar: [],
    activeTab: 0,
    isMobileSidebarOpen: false,
  });

  // TODO: fix this
  const blocksFieldname = getBlocksFieldname(content);
  const blocksLayoutFieldname = getBlocksLayoutFieldname(content);

  const getSidebar = (item, depth) => {
    const sidebar = [];
    item?.items?.length &&
      item.items.forEach(nextItem => {
        sidebar.push(
          <NavLink
            to={nextItem.url === '' ? '/' : nextItem.url}
            exact={
              settings.isMultilingual
                ? nextItem.url === `/${lang}`
                : nextItem.url === ''
            }
            key={nextItem.url}
            className={`tabs__item depth__${depth}`}
            activeClassName="tabs__item_active"
          >
            {nextItem.title}
          </NavLink>,
        );
        sidebar.push(...getSidebar(nextItem, depth + 1));
      });
    return sidebar;
  };
  useEffect(() => {
    if (navigation) {
      const sidebar = [];
      sidebar.push(...getSidebar(navigation.items?.[state.activeTab], 1));
      setState({
        ...state,
        sidebar,
      });
    }
    /* eslint-disable-next-line */
  }, [props.navigation, state.activeTab]);
  // TODO: fix this
  if (!navigation) return '';

  return hasBlocksData(content) ? (
    <div className="ui wrapper">
      {props.location.pathname.includes('/glossary') ? (
        <div className="glossary-search">
          <SearchBlock
            data={{
              title: { value: 'Glossary' },
              description: {
                value:
                  'This section provides a close-up picture of air pollution from various sources such as road transport, shipping, aviation, domestic heating, agriculture and small business (diffuse emissions). Pollution from diffuse sources occurs over large areas from often indistinct elements. Although the large numbers of houses and vehicles in cities represent many point sources, they collectively represent a large, diffuse source of pollution.',
              },
              query: {
                value: {
                  properties: {
                    path: {
                      value: ['eprtr/glossary'],
                    },
                  },
                },
              },
              placeholder: { value: 'Search site' },
              buttonText: { value: 'SEARCH' },
              buttonClassName: { value: '' },
              searchButton: { value: true },
            }}
          />
        </div>
      ) : props.location.pathname.includes('/raw-data') ? (
        <div>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1
              style={{
                textAlign: 'center',
                marginTop: '1rem',
                fontSize: '36px',
                color: '#4296B2',
              }}
            >
              Raw data
            </h1>
            <p>
              This section provides a close-up picture of air pollution from
              various sources such as road transport, shipping, aviation,
              domestic heating, agriculture and small business (diffuse
              emissions). Pollution from diffuse sources occurs over large areas
              from often indistinct elements. Although the large numbers of
              houses and vehicles in cities represent many point sources, they
              collectively represent a large, diffuse source of pollution.
            </p>
          </div>
        </div>
      ) : (
        ''
      )}

      <nav className="tabs section-tabs">
        {navigation.items?.length
          ? navigation.items.map((item, index) => {
              if (
                isActive(item.url, props.pathname) &&
                index !== state.activeTab
              ) {
                setState({
                  ...state,
                  activeTab: index,
                });
              }
              return (
                <NavLink
                  to={
                    deepSearch({
                      inputArray: item.items,
                      pattern: {
                        criteria: 'first',
                        validationType: 'hasItems',
                        propertyToValidate: 'items',
                        propertyToReturn: 'url',
                      },
                      depth: 1,
                    }) || (item.url === '' ? '/' : item.url)
                  }
                  exact={
                    settings.isMultilingual
                      ? item.url === `/${lang}`
                      : item.url === ''
                  }
                  key={item.url}
                  className={
                    isActive(item.url, props.pathname)
                      ? 'tabs__item tabs__item_active'
                      : 'tabs__item'
                  }
                  activeClassName="tabs__item_active"
                >
                  {item.title}
                </NavLink>
              );
            })
          : ''}
      </nav>

      <div
        className={
          state.isMobileSidebarOpen
            ? 'withSidebar mobileSidebarOpened'
            : 'withSidebar'
        }
      >
        <div className="hamburger-wrapper mobile tablet only">
          <button
            className={cx('hamburger hamburger--collapse', {
              'is-active': state.isMobileSidebarOpen,
            })}
            aria-label={
              state.isMobileSidebarOpen
                ? props.intl.formatMessage(messages.closeMobileSidebar, {
                    type: props.type,
                  })
                : props.intl.formatMessage(messages.openMobileSidebar, {
                    type: props.type,
                  })
            }
            title={
              state.isMobileSidebarOpen
                ? props.intl.formatMessage(messages.closeMobileSidebar, {
                    type: props.type,
                  })
                : props.intl.formatMessage(messages.openMobileSidebar, {
                    type: props.type,
                  })
            }
            type="button"
            onClick={() => {
              setState({
                ...state,
                isMobileSidebarOpen: !state.isMobileSidebarOpen,
              });
            }}
          >
            <span className="hamburger-box">
              <span className="hamburger-inner" />
            </span>
          </button>
        </div>
        <div
          className={
            state.isMobileSidebarOpen
              ? 'page-document-sidebar open'
              : 'page-document-sidebar computer large screen widescreen only'
          }
        >
          <nav className="tabs">{state?.sidebar?.map(item => item)}</nav>
        </div>
        <div id="page-document" className="hasSidebar">
          <Helmet title={content.title} />
          {map(content[blocksLayoutFieldname].items, block => {
            const Block =
              blocks.blocksConfig[
                (content[blocksFieldname]?.[block]?.['@type'])
              ]?.['view'] || null;
            return Block !== null ? (
              <Block
                key={`block-${block}`}
                blockID={block}
                properties={content}
                data={content[blocksFieldname][block]}
              />
            ) : (
              <div key={`blocktype-${block}`}>
                {intl.formatMessage(messages.unknownBlock, {
                  block: content[blocksFieldname]?.[block]?.['@type'],
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  ) : (
    ''
  );
};

DefaultView.propTypes = {
  content: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    text: PropTypes.shape({
      data: PropTypes.string,
    }),
  }).isRequired,
};

export default compose(
  injectIntl,
  connect((state, props) => ({
    navigation: state.navigation.items.filter(item => {
      const basePath = getBasePath(item.url);
      // sectionsWithTabsView
      const { sectionsWithTabsView } = settings;
      const filterBy = sectionsWithTabsView.find(i => i === basePath);
      if (props.location.pathname.includes(filterBy)) {
        return item.title;
      }
      return false;
    })[0],
    pathname: props.location.pathname,
    lang: state.intl.locale,
    content:
      state.prefetch?.[state.router.location.pathname] || state.content.data,
  })),
)(DefaultView);
