import axios from "axios";

export const environment = {
  production: false,
  app_name: "a&d-naturals-local",
  encryption: false,
  environmentType: "local",

  api_path: "http://localhost:3000/api/web",
  api_base_path: "http://localhost:3000",

  cookiesOptions: {
    storeUnencoded: true,
    sameSite: "Strict",
    secure: true,
    expires: new Date(),
  },
  // request_encode_key: '@#$Gg4sdVV5443g$#TVS@#f3g2&^%JH#2fc2@^%f2f23f#@@#fg',
  // private_key: 'JuYo]&%^%f2f23f#'
};

/* export const environment = {
  api_path: "https://8anma2kjyp.us-east-1.awsapprunner.com/api/web",
}; */

export const getTokenFromStore = () => {
  try {
    const data = localStorage.getItem("A&D_Login_Token");
    console.log(data, "Token");
    return data;
  } catch (error) {
    console.error("Error fetching data from local storage:", error);
    return null;
  }
};
const token = getTokenFromStore();

export const defaultOptions = {
  headers: {
    Authorization: getTokenFromStore(),
  },
};

export const axiosInstance = axios.create({
  baseURL: environment.api_path,
  ...defaultOptions,
});
