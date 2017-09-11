import {mapObject} from 'lib/helpers/helpers';

import * as ideaStorage from 'storage/ideas';
import * as assocStorage from 'storage/associations';
import * as mindmapStorage from 'storage/mindmaps';

import buildGraph from 'lib/graph/build-ideas-graph';

/**
 * Applies patch to model state
 * @param {object} model
 * @param {Patch} patch
 * @return {object} new model state
 */
export default async function mutate(model, patch) {
    
    let mutated = model;

    await Promise.all(patch.map(async function(mutation) {
        mutated = await apply(mutated, mutation);
    }));

    return mutated;
}

/**
 * Applies single mutation to state
 * TODO: refactor switch-case to separate functions (onInit, onAddIdea, etc.)
 * 
 * @param {{mindmap}} model
 * @param {{type, data}} mutation
 * @return {object} new model state
 */
async function apply(model, mutation) {

    const {mindmap} = model;

    switch (mutation.type) {

    case 'init': {

        const {db} = mutation.data;

        // data
        const ideas = await ideaStorage.getAll(db.ideas);
        const assocs = await assocStorage.getAll(db.associations);
        const mindmaps = await mindmapStorage.getAll(db.mindmaps);

        if (mindmaps.length === 0) {
            throw Error('Mindmap database is empty');
        }

        // TDB: get first mindmap
        if (mindmaps.length > 1) {
            console.warn(
                'There is more than one mindmap, but taking first now');
        }

        const mindmap = mindmaps[0];

        mindmap.root = buildGraph(ideas, assocs);
        
        mindmap.associations = assocs;
        mindmap.ideas = ideas;

        model.mindmap = mindmap;
        break;
    }

    case 'add idea': {
        const idea = mutation.data;
        mindmap.ideas.push(idea);

        if (idea.isCentral) {

            // add root idea
            if (mindmap.root) {
                throw Error('Mindmap already has root idea');
            }

            mindmap.root = idea;

        } else {

            // connect to incoming associations
            const assocs = mindmap.associations.filter(a => a.toId === idea.id);
        
            if (!assocs.length) {
                throw Error(
                    `No incoming associations found for idea '${idea.id}'`);
            }
    
            assocs.forEach(a => a.to = idea);
        }

        idea.associations = [];
        
        break;
    }

    case 'update idea': {
        const patch = mutation.data;
        const idea = mindmap.ideas.find(i => i.id === patch.id);

        if (!idea) {
            throw Error(`Idea '${patch.id}' was not found`);
        }

        mapObject(idea, patch);
        break;
    }

    case 'remove idea': {
        const id = mutation.data.id;
        const index = mindmap.ideas.findIndex(i => i.id === id);
        mindmap.ideas.splice(index, 1);

        // disconnect from incoming associations
        const assocs = mindmap.associations.filter(a => a.toId === id);
        assocs.forEach(a => {
            a.toId = null;
            a.to = null;
        });

        break;
    }

    case 'add association': {
        const assoc = mutation.data;
        mindmap.associations.push(assoc);

        // connect with starting idea
        const startingIdea = mindmap.ideas.find(i => i.id === assoc.fromId);
        if (!startingIdea) {
            throw Error(
                `Starting idea '${assoc.fromId}' not found for association`);
        }

        assoc.from = startingIdea;
        startingIdea.associations = startingIdea.associations || [];
        startingIdea.associations.push(assoc);

        // connect with ending idea
        const endingIdea = mindmap.ideas.find(i => i.id === assoc.toId);
        if (endingIdea) {

            // do not throw error, because
            // ending idea can be not added yet
            // in scenario of creating new idea
            // (new association added before new idea)
            assoc.to = endingIdea;
        }

        break;
    }

    case 'update association': {
        const patch = mutation.data;
        const assoc = mindmap.associations.find(a => a.id === patch.id);

        if (!assoc) {
            throw Error(`Association '${patch.id}' was not found`);
        }

        mapObject(assoc, patch);
        break;
    }

    case 'remove association': {
        const id = mutation.data.id;
        const assoc = mindmap.associations.find(a => a.id === id);

        if (!assoc) {
            throw Error(`Association '${id}' was not found`);
        }

        // remove from list
        let index = mindmap.associations.findIndex(a => a === assoc);
        mindmap.associations.splice(index, 1);

        // disconnect from starting idea
        if (!assoc.from) {
            throw Error(`Association '${id}' not connected to starting idea`);
        }

        const startingIdeaAssocs = assoc.from.associations;
        index = startingIdeaAssocs.findIndex(a => a === assoc);

        if (index === -1) {
            throw Error(
                `Starting idea '${assoc.from.id}' not connected ` +
                `to association '${id}'`);
        }

        startingIdeaAssocs.splice(index, 1);
        break;
    }

    case 'update mindmap': {
        const patch = mutation.data;
        mapObject(mindmap, patch);
        break;
    }

    default:
        throw Error(`Unknown mutation '${mutation.type}'`);
    }

    return model;
}