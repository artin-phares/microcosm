import React, {Component} from 'react';
import cx from 'classnames';

import Point from 'model/entities/Point';
import NodeVmType from 'vm/map/entities/Node';

import Group from 'view/shared/svg/Group';
import Circle from 'view/shared/svg/Circle';
import Text from 'view/shared/svg/Text';

import NodeDebug from '../NodeDebug';

import classes from './Node.css';

const TEXT_AREA_POS = new Point({x: 0, y: -10});

// eslint-disable-next-line valid-jsdoc
/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {NodeVmType} node
 * 
 * events
 * @prop {function({button})} onMouseDown
 * @prop {function()} onContextMenu
 * @prop {function()} onClick
 * 
 * @extends {Component<Props>}
 */
export default class Node extends Component {

    /** Indicates that mouse was moved after left button downed */
    mouseMovedAfterMouseDown = false;

    onMouseDown = e => {

        if (e.button === 2) {
            // Q: why emitting context menu by 'mouse down' event and not
            //    'context menu' event?
            // A: because it allows to select context menu item by holding
            //    right mouse button:
            //    press right button to show context menu, while holding right
            //    button move mouse to target menu item, release button upon the
            //    item to select it
            this.props.onContextMenu();
        }

        this.props.onMouseDown({
            button: e.nativeEvent.which === 1 ? 'left' : 'right'
        });
        e.stopPropagation();
    }

    onMouseMove = e => {
        if (e.buttons === 1) {
            // mouse moved while holding left button.
            this.mouseMovedAfterMouseDown = true;
        }
    }

    onMouseUp = e => {

        if (e.button === 2) {
            // right mouse button should not initiate click
            return;
        }

        if (this.mouseMovedAfterMouseDown) {
            
            // only initiate click event when it is a clean click,
            // ie. after mouse is down - it is not moved there. otherwise
            // consider mouse-up as part of some other action on parent.
            // (eg. when dragging node subsequent mouse-up should not
            // be considered as click on the node, but as end of node dragging)
            this.mouseMovedAfterMouseDown = false;
            return;
        }

        this.props.onClick();
    }

    onClick = e => {
        // do not propagate click to graph to not disable idea form modal
        e.stopPropagation();
    }

    onContextMenu = e => {
        // prevent default context menu in favor of custom one
        e.preventDefault();
    }

    render() {
        
        const {
            className,
            node
        } = this.props;

        const gradientId = `node-gradient-${node.id}`;

        return (
            <Group
                className={cx(
                    classes.root, className,
                    {[classes.shaded]: node.shaded})}
                pos={node.posAbs}
                scale={node.scale}
                onMouseDown={this.onMouseDown}
                onMouseMove={this.onMouseMove}
                onMouseUp={this.onMouseUp}
                onClick={this.onClick}
                onContextMenu={this.onContextMenu}>

                <Circle className={classes.circle}
                    radius={node.radius}
                    fill={`url(#${gradientId})`}/>

                {
                    node.title.visible ?
                        <Text className={classes.title}
                            text={node.title.value}
                            align='middle'
                            pos={TEXT_AREA_POS} />
                        : null
                }

                <defs>
                    <radialGradient id={gradientId}>
                        <stop offset='10%' stopColor={node.color} />
                        <stop offset='95%' stopColor={node.color}
                            stopOpacity='0' />
                    </radialGradient>
                </defs>

                <NodeDebug node={node} />

            </Group>
        );
    }

}