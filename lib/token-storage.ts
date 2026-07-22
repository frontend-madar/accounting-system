import Cookies from "js-cookie";

const ACCESS_TOKEN_KEY = "access_token";

export const tokenStorage = {
  get(): string | undefined {
    return Cookies.get(ACCESS_TOKEN_KEY);
  },
  set(token: string, expiresInSeconds: number) {
    const expires = new Date(Date.now() + expiresInSeconds * 1000);
    Cookies.set(ACCESS_TOKEN_KEY, token, {
      expires,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

  },
  clear() {
    Cookies.remove(ACCESS_TOKEN_KEY);
  },
};