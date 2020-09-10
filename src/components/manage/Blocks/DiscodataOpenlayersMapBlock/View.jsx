/* REACT */
import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Portal } from 'react-portal';
// HELPERS
import qs from 'query-string';
import axios from 'axios';
import jsonp from 'jsonp';
import { settings } from '~/config';
import { isArray, isObject } from 'lodash';
// VOLTO
import { Icon as VoltoIcon } from '@plone/volto/components';
// VOLTO-DATABLOCKS
import { setQueryParam } from 'volto-datablocks/actions';
// SEMANTIC REACT UI
import { Grid, Header, Loader, Dimmer } from 'semantic-ui-react';
// SVGs
import clearSVG from '@plone/volto/icons/clear.svg';
import navigationSVG from '@plone/volto/icons/navigation.svg';
// STYLES
import 'ol/ol.css';
import './style.css';

const splitBy = (arr, delimiter) => {
  if (Array.isArray(arr)) {
    return (
      arr
        .filter((value) => value)
        .map((value) => `'${value}'`)
        .join(delimiter) || ''
    );
  }
  return '';
};

let Map,
  View,
  Overlay,
  EsriJSON,
  VectorSource,
  VectorSourceEvent,
  XYZ,
  fromLonLat,
  toLonLat,
  toStringHDMS,
  createXYZ,
  CircleStyle,
  Fill,
  Stroke,
  Style,
  TileLayer,
  VectorLayer,
  Group,
  tile,
  Control,
  defaultsControls,
  defaultsInteractions,
  DragRotateAndZoom;
