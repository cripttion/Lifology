/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://docs.infinite.red/ignite-cli/boilerplate/app/services/#backend-api-integration)
 * documentation for more details.
 */
import {
  ApiResponse,
  ApisauceInstance,
  create,
} from "apisauce"
import Config from "../../config"
import type {
  ApiConfig,
  ApiFeedResponse,
  UserDataResponse,
  UserPostResponse,
} from "./api.types"
import { GeneralApiProblem, getGeneralApiProblem } from "./apiProblem"

/**
 * Configuring the apisauce instance.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10000,
}

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class Api {
  apisauce: ApisauceInstance
  config: ApiConfig

  /**
   * Set up our API instance. Keep this lightweight!
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
  }

  async getUserData(limit:number,skip:number): Promise<{ kind: "ok"; userData: UserDataResponse[] } | GeneralApiProblem> {
    console.log("User data fetching called",limit,skip)
    const response: ApiResponse<UserDataResponse[]> = await this.apisauce.get(`users?limit=${limit}&skip=${skip}`);
    try {
  
      // console.log(response);
      if (!response.ok) {
        // Handle API problem cases
        const problem = getGeneralApiProblem(response);
         console.log("the Problem is",problem);
        if (problem) return problem;
      }
      // console.log(response.data);
      // Assuming response.data has the expected structure
      return { kind: "ok", userData: response?.data?.users || [] };
    } catch (e) {
      // Handle any unexpected errors
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack);
      }
      return { kind: "bad-data" };
    }
  }

  async getPostData(limit:number,userId:number,skip:number): Promise<{ kind: "ok"; userData: UserPostResponse[] } | GeneralApiProblem> {
    const response: ApiResponse<UserPostResponse[]> = await this.apisauce.get(`posts?limit=${limit}&skip=${skip}`);
    try {
  
      // console.log(response);
      if (!response.ok) {
        // Handle API problem cases
        const problem = getGeneralApiProblem(response);
        if (problem) return problem;
      }
      // console.log(response.data);
      // Assuming response.data has the expected structure
      return { kind: "ok", userData: response?.data?.posts || [] };
    } catch (e) {
      // Handle any unexpected errors
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack);
      }
      return { kind: "bad-data" };
    }
  }
}
// Singleton instance of the API for convenience
export const api = new Api()
