import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { setQueryParam, deleteQueryParam } from 'volto-datablocks/actions';
import _uniqueId from 'lodash/uniqueId';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import RenderTable from '../RenderTable';
import PermitingAuthority from '../PermitingAuthority';
import moment from 'moment';
import cx from 'classnames';
import { getDate, getLonLat } from '../helpers';
import infoSVG from '@plone/volto/icons/info.svg';
import './style.css';

const View = (props) => {
  const history = useHistory();
  const [aels, setAels] = useState(false);
  const {
    siteInspireId = null,
    installationInspireId = null,
    siteReportingYear = null,
  } = props.discodata_query.search;
  const {
    permits = {},
    bat_derogations = {},
    bat_conclusions = {},
  } = props.discodata_resources.data;

  const data_permits = permits[siteInspireId] || null;
  const data_bat_derogations = bat_derogations[siteInspireId] || null;
  const data_bat_conclusions = bat_conclusions[siteInspireId] || null;

  const permitingAuthority =
    siteReportingYear && data_permits?.euregReportingYears?.[siteReportingYear]
      ? data_permits.euregReportingYears[siteReportingYear]
          .filter(
            (report) =>
              report.EUregReportingYear === siteReportingYear &&
              report.installationInspireId === installationInspireId,
          )
          .map((report) => ({
            permitUpdated: getDate(report.permitUpdated),
            permitingAuthority: report.permitingAuthority,
            permitAvailable: report.permitAvailable,
            seveso: report.seveso,
            entityStatus: report.entityStatus,
          }))
      : [];
  const batDerogations =
    siteReportingYear &&
    data_bat_derogations?.euregReportingYears?.[siteReportingYear]
      ? data_bat_derogations.euregReportingYears[siteReportingYear].filter(
          (report) =>
            report.EUregReportingYear === siteReportingYear &&
            report.installationInspireId === installationInspireId,
        )
      : [];
  const batConclusions =
    siteReportingYear &&
    data_bat_conclusions?.euregReportingYears?.[siteReportingYear]
      ? data_bat_conclusions.euregReportingYears[siteReportingYear].filter(
          (report) =>
            report.EUregReportingYear === siteReportingYear &&
            report.installationInspireId === installationInspireId &&
            report.BATConclusionName,
        )
      : [];

  return props.mode === 'edit' ? (
    <p>Installation details</p>
  ) : (
    <div>
      {true ? (
        <div className="site-details">
          {/* OPERATING PERMIT */}
          <PermitingAuthority permitingAuthority={permitingAuthority} />
          {/* BAT CONCLUSION */}
          <div className={cx('header-tooltip', 'mb-1')}>
            <h3 className="blue">BAT conclusions</h3>
            <span className="floating-icon" data-tip={'This is a tooltip'}>
              <Icon
                className="firefox-icon"
                name={infoSVG}
                size="20"
                color="#D63D27"
              />
            </span>
          </div>
          {batConclusions.length || batDerogations.length ? (
            <div className="eprtrBatConclusions bat-container mb-1">
              {batConclusions.length
                ? batConclusions.map((conclusion, index) => (
                    <div key={`conclusion_${index}`} className="bat-conclusion">
                      <div className="mb-1">
                        <h3>{conclusion.BATConclusionName}</h3>
                      </div>
                      <div className="row mb-1">
                        <div className="detail xs-6 sm-6 md-6 lg-6">
                          <p className="bold mb-0">Status</p>
                          <p className="info">{conclusion.Status || '-'}</p>
                        </div>
                        <div className="detail xs-6 sm-6 md-6 lg-6">
                          <p className="bold mb-0">Status modified</p>
                          <p className="info">
                            {conclusion.StatusModifiedYear || '-'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                : ''}
              {((aels && batDerogations.length) || !batConclusions.length) && (
                <div className="bat-aels">
                  <div className="site-details">
                    <h3
                      className={cx(
                        'mb-1 dark',
                        batConclusions.length ? 'mt-2-super' : '',
                      )}
                    >
                      BAT AELs
                    </h3>
                  </div>
                  {batDerogations.map((ael, index) => (
                    <div className="bat-ael" key={`${index}_${ael.BATAELName}`}>
                      <div className="bat-title mb-1">
                        <h4>
                          <a
                            rel="noreferrer"
                            href={ael.PublicReason}
                            target="_blank"
                          >
                            {ael.BATAELName}
                          </a>
                        </h4>
                      </div>
                      <div className="row mb-1">
                        <div className="detail xs-6 sm-6 md-6 lg-6">
                          <p className="bold mb-0">Start date</p>
                          <p className="info">
                            {getDate(ael.StartDate) || '-'}
                          </p>
                        </div>
                        <div className="detail xs-6 sm-6 md-6 lg-6">
                          <p className="bold mb-0">End date</p>
                          <p className="info">{getDate(ael.EndDate)}</p>
                        </div>
                      </div>
                      <div className="row mb-1">
                        <div className="detail xs-12 sm-12 md-12 lg-12">
                          <p className="bold mb-0">Status</p>
                          <p className="info">{ael.Status || '-'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {batDerogations.length && batConclusions.length ? (
                <>
                  <div className="hr mt-3 mb-1" />
                  <div className="bat-action text-align-center">
                    <button
                      onClick={() => {
                        setAels(!aels);
                      }}
                    >
                      {aels ? 'Hide BAT AELs' : 'View BAT AELs'}
                    </button>
                  </div>
                </>
              ) : (
                ''
              )}
            </div>
          ) : (
            <p className="info mb-1-super">No data</p>
          )}

          <ReactTooltip />
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default compose(
  connect(
    (state, props) => ({
      query: state.router.location.search,
      discodata_query: state.discodata_query,
      discodata_resources: state.discodata_resources,
    }),
    {
      setQueryParam,
      deleteQueryParam,
    },
  ),
)(View);
