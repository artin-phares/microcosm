import assert from 'assert';
import required from 'utils/required-params';
import Patch from './Patch';

/**
 * Collection of registered action handlers
 * TODO: rename to ActionHandler (or smth. better)
 * "dispatch" means "send". only valid place for sending
 * an action to - is Store (store.dispatch)
 */
export default class Dispatcher {

    _handlers = [];

    /**
     * Registers handler for action
     * @param {string} type - action type
     * @param {function} handler
     */
    reg(type, handler) {

        if (this._handlers.some(d => d.type === type)) {
            throw Error(`Action '${type}' already has registered handler`);
        }
        
        this._handlers.push({type, handler});
    }

    /**
     * Gets iterator over handlers
     * @return {object}
     */
    [Symbol.iterator]() {
        return this._handlers[Symbol.iterator]();
    }
    
    /**
     * Executes registered handler for an action
     * @param {object} state
     * @param {object} action
     * @return {promise.<Patch>}
     */
    async dispatch(state, action) {
        const {type} = required(action);
        const {data} = action;

        const actionHandler = this._handlers
            .find(ah => ah.type === type);

        if (!actionHandler) {
            throw Error(`Unknown action type '${type}'`);
        }

        // Q: why pass 'handle' function for calling child handlers,
        // when parent handler can explicitly 'import' child handler module?
        // A: because in this case parent handler would also need to pass
        // state, handle, etc. to child handler.
        // with 'handle' function you can handle actions with same
        // interface as if handling outside the store.
        const handle = this.dispatch.bind(this, state);

        const patch = await actionHandler.handler(state, data, handle);

        if (patch !== undefined && !(patch instanceof Patch)) {
            throw Error(
                `Action handler should return undefined or ` +
                `instance of Patch, but returned '${patch}'`);
        }

        return patch || new Patch();
    }

    /**
     * Combines several dispatchers to single one
     * @param {array.<Dispatcher>} dispatchers
     * @return {Dispatcher}
     */
    static combine(...dispatchers) {

        assert(dispatchers.every(g => g instanceof Dispatcher),
            'Each argument should be instance of Dispatcher');

        const dispatcher = new Dispatcher();

        dispatchers
            .forEach(d => [...d]
                .forEach(ah => dispatcher.reg(ah.type, ah.handler)));

        return dispatcher;
    }
}