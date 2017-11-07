import {createDB} from 'test/utils';

import Mindmap from 'src/model/entities/Mindmap';
import Point from 'src/model/entities/Point';
import MainVM from 'src/vm/main/Main';
import MindmapVM from 'src/vm/main/Mindmap';

import toGraph from 'vm/map/mappers/mindmap-to-graph';

/**
 * Creates clean test-ready state
 * @return {object} state
 */
export default function createState() {

    // model
    const mindmap = new Mindmap();
    mindmap.pos = new Point({x: 0, y: 0});

    // view model
    const main = new MainVM();
    main.mindmap = new MindmapVM();
    main.mindmap.graph = toGraph(mindmap);

    return {
        data: {
            ideas: createDB(),
            associations: createDB(),
            mindmaps: createDB()
        },
        model: {
            mindmap
        },
        vm: {
            main
        },
        view: {
            root: document.createElement('div'),
            storeDispatch: () => {}
        }
    };
}