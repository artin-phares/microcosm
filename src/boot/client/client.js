import PouchDB from 'pouchdb';

import Store from 'utils/state/Store';

import dispatcher from 'action/dispatcher';
import initialState from './initial-state';
import logger from 'utils/state/middlewares/logger';
import combine from 'utils/state/combine-mutators';

import {connect} from 'vm/utils/store-connect';

import mutateData from 'data/mutators';
import mutateModel from 'model/mutators';
import mutateVM from 'vm/mutators';
import mutateView from 'view/mutators';

// for devtools Fauxton extension
window.PouchDB = PouchDB;

/**
 * Startup
 */
async function start() {

    const store = new Store(
        dispatcher,
        combine([
            mutateData,
            mutateModel,
            mutateVM,
            mutateView
        ]),
        initialState,
        [logger]);

    connect.to(store);

    // warm up state
    await store.dispatch({
        type: 'init',
        data: {
            data: {
                ideas: new PouchDB('ideas'),
                associations: new PouchDB('associations'),
                mindmaps: new PouchDB('mindmaps')
            },
            view: {
                root: document.querySelector('#root')
            }
        }});
}

start();