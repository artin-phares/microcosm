import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Point from 'ui/viewmodels/misc/Point';

export default class Group extends Component {

    static propTypes = {
        pos: PropTypes.instanceOf(Point),
        id: PropTypes.string,
        children: PropTypes.arrayOf(PropTypes.element).isRequired
    }

    render() {

        const {pos, id, ...other} = this.props;

        return (
            <g id={id}
                transform={ pos && `translate(${pos.x} ${pos.y})`}
                {...other}>

                {this.props.children}

            </g>
        );
    }

}