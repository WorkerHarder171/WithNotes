import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export interface TokenPayload {
  exp: number;
  [key: string]: any;
}

export class AuthService {
  
  // Check if the token is valid
  isTokenValid(): boolean {
    try {
      const token = this.getToken() || this.getOauthAccessToken();
      if (!token) {
        console.log("Token not found");
        return false;
      }

      const decoded: TokenPayload = jwtDecode<TokenPayload>(token);

      if (!decoded.exp || decoded.exp * 1000 < Date.now()) {
        console.log("Token expired or invalid");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Token Validation Error:", error);
      return false;
    }
  }

  // Check if the user is authorized (valid token)
  isAuthorized(): boolean {
    if (!this.isTokenValid()) {
      this.clearCredentialsToken();
      return false;
    }
    return true;
  }

  // Get token from cookies
  getToken(): string | undefined {
    const token = Cookies.get("token");
    console.log("token", token);
    if (!token) {
      console.log("Token not found in cookies");
    }
    return token;
  }

  // Get OAuth access token from cookies
  getOauthAccessToken(): string | undefined {
    return Cookies.get("oauthAccessToken");
  }

  // Get refresh token from cookies
  getRefreshToken(): string | undefined {
    return Cookies.get("refreshToken");
  }

  // Set credentials to cookies with expiration based on token's exp field
  setCredentialsToCookie(token: string): void {
    try {
      const { exp } = jwtDecode<TokenPayload>(token);
      if (!exp) {
        console.error("Token is missing expiration (`exp`)");
        return;
      }
      Cookies.set("token", token, { expires: new Date(exp * 1000) });
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  // Store credentials in cookies
  storeCredentialsToken({
    token,
    refreshToken,
    oauthAccessToken,
  }: {
    token: string;
    refreshToken: string;
    oauthAccessToken: string;
  }): void {
    try {
      const { exp } = jwtDecode<TokenPayload>(token);
      if (!exp) {
        console.error("Token is missing expiration (`exp`)");
        return;
      }

      Cookies.set("token", token, { expires: new Date(exp * 1000) });
      Cookies.set("oauthAccessToken", oauthAccessToken, { expires: new Date(exp * 1000) });
      Cookies.set("refreshToken", refreshToken, { expires: new Date(exp * 1000) });
    } catch (error) {
      console.error("Error storing credentials:", error);
    }
  }

  // Clear credentials tokens from cookies
  clearCredentialsToken(): void {
    Cookies.remove("token");
    Cookies.remove("oauthAccessToken");
    Cookies.remove("refreshToken");
  }

  // Log the user out and clear credentials
  logout(): void {
    console.info("User logged out");
    this.clearCredentialsToken();
  }

  // Set user data to cookies with expiration based on token's exp field
  setDataUser({
    nama,
    email,
    img,
  }: {
    nama: string;
    email: string;
    img: string;
  }): void {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error("Token is required to set user data");
      }

      const decoded: TokenPayload = jwtDecode<TokenPayload>(token);
      if (!decoded.exp) {
        throw new Error("Token missing expiration (`exp`)");
      }

      const data = { nama, email, img };

      Cookies.set("dataUser", JSON.stringify(data), {
        expires: new Date(decoded.exp * 1000),
      });
    } catch (error) {
      console.error("Error setting user data:", error);
    }
  }
}
