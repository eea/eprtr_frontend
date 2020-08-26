export const getSchema = (props) => {
  return {
    title: 'Detailed Link',

    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: ['page'],
      },
      {
        id: 'properties',
        title: 'Properties',
        fields: [
          'hideTitle',
          'hideDescription',
          'title',
          'description',
          'buttonTitle',
        ],
      },
      {
        id: 'settings',
        title: 'Settings',
        fields: [
          'textAlign',
          'titleClassname',
          'descriptionClassname',
          'buttonClassname',
        ],
      },
    ],

    properties: {
      hideTitle: {
        title: 'Hide title',
        type: 'boolean',
      },
      hideDescription: {
        title: 'Hide description',
        type: 'boolean',
      },
      page: {
        title: 'Page',
        widget: 'object_by_path',
      },
      title: {
        title: 'Title',
        widget: 'string',
      },
      description: {
        title: 'Description',
        widget: 'textarea',
      },
      buttonTitle: {
        title: 'Button title',
        widget: 'string',
      },
      textAlign: {
        title: 'Text align',
        factory: 'Choice',
        type: 'string',
        choices: [
          ['left', 'Left'],
          ['center', 'Center'],
          ['right', 'Right'],
        ],
      },
      titleClassname: {
        title: 'Title class',
        widget: 'string',
      },
      descriptionClassname: {
        title: 'Description class',
        widget: 'string',
      },
      buttonClassname: {
        title: 'Button class',
        widget: 'string',
      },
    },

    required: ['display', 'cards'],
  };
};

export default getSchema;
