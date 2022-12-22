import axios from 'axios';

const API_OPTIONS = {
  apiKey: '29459770-8893fd985768567c1d8693203',
  apiURL: 'https://pixabay.com/api/',
};

axios.defaults.baseURL = API_OPTIONS.apiURL;

export const getQueryPicture = async (query, page, imgPerPage) => {
  const url = `?q=${query}&page=${page}&key=${API_OPTIONS.apiKey}&image_type=photo&orientation=horizontal&per_page=${imgPerPage}`;
  const response = await axios.get(url);

  const hits = response.data.hits;
  const stats = response.data.totalHits;
  // console.log('api', url);
  return { hits, stats };
};
