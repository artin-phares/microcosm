import {EventEmitter} from 'events';
import assert from 'utils/assert';
import noop from 'utils/noop';

import React, {Component} from 'react';
import PropTypes from 'prop-types';

/**
 * HOC, which connects view component to view-model and store.
 *
 * Does not provide whole state to component (like redux).  
 * Parent component should explicitly pass view-model to child.
 * 
 * Does not provide automatic updates on state change (like redux).  
 * View-model should explicitly emit 'change' event.
 * 
 * @param {function} mapPropsToVM
 * @param {function} mapDispatchToProps
 * @return {function}
 */
export default function connect(mapPropsToVM, mapDispatchToProps = noop) {
    return CustomComponent => {

        assert(typeof mapPropsToVM === 'function');
        assert(typeof CustomComponent === 'function');
        
        /**
         * View model getter
         * @param {object} props
         * @return {EventEmitter} view model
         */
        const getVM = props => {
            const vm = mapPropsToVM(props);
            
            if (!(vm instanceof EventEmitter)) {
                throw Error(
                    `VM '${vm}' of '${CustomComponent.name}' ` +
                    `component is not EventEmitter`);
            }

            return vm;
        };

        /**
         * Wrapper component
         */
        class ConnectedComponent extends Component {

            constructor(props, ...args) {
                super(props, ...args);

                const vm = getVM(props);
                const onVMChange = this.bindVM(vm);

                this.state = {vm, onVMChange};
            }

            static get displayName() {
                return `Connected(${CustomComponent.name})`;
            }

            static contextTypes = {
                dispatch: PropTypes.func.isRequired
            }

            componentWillReceiveProps(nextProps) {
                
                const nextVM = getVM(nextProps);
                const {vm, onVMChange} = this.state;

                // in case new vm instance passed to component,
                // we should unbind previous vm and bind new
                if (this.state.vm !== nextVM) {

                    this.unbindVM(vm, onVMChange);

                    const nextOnVMChange = this.bindVM(nextVM);
                    this.setState({
                        vm: nextVM,
                        onVMChange: nextOnVMChange
                    });
                }
            }

            componentWillUnmount() {
                this.unbindVM(this.state.vm, this.state.onVMChange);
            }

            bindVM(vm) {

                // eslint-disable-next-line require-jsdoc
                const onVMChange = () =>
                    // return promise to be able to
                    // await view updates on vm changes
                    new Promise(resolve => {
                        this.forceUpdate(resolve);
                    });
                
                vm.addListener('change', onVMChange);

                return onVMChange;
            }

            unbindVM(vm, onVMChange) {
                assert(typeof onVMChange === 'function');
                vm.removeListener('change', onVMChange);
            }

            render() {

                // mix connect props
                const dispatch = this.context.dispatch;
                const connectProps = mapDispatchToProps(dispatch, this.props);

                const props = {
                    ...this.props,
                    ...connectProps
                };

                return (<CustomComponent {...props} />);
            }
        }

        return ConnectedComponent;
    };
}