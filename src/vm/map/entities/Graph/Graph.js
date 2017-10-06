import EventedViewModel from 'vm/utils/EventedViewModel';

import Point from 'vm/shared/Point';
import ColorPicker from 'vm/shared/ColorPicker';
import ContextMenu from 'vm/shared/ContextMenu';
import LookupPopup from 'vm/shared/LookupPopup';

import animate from 'vm/utils/animate';

/**
 * Graph view model.
 *
 * Canvas - infinite 2D logical space containing all objects of the scene
 * Viewbox - logical rectangle fragment of canvas mapped to viewport
 *           its size and position regulated with zooming and panning
 *           aspect ratio of viewbox equals to aspect ratio of viewport
 * Viewport - physical rectangle surface of rendering engine
 */
export default class Graph extends EventedViewModel {

    static eventTypes = [
        
        'change',

        'node-title-change',

        'link-title-change',

        'node-position-change',

        'viewbox-position-change',

        'viewbox-scale-change',

        'picker-color-change',
        
        'node-menu-idea-add',

        'node-menu-idea-remove',

        // graph clicked
        'click',

        // node was right clicked
        'node-rightclick',

        // link was right clicked
        'link-rightclick',

        'association-tails-lookup-phrase-changed',

        'association-tails-lookup-suggestion-selected',

        'context-menu-item-selected'
    ]
    
    /**
     * 
     */
    constructor() {
        super();

        this.contextMenu.on('itemSelected', menuItem =>
            this.emit('context-menu-item-selected', {menuItem}));

        this.colorPicker.on('colorSelected',
            this.onPickerColorSelected.bind(this));

        this.associationTailsLookup.on('phrase-changed',
            this.onAssociationTailsLookupPhraseChanged.bind(this));

        this.associationTailsLookup.on('suggestion-selected',
            this.onAssociationTailsLookupSuggestionSelected.bind(this));
    }

    id = undefined;

    /**
     * Drawing surface
     */
    viewport = {
        width: 0,
        height: 0
    };
    
    /**
     * Fragment of canvas
     */
    viewbox = {

        // position on canvas
        x: 0,
        y: 0,

        // size
        width: 0,
        height: 0,

        // scale (affects the size)
        scale: 1,
        scaleMin: 0.2,
        scaleMax: Infinity
    };

    /**
     * Panning state
     */
    pan = {
        active: false,
        shifted: false
    };

    /**
     * Dragging state
     */
    drag = {
        active: false,
        item: null,
        startX: null,
        startY: null
    };

    /**
     * Debug state
     */
    debug = true;

    /**
     * Stringifies instance
     * @return {string}
     */
    toString() {
        return `[Graph (${this.nodes}) (${this.links})]`;
    }

    _nodes = [];
    _link = [];

    /**
     * Nodes getter
     */
    get nodes() {
        return this._nodes;
    }

    /**
     * Nodes setter
     * @param {array} nodes
     */
    set nodes(nodes) {
        nodes.forEach(this.addNodeHandlers.bind(this));
        nodes.forEach(n => n.debug = this.debug);
        this._nodes = nodes;
    }

    /**
     * Links getter
     */
    get links() {
        return this._links;
    }

    /**
     * Links setter
     * @param {array} links`
     */
    set links(links) {
        links.forEach(this.addLinkHandlers.bind(this));
        links.forEach(l => l.debug = this.debug);
        this._links = links;
    }

    /**
     * Depth of nodes which resulting size 
     * is close to original for current viewbox scale
     * @type {number}
     */
    focusDepth = undefined;

    /**
     * Lenght of longest path from root to leaf node
     * @type {number}
     */
    height = undefined;

    /**
     * Context menu of links
     */
    contextMenu = new ContextMenu();

    /**
     * Color picker
     */
    colorPicker = new ColorPicker()

    /**
     * Lookup for selecting tail idea for cross-association
     * @type {LookupPopup}
     */
    associationTailsLookup = new LookupPopup('target idea...')

    /**
     * Binds node events
     * @param {Node} node
     */
    addNodeHandlers(node) {
        node.on('title-change', title => this.emit('node-title-change', {
            nodeId: node.id,
            title
        }));
    }

    /**
     * Binds link events
     * @param {Link} link
     */
    addLinkHandlers(link) {
        link.on('title-change', title => this.emit('link-title-change', {
            linkId: link.id,
            title
        }));
    }

