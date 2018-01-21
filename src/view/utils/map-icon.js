import icons from 'font-awesome/css/font-awesome.css';

import Icon from 'vm/shared/Icon';

/**
 * @typedef {object} IconDescriptor
 * @prop {string} class - css class
 * @prop {string} char - unicode char
 */

/**
 * Maps icon type to icon descriptor
 * 
 * @param {Icon} icon
 * @return {IconDescriptor}
 */
export default function mapIcon(icon) {
    if (!descriptors[icon]) {
        throw Error(`Unknown icon type '${icon}'`);
    }

    return descriptors[icon];
}

/**
 * @type {Object<Icon, IconDescriptor>}
 */
const descriptors = {
    [Icon.plusCircle]: {
        class: icons.faPlusCircle,
        char: '\uf055'
    },
    [Icon.paintBrush]: {
        class: icons.faPaintBrush,
        char: '\uf1fc'
    },
    [Icon.link]: {
        class: icons.faLink,
        char: '\uf0c1'
    },
    [Icon.trash]: {
        class: icons.faTrash,
        char: '\uf1f8'
    },
    [Icon.search]: {
        class: icons.faSearch,
        char: '\uf002'
    },
    [Icon.server]: {
        class: icons.faServer,
        char: '\uf233'
    },
    [Icon.plug]: {
        class: icons.faPlug,
        char: '\uf1e6'
    },
    [Icon.home]: {
        class: icons.faHome,
        char: '\uf015'
    },
    [Icon.githubAlt]: {
        class: icons.faGithubAlt,
        char: '\uf113'
    },
    [Icon.unlink]: {
        class: icons.faUnlink,
        char: '\uf127'
    },
    [Icon.eye]: {
        class: icons.faEye,
        char: '\uf06e'
    },
    [Icon.pencil]: {
        class: icons.faPencil,
        char: '\uf040'
    },
    [Icon.close]: {
        class: icons.faClose,
        char: '\uf00d'
    },
    [Icon.plusSquareO]: {
        class: icons.faPlusSquareO,
        char: '\uf196'
    },
    [Icon.eraser]: {
        class: icons.faEraser,
        char: '\uf12d'
    }
};