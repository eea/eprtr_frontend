/* REACT */
import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { isArray, isDate } from 'lodash';
import { Dropdown, Header } from 'semantic-ui-react';
import { setQueryParam } from 'volto-datablocks/actions';
import DiscodataSqlBuilder from 'volto-datablocks/DiscodataSqlBuilder/View';
import ReactTooltip from 'react-tooltip';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import moment from 'moment';
import infoSVG from '@plone/volto/icons/info.svg';
import cx from 'classnames';

// STATIC DATA
// ==============
const countryGroups = [
  {
    key: 'EEA32',
    value: 'EEA32',
    text: 'EEA32',
  },
  {
    key: 'EEA33',
    value: 'EEA33',
    text: 'EEA33',
  },
  {
    key: 'EU27',
    value: 'EU27',
    text: 'EU27',
  },
  {
    key: 'EU28',
    value: 'EU28',
    text: 'EU28',
  },
];
const pollutionType = [
  {
    key: 'Air',
    value: 'Air',
    text: 'Air',
  },
  {
    key: 'Water',
    value: 'Water',
    text: 'Water',
  },
  {
    key: 'Air,Water',
    value: 'Air,Water',
    text: 'Air & Water',
  },
];
const airPollutants = [
  {
    key: 'Carbon dioxide (CO2)',
    value: 'Carbon dioxide (CO2)',
    text: 'Carbon dioxide (CO2)',
  },
  {
    key: 'Heavy metals (Cd, Hg, Pb)',
    value: 'Heavy metals (Cd, Hg, Pb)',
    text: 'Heavy metals (Cd, Hg, Pb)',
  },
  {
    key: 'Nitrogen oxides (NOX)',
    value: 'Nitrogen oxides (NOX)',
    text: 'Nitrogen oxides (NOX)',
  },
  {
    key: 'Particulate matter (PM10)',
    value: 'Particulate matter (PM10)',
    text: 'Particulate matter (PM10)',
  },
  {
    key: 'Sulphur oxides (SOX)',
    value: 'Sulphur oxides (SOX)',
    text: 'Sulphur oxides (SOX)',
  },
];
const waterPollutants = [
  {
    key: 'Heavy metals (Cd, Hg, Ni, Pb)',
    value: 'Heavy metals (Cd, Hg, Ni, Pb)',
    text: 'Heavy metals (Cd, Hg, Ni, Pb)',
  },
  {
    key: 'Total nitrogen',
    value: 'Total nitrogen',
    text: 'Total nitrogen',
  },
  {
    key: 'Total organic carbon(as total C or COD/3) (TOC)',
    value: 'Total organic carbon(as total C or COD/3) (TOC)',
    text: 'Total organic carbon(as total C or COD/3) (TOC)',
  },
  {
    key: 'Total phosphorus',
    value: 'Total phosphorus',
    text: 'Total phosphorus',
  },
];

const pollutants = {
  Air: airPollutants,
  Water: waterPollutants,
  'Air,Water': [...airPollutants, ...waterPollutants],
};
// ==============

const optionExists = (value, options) => {
  return options.filter((option) => option.value === value).length > 0;
};

const getDate = (field) => {
  if (!field) return '-';
  if (Date.parse(field) > 0) {
    return moment(field).format('DD MMM YYYY');
  }
};

