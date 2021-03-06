import initProps from 'utils/init-props';

import MindmapVmType from 'vm/map/entities/Mindmap';
import ZenType from 'vm/zen/entities/Zen';
import ColorPicker from 'vm/shared/ColorPicker';

import ViewModel from 'vm/utils/ViewModel';
import SearchBox from 'vm/shared/SearchBox';
import Lookup from 'vm/shared/Lookup';
import IconType from 'vm/shared/Icon';

import MindsetViewModeType from 'vm/main/MindsetViewMode';
import DbConnectionIcon from 'vm/main/DbConnectionIcon';
import DropDownMenu from 'vm/shared/DropDownMenu';
import ImportFormModal from 'vm/shared/ImportFormModal';

/**
 * Mindset view model
 *
 * Represents root mindset component, which can show
 * mindset in different forms (mindmap, zen, etc)
 */
export default class Mindset extends ViewModel {
  /**
   * Mindset data was loaded and mapped to view model of current view mode
   * @type {boolean}
   */
  isLoaded = false;

  /**
   * Mindset load failed
   * @type {boolean}
   */
  isLoadFailed = false;

  /**
   * View mode
   * @type {MindsetViewModeType}
   */
  mode;

  /**
   * Mindmap view model.
   * Note: only available in mindmap view mode.
   * @type {MindmapVmType|undefined}
   */
  mindmap;

  /**
   * Zen view model.
   * Note: only available in zen view mode.
   * @type {ZenType}
   */
  zen;

  /**
   * Icon indicating state of connection with server database
   * @type {DbConnectionIcon}
   */
  dbConnectionIcon = new DbConnectionIcon();

  /**
   * Button which switches current view mode
   * @type {{icon, tooltip}}
   */
  toggleModeButton = {
    /** @type {IconType} */
    icon: undefined,

    /** @type {string} */
    tooltip: undefined
  };

  /**
   * Tooltip of go root button
   * @type {string}
   */
  goRootButtonTooltip;

  /**
   * Search box for finding and focusing target ideas
   * @type {SearchBox}
   */
  ideaSearchBox = new SearchBox({
    lookup: new Lookup({placeholder: 'search ideas'})
  });

  /**
   * Menu with additional operations (like logout, etc.)
   * @type {DropDownMenu}
   */
  gearMenu = new DropDownMenu();

  /**
   * Color picker
   * @type {ColorPicker}
   */
  colorPicker = new ColorPicker();

  /**
   * Import form modal
   * @type {ImportFormModal}
   */
  importFormModal = new ImportFormModal();

  /**
   * Constructor
   * @param {Partial<Mindset>} [props]
   */
  constructor(props) {
    super();
    initProps(this, props);
  }
}
