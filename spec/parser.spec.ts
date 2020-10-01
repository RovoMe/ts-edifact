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

import { Parser } from "../src/parser";
import { Configuration } from "../src/configuration";
import { NullValidator } from "../src/validator";

describe("Parser", () => {

    describe("initialize", () => {

        it("should accept known encodings", () => {
            expect(() => new Parser(new Configuration({ charset: "UNOA" }))).not.toThrow();
            expect(() => new Parser(new Configuration({ charset: "UNOB" }))).not.toThrow();
            expect(() => new Parser(new Configuration({ charset: "UNOC" }))).not.toThrow();
            expect(() => new Parser(new Configuration({ charset: "UNOD" }))).not.toThrow();
            expect(() => new Parser(new Configuration({ charset: "UNOE" }))).not.toThrow();
            expect(() => new Parser(new Configuration({ charset: "UNOF" }))).not.toThrow();
            expect(() => new Parser(new Configuration({ charset: "UNOG" }))).not.toThrow();
            expect(() => new Parser(new Configuration({ charset: "UNOH" }))).not.toThrow();
            expect(() => new Parser(new Configuration({ charset: "UNOI" }))).not.toThrow();
            expect(() => new Parser(new Configuration({ charset: "UNOJ" }))).not.toThrow();
            expect(() => new Parser(new Configuration({ charset: "UNOK" }))).not.toThrow();
        });

        it("should reject unknown encodings", () => {
            expect(() => new Parser(new Configuration({ charset: "UNKNOWN" }))).toThrow();
        });
    });

    describe("write", () => {
        let parser: Parser;

        beforeEach(() => {
            parser = new Parser(new Configuration({ validator: new NullValidator() }));
        });

        it("should accept a valid UNA header", () => {
            expect(() => parser.write("UNA:+.? '")).not.toThrow();
            expect(() => parser.end()).not.toThrow();
        });

        it("should use special characters as defined in the UNA header", () => {
            parser.write("UNA+:.? ;");
            expect(() => parser.write("SEG:+:;")).not.toThrow();
            expect(() => parser.end()).not.toThrow();
        });

        it("should accept an empty segmen", () => {
            expect(() => parser.write("SEG'")).not.toThrow();
            expect(() => parser.end()).not.toThrow();
        });

        it("shouldn't accept an empty segment without a terminator", () => {
            expect(() => parser.write("SEG")).not.toThrow();
            expect(() => parser.end()).toThrow();
        });

        it("should call onOpenSegment when starting a new segment", () => {
            const hook: jasmine.Spy = spyOn(parser, "onOpenSegment");
            parser.write("UNH");
            expect(hook.calls.count()).toEqual(0);
            parser.write("+");
            expect(hook.calls.count()).toEqual(1);
            parser.write("'\nSEG");
            expect(hook.calls.count()).toEqual(1);
            parser.write("'");
            expect(hook.calls.count()).toEqual(2);
        });

        it("should call onCloseSegment when terminating a segment", () => {
            const hook: jasmine.Spy = spyOn(parser, "onCloseSegment");
            parser.write("UNH+");
            expect(hook.calls.count()).toEqual(0);
            parser.write("'");
            expect(hook.calls.count()).toEqual(1);
        });

        it("should call onElement when finishing a new element", () => {
            const hook: jasmine.Spy = spyOn(parser, "onElement");
            parser.write("UNH");
            expect(hook.calls.count()).toEqual(0);
            parser.write("++");
            expect(hook.calls.count()).toEqual(1);
            parser.write("'");
            expect(hook.calls.count()).toEqual(2);
        });

        it("should call onComponent when finishing a new component", () => {
            const hook: jasmine.Spy = spyOn(parser, "onComponent");
            parser.write("UNH+");
            expect(hook.calls.count()).toEqual(0);
            parser.write(":");
            expect(hook.calls.count()).toEqual(1);
            parser.write("'");
            expect(hook.calls.count()).toEqual(2);
        });

        it("should read characters preceded by the release character as data", () => {
            let component: string = "";
            parser.onComponent = (data: string) => component = data;
            parser.write("SEG+??'");
            expect(component).toEqual("?");
        });

        it("should accept sample message with two parsers & same encodings (config is cached)", () => {
            const msg: string = "UNB+UNOC:3+123:14+123:14+180813:0806+404114++LG'UNH+404114+MSCONS:D:04B:UN:2.1a'";

            const config: Configuration = new Configuration({ charset: "UNOC" });
            const parser1: Parser = new Parser(config);
            const parser2: Parser = new Parser(config);

            expect(() => parser1.write(msg)).not.toThrow();
            expect(() => parser1.end()).not.toThrow();
            expect(() => parser2.write(msg)).not.toThrow();
            expect(() => parser2.end()).not.toThrow();
        });

        it("should handle negative number values correctly", () => {
            const hook: jasmine.Spy = spyOn(parser, "onComponent");
            parser.write("RNG+5+");
            expect(hook.calls.count()).toEqual(1);
            parser.write("CEL:-5:5'");
            expect(hook.calls.count()).toEqual(4);
        });

        it("should throw on invalid minus/hyphen character used", () => {
            const hook: jasmine.Spy = spyOn(parser, "onComponent");
            parser.write("RNG+5+");
            expect(hook.calls.count()).toEqual(1);
            expect(() => parser.write("CEL:‐5:5'")).toThrow(); // contains invalid - symbol
        });
    });

});
