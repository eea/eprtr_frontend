/**
 * Header component.
 * @module components/theme/Header/Header
 */

import React, { Component } from 'react';
import { Segment, Image, Grid } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Logo, Navigation } from '@plone/volto/components';

import eclogo from './ec.png';
import eealogo from './eea.png';

/**
 * Header component class.
 * @class Header
 * @extends Component
 */
class Header extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    token: PropTypes.string,
    pathname: PropTypes.string.isRequired,
  };

  /**
   * Default properties.
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    token: null,
  };

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    return (
      <Segment basic className="header-wrapper" role="banner">
        <div className="header-container ui container">
          <div className="header">
            <div className="logo-nav-wrapper">
              <div className="logo">
                <Logo />
              </div>
              <Navigation pathname={this.props.pathname} />
            </div>
            <div className="header-partner-section">
              <Image
                className="ec-logo"
                src={eclogo}
                alt="European Comission"
                title="European Comission"
                height={55}
                style={{ marginRight: '10px' }}
              />
              <Image
                className="eea-logo"
                src={eealogo}
                alt="EEA"
                title="EEA"
                height={55}
              />
            </div>
          </div>
        </div>
      </Segment>
    );
  }
}

export default connect((state) => ({
  token: state.userSession.token,
}))(Header);
