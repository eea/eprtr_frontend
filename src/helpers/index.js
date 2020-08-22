/**
 * Add your helpers here.
 * @module helpers
 * @example
 * export { Api } from './Api/Api';
 */
import { settings } from '~/config';
import { getBaseUrl } from '@plone/volto/helpers';
import { setConnectedDataParameters } from 'volto-datablocks/actions';

export function addCustomGroup(config, customGroup) {
  const hasCustomGroup = config.blocks.groupBlocksOrder.filter((el) => {
    return el.id === customGroup.id;
  });
  if (hasCustomGroup.length === 0) {
    config.blocks.groupBlocksOrder.push({
      id: customGroup.id,
      title: customGroup.title,
    });
  }
}

export function getBasePath(url) {
  return getBaseUrl(url)
    .replace(settings.apiPath, '')
    .replace(settings.internalApiPath, '');
}

export const objectHasData = (obj) => {
  return typeof obj === 'object' && obj !== null && Object.keys(obj).length > 0;
};

export function deepSearch({ inputArray = [], pattern, depth }) {
  const objFitCriteria = {
    first: (index) => index === 0,
    last: (index) => index === inputArray.length - 1,
  };
  const validate = {
    hasItems: (arr) => arr && arr.length > 0,
  };
  for (let index = 0; index < inputArray.length; index++) {
    if (depth <= 1 || !inputArray[index][pattern.propertyToValidate])
      return inputArray[index][pattern.propertyToReturn] || null;
    if (!objFitCriteria[pattern.criteria]?.(index)) continue;
    if (
      validate[pattern.validationType]?.(
        inputArray[index][pattern.propertyToValidate],
      )
    )
      return deepSearch({
        inputArray: inputArray[index][pattern.propertyToValidate],
        pattern,
        depth: depth - 1,
      });
  }

  return null;
}

export const getSchemaWithDataQuery = (props) => {
  if (!props.schema) return {};
  let schemaWithDataQuery = {};
  Object.keys(props.schema).forEach((element) => {
    if (props.schema[element].type === 'data-provider') {
      if (
        !objectHasData(
          props?.connected_data_parameters?.byProviderPath?.[props.path],
        ) &&
        !objectHasData(
          props?.connected_data_parameters?.byContextPath?.[props.path],
        )
      ) {
        const dataQuery = {};
        dataQuery[element + '_data_query'] = {
          defaultformat: 'compactnumber',
          type: 'data-query',
        };
        schemaWithDataQuery[element] = props.schema[element];
        schemaWithDataQuery = { ...schemaWithDataQuery, ...dataQuery };
      }
    }
    schemaWithDataQuery[element] = props.schema[element];
  });
  return schemaWithDataQuery;
};

export const updateConnectedDataParameters = (props) => {
  props.schema &&
    Object.keys(props.schema).forEach((element) => {
      if (props.schema[element].type === 'data-query') {
        if (
          props?.newData?.columns?.[element] &&
          (props?.newData?.columns?.[element]?.value?.i !==
            props?.data?.columns?.[element]?.value?.i ||
            props?.newData?.columns?.[element]?.value?.v !==
              props?.data?.columns?.[element]?.value?.v)
        ) {
          const path = getBasePath(props.pathname);
          const byPath = props?.connected_data_parameters?.byPath;
          const connected_data_parameters =
            (byPath?.[path]?.override?.length > 0 &&
              byPath?.[path]?.override?.[`${props.id}_${element}`]) ||
            null;
          if (
            connected_data_parameters === null ||
            connected_data_parameters?.i !==
              props?.newData?.columns?.[element]?.value?.i ||
            connected_data_parameters?.v?.join(',') !==
              props?.newData?.columns?.[element]?.value?.v
          ) {
            props.dispatch(
              setConnectedDataParameters(
                path.replace('/edit', ''),
                props?.newData?.columns?.[element]?.value,
                `${props.id}_${element}`,
              ),
            );
          }
        }
      }
    });
};
