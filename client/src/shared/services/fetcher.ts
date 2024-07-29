import baseAxios from "axios";

type MyKnownError = {
  method: string;
  path: string;
  timestamp: Date;
  error: {
    statusCode: number;
    message: string;
    error: string;
  };
};

const isMyKnownError = (error: unknown): error is MyKnownError => {
  if (typeof error !== "object" || error === null) return false;
  if (
    !("method" in error) ||
    !("path" in error) ||
    !("timestamp" in error) ||
    !("error" in error)
  )
    return false;

  if (typeof error.error !== "object" || error.error === null) return false;
  if (
    !("message" in error.error) ||
    !("error" in error.error) ||
    !("statusCode" in error.error)
  )
    return false;

  return true;
};

const axios = baseAxios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axios.interceptors.response.use(
  (response) => Promise.resolve(response.data),
  (error) =>
    Promise.reject(
      isMyKnownError(error.response.data)
        ? error.response.data.error.message
        : "Ocurrió un error"
    )
);

export abstract class Fetcher {
  protected readonly fetcher = axios;

  protected get<T>(url: string, headers?: object): Promise<T> {
    return this.fetcher.get<T>(url, { headers }) as Promise<T>;
  }

  protected post<T, U>(url: string, data: T, headers?: object): Promise<U> {
    return this.fetcher.post<T, U>(url, data, { headers }) as Promise<U>;
  }
}
