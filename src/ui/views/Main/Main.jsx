import React, {Component} from 'react';
import PropTypes from 'prop-types';

import MainVM from '../../viewmodels/Main';
import Mindmap from '../Mindmap';

import classes from './Main.css';

export default class Main extends Component {

    static propTypes = {
        vm: PropTypes.instanceOf(MainVM).isRequired
    };

    componentDidMount() {
        // console.debug(this.props.vm);
        // this.props.vm.onMount();
    }
    
    render() {
        
        return (
            <main className={classes.main}>
                {
                    !this.props.vm.mindmap &&
                    <div>Loading...</div>
                }

                {
                    this.props.vm.mindmap &&
                    <Mindmap mindmap={ this.props.vm.mindmap } />
                }
            </main>
        );
    }
}