const components = {
  eprtrReportingYears: (
    options,
    queryParameters,
    packages,
    search,
    setQueryParam,
    placeholder,
    className,
    mode,
  ) => {
    let activeValue = '';
    if (queryParameters[0]?.queryParameterToSet) {
      activeValue = search[queryParameters[0].queryParameterToSet] || '';
    }
    return (
      <div
        className={cx(
          'eprtrReportingYears custom-selector white pa-1 pl-3-super pr-3-super',
          className,
        )}
      >
        <div>
          <span className="floating-icon" data-tip={'Something'}>
            <Icon
              className="firefox-icon"
              name={infoSVG}
              size="20"
              color="#fff"
            />
          </span>
          <p className="lighter">Last report was submitted on:</p>
          <p className="bold">{getDate(packages[0])}</p>
        </div>
        {/* <div>
          <p className="bold">Reporting year</p>
          <Dropdown
            selection
            onChange={(event, data) => {
              const queryParametersToSet = {};
              queryParameters.forEach((queryParam) => {
                queryParametersToSet[
                  queryParam.queryParameterToSet
                ] = data.options.filter((opt) => {
                  return opt.value === data.value;
                })[0]?.[queryParam.selectorOptionKey];
              });
              setQueryParam({
                queryParam: {
                  ...(queryParametersToSet || {}),
                },
              });
            }}
            placeholder={placeholder}
            options={options}
            value={activeValue}
          />
        </div> */}
        {/* <div>
          <p className="bold">Publish date</p>
          <p className="lighter">{getDate(packages[1])}</p>
        </div> */}
      </div>
    );
  },
  eprtrCountryGroupSelector: (
    options,
    queryParameters,
    packages,
    search,
    setQueryParam,
    placeholder,
    className,
    mode,
  ) => {
    const initialQueryParameters = {};

    if (!search.analysisCountryGroupId && countryGroups?.[0]?.key) {
      initialQueryParameters.analysisCountryGroupId = countryGroups[0].key;
    }
    if (!search.analysisPollutantType && countryGroups?.[0]?.key) {
      initialQueryParameters.analysisPollutantType = 'Air';
    }
    if (Object.keys(initialQueryParameters).length > 0) {
      setQueryParam({
        queryParam: {
          ...initialQueryParameters,
        },
      });
    }
    return (
      <div className="custom-selector big red">
        <Header as="h1">Industrial pollution in</Header>
        <div className="selector-container display-flex flex-flow-row">
          {countryGroups?.length && (
            <Dropdown
              selection
              onChange={(event, data) => {
                setQueryParam({
                  queryParam: {
                    analysisCountryGroupId: data.options.filter((opt) => {
                      return opt.value === data.value;
                    })[0]?.key,
                  },
                });
              }}
              placeholder={'Country group'}
              options={countryGroups}
              value={search.analysisCountryGroupId}
            />
          )}
          {pollutionType && (
            <Dropdown
              selection
              onChange={(event, data) => {
                setQueryParam({
                  queryParam: {
                    analysisPollutantType: data.options.filter((opt) => {
                      return opt.value === data.value;
                    })[0]?.key,
                  },
                });
              }}
              placeholder={'Pollution by'}
              options={pollutionType}
              value={search.analysisPollutantType}
            />
          )}
          {search.analysisPollutantType && (
            <Dropdown
              selection
              onChange={(event, data) => {
                setQueryParam({
                  queryParam: {
                    analysisPollutant: data.options.filter((opt) => {
                      return opt.value === data.value;
                    })[0]?.key,
                  },
                });
              }}
              placeholder={'Select pollutant'}
              options={pollutants[search.analysisPollutantType]}
              value={
                optionExists(
                  search.analysisPollutant,
                  pollutants[search.analysisPollutantType],
                )
                  ? search.analysisPollutant
                  : null
              }
            />
          )}
        </div>
      </div>
    );
  },
  eprtrCountrySelector: (
    options,
    queryParameters,
    packages,
    search,
    setQueryParam,
    placeholder,
    className,
    mode,
    discodata_resources,
  ) => {
    const countries = discodata_resources.analysis_countries;
    const initialQueryParameters = {};

    if (!search.analysisCountryCode && countries?.[0]?.key) {
      initialQueryParameters.analysisCountryCode = countries[0].key;
      initialQueryParameters.analysisCountryName = countries[0].value;
    }
    if (!search.analysisPollutantType && countries?.[0]?.key) {
      initialQueryParameters.analysisPollutantType = 'Air';
    }
    if (Object.keys(initialQueryParameters).length > 0) {
      setQueryParam({
        queryParam: {
          ...initialQueryParameters,
        },
      });
    }
    return (
      <div className="custom-selector big red">
        <DiscodataSqlBuilder
          data={{
            '@type': 'discodata_sql_builder',
            sql: {
              value:
                '{"fieldsets":[{"id":"sql_metadata","title":"SQL","fields":["analysis_countries"]}],"properties":{"analysis_countries":{"title":"Analysis countries","isCollection":true,"hasPagination":true,"urlQuery":true,"sql":"SELECT DISTINCT PQPC.CountryCode as [key], LC.[CountryName] as [value], LC.[CountryName] as [text]\\nFROM [IED].[latest].[PollutantQuantityPerCapita] as PQPC\\nLEFT JOIN [IED].[latest].[LOV_Countries] as LC\\nON PQPC.[CountryCode] = LC.[CountryCode]\\nWHERE reportingYear IN (\'2018\')"}},"required":[]}',
            },
          }}
        />
        <Header as="h1">Industrial pollution in</Header>
        <div className="selector-container display-flex flex-flow-row">
          {countryGroups?.length && (
            <Dropdown
              selection
              onChange={(event, data) => {
                setQueryParam({
                  queryParam: {
                    analysisCountryCode: data.options.filter((opt) => {
                      return opt.value === data.value;
                    })[0]?.key,
                    analysisCountryName: data.options.filter((opt) => {
                      return opt.value === data.value;
                    })[0]?.value,
                  },
                });
              }}
              placeholder={'Country'}
              options={countries}
              value={search.analysisCountryName}
            />
          )}
          {pollutionType && (
            <Dropdown
              selection
              onChange={(event, data) => {
                setQueryParam({
                  queryParam: {
                    analysisPollutantType: data.options.filter((opt) => {
                      return opt.value === data.value;
                    })[0]?.key,
                  },
                });
              }}
              placeholder={'Pollution by'}
              options={pollutionType}
              value={search.analysisPollutantType}
            />
          )}
          {search.analysisPollutantType && (
            <Dropdown
              selection
              onChange={(event, data) => {
                setQueryParam({
                  queryParam: {
                    analysisPollutant: data.options.filter((opt) => {
                      return opt.value === data.value;
                    })[0]?.key,
                  },
                });
              }}
              placeholder={'Select pollutant'}
              options={pollutants[search.analysisPollutantType]}
              value={
                optionExists(
                  search.analysisPollutant,
                  pollutants[search.analysisPollutantType],
                )
                  ? search.analysisPollutant
                  : null
              }
            />
          )}
        </div>
      </div>
    );
  },
};

