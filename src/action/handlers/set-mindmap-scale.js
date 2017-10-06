import Patch from 'utils/state/Patch';

/**
 * Sets mindmap scale
 * 
 * @param {object} data
 * @param {string} data.mindmapId
 * @param {number} data.scale - target scale
 * @param {Point} data.pos - new position of viewbox on canvas
 * @return {Patch}
 */
export default function setMindmapScale(
    {mindmapId, scale, pos}, {model: {mindmap}}) {
    
    if (mindmap.id !== mindmapId) {
        throw Error('Setting scale of not loaded mindmap');
    }

    return new Patch('update mindmap', {
        id: mindmapId,
        scale,
        x: pos.x,
        y: pos.y
    });
}