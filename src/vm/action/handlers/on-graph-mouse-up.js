import view from 'vm/utils/view-patch';
import PatchType from 'utils/state/Patch';

import StateType from 'boot/client/State';

import Point from 'model/entities/Point';
import stopDrag from 'vm/map/entities/Graph/methods/stop-drag';

/**
 * Handles mouse up event on graph
 * 
 * @param {StateType} state
 * @param {object} data
 * @param {function} dispatch
 * @return {PatchType|undefined}
 */
export default function(state, data, dispatch) {
    const {vm: {main: {mindset: {graph}}}} = state;

    // stop dragging node
    if (graph.drag.active) {

        // TODO: do not dispatch if position was not shifted (same as pan)
        //       update: pan is guaranteed to be shifted if active
        const node = graph.drag.node;

        dispatch({
            type: 'set-idea-position',
            data: {
                ideaId: node.id,
                posAbs: new Point(node.posAbs)
            }
        });

        return view('update-graph', stopDrag());
    }
    
    // stop panning
    if (graph.pan.active) {

        dispatch({
            type: 'set-mindset-position-and-scale',
            data: {
                mindsetId: graph.id,
                pos: new Point({x: graph.viewbox.x, y: graph.viewbox.y})
            }
        });

        return view('update-graph', {
            pan: {active: false}
        });
    }
}