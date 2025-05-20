import axios, { type AxiosInstance } from "axios";
import { env } from "~/env";

export class API {
	static readonly api: AxiosInstance = axios.create({
		baseURL: env.VITE_API_URL,
	});
}