const View = ({ content, ...props }) => {
  const [packages, setPackages] = useState([]);
  const [discodataValues, setDiscodataValues] = useState([]);
  const [mounted, setMounted] = useState(false);
  const { data } = props;
  const { resources = [], subResources = [] } = data;
  const { placeholder = 'Select', className = '' } = data;
  const { key = '', value = '', text = '', queryParametersToSet = [] } = data;

  const options = discodataValues
    .filter((discodata) => discodata[value])
    .map((discodata, index) => ({
      key: discodata[key] || index,
      value: discodata[value] || index,
      text: discodata[text] || index,
    }));

  const updateDiscodataValues = (mounted) => {
    if (props.discodata_resources && props.search && mounted) {
      let newDiscodataValues = [];
      resources.forEach((resource) => {
        if (isArray(props.discodata_resources[resource.package])) {
          newDiscodataValues = [
            ...newDiscodataValues,
            ...(props.discodata_resources[resource.package] || []),
          ];
        }
      });
      const selectedSubResources = subResources.map((subResource) => {
        const keyValue = subResource.package?.split('@') || [null, null];
        return {
          package: keyValue[0],
          query: keyValue[1],
        };
      });
      selectedSubResources.forEach((subResource) => {
        const discodataPackage = resources.filter(
          (resource) => resource.package === subResource.package,
        )[0];
        if (
          props.search[discodataPackage.queryParameter] &&
          isArray(
            props.discodata_resources[discodataPackage.package]?.[
              props.search[discodataPackage.queryParameter]
            ]?.[subResource.query],
          )
        ) {
          newDiscodataValues = [
            ...newDiscodataValues,
            ...(props.discodata_resources[discodataPackage.package]?.[
              props.search[discodataPackage.queryParameter]
            ][subResource.query] || []),
          ];
        }
      });
      setDiscodataValues(newDiscodataValues);
    }
  };

  const updatePackages = (mounted) => {
    if (props.discodata_resources && props.search && mounted) {
      let newDiscodataValues = [];
      const selectedSubResources = subResources.map((subResource) => {
        const keyValue = subResource.package?.split('@') || [null, null];
        return {
          package: keyValue[0],
          query: keyValue[1],
        };
      });
      selectedSubResources.forEach((subResource) => {
        const discodataPackage = resources.filter(
          (resource) => resource.package === subResource.package,
        )[0];
        if (props.search[discodataPackage.queryParameter]) {
          newDiscodataValues.push(
            props.discodata_resources[discodataPackage.package]?.[
              props.search[discodataPackage.queryParameter]
            ]?.[subResource.query],
          );
        }
      });
      setPackages(newDiscodataValues);
    }
  };

  useEffect(() => {
    setMounted(true);
    updatePackages(true);
    if (props.mode !== 'edit') {
      updateDiscodataValues(true);
    } else {
      setDiscodataValues(props.discodataValues);
    }
    /* eslint-disable-next-line */
  }, []);

  useEffect(() => {
    updatePackages(mounted);
    if (props.mode !== 'edit') {
      updateDiscodataValues(mounted);
    } else {
      setDiscodataValues(props.discodataValues);
    }
    /* eslint-disable-next-line */
  }, [props.search, props.discodata_resources, props.discodataValues])


  return (
    <>
      {components[props.data.component] ? (
        components[props.data.component](
          options,
          queryParametersToSet,
          packages,
          props.search,
          props.setQueryParam,
          placeholder,
          className,
          props.mode,
          props.discodata_resources,
        )
      ) : props.mode === 'edit' ? (
        <p>Component not selected</p>
      ) : (
        ''
      )}
      <ReactTooltip />
    </>
  );
};

export default compose(
  connect(
    (state, props) => ({
      query: state.router.location.search,
      search: state.discodata_query.search,
      discodata_resources: state.discodata_resources.data,
    }),
    { setQueryParam },
  ),
)(View);
