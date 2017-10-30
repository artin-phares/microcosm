import {expect} from 'test/utils';

import mutate from 'model/mutators';

import Patch from 'src/utils/state/Patch';
import Mindmap from 'src/model/entities/Mindmap';
import Idea from 'src/model/entities/Idea';
import Association from 'src/model/entities/Association';

import values from 'src/utils/get-map-values';

describe('add-association', () => {
    
    it('should add association to map', () => {

        // setup
        const mindmap = new Mindmap();
        
        const ideaHead = new Idea({id: 'head', depth: 0, isRoot: true});
        const ideaTail = new Idea({id: 'tail', depth: 1});

        mindmap.ideas.set(ideaHead.id, ideaHead);
        mindmap.ideas.set(ideaTail.id, ideaTail);
        mindmap.root = ideaHead;

        const state = {model: {mindmap}};

        const patch = new Patch({
            type: 'add-association',
            data: {
                assoc: new Association({
                    id: 'assoc',
                    value: 'test',
                    fromId: 'head',
                    toId: 'tail'
                })
            }});

        // target
        mutate(state, patch);
        
        // check
        const assocs = values(state.model.mindmap.associations);

        expect(assocs).to.have.length(1);
        expect(assocs[0]).to.containSubset({
            id: 'assoc',
            value: 'test'
        });
    });

    it('should set head idea to association', () => {
        
        // setup
        const mindmap = new Mindmap();
        
        const headIdea = new Idea({id: 'head', depth: 0, isRoot: true});
        const ideaTail = new Idea({id: 'tail', depth: 1});

        mindmap.ideas.set(headIdea.id, headIdea);
        mindmap.ideas.set(ideaTail.id, ideaTail);
        mindmap.root = headIdea;

        const state = {model: {mindmap}};

        const patch = new Patch({
            type: 'add-association',
            data: {
                assoc: new Association({
                    id: 'assoc',
                    fromId: 'head',
                    toId: 'tail'
                })
            }});

        // target
        mutate(state, patch);

        // check
        const assocs = values(state.model.mindmap.associations);

        expect(assocs).to.have.length(1);
        expect(assocs[0]).to.containSubset({
            fromId: 'head',
            from: {id: 'head'}
        });
    });

    it('should set tail idea to association', () => {
        
        // setup
        const mindmap = new Mindmap();
        
        const headIdea = new Idea({id: 'head', depth: 0, isRoot: true});
        const ideaTail = new Idea({id: 'tail', depth: 1});

        mindmap.ideas.set(headIdea.id, headIdea);
        mindmap.ideas.set(ideaTail.id, ideaTail);
        mindmap.root = headIdea;

        const state = {model: {mindmap}};

        const patch = new Patch({
            type: 'add-association',
            data: {
                assoc: new Association({
                    id: 'assoc',
                    fromId: 'head',
                    toId: 'tail'
                })
            }});

        // target
        mutate(state, patch);

        // check
        const assocs = values(state.model.mindmap.associations);

        expect(assocs).to.have.length(1);
        expect(assocs[0]).to.containSubset({
            toId: 'tail',
            to: {id: 'tail'}
        });
    });

    it('should set association to head idea as outgoing', () => {
        
        // setup
        const mindmap = new Mindmap();
        
        const headIdea = new Idea({id: 'head', depth: 0, isRoot: true});
        const ideaTail = new Idea({id: 'tail', depth: 1});

        mindmap.ideas.set(headIdea.id, headIdea);
        mindmap.ideas.set(ideaTail.id, ideaTail);
        mindmap.root = headIdea;

        const state = {model: {mindmap}};

        const patch = new Patch({
            type: 'add-association',
            data: {
                assoc: new Association({
                    id: 'assoc',
                    fromId: 'head',
                    toId: 'tail'
                })
            }});

        // target
        mutate(state, patch);

        // check
        const ideas = values(state.model.mindmap.ideas);

        expect(ideas).to.have.length(2);
        expect(ideas).to.containSubset([{
            id: 'head',
            associationsOut: [{
                id: 'assoc'
            }]
        }]);
    });

    it('should set association to tail idea as incoming', () => {
        
        // setup
        const mindmap = new Mindmap();
        
        const headIdea = new Idea({id: 'head', depth: 0, isRoot: true});
        const ideaTail = new Idea({id: 'tail', depth: 1});

        mindmap.ideas.set(headIdea.id, headIdea);
        mindmap.ideas.set(ideaTail.id, ideaTail);
        mindmap.root = headIdea;

        const state = {model: {mindmap}};

        const patch = new Patch({
            type: 'add-association',
            data: {
                assoc: new Association({
                    id: 'assoc',
                    fromId: 'head',
                    toId: 'tail'
                })
            }});

        // target
        mutate(state, patch);

        // check
        const ideas = values(state.model.mindmap.ideas);

        expect(ideas).to.have.length(2);
        expect(ideas).to.containSubset([{
            id: 'tail',
            associationsIn: [{
                id: 'assoc'
            }]
        }]);

    });

    it('should recalculate idea depths', () => {

        // setup
        //     ______________________________
        //    /                              \
        //   (A) --> (B) --> (C) --> (D) --> (E)
        //    \_______________/
        //        new assoc
        //
        const mindmap = new Mindmap();
        
        const ideaA = new Idea({id: 'A', depth: 0, isRoot: true});
        const ideaB = new Idea({id: 'B', depth: 1});
        const ideaC = new Idea({id: 'C', depth: 2});
        const ideaD = new Idea({id: 'D', depth: 3});
        const ideaE = new Idea({id: 'E', depth: 1});

        const assocAtoB = new Association({
            fromId: ideaA.id,
            from: ideaA,
            toId: ideaB.id,
            to: ideaB
        });

        const assocAtoE = new Association({
            fromId: ideaA.id,
            from: ideaA,
            toId: ideaE.id,
            to: ideaE
        });

        const assocBtoC = new Association({
            fromId: ideaB.id,
            from: ideaB,
            toId: ideaC.id,
            to: ideaC
        });

        const assocCtoD = new Association({
            fromId: ideaC.id,
            from: ideaC,
            toId: ideaD.id,
            to: ideaD
        });

        const assocDtoE = new Association({
            fromId: ideaD.id,
            from: ideaD,
            toId: ideaE.id,
            to: ideaE
        });

        ideaA.associationsOut = [assocAtoB, assocAtoE];
        ideaB.associationsIn = [assocAtoB];
        ideaB.associationsOut = [assocBtoC];
        ideaC.associationsIn = [assocBtoC];
        ideaC.associationsOut = [assocCtoD];
        ideaD.associationsIn = [assocCtoD];
        ideaD.associationsOut = [assocDtoE];
        ideaE.associationsIn = [assocDtoE, assocAtoE];

        mindmap.associations.set(assocAtoB.id, assocAtoB);
        mindmap.associations.set(assocAtoE.id, assocAtoE);
        mindmap.associations.set(assocBtoC.id, assocBtoC);
        mindmap.associations.set(assocCtoD.id, assocCtoD);
        mindmap.associations.set(assocDtoE.id, assocDtoE);

        mindmap.ideas.set(ideaA.id, ideaA);
        mindmap.ideas.set(ideaB.id, ideaB);
        mindmap.ideas.set(ideaC.id, ideaC);
        mindmap.ideas.set(ideaD.id, ideaD);
        mindmap.ideas.set(ideaE.id, ideaE);
        mindmap.root = ideaA;

        const state = {model: {mindmap}};

        // setup patch (add cross-association)
        const patch = new Patch({
            type: 'add-association',
            data: {
                assoc: new Association({
                    fromId: 'A',
                    toId: 'C'
                })
            }});

        // target
        mutate(state, patch);

        // check
        expect(mindmap.ideas.get('A').depth).to.equal(0);
        expect(mindmap.ideas.get('B').depth).to.equal(1);
        expect(mindmap.ideas.get('C').depth).to.equal(1); // actualized
        expect(mindmap.ideas.get('D').depth).to.equal(2); // actualized
        expect(mindmap.ideas.get('E').depth).to.equal(1);
    });

    it('should fail if head idea was not found', () => {
        
        // setup
        const mindmap = new Mindmap();
        
        const headIdea = new Idea({id: 'head', isRoot: true});
        const tailIdea = new Idea({id: 'tail'});

        mindmap.ideas.set(headIdea.id, headIdea);
        mindmap.ideas.set(tailIdea.id, tailIdea);
        mindmap.root = headIdea;

        const state = {model: {mindmap}};

        const patch = new Patch({
            type: 'add-association',
            data: {
                assoc: new Association({
                    fromId: 'XXX',
                    toId: 'tail'
                })
            }});

        // target
        const result = () => mutate(state, patch);

        // check
        expect(result).to.throw(
            `Head idea 'XXX' was not found for association`);
    });

    it('should NOT fail if tail idea was not found', () => {
        
        // setup
        const mindmap = new Mindmap();
        
        const headIdea = new Idea({id: 'head', isRoot: true});

        mindmap.ideas.set(headIdea.id, headIdea);
        mindmap.root = headIdea;

        const state = {model: {mindmap}};

        const patch = new Patch({
            type: 'add-association',
            data: {
                assoc: new Association({
                    fromId: 'head',
                    toId: 'tail'
                })
            }});

        // target
        const result = () => mutate(state, patch);

        // check
        expect(result).to.not.throw();
    });

});