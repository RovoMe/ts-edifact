/**
 * @author Roman Vottner
 * @copyright 2021 Roman Vottner
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

import { DomHandler, DomHandlerOptions } from "htmlparser2";
import { Node, Element } from "htmlparser2/node_modules/domhandler";

type Callback = (error: Error | null, dom: Node[]) => void;
type ElementCallback = (element: Element) => void;

/**
 * Customization of the `DomHandler` class to allow for extending the behavior
 * performed on processing text and "open tags by the dom handler.
 *
 * This implementation is necessary due to a version update of htmlparser2
 * and/or domhandler which now manages elements passed to the `opentag` method
 * by putting such on an `openTag` stack and removing these on processing
 * `onclosetag` calls. By replacing the function calls as previously done
 * DomHandler isn't able to manage this tag stack properly and thus invalid
 * operations are attempted on `undefined` references.
 *
 * This implementation overrides `ontext` and `onopentag` methods of DomHandler
 * and defines two replacement functions (`onText` and`onOpenTag`), which need
 * to be implemented by the user class. These replacement functions are invoked
 * after the parent methods got called.
 */
export abstract class UNECEDomHandler extends DomHandler {

    constructor(callback?: Callback | null,
        options?: DomHandlerOptions | null,
        elementCB?: ElementCallback) {
        super(callback, options, elementCB);
    }

    /**
     * Do not use this method. Please use {@link onText} instead.
     *
     * This method just ensures that the parent method is executed before an
     * overriden version of {@link onText}
     *
     * @internal
     */
    override ontext(data: string): void {
        super.ontext(data);
        this.onText(data);
    }

    /**
     * Indicates that the handler is currently processing a text node of the
     * HTML document. The actual content of the text node is present in the
     * given `data` object passed to this method.
     *
     * @param data The content of the text node
     */
    public abstract onText(data: string): void;

    /**
     * Do not use this method. Please use {@link onOpenTag} instead.
     *
     * This method just ensures that the parent method is executed before an
     * overriden version of {@link onOpenTag}
     *
     * @internal
     */
    override onopentag(name: string, attribs: { [key: string]: string }): void {
        super.onopentag(name, attribs);
        this.onOpenTag(name, attribs);
    }

    /**
     * Indicates that the hander is currently processing a HTML tag that
     * contains further data. The open tag is identified by the given `name`
     * argument. If the tag has any attributes, these will be available in the
     * `attribs` argument.
     *
     * @param name The name of the opening tag found
     * @param attribs Any attributes attached to this tag
     */
    public abstract onOpenTag(name: string, attribs: { [key: string]: string }): void;
}
