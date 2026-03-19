'use strict';

var Commands = require('../../core/Commands');
var DOMElement = require('../../dom-renderables/DOMElement');

function createNodeStub() {
    return {
        addComponent: function() {
            return 11;
        },
        getOpacity: function() {
            return 1;
        },
        getUIEvents: function() {
            return [];
        },
        isShown: function() {
            return true;
        },
        requestUpdate: function() {}
    };
}

describe('text content modernization', function() {
    it('queues a dedicated plain-text command without reusing HTML content', function() {
        var domElement = new DOMElement(createNodeStub(), {});

        domElement._initialized = true;
        domElement.setTextContent('Safe text <strong>literal</strong>');

        expect(domElement.getValue().textContent).toBe('Safe text <strong>literal</strong>');
        expect(domElement.getValue().content).toBe('');
        expect(domElement._changeQueue).toEqual([
            Commands.CHANGE_TEXT_CONTENT,
            'Safe text <strong>literal</strong>'
        ]);
    });

    it('switches back to HTML mode when setContent is called afterwards', function() {
        var domElement = new DOMElement(createNodeStub(), {});

        domElement._initialized = true;
        domElement.setTextContent('Safe text');
        domElement._changeQueue.length = 0;

        domElement.setContent('<strong>HTML</strong>');

        expect(domElement.getValue().textContent).toBe(null);
        expect(domElement.getValue().content).toBe('<strong>HTML</strong>');
        expect(domElement._changeQueue).toEqual([
            Commands.CHANGE_CONTENT,
            '<strong>HTML</strong>'
        ]);
    });
});
