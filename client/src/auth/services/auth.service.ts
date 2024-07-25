import { Fetcher } from "../../shared/services/fetcher";

type LoginReq = {
  email: string;
  password: string;
};

type AuthRes = {
  id: string;
  firstname: string;
  lastname: string;
  token: string;
};

class AuthService extends Fetcher {
  constructor() {
    super();
  }

  login(data: LoginReq) {
    return this.post<LoginReq, AuthRes>("/auth/login", data);
  }
}

export const authService = new AuthService();
