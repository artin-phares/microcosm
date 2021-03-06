import required from 'utils/required-params';
import Patch from 'utils/state/Patch';

import StateType from 'boot/client/State';

import getIdea from 'action/utils/get-idea';

/**
 * Sets idea color
 *
 * @param {StateType} state
 * @param {object} data
 * @param {string} data.ideaId
 * @param {string} data.color
 * @return {Patch|undefined}
 */
export default function setIdeaColor(state, data) {
  const {model} = state;
  const {mindset} = model;
  const {ideaId, color} = required(data);

  const idea = getIdea(mindset, ideaId);

  if (idea.color === color) {
    // was not changed
    return;
  }

  return new Patch('update-idea', {
    id: ideaId,
    color
  });
}
