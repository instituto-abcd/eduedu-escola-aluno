import axios, { type AxiosInstance } from "axios";

export class API {
	static readonly api: AxiosInstance = axios.create({
		baseURL: import.meta.env.VITE_API_URL,
	});
}
