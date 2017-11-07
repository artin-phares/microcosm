/**
 * Gets idea by ID
 *
 * @param {Mindmap} mindmap
 * @param {string} ideaId
 * @return {Idea}
 */
export default function getIdea(mindmap, ideaId) {
    
    const idea = mindmap.ideas.get(ideaId);

    if (!idea) {
        throw Error(`Idea '${ideaId}' was not found in mindmap`);
    }

    return idea;
}