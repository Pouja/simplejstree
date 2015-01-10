'use strict';

/**
 * Test file used in combination with Karma, PhantomJS and Jasmine.
 * @author http://www.github.com/Pouja
 */
describe('Service: Tree', function() {
    // load the service's module
    beforeEach(module('simpleTreeApp'));

    // instantiate service
    var Tree;
    beforeEach(inject(function(_Tree_) {
        Tree = _Tree_;
    }));

    var nodes = [{
        weirdId: 3,
    }, {
        weirdId: 1,
    }, {
        weirdId: 99,
    }, {
        weirdId: 76,
    }, {
        weirdId: 9,
        weirdParentId: 3
    }, {
        weirdId: 11,
        weirdParentId: 9
    }, {
        weirdId: 54,
        weirdParentId: 11
    }, {
        weirdId: 23,
        weirdParentId: 11
    }, {
        weirdId: 85,
        weirdParentId: 99
    }, {
        weirdId: 13,
        weirdParentId: 99
    }];

    describe('Constructor', function() {
        it('should create a new tree without errors', function() {
            expect(function() {
                new Tree(nodes, 'weirdId', 'weirdParentId');
            }).not.toThrow();
        });

        it('root should be placed correctly', function() {
            var tree = new Tree(nodes, 'weirdId', 'weirdParentId');
            expect(tree._tree.length).toBe(4);
        });
    });
    describe('getChildren', function() {
        var tree = null;
        beforeEach(function() {
            tree = new Tree(nodes, 'weirdId', 'weirdParentId');
        });

        it('Should return empty list when the parent is not found.', function() {
            expect(tree.getChildren({
                weirdId: 90822
            }).length).toBe(0);
        });

        it('Should return a non empty list.', function() {
            expect(tree.getChildren({
                weirdId: 99
            }).length).toBe(2);
            expect(tree.getChildren({
                weirdId: 11
            }).length).toBe(2);
            expect(tree.getChildren({
                weirdId: 9
            }).length).toBe(1);
        });
    });
    describe('find', function() {
        var tree = null;
        beforeEach(function() {
            tree = new Tree(nodes, 'weirdId', 'weirdParentId');
        });

        it('Should return null since there are no nodes', function() {
            tree = new Tree([], 'a', 'b');
            expect(tree.find({})).toBe(null);
        });
        it('Should return null since the node does not exist in the tree.', function() {
            expect(tree.find({
                weirdId: 13132,
                weirdParentId: 1000
            })).toBe(null);
        });
        it('Should return not-null object', function() {
            expect(tree.find({
                weirdId: 23,
                weirdParentId: 11
            })).not.toBe(null);
        });
    });
    describe('remove', function() {
        var tree = null;
        beforeEach(function() {
            tree = new Tree(nodes, 'weirdId', 'weirdParentId');
        });

        it('Should return false since there are no nodes', function() {
            tree = new Tree([], 'a', 'b');
            expect(tree.remove({})).toBe(false);
        });
        it('Should return false since that node does not exist', function() {
            expect(tree.remove({
                weirdId: 1000,
                weirdParentId: 10000
            })).toBe(false);
        });
        it('Should return true since the root node exists.', function() {
            expect(tree.remove({
                weirdId: 3
            })).toBe(true);
            expect(tree.find({
                weirdId: 3
            })).toBe(null);
            expect(tree.find({
                weirdId: 23,
                weirdParentId: 11
            })).toBe(null);
        });
        it('Should return true since the node exists.', function() {
            expect(tree.remove({
                weirdId: 85,
                weirdParentId: 99
            })).toBe(true);
            expect(tree.find({
                weirdId: 85,
                weirdParentId: 99
            })).toBe(null);
        });
    });
});
