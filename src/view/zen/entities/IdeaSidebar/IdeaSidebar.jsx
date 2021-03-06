import React, {Component} from 'react';
import cx from 'classnames';

import IdeaSidebarType from 'vm/zen/entities/IdeaSidebar';
import IdeaList from 'view/shared/IdeaList/IdeaList';
import Icon from 'view/shared/Icon';
import IconType from 'vm/shared/Icon';
import IconSize from 'vm/shared/IconSize';

import classes from './IdeaSidebar.css';

/**
 * @typedef {object} Props
 * @prop {string} [className]
 * @prop {IdeaSidebarType} sidebar
 *
 * @prop {function()} onGoParent
 * @prop {function()} onSuccessorSelect
 * @prop {function()} onToggle
 *
 * @extends {Component<Props>}
 */
export default class IdeaSidebar extends Component {
  onGoParentButtonClick = () => {
    if (this.props.sidebar.goParentAvailable) {
      this.props.onGoParent();
    }
  };

  render() {
    const {className, sidebar, onSuccessorSelect, onToggle} = this.props;

    return (
      <div
        className={cx(classes.root, className, {
          [classes.collapsed]: sidebar.isCollapsed
        })}
      >
        <div className={classes.content}>
          <div
            className={cx(classes.goParentButton, {
              [classes.enabled]: sidebar.goParentAvailable
            })}
            title={sidebar.rootPath}
            onClick={this.onGoParentButtonClick}
          >
            {sidebar.goParentAvailable ? (
              <Icon
                className={classes.backIcon}
                icon={IconType.chevronLeft}
                size={IconSize.large}
              />
            ) : null}
            <span className={classes.title}>{sidebar.title}</span>
          </div>

          {sidebar.successors.length ? (
            <IdeaList
              className={classes.successors}
              ideas={sidebar.successors}
              layout="column"
              onIdeaSelect={onSuccessorSelect}
            />
          ) : null}
        </div>

        <div
          className={classes.toggleButton}
          title={sidebar.isCollapsed ? 'Show sidebar' : 'Hide sidebar'}
          onClick={onToggle}
        >
          <Icon icon={IconType.circle} />
          <Icon icon={IconType.circle} />
          <Icon icon={IconType.circle} />
        </div>
      </div>
    );
  }
}
