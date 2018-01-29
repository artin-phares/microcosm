import MindsetType from 'model/entities/Mindset';
import MindlistType from 'vm/list/entities/Mindlist';

import IdeaPane from 'vm/list/entities/IdeaPane';
import openForm from 'vm/shared/IdeaForm/methods/open';
import openSidebar from 'vm/list/entities/IdeaSidebar/methods/open';

/**
 * Opens new or existing idea
 *
 * @param {object} opts
 * @param {MindsetType} opts.mindset
 * @param {boolean} [opts.isNewIdea  = false] - is creating new idea
 * @param {string} [opts.parentIdeaId] - ID of parent idea if creating new idea
 * @param {string} [opts.ideaId] - ID of existing idea
 * @return {Partial.<MindlistType>} update object
 */
export default function openIdea(opts) {
  const {mindset, isNewIdea = false, parentIdeaId, ideaId} = opts;

  // init sidebar
  const sidebar = openSidebar({
    mindset,
    isNewIdea,
    parentIdeaId,
    ideaId
  });

  // init idea pane
  const form = openForm({
    mindset,
    isNewIdea,
    parentIdeaId,
    ideaId
  });

  const pane = new IdeaPane({form});

  return {sidebar, pane};
}