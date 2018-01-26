import PatchType from 'utils/state/Patch';
import view from 'vm/utils/view-patch';

import StateType from 'boot/client/State';

import {
  MESSAGE_CONFIRM_REMOVE,
  MESSAGE_CONFIRM_LEAVE
} from 'vm/shared/IdeaForm';
import openIdea from 'vm/list/entities/Mindlist/methods/open-idea';

/**
 * Handles remove event from mindlist idea form
 *
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.ideaId
 * @param {function} dispatch
 * @return {PatchType}
 */
export default function(state, data, dispatch) {
  const {model: {mindset}} = state;
  const {vm: {main: {mindset: {list}}}} = state;

  const {form} = list.pane;

  const idea = mindset.ideas.get(form.ideaId);

  // ensure changes are saved
  if (form.isSaveable && !confirm(MESSAGE_CONFIRM_LEAVE)) {
    return;
  }

  // ensure remove
  if (!confirm(`${MESSAGE_CONFIRM_REMOVE}\n\n${idea.title}\n`)) {
    return;
  }

  dispatch({
    type: 'remove-idea',
    data: {ideaId: form.ideaId}
  });

  // move to parent
  const parentId = idea.edgeFromParent.from.id;
  return view('update-mindlist', openIdea({mindset, ideaId: parentId}));
}
