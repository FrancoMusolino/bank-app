import { Fetcher } from "../../shared/services/fetcher";

type LoginReq = {
  email: string;
  password: string;
};

type RegisterReq = {
  firstname: string;
  lastname: string;
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
  login(data: LoginReq) {
    return this.post<LoginReq, AuthRes>("/auth/login", data);
  }

  register(data: RegisterReq) {
    return this.post<RegisterReq, AuthRes>("/auth/register", data);
  }
}

export const authService = new AuthService();
