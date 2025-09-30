import { AuthService } from "./AuthService";
import { User } from "@/classes/User";

export class UserService {
  static async fetchUsers(): Promise<User[]> {
    const token = AuthService.getToken();

    if (!token) {
      throw new Error("No auth token found");
    }

    const res = await fetch("http://192.168.50.24:4000/api/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const json = await res.json();
    console.log("Response JSON:", json);

    if (json.status === 200 && Array.isArray(json.data)) {
      return json.data.map((user: any) => {
        return new User(
          user.id,
          user.username,
          user.name,
          Number(user.outlet_id),
          user.outlets?.nama_outlet || `Outlet ${user.outlet_id}`,
          Number(user.role_id)
        );
      });
    }

    throw new Error("Failed to fetch users: Invalid response format");
  }

  static async deleteUser(userId: number) {
    const res = await fetch(`http://192.168.50.24:4000/api/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to delete user");
    }
  }
  static async fetchRoles() {
    const token = AuthService.getToken();

    const res = await fetch("http://192.168.50.24:4000/api/roles", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json();

    if (json.status === 200 && Array.isArray(json.data)) {
      return json.data;
    }

    throw new Error("Failed to fetch roles");
  }

  static async fetchOutlets() {
    const token = AuthService.getToken();
    console.log("✅ Token for fetchOutlets:", token);

    const res = await fetch("http://192.168.50.24:4000/api/outlet", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json();

    if (json.status === 200 && Array.isArray(json.data)) {
      return json.data;
    }

    if (json.data?.status === 200 && Array.isArray(json.data.data)) {
      return json.data.data;
    }

    throw new Error("Failed to fetch outlets - Unexpected response format");
  }

  static async updateUser(updatedUser: User) {
    const token = AuthService.getToken();

    const res = await fetch(
      `http://192.168.50.24:4000/api/users/${updatedUser.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: updatedUser.username,
          name: updatedUser.name,
          outlet_id: Number(updatedUser.outlet_id),
          role_id: Number(updatedUser.role_id),
          loket_id:
            updatedUser.loket_id !== undefined
              ? Number(updatedUser.loket_id)
              : null,
        }),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      try {
        const errorJson = errorText ? JSON.parse(errorText) : {};
        throw new Error(
          errorJson.message || `Failed to update user: HTTP ${res.status}`
        );
      } catch (e) {
        throw new Error(
          errorText || `Failed to update user: HTTP ${res.status}`
        );
      }
    }

    const json = await res.json();
    console.log("Update User Success:", json);
    return json;
  }

  static async createUser(userData: {
    username: string;
    password: string;
    name: string;
    role_id: number;
    outlet_id: number;
  }) {
    const token = AuthService.getToken();
    const res = await fetch("http://192.168.50.24:4000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      const errorText = await res.text();
      try {
        const errorJson = errorText ? JSON.parse(errorText) : {};
        throw new Error(
          errorJson.message || `Failed to create user: HTTP ${res.status}`
        );
      } catch (e) {
        throw new Error(
          errorText || `Failed to create user: HTTP ${res.status}`
        );
      }
    }

    const json = await res.json();
    return json;
  }
}