    /**
     * Sets viewport size
     * @param {object} opts
     * @param {number} opts.width
     * @param {number} opts.height
     */
    setViewportSize({width, height}) {
        this.viewport.width = width;
        this.viewport.height = height;

        this.recomputeViewboxSize();
    }

    /**
     * Handles click event
     */
    onClick() {
        this.contextMenu.deactivate();
        this.colorPicker.deactivate();
        this.associationTailsLookup.deactivate();
    }

    /**
     * Handles node right click event
     * @param {Node} node
     * @param {object} pos
     */
    onNodeRightClick(node, pos) {
        this.emit('node-rightclick', {pos, node});
    }

    /**
     * Handles link right click event
     * @param {Link} link
     * @param {object} pos
     */
    onLinkRightClick(link, pos) {
        this.emit('link-rightclick', {pos, link});
    }

    /**
     * Handles viewport resize event
     * @param {object} size
     */
    onViewportResize(size) {
        this.setViewportSize(size);

        this.emit('change');
    }

    /**
     * Handles mouse wheel event
     * @param {boolean} up
     * @param {Point} pos - target canvas point of mouse event
     */
    onWheel(up, pos) {
        this.animateZoom(up, pos);
    }

    /**
     * Handles key press event
     * @param {string} keyCode
     */
    onKeyPress(keyCode) {
        let panKeyStep = 20;
        let viewboxChanged = false;

        panKeyStep /= this.viewbox.scale;

        switch (keyCode) {
        case 'ArrowDown':
            this.onPan({shiftY: -panKeyStep});
            viewboxChanged = true;
            break;
        case 'ArrowUp':
            this.onPan({shiftY: panKeyStep});
            viewboxChanged = true;
            break;
        case 'ArrowLeft':
            this.onPan({shiftX: panKeyStep});
            viewboxChanged = true;
            break;
        case 'ArrowRight':
            this.onPan({shiftX: -panKeyStep});
            viewboxChanged = true;
            break;
        default:
            // skip
        }

        if (viewboxChanged) {
            this.emit('viewbox-position-change', {
                graphId: this.id,
                pos: {
                    x: this.viewbox.x,
                    y: this.viewbox.y
                }
            });
        }
    }

    /**
     * Handles pan start event
     */
    onPanStart() {
        this.pan.active = true;
    }

    /**
     * Handles pan event
     * @param {object} opts
     */
    onPan({shiftX = 0, shiftY = 0}) {
        this.pan.shifted = true;

        this.viewbox.x -= shiftX;
        this.viewbox.y -= shiftY;

        this.emit('change');
    }

    /**
     * Handles pan stop event
     */
    onPanStop() {
        if (this.pan.active && this.pan.shifted) {
            this.emit('viewbox-position-change', {
                graphId: this.id,
                pos: {
                    x: this.viewbox.x,
                    y: this.viewbox.y
                }
            });
        }

        this.pan.active = false;
        this.pan.shifted = false;
    }

    /**
     * Handles drag start event
     * @param {Node} node
     */
    onDragStart(node) {
        if (node.shaded) {
            // prevent actions on shaded nodes
            return;
        }

        this.drag = {
            active: true,
            node: node,
            startX: node.pos.x,
            startY: node.pos.y
        };
    }

    /**
     * Handles drag event
     * @param {object} opts
     */
    onDrag({shiftX, shiftY}) {
        if (!this.drag.active) {
            return;
        }

        this.moveNode({
            nodeId: this.drag.node.id,
            shift: {x: shiftX, y: shiftY}
        });
    }

    /**
     * Handles drag stop event
     */
    onDragStop() {
        if (!this.drag.active) {
            return;
        }

        this.drag.active = false;
        this.emit('node-position-change', {
            nodeId: this.drag.node.id,
            pos: this.drag.node.pos
        });
    }

    /**
     * Handles drag revert event (cancel dragging)
     */
    onDragRevert() {
        if (!this.drag.active) {
            return;
        }

        this.drag.active = false;

        this.moveNode({
            nodeId: this.drag.node.id,
            pos: {x: this.drag.startX, y: this.drag.startY}
        });
    }

    /**
     * Handles color selected event
     * @param {string} color
     */
    onPickerColorSelected(color) {

        this.emit('picker-color-change', {
            picker: this.colorPicker,
            color
        });
      
        // TODO: deactivate through action
        this.colorPicker.deactivate();
    }

