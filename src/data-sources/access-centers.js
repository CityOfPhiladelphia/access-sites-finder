export default {
  id: 'access-centers',
  type: 'http-get',
  dependent: 'none',
  resettable: false,
  url: 'https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Digital_Access_Centers_2020_PUBLICVIEW/FeatureServer/0/query',
  options: {
    params: {
      where: '1=1',
      outFields: '*',
      f: 'pjson',
    },
  },
};

