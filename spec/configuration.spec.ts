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

import { Configuration } from "../src/configuration";

describe("Configuration", () => {

    let configuration: Configuration;

    beforeEach(() => configuration = new Configuration());

    it("should accept known encodings", () => {
        expect(() => configuration.encoding("UNOA")).not.toThrow();
        expect(() => configuration.encoding("UNOB")).not.toThrow();
        expect(() => configuration.encoding("UNOC")).not.toThrow();
        expect(() => configuration.encoding("UNOY")).not.toThrow();
        expect(() => configuration.encoding("UCS2")).not.toThrow();
    });

    it("should reject unknown encodings", () => {
        expect(() => configuration.encoding("UNKNOWN")).toThrow();
    });

    it("should return the delimiters as a sorted array", () => {
        let count: number = 0;

        const run = (permutation: number[]) => {

            configuration.config.segmentTerminator      = permutation[0];
            configuration.config.dataElementSeparator   = permutation[1];
            configuration.config.componentDataSeparator = permutation[2];
            configuration.config.decimalMark            = permutation[3];
            configuration.config.releaseCharacter       = permutation[4];

            const delimiters: number[] = configuration.delimiters();
            for (let i: number = 1; i < delimiters.length; i++) {
                expect(delimiters[i]).toBeGreaterThan(delimiters[i - 1]);
            }
            count++;
        };

        const permute = (head: number[], tail: number[], callback: (permutation: number[]) => unknown): void => {
            if (tail.length === 0) {
                callback(head);
            } else {
                for (let i: number = 0; i < tail.length; i++) {
                    const item: number = tail[i];
                    tail.splice(i, 1);
                    head.push(item);
                    permute(head, tail, callback);
                    head.pop();
                    tail.splice(i, 0, item);
                }
            }
        };

        permute([], [0, 1, 2, 3, 4], run);
        expect(count).toEqual(120);
    });
});
