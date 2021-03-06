import PatchType from 'utils/state/Patch';
import view from 'vm/utils/view-patch';

import StateType from 'boot/client/State';

import onToggleGearMenu from 'vm/shared/IdeaForm/methods/on-toggle-gear-menu';

/**
 * Handles toggle gear menu event from idea form
 *
 * @param {StateType} state
 * @return {PatchType}
 */
export default function(state) {
  const {
    vm: {
      main: {
        mindset: {mindmap}
      }
    }
  } = state;

  const {form} = mindmap.ideaFormModal;

  return view('update-idea-form-modal', {
    form: onToggleGearMenu(form)
  });
}
