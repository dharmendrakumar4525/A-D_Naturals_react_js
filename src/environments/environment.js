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
