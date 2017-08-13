import {guid} from 'lib/helpers/helpers';
import PouchDB from 'pouchdb';
import memoryPlugin from 'pouchdb-adapter-memory';
import findPlugin from 'pouchdb-find';

PouchDB.plugin(memoryPlugin);
PouchDB.plugin(findPlugin);

/**
 * Creates unique database
 * @return {PouchDB}
 */
export function createDB() {
    return new PouchDB(guid(), {adapter: 'memory'});
}