import required from 'utils/required-params';
import patch from 'vm/utils/patch-view';

import zoomGraph from 'action/utils/zoom-graph';
import checkScaleLimits from 'action/utils/check-graph-scale-limits';
import mapCoordsToCanvas from 'action/utils/map-viewport-to-canvas-coords';
import animate from 'vm/utils/animate';
import Point from 'vm/shared/Point';

/**
 * Animates graph scale towards certain canvas position
 * 
 * @param {object} state
 * @param {object} data
 * @param {object} data.up  - scale up or down
 * @param {object} data.pos - target viewport position
 * @param {function} dispatch
 * @param {function} mutate
 * @param {function} scheduleAnimationStep
 * @return {Patch}
*/
export default async function animateGraphZoom(state, data, dispatch, mutate) {
    const {vm: {main: {mindmap: {graph}}}} = state;
    const {up, pos: viewportPos} = required(data);
    const {scheduleAnimationStep} = data;

    const {viewbox, zoomInProgress} = graph;

    if (zoomInProgress || !checkScaleLimits({viewbox, up})) {
        // zoom already running or limits reached
        return;
    }

    mutate(patch('update-graph', {zoomInProgress: true}));

    // convert coordinates from viewport to canvas
    const pos = mapCoordsToCanvas(viewportPos, viewbox);

    const scaleStep = 0.5;
    const targetScale = viewbox.scale +
        ((up ? 1 : -1) * scaleStep * viewbox.scale);

    await animate({
        from: graph.viewbox.scale,
        to: targetScale,
        duration: 250,
        scheduleAnimationStep,

        onStep: async scale => {
            const viewbox = zoomGraph({
                viewbox: graph.viewbox,
                viewport: graph.viewport,
                scale,
                pos
            });
            await mutate(patch('update-graph', {viewbox}));
        }
    });

    await dispatch({
        type: 'set-mindmap-scale',
        data: {
            mindmapId: graph.id,
            scale: graph.viewbox.scale,
            pos: new Point(graph.viewbox.x, graph.viewbox.y)
        }
    });

    return patch('update-graph', {zoomInProgress: false});
}