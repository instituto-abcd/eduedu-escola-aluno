import axios, { type AxiosInstance } from "axios";
import { env } from "~/env";

export class API {
	static readonly api: AxiosInstance = axios.create({
		baseURL: window.config.API_URL,
	});
}
