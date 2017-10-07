import clone from 'clone';

/**
 * Log entry for store action
 */
export default class LogEntry {

    /**
     * Action
     * @type {{type, data}}
     */
    action = undefined;

    /**
     * Action dispatching performance info
     */
    perf = {
        /**
         * Time before processing action
         * @type {number} - unix epoch
         */
        start: undefined,

        /**
         * Time after processing action
         * @type {number} - unix epoch
         */
        end: undefined
    };

    /**
     * State patch
     * @type {Patch}
     */
    patch = undefined;

    _prevState = undefined;

    /**
     * Gets state before action
     * @return {object}
     */
    get prevState() {
        return this._prevState;
    }

    /**
     * Sets state before action
     * @param {object} state
     */
    set prevState(state) {
        this._prevState = {
            model: clone(state.model),
            vm: clone(state.vm)
        };
    }

    _nextState = undefined;

    /**
     * Gets state after action
     * @return {object}
     */
    get nextState() {
        return this._nextState;
    }

    /**
     * Sets state after action
     * @param {object} state
     */
    set nextState(state) {
        this._nextState = {
            model: clone(state.model),
            vm: clone(state.vm)
        };
    }

    /**
     * Indicates action failed
     * @type {boolean}
     */
    get failed() {
        return this.dispatchFailed || this.mutationFailed;
    }

    /**
     * Indicates dispatch failed
     * @type {boolean}
     */
    dispatchFailed = false;

    /**
     * Indicates mutation failed
     * @type {boolean}
     */
    mutationFailed = false;

    /**
     * Error from dispatch or mutation if failed
     * @type {Error}
     */
    error = undefined;

    /**
     * Constructor
     */
    constructor() {
        Object.seal(this);
    }

}