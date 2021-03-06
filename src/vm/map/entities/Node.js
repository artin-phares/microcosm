import initProps from 'utils/init-props';

import ViewModel from 'vm/utils/ViewModel';
import LinkType from 'vm/map/entities/Link';
import PointType from 'model/entities/Point';

/**
 * Node
 *
 * @implements {VertexType}
 */
export default class Node extends ViewModel {
  /**
   * Data for debug purposes only (eg. to render on debug pane)
   * @type {{enable, posRel}}
   */
  debug = {
    /**
     * Enable debug pane
     * @type {boolean}
     */
    enable: false,

    /**
     * Position relative to parent idea
     * @type {PointType|undefined}
     */
    posRel: undefined
  };

  /**
   * Node ID (equals to idea ID)
   * @type {string|undefined}
   */
  id;

  /**
   * Absolute position of node on canvas.
   * @type {PointType|undefined}
   */
  posAbs;

  /**
   * Node radius
   * @type {number}
   */
  radius = 0;

  /**
   * Scale
   * How much times size of node should be smaller
   * or bigger than its normal size (ie. radius)
   * Scale 1 - is normal size
   * @type {number|undefined}
   */
  scale;

  /**
   * Node title state
   */
  title = {
    value: '',
    visible: true
  };

  /**
   * Indicates that idea is root idea of graph
   * @type {boolean}
   */
  isRoot = false;

  /**
   * Node color (inherited)
   * @type {string|undefined}
   */
  color;

  /**
   * Incoming links
   * @memberof Vertex
   * @type {Array.<LinkType>|undefined}
   */
  edgesIn;

  /**
   * Outgoing links
   * @memberof Vertex
   * @type {Array.<LinkType>|undefined}
   */
  edgesOut;

  /**
   * Link to parent idea.
   * Note: available only after graph is weighted
   * @memberof Vertex
   * @type {LinkType|undefined}
   */
  edgeFromParent;

  /**
   * Links to child ideas.
   * Note: available only after graph is weighted
   * @memberof Vertex
   * @type {Array.<LinkType>|undefined}
   */
  edgesToChilds;

  /**
   * Weight of minimal path from root (RPW).
   * Note: available only after graph is weighted
   * @memberof Vertex
   * @type {number|undefined}
   */
  rootPathWeight;

  /**
   * Indicates that node has less importance
   * (ie. grayed out)
   * TODO: rename to isShaded for naming consistency
   * @type {boolean}
   */
  shaded = false;

  /**
   * Constructor
   * @param {Partial<Node>} [props]
   */
  constructor(props) {
    super();
    initProps(this, props);
  }
}
