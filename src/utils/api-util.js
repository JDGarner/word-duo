import NetInfo from "@react-native-community/netinfo";
import { MOCK_URL, getConfig } from "../Config";
import getMockData from "../mock-data";
import { ERROR_CODES } from "../components/error/ErrorScreen";

const { API_URL, API_KEY } = getConfig();

const FETCH_TIMEOUT = 12000;

const mockFetch = endpoint => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(createMockSuccessResponse(endpoint));
    }, 200);
  });
};

const createMockSuccessResponse = endpoint => {
  return {
    status: 200,
    json: () =>
      new Promise(resolve => {
        resolve(getMockData(endpoint));
      }),
  };
};

const enhancedFetch = async (url, endpoint) => {
  if (url === MOCK_URL) {
    return mockFetch(endpoint);
  }

  console.log(`>>> Request: ${url}/${endpoint}`);

  return fetch(`${url}/${endpoint}`, {
    headers: {
      Authorization: API_KEY,
    },
  });
};

const fetchData = async (endpoint, onError = () => {}) => {
  return await NetInfo.fetch().then(async state => {
    if (!state.isConnected && API_URL !== MOCK_URL) {
      onError(ERROR_CODES.CONNECTION);
      return null;
    }

    let didTimeOut = false;

    const fetchTimeout = setTimeout(function() {
      didTimeOut = true;
      console.log("Network request timed out");
      onError(ERROR_CODES.TIMEOUT);
    }, FETCH_TIMEOUT);

    try {
      const response = await enhancedFetch(API_URL, endpoint);
      clearTimeout(fetchTimeout);

      if (didTimeOut) {
        return null;
      }

      if (response.status === 200) {
        return response;
      } else {
        console.log("Error: ", response);
        onError(ERROR_CODES.API);
        return null;
      }
    } catch (error) {
      if (!didTimeOut) {
        console.log(error);
        onError(ERROR_CODES.API);
        return null;
      }
    }
  });
};

export const fetchFromApi = async (endpoint, onSuccess, onError = () => {}) => {
  const response = await fetchData(endpoint, onError);

  try {
    if (response) {
      const responseJson = await response.json();
      // console.log(">>> response: ", responseJson);
      onSuccess(responseJson);
    }
  } catch (error) {
    console.log(error);
    onError(ERROR_CODES.GENERIC);
  }
};

export const postToApi = async (endpoint, params) => {
  if (API_URL === MOCK_URL) {
    console.log(">>> Mock Post Request: ", endpoint, params);
    return;
  }

  console.log(">>> Post Request: ", endpoint, params);
  fetch(`${API_URL}/${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: API_KEY,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
};
