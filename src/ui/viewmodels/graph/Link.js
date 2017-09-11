import EventedViewModel from '../shared/EventedViewModel';

/**
 * Link view model
 */
export default class Link extends EventedViewModel {

    static eventTypes = [

        // state changed
        'change',

        // link title changed
        'title-change'
    ]

    /**
     * Start node
     * @type {Node}
     */
    from;

    /**
     * End node
     * @type {Node}
     */
    to;

    /**
     * ID of link
     */
    id = undefined;
    
    /**
     * Link title state
     */
    title = {
        value: '',
        editing: false,
        editable: true,
        visible: true
    };

    /**
     * Debug state
     */
    debug = false;

    /**
     * constructor
     * @param {Node} fromNode
     * @param {Node} toNode
     */
    constructor(fromNode, toNode) {
        super();

        this.from = fromNode;
        this.to = toNode;
    }

    /**
     * Stringifies instance
     * @return {string}
     */
    toString() {
        return `[Link` +
            (this.isBOI ? '* ' : ' ') +
            `(${this.id}) ` +
            `(${this.from.pos.x} x ${this.from.pos.y}) - ` +
            `(${this.to.pos.x} x ${this.to.pos.y}) ` +
            `(${this.color}) ` +
            `(${this.title})]`;
    }

    /**
     * Is basic oriented idea (BOI)?
     */
    get isBOI() {
        return this.from.isCentral;
    }

    /**
     * Gets link color
     */
    get color() {
        return this.to.color;
    }

    /**
     * Handles title click event
     */
    onTitleClick() {
        if (this.title.editable && !this.title.editing) {
            this.title.editing = true;
            this.emit('change');
        }
    }

    /**
     * Handles title blur event
     */
    onTitleBlur() {
        if (this.title.editable && this.title.editing) {
            this.title.editing = false;
            this.emit('change');
        }
    }

    /**
     * Handles title change event
     * @param {string} title
     */
    onTitleChange(title) {
        this.emit('title-change', title);
    }

}