import StateType from 'boot/client/State';

import {MESSAGE_CONFIRM_LEAVE} from 'vm/shared/IdeaForm';

/**
 * Handles successor create event from idea form
 *
 * @param {StateType} state
 * @param {object} data
 * @param {function} dispatch
 */
export default function(state, data, dispatch) {
  const {vm: {main: {mindset: {mindmap}}}} = state;

  const {form} = mindmap.ideaFormModal;

  if (form.isSaveable && !confirm(MESSAGE_CONFIRM_LEAVE)) {
    return;
  }

  dispatch({
    type: 'open-idea-form-modal',
    data: {
      isNewIdea: true,
      parentIdeaId: form.ideaId
    }
  });
}
