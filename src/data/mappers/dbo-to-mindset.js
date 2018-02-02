import Mindset from 'model/entities/Mindset';

/**
 * Maps dbo to mindset model
 * @param {object} dbo
 * @return {Mindset}
 */
export default function dboToMindset(dbo) {
  const model = new Mindset();

  model.id = dbo._id;
  model.focusIdeaId = dbo.focusIdeaId;

  return model;
}
