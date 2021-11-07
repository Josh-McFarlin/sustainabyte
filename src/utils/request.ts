import axios from "axios";

export const request = axios.create();
export const authRequest = axios.create({
  transformResponse: [].concat(axios.defaults.transformResponse, (json) => {
    if (json.error === true) {
      throw new Error(json.message || "Failed to retrieve resources!");
    }

    return json.data;
  }),
});
