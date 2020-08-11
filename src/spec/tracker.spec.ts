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

import { Tracker } from "../main/tracker";

describe("Tracker", () => {
    let tracker: Tracker;

    it("shouldn't accept unknown segments", () => {
        tracker = new Tracker([
            { content: "AAA", mandatory: true, repetition: 1 }
        ]);
        expect(() => tracker.accept("SEG")).toThrow();
    });

    it("should throw if omitting a mandatory segment", () => {
        tracker = new Tracker([
            { content: "AAA", mandatory: true, repetition: 1 },
            { content: "BBB", mandatory: false, repetition: 1 }
        ]);
        expect(() => tracker.accept("BBB")).toThrow();
    });

    it("can accept the first segment again after a reset", () => {
        tracker = new Tracker([
            { content: "AAA", mandatory: false, repetition: 1 },
            { content: "BBB", mandatory: false, repetition: 1 }
        ]);
        expect(() => tracker.accept("AAA")).not.toThrow();
        expect(() => tracker.accept("BBB")).not.toThrow();
        tracker.reset();
        expect(() => tracker.accept("AAA")).not.toThrow();
    });

    describe("expecting a mandatory repeatable segment", () => {
        // Such a segment defines a repetition property higher than one. However,
        // a mandatory segment only requires the segment to be included once
        beforeEach(() => {
            tracker = new Tracker([
                { content: "AAA", mandatory: true, repetition: 2 },
                { content: "BBB", mandatory: false, repetition: 1 }
            ]);
        });

        it("can include only one repetition", () => {
            expect(() => tracker.accept("AAA")).not.toThrow();
            expect(() => tracker.accept("BBB")).not.toThrow();
        });

        it("should not exceed maximum repetitions", () => {
            expect(() => tracker.accept("AAA")).not.toThrow();
            expect(() => tracker.accept("AAA")).not.toThrow();
            expect(() => tracker.accept("AAA")).toThrow();
        });
    });

    describe("expecting a conditional segment", () => {
        beforeEach(() => {
            tracker = new Tracker([
                { content: "AAA", mandatory: false, repetition: 2 },
                { content: "BBB", mandatory: false, repetition: 1 }
            ]);
        });

        it("can skip to the next entry", () => {
            expect(() => tracker.accept("BBB")).not.toThrow();
        });

        it("should not exceed maximum repetitions", () => {
            expect(() => tracker.accept("AAA")).not.toThrow();
            expect(() => tracker.accept("AAA")).not.toThrow();
            expect(() => tracker.accept("AAA")).toThrow();
        });
    });

    describe("expecting a mandatory group", () => {
        beforeEach(() => {
            tracker = new Tracker([
                { content: [
                    { content: "AAA", mandatory: true, repetition: 1 },
                    { content: "BBB", mandatory: false, repetition: 1 }
                ], mandatory: true, repetition: 2 },
                { content: "CCC", mandatory: false, repetition: 1 }
            ]);
        });

        it("should throw if omitted", () => {
            expect(() => tracker.accept("CCC")).toThrow();
        });

        it("can include only one repetition", () => {
            expect(() => tracker.accept("AAA")).not.toThrow();
            expect(() => tracker.accept("CCC")).not.toThrow();
        });

        it("should not exceed maximum repetitions", () => {
            expect(() => tracker.accept("AAA")).not.toThrow();
            expect(() => tracker.accept("BBB")).not.toThrow();
            expect(() => tracker.accept("AAA")).not.toThrow();
            expect(() => tracker.accept("BBB")).not.toThrow();
            expect(() => tracker.accept("AAA")).toThrow();
        });
    });

    describe("expecting a conditional group", () => {
        beforeEach(() => {
            tracker = new Tracker([
                { content: [
                    { content: "AAA", mandatory: true, repetition: 1 },
                    { content: "BBB", mandatory: false, repetition: 1 }
                ], mandatory: false, repetition: 3 },
                { content: "DDD", mandatory: false, repetition: 1 }
            ]);
        });

        it("can include only one repetition", () => {
            expect(() => tracker.accept("AAA")).not.toThrow();
            expect(() => tracker.accept("DDD")).not.toThrow();
        });

        it("can include the maximal number of repetitions", () => {
            expect(() => tracker.accept("AAA")).not.toThrow();
            expect(() => tracker.accept("AAA")).not.toThrow();
            expect(() => tracker.accept("AAA")).not.toThrow();
            expect(() => tracker.accept("DDD")).not.toThrow();
        });

        it("can skip to the next entry", () => {
            expect(() => tracker.accept("DDD")).not.toThrow();
        });

        it("should not exceed maximum repetitions", () => {
            expect(() => tracker.accept("AAA")).not.toThrow();
            expect(() => tracker.accept("BBB")).not.toThrow();
            expect(() => tracker.accept("AAA")).not.toThrow();
            expect(() => tracker.accept("BBB")).not.toThrow();
            expect(() => tracker.accept("AAA")).not.toThrow();
            expect(() => tracker.accept("BBB")).not.toThrow();
            expect(() => tracker.accept("AAA")).toThrow();
        });

        it("should include all mandatory elements if included", () => {
            expect(() => tracker.accept("BBB")).toThrow();
        });
    });

    describe("expecting an optional child group", () => {
        beforeEach(() => {
            tracker = new Tracker([
                { content: [
                    { content: "AAA", mandatory: false, repetition: 1 },
                    { content: [
                        { content: "BBB", mandatory: false, repetition: 1 }
                    ], mandatory: false, repetition: 3 }
                ], mandatory: false, repetition: 3 }
            ]);
            // Move the current tracker position inide the top-level group
            expect(() => tracker.accept("AAA")).not.toThrow();
        });

        it("should retry the parent group after skipping the child group", () => {
            // Tests specifically to see what happens after leaving a group while the
            // tracker is in a probing state
            expect(() => tracker.accept("AAA")).not.toThrow();
        });
    });

    it("can skip a mandatory group without mandatory elements", () => {
        // Checking for mandatory omissions should only be done for segments and not
        // for groups
        tracker = new Tracker([
            { content: [
                { content: 'AAA', mandatory: false, repetition: 1 },
                { content: 'BBB', mandatory: false, repetition: 1 }
            ], mandatory: true, repetition: 3},
            { content: 'CCC', mandatory: false, repetition: 1 }
        ]);
        expect(() => tracker.accept("CCC")).not.toThrow();
    });

    it("should return from a mandatory path when an omission is encountered", () => {
        tracker = new Tracker([
            { content: [
                { content: [
                    { content: 'AAA', mandatory: true, repetition: 1 }
                ], mandatory: true, repetition: 3},
                { content: 'BBB', mandatory: false, repetition: 1 }
            ], mandatory: false, repetition: 3},
            { content: 'CCC', mandatory: false, repetition: 1 }
        ]);
        expect(() => tracker.accept("BBB")).toThrow();
    });

    it("should throw when omitting a mandatory segment after probing for a mandatory group repetition", () => {
        // Repetitions of a mandatory group are actually conditional in the sense
        // that a message can include the mandatory group only once. The tracker is
        // potentially in a different state after probing for such a second
        // repetition. In this test we look at what happens if we omit a mandatory
        // segment after putting the tracker in such a state. It could fail if the
        // mandatory group was added as a return path for omitted mandatory
        // segments, but not removed when leaving the group
        tracker = new Tracker([
            { content: [
                { content: 'AAA', mandatory: false, repetition: 1 }
            ], mandatory: true, repetition: 5},
            { content: 'BBB', mandatory: true, repetition: 1 },
            { content: 'CCC', mandatory: false, repetition: 1 }
        ]);
        expect(() => tracker.accept("AAA")).not.toThrow();
        expect(() => tracker.accept("CCC")).toThrow();
    });

    it("can repeat a group containing a maximally included subgroup", () => {
        // The subgroup, which is included a maximal number of times, will promp
        // the tracker to leave, whithout being in a probing state. This test makes
        // sure this situation does not interfere with the parent group.
        tracker = new Tracker([
            { content: [
                { content: 'AAA', mandatory: false, repetition: 5 },
                { content: [
                    { content: 'BBB', mandatory: false, repetition: 5 }
                ], mandatory: false, repetition: 1}
            ], mandatory: false, repetition: 5}
        ]);
        expect(() => tracker.accept("AAA")).not.toThrow();
        expect(() => tracker.accept("BBB")).not.toThrow();
        expect(() => tracker.accept("AAA")).not.toThrow();
    });
});
