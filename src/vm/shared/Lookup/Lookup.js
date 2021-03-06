import initProps from 'utils/init-props';

import ViewModel from 'vm/utils/ViewModel';

import LookupSuggestionType from 'vm/shared/LookupSuggestion';

/**
 * Lookup
 *
 * Designed to be totally reusable in different places. As such, it does not
 * have any references to concrete searchable entities or search logic
 * (everything should be configured).
 */
export default class Lookup extends ViewModel {
  /**
   * Search phrase
   * @type {string}
   */
  phrase = '';

  /**
   * Suggestions list
   * @type {Array.<LookupSuggestionType>}
   */
  suggestions = [];

  /**
   * Id of suggestion highlighted
   * in the list of suggestions
   * @type {string|undefined}
   */
  highlightedSuggestionId;

  /**
   * Indicates that lookup is loading suggestions
   * @type {boolean}
   */
  loading = false;

  /**
   * Indicates that lookup input field is focused
   * @type {boolean}
   */
  focused = false;

  /**
   * Input placeholder
   * @type {string|undefined}
   */
  placeholder;

  /**
   * Indicates 'nothing found' label is shown
   * @type {boolean}
   */
  nothingFoundLabelShown = false;

  /**
   * Gets action to perform on phrase change
   * @type {function|undefined}
   */
  onPhraseChangeAction;

  /**
   * Gets action to perform on suggestion select
   * @type {function({suggestion})|undefined}
   */
  onSelectAction;

  /**
   * Constructor
   * @param {Partial<Lookup>} [props]
   */
  constructor(props) {
    super();
    initProps(this, props);
  }
}
