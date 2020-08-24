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

    describe("with actual segment and element definitions", () => {

        let validator: Validator;

        const buffer: Tokenizer = new Tokenizer();

        beforeEach(() => {
            // https://www.stylusstudio.com/edifact/40100/UNB_.htm
            const segments: Dictionary<SegmentEntry> = new Dictionary<SegmentEntry>();
            segments.add("UNB", { requires: 5, elements: ["S001", "S002", "S003", "S004", "0020", "S005", "0026", "0029", "0031", "0032", "0035"] });
            const elements: Dictionary<ElementEntry> = new Dictionary<ElementEntry>();
            elements.add("S001", { requires: 2, components: ["a4", "an1", "an..6", "an..3"] });
            elements.add("S002", { requires: 1, components: ["an..35", "an..4", "an..35", "an..35"] });
            elements.add("S003", { requires: 1, components: ["an..35", "an..4", "an..35", "an..35"] });
            elements.add("S004", { requires: 2, components: ["n..8", "n4"] });
            elements.add("0020", { requires: 1, components: ["an..14"] });
            elements.add("S005", { requires: 1, components: ["an..14", "an2"] });
            elements.add("0026", { requires: 0, components: ["an..14"] });
            elements.add("0029", { requires: 0, components: ["a1"] });
            elements.add("0031", { requires: 0, components: ["n1"] });
            elements.add("0032", { requires: 0, components: ["an..35"] });
            elements.add("0035", { requires: 0, components: ["n1"] });

            validator = new ValidatorImpl();
            validator.define(segments);
            validator.define(elements);
        })

        it("should not throw on optional UNB elements", () => {
            // UNB+UNOC:3+1234567890123:14+3210987654321:14+200608:0945+KC6C2Y-U9NTGBR++++++1'
            expect(() => validator.onOpenSegment("UNB")).not.toThrow();

            // S001
            setBuffer("");
            expect(() => validator.onElement()).not.toThrow();
            expect(() => validator.onOpenComponent(buffer)).not.toThrow();
            setBuffer("UNOC");
            expect(() => validator.onCloseComponent(buffer)).not.toThrow();
            setBuffer("");
            expect(() => validator.onOpenComponent(buffer)).not.toThrow();
            setBuffer("3");
            expect(() => validator.onCloseComponent(buffer)).not.toThrow();

            // S002
            expect(() => validator.onElement()).not.toThrow();
            setBuffer("");
            expect(() => validator.onOpenComponent(buffer)).not.toThrow();
            setBuffer("1234567890123");
            expect(() => validator.onCloseComponent(buffer)).not.toThrow();
            setBuffer("");
            expect(() => validator.onOpenComponent(buffer)).not.toThrow();
            setBuffer("14");
            expect(() => validator.onCloseComponent(buffer)).not.toThrow();

            // S003
            expect(() => validator.onElement()).not.toThrow();
            setBuffer("");
            expect(() => validator.onOpenComponent(buffer)).not.toThrow();
            setBuffer("3210987654321");
            expect(() => validator.onCloseComponent(buffer)).not.toThrow();
            setBuffer("");
            expect(() => validator.onOpenComponent(buffer)).not.toThrow();
            setBuffer("14");
            expect(() => validator.onCloseComponent(buffer)).not.toThrow();

            // S004
            expect(() => validator.onElement()).not.toThrow();
            setBuffer("");
            expect(() => validator.onOpenComponent(buffer)).not.toThrow();
            setBuffer("200608");
            expect(() => validator.onCloseComponent(buffer)).not.toThrow();
            setBuffer("");
            expect(() => validator.onOpenComponent(buffer)).not.toThrow();
            setBuffer("0945");
            expect(() => validator.onCloseComponent(buffer)).not.toThrow();

            // 0020
            expect(() => validator.onElement()).not.toThrow();
            setBuffer("");
            expect(() => validator.onOpenComponent(buffer)).not.toThrow();
            setBuffer("KC6C2Y-U9NTGBR");
            expect(() => validator.onCloseComponent(buffer)).not.toThrow();

            // S005
            expect(() => validator.onElement()).not.toThrow();
            setBuffer("");
            expect(() => validator.onOpenComponent(buffer)).not.toThrow();
            setBuffer("");
            expect(() => validator.onCloseComponent(buffer)).not.toThrow();
            
            // 0026
            expect(() => validator.onElement()).not.toThrow();
            setBuffer("");
            expect(() => validator.onOpenComponent(buffer)).not.toThrow();
            setBuffer("");
            expect(() => validator.onCloseComponent(buffer)).not.toThrow();
            
            // 0029
            expect(() => validator.onElement()).not.toThrow();
            setBuffer("");
            expect(() => validator.onOpenComponent(buffer)).not.toThrow();
            setBuffer("");
            expect(() => validator.onCloseComponent(buffer)).not.toThrow();
            
            // 0031
            expect(() => validator.onElement()).not.toThrow();
            setBuffer("");
            expect(() => validator.onOpenComponent(buffer)).not.toThrow();
            setBuffer("");
            expect(() => validator.onCloseComponent(buffer)).not.toThrow();
            
            // 0032
            expect(() => validator.onElement()).not.toThrow();
            setBuffer("");
            expect(() => validator.onOpenComponent(buffer)).not.toThrow();
            setBuffer("");
            expect(() => validator.onCloseComponent(buffer)).not.toThrow();
            
            // 0035
            expect(() => validator.onElement()).not.toThrow();
            setBuffer("");
            expect(() => validator.onOpenComponent(buffer)).not.toThrow();
            setBuffer("1");
            expect(() => validator.onCloseComponent(buffer)).not.toThrow();

            expect(() => validator.onCloseSegment("UNB")).not.toThrow();
        });

        function setBuffer(value: string): void {
            buffer.content = () => value;
            buffer.length = () => value.length;
        }
    });
});