let OL_LOADED = false;
const initialExtent = [
  -10686671.0000035,
  -2430148.00000588,
  6199975.99999531,
  10421410.9999871,
];
let renderExtent = [];
const OpenlayersMapView = (props) => {
  const stateRef = useRef({
    map: {
      element: null,
      sitesSourceQuery: { whereStatements: {}, where: '' },
      oldSitesSourceQuery: { whereStatements: {}, where: '' },
      sitesSourceLayer: null,
    },
    popup: { element: null, properties: {} },
    popupDetails: { element: null, properties: {} },
    locationTerm: null,
    updateMapPosition: null,
  });
  const [state, setState] = useState({
    map: {
      element: null,
      sitesSourceQuery: { whereStatements: {}, where: '' },
      oldSitesSourceQuery: { whereStatements: {}, where: '' },
      sitesSourceLayer: null,
    },
    popup: { element: null, properties: {} },
    popupDetails: { element: null, properties: {} },
    locationTerm: null,
    updateMapPosition: null,
  });
  const [loader, setLoader] = useState(false);
  const [mapRendered, setMapRendered] = useState(false);
  const [firstFilteringUpdate, setFirstFilteringUpdate] = useState(false);
  const ToggleSidebarControl = useRef(null);
  const ViewYourAreaControl = useRef(null);
  const history = useHistory();
  const draggable = !!props.data?.draggable?.value;
  const hasPopups = !!props.data?.hasPopups?.value;
  const hasSidebar = !!props.data?.hasSidebar?.value;
  const hasRegionsFeatures = !!props.data?.hasRegionsFeatures?.value;
  const filterSource = props.data?.filterSource?.value || 'query_params';
  const zoomSwitch = 6;
  const currentMapZoom = state.map?.element
    ? state.map.element.getView().getZoom()
    : null;
  let queryParams;
  if (filterSource === 'query_params') {
    try {
      queryParams = JSON.parse(props.data?.query?.value)?.properties;
      Object.entries(queryParams).forEach(([key, value]) => {
        queryParams[key].sql = `(${value.param} LIKE '%:options%')`;
        queryParams[key].type = 'string';
      });
    } catch {
      queryParams = {};
    }
  }

  const searchQueryParams = isObject(queryParams)
    ? Object.entries(queryParams).map(([key, value]) => {
        return props.discodata_query.search[value.param] || null;
      })
    : [];

  if (mapRendered && !firstFilteringUpdate) {
    updateFilters();
    setFirstFilteringUpdate(true);
  }

  useEffect(() => {
    if (__CLIENT__ && document) {
      // MOuNT
      if (!OL_LOADED) {
        Map = require('ol/Map').default;
        View = require('ol/View').default;
        Overlay = require('ol/Overlay').default;
        EsriJSON = require('ol/format/EsriJSON').default;
        VectorSource = require('ol/source/Vector').default;
        VectorSourceEvent = require('ol/source/Vector').VectorSourceEvent;
        XYZ = require('ol/source/XYZ').default;
        fromLonLat = require('ol/proj').fromLonLat;
        toLonLat = require('ol/proj').toLonLat;
        toStringHDMS = require('ol/coordinate').toStringHDMS;
        createXYZ = require('ol/tilegrid').createXYZ;
        CircleStyle = require('ol/style/Circle.js').default;
        Fill = require('ol/style/Fill.js').default;
        Stroke = require('ol/style/Stroke.js').default;
        Style = require('ol/style/Style.js').default;
        TileLayer = require('ol/layer/Tile.js').default;
        VectorLayer = require('ol/layer/Vector.js').default;
        Group = require('ol/layer/Group.js').default;
        tile = require('ol/loadingstrategy').tile;
        Control = require('ol/control/Control.js').default;
        defaultsControls = require('ol/control.js').defaults;
        defaultsInteractions = require('ol/interaction.js').defaults;
        DragRotateAndZoom = require('ol/interaction.js').DragRotateAndZoom;
        OL_LOADED = true;
      }
      if (OL_LOADED && !ToggleSidebarControl.current && hasSidebar) {
        ToggleSidebarControl.current = /*@__PURE__*/ (function (Control) {
          function ToggleSidebarControl(opt_options) {
            const options = opt_options || {};
            const buttonContainer = document.createElement('div');
            buttonContainer.setAttribute('id', 'map-sidebar-button');
            buttonContainer.setAttribute('class', 'ol-unselectable ol-control');
            Control.call(this, {
              element: buttonContainer,
              target: options.target,
            });
          }
          if (Control) ToggleSidebarControl.__proto__ = Control;
          ToggleSidebarControl.prototype = Object.create(
            Control && Control.prototype,
          );
          ToggleSidebarControl.prototype.constructor = ToggleSidebarControl;

          return ToggleSidebarControl;
        })(Control);
      }

      if (OL_LOADED && !ViewYourAreaControl.current) {
        ViewYourAreaControl.current = /*@__PURE__*/ (function (Control) {
          function ViewYourAreaControl(opt_options) {
            const options = opt_options || {};
            const buttonContainer = document.createElement('div');
            buttonContainer.setAttribute('id', 'map-view-your-area-button');
            buttonContainer.setAttribute('class', 'ol-unselectable ol-control');
            Control.call(this, {
              element: buttonContainer,
              target: options.target,
            });
          }
          if (Control) ViewYourAreaControl.__proto__ = Control;
          ViewYourAreaControl.prototype = Object.create(
            Control && Control.prototype,
          );
          ViewYourAreaControl.prototype.constructor = ViewYourAreaControl;

          return ViewYourAreaControl;
        })(Control);
      }
      renderMap();
      setMapRendered(true);
    }
    return () => {
      // UNMOUNT
    };
    /* eslint-disable-next-line */
  }, [])

  useEffect(() => {
    if (mapRendered) {
      updateFilters();
    }
    /* eslint-disable-next-line */
  }, [
    JSON.stringify(props.discodata_query.search.siteTerm),
    JSON.stringify(props.discodata_query.search.locationTerm),
    JSON.stringify(props.discodata_query.search.EEASubSector),
    JSON.stringify(props.discodata_query.search.siteCountry),
    JSON.stringify(props.discodata_query.search.region),
    JSON.stringify(props.discodata_query.search.riverBasin),
    JSON.stringify(props.discodata_query.search.townVillage),
    JSON.stringify(props.discodata_query.search.pollutantGroup),
    JSON.stringify(props.discodata_query.search.pollutant),
    JSON.stringify(props.discodata_query.search.reportingYear),
    JSON.stringify(props.discodata_query.search.batConclusionCode),
    JSON.stringify(props.discodata_query.search.batConclustionYear),
    JSON.stringify(props.discodata_query.search.permitType),
    JSON.stringify(props.discodata_query.search.permitYear),
    JSON.stringify(searchQueryParams),
  ]);

  useEffect(() => {
    stateRef.current = { ...state };
    /* eslint-disable-next-line */
  }, [state])

  useEffect(() => {
    if (mapRendered) {
      if (state.updateMapPosition === 'byLocationTermNoRefresh') {
        const options = {
          duration: 2000,
          maxZoom: 15,
        };
        getLocation(options, true);
        setState({
          ...state,
          updateMapPosition: null,
        });
      } else {
        state.map.sitesSourceLayer &&
          state.map.sitesSourceLayer.getSource().refresh();
      }
    }
    /* eslint-disable-next-line */
  }, [state.map.sitesSourceQuery?.where, state.locationTerm?.text])

  function updateFilters() {
    const sitesSourceQuery = { ...state.map.sitesSourceQuery };
    const locationTerm = props.discodata_query.search.locationTerm || null;
    if (hasSidebar && filterSource === 'eprtr_filters') {
      sitesSourceQuery.whereStatements = {
        ...sitesSourceQuery.whereStatements,
        siteTerm: {
          sql: `(siteName LIKE ':options%')`,
          type: 'string',
        },
        // Industries
        EEASubSector: {
          sql: `(eea_activities LIKE '%:options%')`,
          type: 'multiple',
        },
        // Country / Region / Town
        nuts_latest: {
          sql: `(nuts_regions LIKE '%:options%')`,
          type: 'multiple',
        },
        // River basin district
        riverBasin: {
          sql: `(rbds LIKE '%:options%')`,
          type: 'multiple',
        },
        // Pollutants grouops
        pollutantGroup: {
          sql: `((air_groups LIKE '%:options%') OR (water_groups LIKE '%:options%'))`,
          type: 'multiple',
        },
        // Pollutants
        pollutant: {
          sql: `(pollutants LIKE '%:options%')`,
          type: 'multiple',
        },
        // Reporting year
        reportingYear: {
          sql: `(Site_reporting_year IN (:options))`,
        },
        // BAT conclusion
        batConclusionCode: {
          sql: `(bat_conclusions LIKE '%:options%')`,
          type: 'multiple',
        },
        // BAT conclusion year
        batConclustionYear: {
          sql: `(bat_conclusion_years LIKE '%:options%')`,
          type: 'multiple',
        },
        // Permit type
        permitType: {
          sql: `(permit_types LIKE '%:options%')`,
          type: 'multiple',
        },
        // Permit year
        permitYear: {
          sql: `(permit_years LIKE '%:options%')`,
          type: 'multiple',
        },
      };
    } else if (filterSource === 'query_params') {
      sitesSourceQuery.whereStatements = {
        ...sitesSourceQuery.whereStatements,
        ...queryParams,
      };
    }

    Object.entries(sitesSourceQuery.whereStatements).forEach(([id, where]) => {
      let options;
      if (['string', 'multiple'].includes(where.type)) {
        options = props.discodata_query.search[id];
      } else if (!props.discodata_query.search[id]) {
        options = null;
      } else {
        options = splitBy(props.discodata_query.search[id], ',');
      }
      if (where.type === 'multiple') {
        options = isArray(options) ? options?.filter((option) => option) : [];
        const conditions = [];
        if (options?.length) {
          options.forEach((option) => {
            let baseSql = where.sql;
            option && conditions.push(baseSql.replace(/:options/g, option));
          });
          where.sql = `(${conditions.join(' OR ')})`;
        } else {
          where.sql = null;
        }
      } else {
        where.sql = options ? where.sql.replace(/:options/g, options) : null;
      }
      if (!where.sql) delete sitesSourceQuery.whereStatements[id];
    });

    sitesSourceQuery.where = Object.entries(sitesSourceQuery.whereStatements)
      .map(([id, where]) => where.sql)
      .join(' AND ');

    if (
      sitesSourceQuery.where !== state.map.sitesSourceQuery.where ||
      locationTerm?.text !== state.locationTerm?.text
    ) {
      let updateMapPosition = null;
      if (
        sitesSourceQuery.whereStatements.siteId?.sql ||
        sitesSourceQuery.whereStatements.siteTerm?.sql ||
        sitesSourceQuery.whereStatements.siteName?.sql
      ) {
        updateMapPosition = 'bySiteTerm';
      } else if (locationTerm?.text) {
        updateMapPosition = 'byLocationTerm';
      } else if (
        sitesSourceQuery.whereStatements.siteCountry?.sql ||
        sitesSourceQuery.whereStatements.region?.sql
      ) {
        updateMapPosition = 'byRegion';
      }
      // setLoader(true);
      if (sitesSourceQuery.where !== state.map.sitesSourceQuery.where) {
        setState({
          ...state,
          map: {
            ...state.map,
            sitesSourceQuery,
          },
          updateMapPosition,
          locationTerm,
        });
      } else if (locationTerm?.text !== state.locationTerm?.text) {
        setState({
          ...state,
          updateMapPosition: 'byLocationTermNoRefresh',
          locationTerm,
        });
      }
    }
  }

  function makeMap() {
    if (document.getElementById('map')) {
      document.getElementById('map').innerHTML = '';
      const map = new Map({
        controls: draggable
          ? hasSidebar
            ? defaultsControls().extend([
                new ToggleSidebarControl.current(),
                new ViewYourAreaControl.current(),
              ])
            : defaultsControls().extend([new ViewYourAreaControl.current()])
          : [],
        interactions: draggable
          ? defaultsInteractions().extend([new DragRotateAndZoom()])
          : [],
        target: document.getElementById('map'),
        view: new View({
          center: fromLonLat([20, 50]),
          zoom: 4.5,
        }),
      });
      return map;
    }
    return false;
  }

  function makeTileLayer(url, visible, title) {
    const layer = new TileLayer({
      source: new XYZ({
        url,
      }),
      visible,
      title,
    });
    return layer;
  }

  function makeOverlay(element, className, positioning, stopEvent) {
    if (element) {
      return new Overlay({
        element,
        className,
        positioning,
        stopEvent,
      });
    }
    return false;
  }

  function getLocation(options, noRefresh = false) {
    axios
      .get(
        encodeURI(
          'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=' +
            stateRef.current.locationTerm?.text +
            '&f=json&outSR={"wkid":102100,"latestWkid":3857}&outFields=Match_addr,Addr_type,StAddr,City&magicKey=' +
            stateRef.current.locationTerm?.magicKey +
            '&maxLocations=6',
        ),
      )
      .then((response) => {
        const data = JSON.parse(response.request.response) || {};
        if (data.error) {
          // setLoader(false);
        } else if (data.candidates?.length > 0) {
          stateRef.current.map.element
            .getView()
            .fit(
              [
                data.candidates[0].extent.xmin,
                data.candidates[0].extent.ymin,
                data.candidates[0].extent.xmax,
                data.candidates[0].extent.ymax,
              ],
              {
                ...options,
                callback: function () {
                  if (noRefresh) {
                    // setLoader(false);
                    stateRef.current.map.sitesSourceLayer &&
                      stateRef.current.map.sitesSourceLayer
                        .getSource()
                        .refresh();
                  }
                },
              },
            );
        }
      })
      .catch((error) => {});
  }

  function onSourceChange(source) {
    const options = {
      duration: 2000,
      maxZoom: 15,
    };
    const extent = source.getExtent().map((coordinate, index) => {
      if (coordinate === Infinity || coordinate === -Infinity) {
        return initialExtent[index];
      }
      return coordinate;
    });
    if (stateRef.current.updateMapPosition === 'bySiteTerm' && extent) {
      stateRef.current.map.element.getView().fit(extent, options);
    }
    if (
      stateRef.current.updateMapPosition === 'byLocationTerm' &&
      stateRef.current.locationTerm?.text &&
      stateRef.current.locationTerm?.magicKey &&
      extent
    ) {
      getLocation(options);
    }
    if (stateRef.current.updateMapPosition === 'byRegion' && extent) {
      stateRef.current.map.element.getView().fit(extent);
    }
    //  UPDATE OLD FILTERS
    if (
      stateRef.current.map.sitesSourceQuery.where !==
        stateRef.current.map.oldSitesSourceQuery.where ||
      stateRef.current.updateMapPosition !== null
    ) {
      setState({
        ...stateRef.current,
        map: {
          ...stateRef.current.map,
          oldSitesSourceQuery: {
            ...stateRef.current.map.sitesSourceQuery,
          },
        },
        updateMapPosition: null,
      });
    }
  }

  function centerPosition(map, position, zoom) {
    map.getView().animate({
      center: fromLonLat([position.coords.longitude, position.coords.latitude]),
      duration: 1000,
      zoom,
    });
  }

  function setFeatureInfo(map, pixel, coordinate, detailed) {
    let features = [];
    map.forEachFeatureAtPixel(pixel, function (feature) {
      features.push(feature);
    });
    if (features.length) {
      let hdms = toStringHDMS(
        toLonLat(features[0].getGeometry().flatCoordinates),
      );
      const featuresProperties = features[0].getProperties();
      if (
        detailed &&
        JSON.stringify(stateRef.current.popupDetails.properties) !==
          JSON.stringify(featuresProperties)
      ) {
        // axios.get()
        setState({
          ...stateRef.current,
          popupDetails: {
            ...stateRef.current.popupDetails,
            properties: { ...featuresProperties, hdms },
          },
        });
      } else if (
        !detailed &&
        JSON.stringify(stateRef.current.popup.properties) !==
          JSON.stringify(featuresProperties)
      ) {
        setState({
          ...stateRef.current,
          popup: {
            ...stateRef.current.popup,
            properties: { ...featuresProperties, hdms },
          },
        });
      }
      return true;
    }
    return false;
  }

  function displayPopup(map, pixel, coordinate, popup, detailed = false) {
    if (setFeatureInfo(map, pixel, coordinate, detailed)) {
      map.getTarget().style.cursor = 'pointer';
      popup.element.classList.add('show');
      popup.setPosition(coordinate);
    } else {
      map.getTarget().style.cursor = '';
      if (!detailed) {
        popup.element.classList.remove('show');
        popup.setPosition(undefined);
      }
    }
  }

  function renderMap() {
    //  MAP
    const map = makeMap();
    //  Layers
    let worldLightGrayBase, worldHillshade;
    //  Overlayers
    let popup, popupDetails, dynamicFilters;
    //  Features Formater
    let esrijsonFormat = new EsriJSON();
    //  Vector Layers
    let sitesSourceLayer, regionsSourceLayer;
    //  Vector Sources
    let sitesSource, regionsSource;
    //  Global variables
    let currentZoom;
    if (map) {
      /* ======== TILE LAYERS ======== */
      //  Make TileLayers
      worldLightGrayBase = makeTileLayer(
        'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        true,
        'World_Light_Gray_Base',
      );
      worldHillshade = makeTileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}',
        false,
        'World_Hillshade',
      );
      /* ======== OVERLAYS ======== */
      //  Make popups overlays
      if (hasPopups) {
        popup = makeOverlay(
          document.getElementById('popup'),
          'ol-overlay-container ol-popup',
          'center-center',
          true,
        );
        popupDetails = makeOverlay(
          document.getElementById('popup-details'),
          'ol-overlay-container ol-popup-details',
          'center-center',
          true,
        );
      }
      //  Make dynamic filters overlay
      if (hasSidebar) {
        const sideBar = document.createElement('div');
        sideBar.setAttribute('id', 'map-sidebar');
        dynamicFilters = makeOverlay(
          sideBar,
          'ol-dynamic-filter',
          'center-center',
          true,
        );
      }
      /* ======== SOURCES ======== */
      //  Make sites source
      let reqs = 0;
      sitesSource = new VectorSource({
        loader: function (extent, resolution, projection) {
          const updateMapPosition =
            !!stateRef.current.updateMapPosition &&
            !['byLocationTerm', 'byLocationTermNoRefresh'].includes(
              stateRef.current.updateMapPosition,
            );
          var url =
            'https://services.arcgis.com/LcQjj2sL7Txk9Lag/arcgis/rest/services/SiteMap_v2/FeatureServer/0/query/?f=json&' +
            'returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=' +
            encodeURIComponent(
              '{"xmin":' +
                (updateMapPosition ? initialExtent[0] : extent[0]) +
                ',"ymin":' +
                (updateMapPosition ? initialExtent[1] : extent[1]) +
                ',"xmax":' +
                (updateMapPosition ? initialExtent[2] : extent[2]) +
                ',"ymax":' +
                (updateMapPosition ? initialExtent[3] : extent[3]) +
                ',"spatialReference":{"wkid":102100}}',
            ) +
            '&geometryType=esriGeometryEnvelope&inSR=102100&outFields=*' +
            '&outSR=102100';
          // setLoader(true);
          reqs++;
          jsonp(
            url,
            {
              param:
                (stateRef.current.map.sitesSourceQuery.where
                  ? qs.stringify({
                      where: stateRef.current.map.sitesSourceQuery.where,
                    })
                  : '') + '&callback',
            },
            (error, response) => {
              reqs--;
              if (error) {
                // setLoader(false);
                console.log(error.message);
              } else {
                var features = esrijsonFormat.readFeatures(response, {
                  featureProjection: projection,
                });
                if (features.length > 0) {
                  sitesSource.addFeatures(features);
                  sitesSource.dispatchEvent(
                    new VectorSourceEvent('updateFilters', features),
                  );
                } else {
                  // setLoader(false);
                }
              }
            },
          );
        },
        strategy: tile(
          createXYZ({
            tileSize: 512,
          }),
        ),
      });
      //  Make regions source layer
      if (hasRegionsFeatures) {
        regionsSource = new VectorSource({
          loader: function (extent, resolution, projection) {
            var url =
              'https://services.arcgis.com/LcQjj2sL7Txk9Lag/ArcGIS/rest/services/ly_IED_SiteClusters_WM/FeatureServer/0/query/?f=json' +
              '&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=' +
              encodeURIComponent(
                '{"xmin":' +
                  extent[0] +
                  ',"ymin":' +
                  extent[1] +
                  ',"xmax":' +
                  extent[2] +
                  ',"ymax":' +
                  extent[3] +
                  ',"spatialReference":{"wkid":102100}}',
              ) +
              '&geometryType=esriGeometryEnvelope&inSR=102100&outFields=*' +
              '&outSR=102100';
            jsonp(url, null, (error, response) => {
              if (error) {
                console.log(error.message);
              } else {
                var features = esrijsonFormat.readFeatures(response, {
                  featureProjection: projection,
                });
                if (features.length > 0) {
                  regionsSource.addFeatures(features);
                }
              }
            });
          },
          strategy: tile(
            createXYZ({
              tileSize: 512,
            }),
          ),
        });
      }
      /* ======== SOURCE LAYERS ======== */
      //  Sites source layer
      sitesSourceLayer = new VectorLayer({
        source: sitesSource,
        style: new Style({
          image: new CircleStyle({
            radius: 3,
            fill: new Fill({ color: '#000' }),
            stroke: new Stroke({ color: '#6A6A6A', width: 1 }),
          }),
        }),
        visible: true,
        title: 'ly_IED_SiteMap_WM',
      });
      //  Regions source layer
      if (hasRegionsFeatures) {
        regionsSourceLayer = new VectorLayer({
          source: regionsSource,
          style: new Style({
            image: new CircleStyle({
              radius: 3,
              fill: new Fill({ color: '#4296B2' }),
              stroke: new Stroke({ color: '#6A6A6A', width: 1 }),
            }),
          }),
          visible: true,
          title: 'ly_IED_SiteClusters_WM',
        });
      }
      /* ======== APPEND TO THE MAP ======== */
      //  Append TileLayers to the map
      map.addLayer(
        new Group({
          layers: [worldLightGrayBase, worldHillshade],
        }),
      );
      popupDetails && map.addOverlay(popupDetails);
      //  Append dynamic filters to the map
      dynamicFilters && map.addOverlay(dynamicFilters);
      dynamicFilters && dynamicFilters.setPosition([0, 0]);
      //  Append popups to the map
      popup && map.addOverlay(popup);
      //  Append source layers to the map
      map.addLayer(
        new Group({
          layers: hasRegionsFeatures
            ? [sitesSourceLayer, regionsSourceLayer]
            : [sitesSourceLayer],
        }),
      );
      //  Center by user location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          return centerPosition(map, position, 12);
        });
      }
      //  Events
      sitesSource.on('updateFilters', function (e) {
        if (!reqs && e.target.getState() === 'ready') {
          // setLoader(false);
          onSourceChange(e.target);
        }
      });
      if (hasPopups) {
        map.on('pointermove', function (evt) {
          if (evt.dragging) {
            return;
          }
          const pixel = map.getEventPixel(evt.originalEvent);
          displayPopup(map, pixel, evt.coordinate, popup);
        });
        map.on('click', function (evt) {
          let newZoom = map.getView().getZoom();
          if (newZoom > zoomSwitch) {
            displayPopup(map, evt.pixel, evt.coordinate, popupDetails, true);
          }
        });
      }
      map.on('moveend', function (e) {
        if (hasSidebar && document.getElementById('dynamic-filter')) {
          document.getElementById('dynamic-filter').dispatchEvent(
            new CustomEvent('featurechange', {
              detail: {
                features: sitesSource.getFeaturesInExtent(
                  map.getView().calculateExtent(),
                ),
              },
            }),
          );
        }
        let newZoom = map.getView().getZoom();
        if (currentZoom !== newZoom) {
          if (newZoom > zoomSwitch) {
            sitesSourceLayer.setVisible(true);
            hasRegionsFeatures && regionsSourceLayer.setVisible(false);
          } else if (newZoom > 2) {
            sitesSourceLayer.setVisible(false);
            hasRegionsFeatures && regionsSourceLayer.setVisible(true);
          } else {
            sitesSourceLayer.setVisible(false);
            hasRegionsFeatures && regionsSourceLayer.setVisible(false);
          }
          currentZoom = newZoom;
        }
      });
      setState({
        ...stateRef.current,
        map: {
          ...stateRef.current.map,
          element: map,
          sitesSourceLayer,
        },
        popup: {
          ...stateRef.current.popup,
          element: popup,
        },
        popupDetails: {
          ...stateRef.current.popupDetails,
          element: popupDetails,
        },
      });
    }
  }

  const setSiteQueryParams = () => {
    axios
      .get(
        encodeURI(
          `${settings.providerUrl}?query=SELECT DISTINCT siteId, siteInspireId FROM [IED].[latest].[FacilitiesPerSite] WHERE siteId = '${state.popupDetails.properties.id}'`,
        ),
      )
      .then((response) => {
        const data = JSON.parse(response.request.response);
        props.setQueryParam({
          queryParam: {
            siteInspireId: data.results[0].siteInspireId,
            siteId: state.popupDetails.properties.id,
            siteName: state.popupDetails.properties.sitename,
            reportingYear: state.popupDetails.properties.rep_yr,
          },
        });
      })
      .catch((error) => {});
  };

  return (
    <div className="openlayer-map-container">
      {props.mode === 'edit' ? <p>Openlayer map</p> : ''}
      <div id="map" className="map" />
      <div id="popup" className="popup">
        {state.popup.element && (
          <>
            <div className="popover-header">
              {currentMapZoom && currentMapZoom > zoomSwitch ? (
                <Header as="h3">{state.popup.properties.siteName}</Header>
              ) : (
                <Header as="h3">{`${state.popup.properties.NUTS_NAME}, ${state.popup.properties.CNTR_CODE}, ${state.popup.properties.COUNTRY}`}</Header>
              )}
            </div>
            <div className="popover-body">
              <Grid.Column stretched>
                {currentMapZoom && currentMapZoom > zoomSwitch ? (
                  ''
                ) : (
                  <Grid.Row>
                    <p>
                      Number of sites:{' '}
                      <code>{state.popup.properties.num_sites}</code>
                    </p>
                  </Grid.Row>
                )}
                {/* HDMS */}
                <Grid.Row>
                  {state.popup.properties.hdms ? (
                    <>
                      <p className="mb-1">The location you are viewing is:</p>
                      <code>{state.popup.properties.hdms}</code>
                    </>
                  ) : (
                    ''
                  )}
                </Grid.Row>
              </Grid.Column>
            </div>
          </>
        )}
      </div>
      <div id="popup-details" className="popup">
        {state.popupDetails.element && (
          <>
            <div className="popover-header">
              <Header as="h2">
                {state.popupDetails.properties.siteName
                  ? state.popupDetails.properties.siteName
                  : ''}
              </Header>
              <VoltoIcon
                onClick={() =>
                  state.popupDetails.element.setPosition(undefined)
                }
                name={clearSVG}
                size="2em"
              />
            </div>
            <div className="popover-body">
              <div className="grid-layout">
                {/* SITE CONTENTS */}
                <div className="row mb-1-super mt-0-super">
                  <div className="column column-12">
                    <Header Header as="h3">
                      Site contents
                    </Header>
                  </div>
                  <div className="column  column-12">
                    <p>
                      <Link
                        onClick={setSiteQueryParams}
                        to={
                          '/industrial-site/introduction/understanding-the-data'
                        }
                      >
                        {state.popupDetails.properties.nFacilities || 0}{' '}
                        Facilities
                      </Link>
                    </p>
                  </div>
                  <div className="column  column-12">
                    <p>
                      <Link
                        onClick={setSiteQueryParams}
                        to={
                          '/industrial-site/introduction/understanding-the-data'
                        }
                      >
                        {state.popupDetails.properties.nLCP || 0} Large
                        comustion plants
                      </Link>
                    </p>
                  </div>
                  <div className="column  column-12">
                    <p>
                      <Link
                        onClick={setSiteQueryParams}
                        to={
                          '/industrial-site/introduction/understanding-the-data'
                        }
                      >
                        {state.popupDetails.properties.nInstallations || 0}{' '}
                        Installations
                      </Link>
                    </p>
                  </div>
                </div>
                {/* SITE POLLUTANT EMISSIONS */}
                <div className="row mb-1-super mt-0-super">
                  <div className="column  column-12">
                    <Header as="h3">Pollutant emissions</Header>
                  </div>
                  <div className="column  column-12 description">
                    {state.popupDetails.properties.pollutants ? (
                      <p>
                        {state.popupDetails.properties.pollutants}
                        {/* {state.popupDetails.properties.pollutants.substring(
                          0,
                          256,
                        )}
                        {state.popupDetails.properties.pollutants.length > 256
                          ? '...'
                          : ''} */}
                      </p>
                    ) : (
                      <p>There are no data regarding the pollutants</p>
                    )}
                  </div>
                </div>
                {/* REGULATORY INFORMATION */}
                <div className="row mb-1-super mt-0-super">
                  <div className="column  column-12">
                    <Header as="h3">Regulatory information</Header>
                  </div>
                  <div className="column  column-12">
                    {state.popupDetails.properties.Site_reporting_year ? (
                      <p>
                        Inspections in{' '}
                        {state.popupDetails.properties.Site_reporting_year}:{' '}
                        {state.popupDetails.properties.numInspections || 0}
                      </p>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="popover-actions">
              <button
                onClick={() => {
                  setSiteQueryParams();
                  history.push(
                    '/industrial-site/introduction/understanding-the-data',
                  );
                }}
                className="solid dark-blue"
              >
                Site Details
              </button>
            </div>
          </>
        )}
      </div>
      <Dimmer id="map-loader" active={loader}>
        <Loader />
      </Dimmer>
      <Portal node={document.getElementById('map-view-your-area-button')}>
        <div id="view-your-area" className="ol-unselectable ol-control">
          <button
            className="toggle-button"
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                  return centerPosition(state.map.element, position, 12);
                });
              }
            }}
          >
            <VoltoIcon name={navigationSVG} size="1em" fill="white" />
          </button>
        </div>
      </Portal>
    </div>
  );
};

export default compose(
  connect(
    (state, props) => ({
      query: state.router.location.search,
      content:
        state.prefetch?.[state.router.location.pathname] || state.content.data,
      discodata_query: state.discodata_query,
    }),
    {
      setQueryParam,
    },
  ),
)(OpenlayersMapView);
