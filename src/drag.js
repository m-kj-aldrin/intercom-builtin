/**
 * @typedef {Object} HTMLTarget
 * @property {HTMLElement} target
 * @property {HTMLElement} currentTarget
 */

import COMModule from "./elements/internal/Module.js";
import COMOut from "./elements/internal/Out.js";

/**
 * @template {DragEvent | InputEvent | MouseEvent} T
 * @typedef {T & HTMLTarget} HTMLEvent
 */

/**@param {HTMLEvent<DragEvent>} e */
function dragStart(e) {
    if (e.currentTarget != e.target) return;
    e.currentTarget.setAttribute("data-dragged", "true");
    document.documentElement.classList.add(e.currentTarget.tagName);
    document.documentElement.setAttribute("data-dragging", "true");
}

/**@param {HTMLEvent<DragEvent>} e */
function dragEnd(e) {
    e.currentTarget.removeAttribute("data-dragged");
    document.documentElement.classList.remove(e.currentTarget.tagName);
    document.documentElement.removeAttribute("data-dragging");
}

/**
 * @template {HTMLElement} T
 * @param {T} target
 */
export function draggable(target) {
    target.draggable = true;

    target.addEventListener("dragstart", dragStart);
    target.addEventListener("dragend", dragEnd);

    return target;
}

/**
 * @param {NodeListOf<HTMLElement>} children
 * @param {number} y
 */
function getClosest(children, y) {
    let closestElement = null;
    let closestoffsetY = Number.NEGATIVE_INFINITY;

    for (const child of children) {
        const childBox = child.getBoundingClientRect();
        const offsetY = y - childBox.top - childBox.height / 2;

        if (offsetY < 0 && offsetY > closestoffsetY) {
            closestElement = child;
            closestoffsetY = offsetY;
        }
    }

    return closestElement;
}

/**
 * @param {COMModule | COMOut} acceptType
 * @param {boolean} appendOnly
 * @param {HTMLEvent<DragEvent>} e
 */
function dragOver(acceptType, appendOnly, e) {
    e.preventDefault();

    /**@type {COMModule | COMOut} */ // @ts-ignore
    const dragged = document.querySelector("[data-dragged='true']");
    if (!(dragged instanceof acceptType)) return;

    /**@type {NodeListOf<HTMLElement>} */
    const children = e.currentTarget.querySelectorAll(
        `:scope > :not([data-dragged="true"])`
    );

    let closest = null;
    closest = getClosest(children, e.clientY);

    const fromList = dragged.parentElement;
    if (!fromList) return;
    const toList = e.currentTarget;
    if (!toList) return;

    if (appendOnly && fromList == toList) return;

    //   console.log(toList);
    //   dragged.attached = false;
    dragged._openConnection = true;
    // console.log("closest ", closest);
    // console.log("a only bool, ", appendOnly && fromList != toList);

    if (closest == null) {
        if (dragged == toList.lastElementChild) return;
        const d = dragged.remove();
        toList.appendChild(d);
    } else if (closest.previousElementSibling != dragged) {
        // console.log(dragged,closest);
        // console.log(toList);
        const d = dragged.remove();
        toList.insertBefore(dragged, closest);
    }
}

/**
 * @template {HTMLElement} T
 * @param {T} target
 * @param {COMModule | COMOut} acceptType
 * @param {boolean} appendOnly
 */
export function dragZone(target, acceptType, appendOnly = false) {
    target.addEventListener(
        "dragover",
        dragOver.bind({}, acceptType, appendOnly)
    );
    return target;
}
