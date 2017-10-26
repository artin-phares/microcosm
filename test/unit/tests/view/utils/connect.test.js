/* eslint-disable require-jsdoc */
import {expect} from 'test/utils';
import {spy} from 'sinon';
import {mount} from 'enzyme';

import ViewModel from 'src/vm/utils/ViewModel';
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import connect from 'view/utils/connect';
import Provider from 'view/utils/connect/Provider';

describe('connect', () => {

    it(`should update view on view-model 'change' events`, () => {

        // setup view-model
        class VM extends ViewModel {
            static eventTypes = ['change']
            someProp = 'INITIAL'
        }

        const vm = new VM();

        // setup view
        class View extends Component {
            static propTypes = {
                myVM: PropTypes.instanceOf(VM).isRequired
            }
            render() {
                return <span>{this.props.myVM.someProp}</span>;
            }
        }

        // setup connected view
        const ConnectedView = connect(props => props.myVM)(View);

        // setup store dispatch
        const dispatch = spy();

        // target
        const wrapper = mount(
            <Provider dispatch={dispatch}>
                <ConnectedView myVM={vm} />
            </Provider>
        );

        // check
        expect(wrapper).to.exist;

        vm.someProp = 'UPDATED';
        vm.emit('change');

        expect(wrapper.text()).to.equal('UPDATED');
    });

    it('should dispatch store actions on view events', () => {

        // setup view-model
        class VM extends ViewModel {
            static eventTypes = ['change']
            someProp = 'vm prop value'
        }

        const vm = new VM();

        // setup view
        class View extends Component {
            static propTypes = {
                onClick: PropTypes.func.isRequired
            }
            onClick() {
                this.props.onClick('view event data');
            }
            render() {
                return <span onClick={this.onClick.bind(this)}></span>;
            }
        }

        // setup connected view
        const ConnectedView = connect(
            props => props.myVM,
            (dispatch, props) => ({
                onClick: eventData => dispatch({
                    type: 'action',
                    data: `${eventData}: ${props.myVM.someProp}`
                })
            })
        )(View);

        // setup store dispatch
        const dispatch = spy();

        // target
        const wrapper = mount(
            <Provider dispatch={dispatch}>
                <ConnectedView myVM={vm} />
            </Provider>
        );

        // check
        expect(wrapper).to.exist;

        wrapper.simulate('click');

        expect(dispatch.callCount).to.equal(1);
        expect(dispatch.firstCall.args).to.have.length(1);
        expect(dispatch.firstCall.args[0]).to.deep.equal({
            type: 'action',
            data: 'view event data: vm prop value'
        });
    });

});