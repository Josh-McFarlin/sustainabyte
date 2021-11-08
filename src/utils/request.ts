import axios from "axios";
import qs from "qs";

export const request = axios.create();
export const authRequest = axios.create({
  transformResponse: [].concat(axios.defaults.transformResponse, (json) => {
    if (json.error === true) {
      throw new Error(json.message || "Failed to retrieve resources!");
    }

    return json.data;
  }),
  paramsSerializer: (p) =>
    qs.stringify(p, {
      arrayFormat: "comma",
    }),
});
