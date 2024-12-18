import axios from "axios";

import cookie from "js-cookie";

export type UserLoginPropsType = {
  email: string;
  password: string;
};

export type UserLoginType = {
  isLoggedIn: boolean;
  email: string;
  username: string;
  responseStatus: number;
};
export const UserLogin = async (
  loginData: UserLoginPropsType
): Promise<UserLoginType> => {
  try {
    const response = await axios.post(
      "http://localhost:3002/user/login",
      loginData
    );

    if (response.status === 200) {
      cookie.set("authToken", response.data.token);
      cookie.set("userEmail", loginData.email);
      cookie.set("userName", response.data.userName);

      return {
        isLoggedIn: true,
        email: loginData.email,
        username: response.data.userName,
        responseStatus: response.status,
      };
    }

    return {
      isLoggedIn: false,
      email: loginData.email,
      username: "",
      responseStatus: response.status,
    };
  } catch (error) {
    console.error(error);
    return {
      isLoggedIn: false,
      email: loginData.email,
      username: "",
      responseStatus: 500,
    };
  }
};
