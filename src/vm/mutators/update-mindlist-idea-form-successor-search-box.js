import updateViewModel from 'vm/utils/update-view-model';

import StateType from 'boot/client/State';
import SearchBoxType from 'vm/shared/SearchBox';

/**
 * Updates successor search box in mindlist idea form
 * TODO: update seachbox through idea-pane mutator
 *
 * @param {StateType} state
 * @param {Partial<SearchBoxType>} data
 */
export default function(state, data) {
  const {list} = state.vm.main.mindset;
  const {successorSearchBox} = list.pane.form;

  updateViewModel(successorSearchBox, data);
}