    /**
     * Handles phrase changed event from association tails lookup
     * @param {*} data 
     */
    onAssociationTailsLookupPhraseChanged({phrase}) {

        this.emit('association-tails-lookup-phrase-changed', {
            lookup: this.associationTailsLookup,
            phrase
        });
    }

    /**
     * Handles suggestion selected event from association tails lookup
     * @param {object} data
     * @param {LookupSuggestion} data.suggestion
     */
    onAssociationTailsLookupSuggestionSelected({suggestion}) {

        this.emit('association-tails-lookup-suggestion-selected', {
            lookup: this.associationTailsLookup,
            suggestion
        });

        // TODO: deactivate through action
        this.associationTailsLookup.deactivate();
    }

    /**
     * Gets node
     * @param {string} nodeId
     * @return {Node}
     */
    getNode(nodeId) {
        const node = this.nodes.find(n => n.id === nodeId);
        if (!node) {
            throw Error(`No node with such id found: ${nodeId}`);
        }
        return node;
    }

    /**
     * Moves node position
     * @param {object} opts
     */
    moveNode({nodeId, pos, shift}) {
        const node = this.getNode(nodeId);

        if (shift) {
            node.pos.x += shift.x;
            node.pos.y += shift.y;
        } else {
            node.pos.x = pos.x;
            node.pos.y = pos.y;
        }

        this.emit('change');
    }

    /**
     * Animates zoom
     * @param {bool} up 
     * @param {Point} pos - target canvas point
     */
    async animateZoom(up, pos) {
        
        if (this.zoomInProgress || !this.canScaleMore(up)) {
            return;
        }

        this.zoomInProgress = true;

        const scaleStep = 0.5;
        const targetScale = this.viewbox.scale +
            ((up ? 1 : -1) * scaleStep * this.viewbox.scale);

        await animate({
            from: this.viewbox.scale,
            to: targetScale,
            duration: 250,

            onStep: scale => {
                this.zoom(scale, pos);
            }
        });

        await this.emit('viewbox-scale-change', {
            graphId: this.id,
            scale: this.viewbox.scale,
            pos: new Point(this.viewbox.x, this.viewbox.y)
        });

        this.zoomInProgress = false;
    }

    /**
     * Changes scale of the graph
     * @param {number} scale - target scale
     * @param {Point} pos - target canvas point to zoom into/out from
     */
    zoom(scale, pos) {
        const viewbox = this.viewbox;

        if (!this.canScaleMore(scale > this.viewbox.scale)) {
            // do not scale out of limits
            return;
        }

        viewbox.scale = scale;

        const {width: prevWidth, height: prevHeight} = viewbox;

        this.recomputeViewboxSize();

        // space that will be hidden/shown by zoom
        const hiddenWidth = prevWidth - viewbox.width;
        const hiddenHeight = prevHeight - viewbox.height;

        // zoom position on viewbox (ie. not on canvas)
        const viewboxX = pos.x - viewbox.x;
        const viewboxY = pos.y - viewbox.y;

        // how much of hidden/shown space we should use
        // to shift viewbox depending on zoom position
        const shiftFactorX = viewboxX / prevWidth;
        const shiftFactorY = viewboxY / prevHeight;

        // shift viewbox toward zoom position
        viewbox.x += hiddenWidth * shiftFactorX;
        viewbox.y += hiddenHeight * shiftFactorY;

        this.emit('change');
    }

    /**
     * Checks whether scale limits allow to scale more up or down
     * @param {bool} up
     * @return {bool}
     */
    canScaleMore(up) {
        return (
            (up && this.viewbox.scale < this.viewbox.scaleMax) ||
            (!up && this.viewbox.scale > this.viewbox.scaleMin)
        );
    }

    /**
     * Recomputes viewbox size
     */
    recomputeViewboxSize() {
        const viewbox = this.viewbox;

        const {min, max, round} = Math;

        viewbox.scale = max(viewbox.scaleMin, viewbox.scale);
        viewbox.scale = min(viewbox.scaleMax, viewbox.scale);
        viewbox.scale = round(viewbox.scale * 100) / 100;

        viewbox.width = round(this.viewport.width / viewbox.scale);
        viewbox.height = round(this.viewport.height / viewbox.scale);
    }
}