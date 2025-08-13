import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

interface DecodedToken {
  sub: number;
  email: string;
  role: string;
  outlet: string;
  permission: string[];
  iat: number;
  exp: number;
}

export class AuthService {
  static async login(email: string, password: string) {
    const res = await fetch("http://192.168.50.2:4000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      console.error("Login failed:", error.message);
      throw new Error(error.message || "Login failed");
    }

    const response = await res.json();
    console.log("Login response:", response);

    const token = response.data?.token;

    if (!token || typeof token !== "string") {
      throw new Error("Invalid token received from backend");
    }

    Cookies.set("access_token", token, { expires: 1 });

    localStorage.setItem("access_token", token);

    const decoded: DecodedToken = jwtDecode(token);

    const user = {
      token,
      email: decoded.email,
      role: decoded.role,
      outlet: decoded.outlet,
    };

    localStorage.setItem("user", JSON.stringify(user));

    return user;
  }

  static getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("access_token");
    }
    return null;
  }

  static logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      Cookies.remove("access_token");
    }
  }

  static getDecodedUser(): DecodedToken | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch (e) {
      console.error("Invalid token", e);
      return null;
    }
  }
}
