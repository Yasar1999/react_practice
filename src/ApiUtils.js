import api from  "./CustomApi"


// Dynamic API helper functions with Authorization header
export const getItems = (resource, params = {}) => 
  api.get(`/api/${resource}/`, { params });


export const createItem = (resource, data, headers = {}) => {
  return api.post(`/api/${resource}/`, data, {
    headers: {
      ...headers,  // Spread additional headers here
    },
  });
};

export const updateItem = (resource, id, data, headers = {} ) => {
  return api.put(`/api/${resource}/${id}/`, data, {
    headers: {
      ...headers,  // Spread additional headers here
    },
  });
};

export const partialupdateItem = (resource, id, data) => {
  return api.patch(`/api/${resource}/${id}/`, data);
};

export const deleteItem = (resource, id) => {
  return api.delete(`/api/${resource}/${id}/`);
};

export const getItem = (resource, id) => {
  return api.get(`/api/${resource}/${id}/`);
};