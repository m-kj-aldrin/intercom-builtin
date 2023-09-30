/**@typedef {import("./internal/Chain").default | import("./internal/Module") | import("./internal/Out").default} ComUnion */
/**@typedef {"connected" | "disconnected" | "change"} BusEventType */

/**
 * @typedef {Object} ComBusDetail
 * @property {BusEventType} type
 * @property {ComUnion} emitter
 * @property {import("./internal/Chain").default} [chain]
 * @property {import("./internal/Module").default} [module]
 * @property {import("./internal/Out").default} [out]
 */

/**
 * @extends {CustomEvent<ComBusDetail>}
 */
export default class ComBusEvent extends CustomEvent {
    /**
     *
     * @param {BusEventType} type
     * @param {ComUnion} emitter
     * @param {boolean} [composed]
     */

    constructor(type, emitter, composed = false) {
        super("com:bus", {
            composed,
            bubbles: true,
            detail: {
                type,
                emitter,
            },
        });
    }
}
