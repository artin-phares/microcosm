import React, {Component} from 'react';
import cx from 'classnames';

import IdeaFormModalVmType from 'vm/shared/IdeaFormModal';

import Modal from 'view/shared/Modal';
import IdeaForm from 'view/shared/IdeaForm';

import classes from './IdeaFormModal.css';

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {IdeaFormModalVmType} ideaFormModal
 *
 * @prop {function()} onTitleChange
 * @prop {function()} onValueChange
 * @prop {function()} onValueToggleEdit
 * @prop {function()} onValueDoubleClick
 * @prop {function()} onNeighborIdeaSelect
 * @prop {function()} onGearMenuToggle
 * @prop {function()} onRemove
 * @prop {function()} onColorSelect
 * @prop {function()} onColorRemove
 * @prop {function()} onSuccessorCreate
 * @prop {function()} onSuccessorRemove
 * @prop {function()} onSuccessorSearchTriggerClick
 * @prop {function()} onSuccessorSearchLookupFocusOut
 * @prop {function()} onSuccessorSearchLookupPhraseChange
 * @prop {function()} onSuccessorSearchLookupKeyDown
 * @prop {function()} onSuccessorSearchLookupSuggestionSelect
 * @prop {function()} onClose
 * @prop {function()} onSave
 * @prop {function()} onCancel
 * @prop {function()} onScroll
 * @prop {function(object)} onTitleFocusChange
 *
 * @extends {Component<Props>}
 */
export default class IdeaFormModal extends Component {
  render() {
    const {
      className,
      ideaFormModal,
      onTitleChange,
      onValueChange,
      onValueToggleEdit,
      onValueDoubleClick,
      onNeighborIdeaSelect,
      onGearMenuToggle,
      onRemove,
      onColorSelect,
      onColorRemove,
      onSuccessorCreate,
      onSuccessorRemove,
      onSuccessorSearchTriggerClick,
      onSuccessorSearchLookupFocusOut,
      onSuccessorSearchLookupPhraseChange,
      onSuccessorSearchLookupKeyDown,
      onSuccessorSearchLookupSuggestionSelect,
      onClose,
      onSave,
      onCancel,
      onScroll,
      onTitleFocusChange
    } = this.props;

    return (
      <Modal
        className={cx(classes.root, className)}
        contentClass={classes.content}
        modal={ideaFormModal.modal}
        onClose={onClose}
        onScroll={onScroll}
      >
        <IdeaForm
          form={ideaFormModal.form}
          valueEditButtonClass={classes.valueEditButton}
          onTitleChange={onTitleChange}
          onValueChange={onValueChange}
          onValueToggleEdit={onValueToggleEdit}
          onValueDoubleClick={onValueDoubleClick}
          onNeighborIdeaSelect={onNeighborIdeaSelect}
          onGearMenuToggle={onGearMenuToggle}
          onRemove={onRemove}
          onColorSelect={onColorSelect}
          onColorRemove={onColorRemove}
          onSuccessorCreate={onSuccessorCreate}
          onSuccessorRemove={onSuccessorRemove}
          onSuccessorSearchTriggerClick={onSuccessorSearchTriggerClick}
          onSuccessorSearchLookupFocusOut={onSuccessorSearchLookupFocusOut}
          onSuccessorSearchLookupPhraseChange={
            onSuccessorSearchLookupPhraseChange
          }
          onSuccessorSearchLookupKeyDown={onSuccessorSearchLookupKeyDown}
          onSuccessorSearchLookupSuggestionSelect={
            onSuccessorSearchLookupSuggestionSelect
          }
          onSave={onSave}
          onCancel={onCancel}
          onTitleFocusChange={onTitleFocusChange}
        />
      </Modal>
    );
  }
}
