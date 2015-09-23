import GraphVM from 'client/viewmodels/graph/Graph';
import { ideaToNode } from 'client/mappers/nodeMapper';
import { assocToLink } from 'client/mappers/linkMapper';
import Mindmap from 'models/Mindmap';
import TreeCrawler from 'client/lib/TreeCrawler';

export function mindmapToGraph(mindmap) {
  if (!(mindmap instanceof Mindmap)) {
    throw Error('invalid mindmap type');
  }

  let nodes = Mindmap.ideas.map(ideaToNode);
  let links = Mindmap.assocs.map(assocToLink.bind(null, nodes));

  // travers tree
  let centralNode = nodes.find(n => n.isCentral);
  if (!centralNode) {
    console.warn('There is no central node in the tree');
  } else {
    let crawler = new TreeCrawler();

    // set color on main sub trees
    centralNode.links.forEach(l => {
      let subNode = l.toNode;
      crawler.traverseTree(subNode, (n) => {
        n.color = subNode.color;
      });
    });

  }

  let graph = new GraphVM();

  graph.nodes = nodes;
  graph.links = links;

  return graph;
}

export default {
  mindmapToGraph
}