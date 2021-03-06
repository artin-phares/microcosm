import React, {Component} from 'react';
import cx from 'classnames';

import ImportFormVmType from 'vm/shared/ImportForm';
import IconType from 'vm/shared/Icon';
import IconSize from 'vm/shared/IconSize';

import Button from 'view/shared/Button';
import Icon from 'view/shared/Icon';
import Log from 'view/shared/Log';
import ProgressBar from 'view/shared/ProgressBar';

import classes from './ImportForm.css';

// eslint-disable-next-line valid-jsdoc
/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {ImportFormVmType} form
 *
 * @prop {function()} onImport
 * @prop {function({file: File})} onFileChange
 *
 * @extends {Component<Props>}
 */
export default class ImportForm extends Component {
  onFileChange = e => {
    const input = e.target;
    const files = input.files;
    this.props.onFileChange({file: files[0]});
  };

  render() {
    const {className, form, onImport} = this.props;

    return (
      <div className={cx(classes.root, className)}>
        <div className={classes.title}>Import</div>
        <div className={classes.fields}>
          <div className={classes.field}>
            <span className={classes.fieldTitle}>Notebook:</span>
            <span className={classes.fieldValue}>
              <select disabled>
                <option value="evernote">Evernote</option>
              </select>
            </span>
          </div>
          <div className={classes.field}>
            <span className={classes.fieldTitle}>Source:</span>
            <span className={classes.fieldValue}>
              <input
                type="file"
                accept=".enex"
                disabled={!form.isInputEnabled}
                onChange={this.onFileChange}
              />
            </span>
          </div>
          <div className={classes.field}>
            <span className={classes.fieldTitle}>Target idea:</span>
            <span className={classes.fieldValue}>{form.targetIdeaTitle}</span>
          </div>
        </div>
        <div>
          <div className={classes.tip}>
            <Icon icon={IconType.infoCircle} size={IconSize.large} />
            <span>
              Tip: do not import notes from all notebooks at once. Evernote does
              not export tree structure (stacks and notebooks), but only flat
              list of notes. So if you want to preserve original structure -
              export/import each notebook one by one.
            </span>
          </div>
        </div>
        <div className={classes.progress}>
          <ProgressBar bar={form.progressBar} />
          {form.logIsShown ? (
            <Log className={classes.log} log={form.log} />
          ) : null}
        </div>
        <div className={classes.buttons}>
          <Button
            disabled={!form.importButton.enabled}
            disabledStyle="hard"
            onClick={onImport}
          >
            {form.importButton.content}
          </Button>
        </div>
      </div>
    );
  }
}
