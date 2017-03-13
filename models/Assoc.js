import {newIdStr, mapObject} from 'lib/helpers/helpers';

/**
 * Association model
 */
export default class Assoc {

    /**
     * ID
     * @type {string}
     */
    id = newIdStr();

    /**
     * ID of start node
     * @type {string}
     */
    from = '';

    /**
     * ID of end node
     * @type {string}
     */
    to = '';
    
    /**
     * Value
     * @type {string}
     */
    value = '';

    /**
     * constructor
     * @param {object} obj
     */
    constructor(obj) {
        if (obj) {
            mapObject(this, obj);
        }
    }

    /**
     * Stringifies instance
     * @return {string}
     */
    toString() {
        return `[Assoc ` +
            `(${this.id}) ` +
            `(${this.from} - ${this.to}) ` +
            `(${this.value})]`;
    }
}