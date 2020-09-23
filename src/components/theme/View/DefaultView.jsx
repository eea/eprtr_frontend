/**
 * Document view component.
 * @module components/theme/View/DefaultView
 */

import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';

import { Container, Image } from 'semantic-ui-react';
import { map } from 'lodash';

import { blocks } from '~/config';

import {
  getBlocksFieldname,
  getBlocksLayoutFieldname,
  hasBlocksData,
  getBaseUrl,
} from '@plone/volto/helpers';

const messages = defineMessages({
  unknownBlock: {
    id: 'Unknown Block',
    defaultMessage: 'Unknown Block {block}',
  },
});

/**
 * Component to display the default view.
 * @function DefaultView
 * @param {Object} content Content object.
 * @returns {string} Markup of the component.
 */
const DefaultView = ({ content, contentType, intl, location }) => {
  const blocksFieldname = getBlocksFieldname(content);
  const blocksLayoutFieldname = getBlocksLayoutFieldname(content);
  const contentTypeBlocks =
    contentType.data?.properties?.[blocksFieldname]?.default;
  const contentTypeBlocksLayout =
    contentType.data?.properties?.[blocksLayoutFieldname]?.default;
  if (!contentType?.loaded) return '';
  return hasBlocksData(content) ? (
    <div id="page-document" className="ui container">
      {map(content[blocksLayoutFieldname].items, (block) => {
        const contentBlock =
          contentTypeBlocks?.[content[blocksFieldname]?.[block]?.['@layout']] &&
          !content[blocksFieldname]?.[block]?.grid_overwrite_layout
            ? contentTypeBlocks?.[
                content[blocksFieldname]?.[block]?.['@layout']
              ]
            : content[blocksFieldname]?.[block];
        const Block =
          blocks.blocksConfig[contentBlock?.['@type']]?.['view'] || null;
        return Block !== null ? (
          <Block
            key={block}
            id={block}
            properties={content}
            data={contentBlock}
            path={getBaseUrl(location?.pathname || '')}
          />
        ) : (
          <div key={block}>
            {intl.formatMessage(messages.unknownBlock, {
              block: contentBlock?.['@type'],
            })}
          </div>
        );
      })}
    </div>
  ) : (
    <Container id="page-document">
      <h1 className="documentFirstHeading">{content.title}</h1>
      {content.description && (
        <p className="documentDescription">{content.description}</p>
      )}
      {content.image && (
        <Image
          className="document-image"
          src={content.image.scales.thumb.download}
          floated="right"
        />
      )}
      {content.remoteUrl && (
        <span>
          The link address is:
          <a href={content.remoteUrl}>{content.remoteUrl}</a>
        </span>
      )}
      {content.text && (
        <div
          dangerouslySetInnerHTML={{
            __html: content.text.data,
          }}
        />
      )}
    </Container>
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
DefaultView.propTypes = {
  /**
   * Content of the object
   */
  content: PropTypes.shape({
    /**
     * Title of the object
     */
    title: PropTypes.string,
    /**
     * Description of the object
     */
    description: PropTypes.string,
    /**
     * Text of the object
     */
    text: PropTypes.shape({
      /**
       * Data of the text of the object
       */
      data: PropTypes.string,
    }),
  }).isRequired,
};

export default compose(
  connect(
    (state, props) => ({
      contentType: state.contentType,
    }),
    {},
  ),
)(injectIntl(DefaultView));
