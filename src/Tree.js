'use strict';

/**
 * A simple tree datastructures which uses variable parent and self identifiers.
 */
angular.module('simpleTreeApp')
    .factory('Tree',
        function() {
            /**
             * Constructor.
             * @param {Array} list The list of nodes.
             * @param {String} identifier The attribute name that identifies a node.
             * @param {String} parentIdentifier The attribute name that identifies the parent id.
             */
            var Tree = function(nodes, identifier, parentIdentifier) {
                this._tree = this._loadTree(nodes, identifier, parentIdentifier, 'children');
                this._id = identifier;
                this._parentId = parentIdentifier;
            };

            /**
             * Finds the node in the given array.
             * @param {Array} arr The array of elements.
             * @param {Object} node Should contain atleast the identifier.
             * @param {Number} -1 iff the node was not found otherwise the index in the array.
             */
            Tree.prototype._findIndex = function(arr, node) {
                var index = -1;
                var self = this;
                arr.forEach(function(element, i) {
                    if (element[self._id] === node[self._id]) {
                        index = i;
                    }
                });
                return index;
            };

            /**
             * Removes all the node and all his children.
             * @param {Object} node The node.
             * @return {Boolean} true iff the node was found and removed, false otherwise.
             */
            Tree.prototype.remove = function(node) {
                if (!this.find(node)) {
                    return false;
                }

                // because of jshint we have to define our index variable here.
                var index = -1;

                // We find the parent and remove child
                var parent = {};
                parent[this._id] = node[this._parentId];
                var rParent = this.find(parent);

                if (rParent && ~this._findIndex(rParent.children, node)) {
                    index = this._findIndex(rParent.children, node);
                    rParent.children.splice(index, 1);
                    return true;
                } else if (~this._findIndex(this._tree, node)) {
                    // when branching here, it means that we know that the node exists and that it is a root,
                    // since there was no parent to be found.
                    index = this._findIndex(this._tree, node);
                    this._tree.splice(index, 1);
                    return true;
                }
                return false;
            };

            /**
             * Adds a root node.
             * @param {Object} node The root node.
             */
            Tree.prototype.addRoot = function(node) {
                node.children = [];
                this._tree.push(node);
            };

            /**
             * Adds a child node to the parent.
             * @param {Object} child The child node to be added.
             * @param {Object} parent The parent node. Note, this object only requires the given parentIdentifier.
             */
            Tree.prototype.addChild = function(child, parent) {
                child.children = [];
                this.find(parent).children.push(child);
            };

            /**
             * Creates a 'tree' from a flat list, created by http://stackoverflow.com/a/22367819.
             * @param {Array} list The list of nodes.
             * @param {String} idAttr The attribute name that identifies a node.
             * @param {String} parentAttr The attribute name that identifies the parent id.
             * @param {String} childrenAtt The attribute in which all the children for each node should be stored.
             * @return {Array} A 'tree'.
             */
            Tree.prototype._loadTree = function(list, idAttr, parentAttr, childrenAttr) {
                var treeList = [];
                var lookup = {};
                list.forEach(function(obj) {
                    lookup[obj[idAttr]] = obj;
                    obj[childrenAttr] = [];
                });
                list.forEach(function(obj) {
                    if (obj[parentAttr] !== undefined) {
                        lookup[obj[parentAttr]][childrenAttr].push(obj);
                    } else {
                        treeList.push(obj);
                    }
                });
                return treeList;
            };

            /**
             * @return {Array} Returns all the root nodes.
             */
            Tree.prototype.getRoots = function() {
                return this._tree;
            };

            /**
             * @return {Array} the list that was passed on the constuctor.
             */
            Tree.prototype.flatten = function(root, list) {
                list = list || [];
                var loop = (root) ? root.children : this._tree;
                var self = this;
                loop.forEach(function(node) {
                    list.push(node);
                    self.flatten(node, list);
                });
                return list;
            };

            /**
            * Travers the whole tree and applies f
            */
            Tree.prototype.traverse = function(f, root){
                var loop = (root) ? root.children : this._tree;

                if(loop.length === 0){
                    return false;
                }

                var stop = false;
                var index = 0;
                for(; index < loop.length; index++){
                    if(f(loop[index]) || this.traverse(f, loop[index])){
                        break;
                    }
                }
                return index !== loop.length - 1;
            }

            /**
             * Finds a node in the tree.
             * @param {Number | String} node.identifier The only required attribute for @code{node} is the identifier that is passed to the Tree.
             * @param {Object} root (optional) The root nood.
             * @param {Object | null} null iff the node couldn't be found.
             */
            Tree.prototype.find = function(node, root) {
                if (root !== undefined && root[this._id] === node[this._id]) {
                    return root;
                }

                var found = null;
                var list = (root) ? root.children : this._tree;
                var _self = this;

                list.some(function(newRoot) {
                    found = _self.find(node, newRoot);
                    if (found) {
                        return true;
                    }
                });

                return found;
            };

            /**
             * @param {Number | String} parent.identifier The only required attribute for @code{parent} is the identifier that is passed to the Tree.
             * @return {Array} A list of children of the given parent.
             */
            Tree.prototype.getChildren = function(parent) {
                var p = this.find(parent);
                return (p) ? p.children : [];
            };

            return Tree;
        }
);
