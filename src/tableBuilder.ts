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

import * as fs from "fs";
import * as path from "path";
import { Dictionary } from "./validator";

export enum Suffix {
    Elements = "elements",
    Segments = "segments"
}

export abstract class TableBuilder<T> {

    private type: string;
    private version?: string;
    private location?: string;
    protected fileSuffix: Suffix;

    constructor(type: string, suffix: Suffix) {
        this.type = type;
        this.fileSuffix = suffix;
    }

    forVersion(version: string): TableBuilder<T> {
        this.version = version;
        return this;
    }

    specLocation(location: string): TableBuilder<T> {
        this.location = location;
        return this;
    }

    protected getDefinitionFileLoc(): string | undefined {
        let defaultFilePath: string;

        if (this.location) {
            defaultFilePath = path.resolve("./", this.location);
            if (!defaultFilePath.endsWith("/")) {
                defaultFilePath += "/";
            }
        } else {
            defaultFilePath = "./";
        }

        const baseFileName: string = defaultFilePath + this.type.toUpperCase() + "." + this.fileSuffix + ".json";
        if (this.version) {
            const versionedFileName: string = defaultFilePath + this.version.toUpperCase() + "_" + this.type.toUpperCase() + "." + this.fileSuffix + ".json";

            if (fs.existsSync(versionedFileName)) {
                return versionedFileName;
            } else if (fs.existsSync(baseFileName)) {
                console.warn(`No ${this.fileSuffix} definition file found for message type ${this.type} of version ${this.version}. Falling back to default version`);
                return baseFileName;
            }
        } else {
            if (fs.existsSync(baseFileName)) {
                return baseFileName;
            }
        }

        console.error(`No ${this.fileSuffix} definition file found for message type ${this.type}`);
        return undefined;
    }

    abstract build(): Dictionary<T>;
}
