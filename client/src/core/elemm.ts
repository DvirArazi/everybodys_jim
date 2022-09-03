export const Elem = <K extends keyof HTMLElementTagNameMap>(
        tagName: K,
        properties?: Partial<HTMLElementTagNameMap[K]>,
        children?: Node[],
        style?: Partial<CSSStyleDeclaration>
    ) => {

    const element = document.createElement(tagName);

    if (properties != undefined) {
        Object.assign(element, properties);
    }

    if (children != undefined) {
        for (const child of children) {
            element.appendChild(child);
        }
    }

    if (style != undefined) {
        Object.assign(element.style, style);
    }

    return element;
}