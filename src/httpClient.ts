/**
 * @author Roman Vottner
 * @copyright 2020 Roman Vottner
 * @license Apache-2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import * as url from "url";
import * as axios from "axios";

export class HttpClient {

    baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async get(target: string): Promise<string> {
        const uri: string = url.resolve(this.baseUrl, target);

        const request: Promise<string> = axios.default.get<string, axios.AxiosResponse<string>>(uri)
            .then(axiosResponse => {
                if (axiosResponse.status === 200) {
                    const response: string = axiosResponse.data;
                    // console.log(`Response: ${response}`);
                    return response;
                } else {
                    console.error(`Unexpected response ${axiosResponse.status}: ${axiosResponse.data}`);
                }
                return "";
            });

        try {
            const data: string = await request;
            return Promise.resolve(data);
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }
}
