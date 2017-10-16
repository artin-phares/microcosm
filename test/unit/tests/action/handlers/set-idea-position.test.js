import {expect} from 'test/utils';

import Mindmap from 'src/model/entities/Mindmap';
import Idea from 'src/model/entities/Idea';

import handler from 'src/action/handler';
const handle = handler.handle.bind(handler);

describe('set-idea-position', () => {
    
    it('should set idea position', () => {

        // setup
        const mindmap = new Mindmap();
        mindmap.ideas.set('id', new Idea({
            id: 'id',
            x: 100,
            y: 100
        }));

        const state = {model: {mindmap}};

        // target
        const patch = handle(state, {
            type: 'set-idea-position',
            data: {
                ideaId: 'id',
                pos: {
                    x: 200,
                    y: 200
                }
            }
        });

        // check
        expect(patch).to.have.length(1);
        expect(patch['update-idea']).to.exist;
        expect(patch['update-idea'][0].data).to.deep.equal({
            id: 'id',
            x: 200,
            y: 200
        });

    });

    it('should target all state layers', () => {

        // setup
        const mindmap = new Mindmap();
        mindmap.ideas.set('id', new Idea({
            id: 'id',
            x: 100,
            y: 100
        }));

        const state = {model: {mindmap}};

        // target
        const patch = handle(state, {
            type: 'set-idea-position',
            data: {
                ideaId: 'id',
                pos: {
                    x: 200,
                    y: 200
                }
            }
        });

        // check
        expect(patch.hasTarget('data')).to.be.true;
        expect(patch.hasTarget('model')).to.be.true;
        expect(patch.hasTarget('vm')).to.be.true;
        expect(patch.hasTarget('view')).to.be.true;
    });

});