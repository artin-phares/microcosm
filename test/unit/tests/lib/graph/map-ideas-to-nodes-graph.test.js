import {expect} from 'chai';

import Idea from 'src/domain/models/Idea';
import Association from 'src/domain/models/Association';

import mapGraph from 'src/lib/graph/map-ideas-to-nodes-graph';

describe('map-ideas-to-nodes-graph', () => {

    it('should map tree graph', () => {
        
        // setup tree graph
        //
        //       (root idea)
        //         /     \
        //    (idea 1)  (idea 2)
        //                 \
        //               (idea 3)
        //
        const rootIdea = new Idea({id: 'root idea', isCentral: true});
        const idea1 = new Idea({id: 'idea 1'});
        const idea2 = new Idea({id: 'idea 2'});
        const idea3 = new Idea({id: 'idea 3'});

        const assoc1 = new Association({
            id: 'assoc 1',
            from: rootIdea,
            to: idea1
        });

        const assoc2 = new Association({
            id: 'assoc 2',
            from: rootIdea,
            to: idea2
        });

        rootIdea.associations = [
            assoc1,
            assoc2
        ];

        const assoc3 = new Association({
            id: 'assoc 3',
            from: idea2,
            to: idea3
        });

        idea1.associations = [];
        idea3.associations = [];
        idea2.associations = [
            assoc3
        ];

        // target
        const {rootNode} = mapGraph(rootIdea);

        // check
        expect(rootNode).to.exist;
        expect(rootNode).to.containSubset({
            id: 'root idea',
            links: [{
                id: 'assoc 1',
                from: {id: 'root idea'},
                to: {id: 'idea 1'}
            }, {
                id: 'assoc 2',
                from: {id: 'root idea'},
                to: {
                    id: 'idea 2',
                    links: [{
                        id: 'assoc 3',
                        from: {id: 'idea 2'},
                        to: {id: 'idea 3'}
                    }]
                }
            }]
        });

    });

    it('should map cyclic graph', () => {

        // setup cyclic graph
        //
        //     (root idea) ---> (idea 1)
        //              ^         |
        //               \        |
        //                \       |
        //                 \      v
        //                  (idea 2)
        //
        const rootIdea = new Idea({id: 'root idea', isCentral: true});
        const idea1 = new Idea({id: 'idea 1'});
        const idea2 = new Idea({id: 'idea 2'});

        const assoc1 = new Association({
            id: 'assoc 1',
            from: rootIdea,
            to: idea1
        });

        rootIdea.associations = [assoc1];

        const assoc2 = new Association({
            id: 'assoc 2',
            from: idea1,
            to: idea2
        });

        idea1.associations = [assoc2];

        const assoc3 = new Association({
            id: 'assoc 3',
            from: idea2,
            to: rootIdea
        });

        idea2.associations = [assoc3];

        // target
        const {rootNode} = mapGraph(rootIdea);

        // check
        expect(rootNode).to.exist;
        expect(rootNode).to.containSubset({
            id: 'root idea',
            links: [{
                id: 'assoc 1',
                from: {id: 'root idea'},
                to: {
                    id: 'idea 1',
                    links: [{
                        id: 'assoc 2',
                        from: {id: 'idea 1'},
                        to: {
                            id: 'idea 2',
                            links: [{
                                id: 'assoc 3',
                                from: {id: 'idea 2'},
                                to: {id: 'root idea'}
                            }]
                        }
                    }]
                }
            }]
        });

    });

    it('should return list of nodes and links', () => {
        
        // setup tree graph
        //
        //       (root idea)
        //         /     \
        //    (idea 1)  (idea 2)
        //                 \
        //               (idea 3)
        //
        const rootIdea = new Idea({id: 'root idea', isCentral: true});
        const idea1 = new Idea({id: 'idea 1'});
        const idea2 = new Idea({id: 'idea 2'});
        const idea3 = new Idea({id: 'idea 3'});

        const assoc1 = new Association({
            id: 'assoc 1',
            from: rootIdea,
            to: idea1
        });

        const assoc2 = new Association({
            id: 'assoc 2',
            from: rootIdea,
            to: idea2
        });

        rootIdea.associations = [
            assoc1,
            assoc2
        ];

        const assoc3 = new Association({
            id: 'assoc 3',
            from: idea2,
            to: idea3
        });

        idea1.associations = [];
        idea3.associations = [];
        idea2.associations = [
            assoc3
        ];

        // target
        const {nodes, links} = mapGraph(rootIdea);

        // check
        expect(nodes).to.have.length(4);
        expect(links).to.have.length(3);
    });

});