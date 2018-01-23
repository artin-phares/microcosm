import clone from 'clone';
import assert from 'utils/assert';
import PatchType from 'utils/state/Patch';
import ActionType from 'utils/state/Action';

import StateType from 'boot/client/State';

/**
 * Log entry for store action
 */
export default class LogEntry {
  /**
   * Action
   * @type {ActionType|undefined}
   */
  action = undefined;

  /**
   * Action dispatching performance info
   */
  perf = {
    dispatch: {
      /**
       * Time before dispatching action
       * @type {number|undefined} - milliseconds from origin time
       */
      start: undefined,

      /**
       * Time after dispatching action
       * @type {number|undefined} - milliseconds from origin time
       */
      end: undefined,

      /**
       * Gets total duration of action dispatch
       */
      get duration() {
        assert(this.start !== undefined, `Invalid dispatch start time`);
        assert(this.end !== undefined, `Invalid dispatch end time`);
        return Math.floor(this.end - this.start);
      }
    },

    /**
     * Performance of handling phase of dispatch
     */
    handler: {
      /**
       * Time before handling action
       * @type {number|undefined} - milliseconds from origin time
       */
      start: undefined,

      /**
       * Time after handling action
       * @type {number|undefined} - milliseconds from origin time
       */
      end: undefined,

      /**
       * Gets total duration of action handling
       */
      get duration() {
        assert(this.start !== undefined, `Invalid handler start time`);
        assert(this.end !== undefined, `Invalid handler end time`);
        return Math.floor(this.end - this.start);
      }
    },

    /**
     * Performance of state mutation phase of dispatch
     */
    mutation: {
      /**
       * Time before state mutation
       * @type {number|undefined} - milliseconds from origin time
       */
      start: undefined,

      /**
       * Time after state mutation
       * @type {number|undefined} - milliseconds from origin time
       */
      end: undefined,

      /**
       * Gets total duration of state mutation
       */
      get duration() {
        assert(this.start !== undefined, `Invalid mutation start time`);
        assert(this.end !== undefined, `Invalid mutation end time`);
        return Math.floor(this.end - this.start);
      }
    }
  };

  /**
   * State patch
   * @type {PatchType|undefined}
   */
  patch = undefined;

  /**
   * @type {object|undefined}
   */
  _prevState = undefined;

  /**
   * Gets state before action
   * @return {StateType}
   */
  get prevState() {
    return this._prevState;
  }

  /**
   * Sets state before action
   * @param {StateType} state
   */
  set prevState(state) {
    this._prevState = {
      model: clone(state.model),
      vm: clone(state.vm)
    };
  }

  /**
   * @type {object|undefined}
   */
  _nextState = undefined;

  /**
   * Gets state after action
   * @return {StateType}
   */
  get nextState() {
    return this._nextState;
  }

  /**
   * Sets state after action
   * @param {StateType} state
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
    return this.handlerFailed || this.mutationFailed;
  }

  /**
   * Indicates handler failed
   * @type {boolean}
   */
  handlerFailed = false;

  /**
   * Indicates mutation failed
   * @type {boolean}
   */
  mutationFailed = false;

  /**
   * Error from handler or mutation if failed
   * @type {Error|undefined}
   */
  error = undefined;

  /**
   * Number of actions of same type
   * that were throttled before this one
   * @type {number}
   */
  throttledCount = 0;

  /**
   * Child actions that were initiated by this action
   * @type {Array.<ActionType>}
   */
  childActions = [];

  /**
   * Constructor
   */
  constructor() {
    Object.seal(this);
  }
}
