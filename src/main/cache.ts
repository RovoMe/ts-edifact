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
type Entry<T> = {
    [key: string]: T;
};

export class Cache<T> {

    private data: Entry<T>;
    private queue: string[];
    private begin: number;
    private end: number;

    constructor(size: number) {
        this.data = {};
        this.queue = new Array<string>(size);
        this.begin = 0;
        this.end = size;
    }

    public insert(key: string, value: T): void {
        if (!this.contains(key)) {
            if ((this.end + 1 - this.begin) % this.queue.length === 0) {
                delete this.data[this.queue[this.begin]];
                this.begin = (this.begin + 1) % this.queue.length;
            }
            this.end = (this.end + 1) % this.queue.length;
            this.queue[this.end] = key;
        }
        this.data[key] = value;
    }

    public contains(key: string): boolean {
        if (Object.prototype.hasOwnProperty.call(this.data, key)) {
            return true;
        }
        return false;
    }

    public get(key: string): T {
        return this.data[key];
    }

    public length(): number {
        return this.queue.length;
    }
}
