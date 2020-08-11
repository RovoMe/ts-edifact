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

import { Validator, ValidatorImpl, Dictionary, SegmentEntry, ElementEntry } from "../main/validator";
import { Tokenizer } from "../main/tokenizer";

describe("Validator", () => {

    let validator: Validator;

    describe("with only segment definitions", () => {
        beforeEach(() => {
            validator = new ValidatorImpl();
            const dict: Dictionary<SegmentEntry> = new Dictionary<SegmentEntry>();
            dict.add("AAA", { requires: 1, elements: ["A000", "A001"]});
            validator.define(dict);
        });

        it("should throw if the required elements aren't provided", () => {
            const segment: string = "AAA";
            expect(() => validator.onCloseSegment(segment)).toThrow();
        });

        it("should throw if too many elements are provided", () => {
            const segment: string = "AAA";
            validator.onOpenSegment(segment);
            validator.onElement();
            validator.onElement();
            validator.onElement();
            expect(() => validator.onCloseSegment(segment)).toThrow();
        });
    });

    describe("with segment and element definitions", () => {

        const buffer: Tokenizer = new Tokenizer();
        buffer.alpha = () => void {};
        buffer.alphanumeric = () => void {};
        buffer.numeric = () => void {};
        buffer.length = () => 0;

        beforeEach(() => {
            validator = new ValidatorImpl();
            const dict: Dictionary<SegmentEntry> = new Dictionary<SegmentEntry>();
            dict.add("AAA", { requires: 0, elements: ["A000", "A001"]});
            validator.define(dict);
        });

        it("should throw if the required components aren't provided", () => {
            const dict: Dictionary<ElementEntry> = new Dictionary<ElementEntry>();
            dict.add("A000", { requires: 1, components: ["a3"]});
            validator.define(dict);
            validator.onOpenSegment("AAA");
            validator.onElement();
            expect(() => validator.onElement()).toThrow();
        });

        it("should throw if too many components are provided", () => {
            const dict: Dictionary<ElementEntry> = new Dictionary<ElementEntry>();
            dict.add("A000", { requires: 0, components: ["a3"]});
            validator.define(dict);
            validator.onOpenSegment("AAA");
            validator.onElement();
            validator.onOpenComponent(buffer);
            expect(() => {
                validator.onOpenComponent(buffer);
                validator.onElement();
            }).toThrow();
        });

        it("set the appropriate mode on the buffer", () => {
            const dict: Dictionary<ElementEntry> = new Dictionary<ElementEntry>();
            dict.add("A000", { requires: 0, components: ["a3", "an3", "n3"] });
            validator.define(dict);
            const alphaHook: jasmine.Spy = spyOn(buffer, "alpha");
            const alphanumericHook: jasmine.Spy = spyOn(buffer, "alphanumeric");
            const numericHook: jasmine.Spy = spyOn(buffer, "numeric");

            validator.onOpenSegment("AAA");
            validator.onElement();
            validator.onOpenComponent(buffer);
            expect(alphaHook).toHaveBeenCalled();
            expect(alphanumericHook).not.toHaveBeenCalled();

            validator.onOpenComponent(buffer);
            expect(alphanumericHook).toHaveBeenCalled();
            expect(numericHook).not.toHaveBeenCalled();

            validator.onOpenComponent(buffer);
            expect(numericHook).toHaveBeenCalled();
        });
    });
});
