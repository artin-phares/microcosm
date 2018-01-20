import IdeaListItemType from 'vm/shared/IdeaListItem';
import SearchBox from 'vm/shared/SearchBox';
import Lookup from 'vm/shared/Lookup';

export const MESSAGE_CONFIRM_LEAVE =
    'There are unsaved changes on the form. Leave anyway?';

export const MESSAGE_CONFIRM_REMOVE = 'Remove following idea?';

/**
 * Form for showing and editing contents of Idea (title, value, etc.)
 */
export default class IdeaForm {

    /**
     * ID of existing idea
     * @type {string}
     */
    ideaId = undefined;

    /**
     * ID of parent idea (in case preparing contents for new idea)
     * @type {string}
     */
    parentIdeaId = undefined;

    /**
     * Indicates whether form works with contents of existing idea
     * or preparing contents for new idea
     * @type {boolean}
     */
    isNewIdea = undefined;

    /**
     * Title field contents
     * @type {string}
     */
    title = undefined;

    /**
     * Value field contents
     * @type {string}
     */
    value = undefined;

    /**
     * Ideas on path from root to parent idea
     * @type {Array.<IdeaListItemType>}
     */
    rootPath = undefined;

    /**
     * Direct predecessor ideas (heads of incomming associations)
     * @type {Array.<IdeaListItemType>}
     */
    predecessors = undefined;

    /**
     * Direct successor ideas (tails of outgoing associations)
     * @type {Array.<IdeaListItemType>}
     */
    successors = undefined;

    /**
     * State of fields before last save.
     * Allows to revert state back if edit is canceled
     */
    prev = {

        /** @type {string} */
        title: undefined,

        /** @type {string} */
        value: undefined,

        /** @type {Array.<IdeaListItemType>} */
        successors: undefined
    }

    /**
     * Indicates that contents of title field is valid, otherwise should be
     * highlighted as invalid
     * @type {boolean}
     */
    isTitleValid = true;

    /**
     * Indicates that title field should be focused when form is shown
     * @type {boolean}
     */
    shouldFocusTitleOnShow = false;

    /**
     * Indicates that value field is in edit mode
     * @type {boolean}
     */
    isEditingValue = false;

    /** 
     * Indicates that additional operations (like remove idea, set color, etc)
     * are available
     * @type {boolean}
     */
    isGearOperationsAvailable = false;

    /**
     * Indicates that list of successors can be edited
     * @type {boolean}
     */
    isSuccessorsEditable = false;

    /**
     * Indicates that form changes can be saved
     * @type {boolean}
     */
    isSaveable = false;

    /**
     * Indicates that form changes can be canceled
     * @type {boolean}
     */
    isCancelable = false;

    /**
     * Search box for new successors
     * @type {SearchBox}
     */
    successorSearchBox = new SearchBox({
        lookup: new Lookup({placeholder: 'target idea...'})
    });

}