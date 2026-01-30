const { describe, expect, it } = require('vitest');

const Commands = require('../core/Commands');
const DOMElement = require('../dom-renderables/DOMElement');
const EventMap = require('../dom-renderers/events/EventMap');
const PointerEvent = require('../dom-renderers/events/PointerEvent');

function createMockNode() {
  return {
    addComponent: () => {},
    getUIEvents: () => [],
    isShown: () => true,
    getOpacity: () => 1,
    requestUpdate: () => {},
    getLocation: () => 'body/0',
    getSize: () => [0, 0, 0],
    getSizeMode: () => [0, 0, 0]
  };
}

describe('DOMElement content commands', () => {
  it('queues CHANGE_CONTENT for HTML content', () => {
    const domElement = new DOMElement(createMockNode());
    domElement._initialized = true;

    domElement.setContent('<strong>hi</strong>');

    expect(domElement._contentIsHTML).toBe(true);
    expect(domElement._changeQueue).toEqual([
      Commands.CHANGE_CONTENT,
      '<strong>hi</strong>'
    ]);
  });

  it('queues CHANGE_TEXT_CONTENT for text-only updates', () => {
    const domElement = new DOMElement(createMockNode());
    domElement._initialized = true;

    domElement.setTextContent('hello');

    expect(domElement._contentIsHTML).toBe(false);
    expect(domElement._changeQueue).toEqual([
      Commands.CHANGE_TEXT_CONTENT,
      'hello'
    ]);
  });
});

describe('Pointer events mapping', () => {
  it('normalizes pointer event fields', () => {
    const ev = {
      screenX: 1,
      screenY: 2,
      clientX: 3,
      clientY: 4,
      ctrlKey: false,
      shiftKey: true,
      altKey: false,
      metaKey: false,
      button: 0,
      buttons: 1,
      pageX: 5,
      pageY: 6,
      x: 7,
      y: 8,
      offsetX: 9,
      offsetY: 10,
      pointerId: 11,
      pointerType: 'mouse',
      isPrimary: true,
      width: 12,
      height: 13,
      pressure: 0.5,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      twist: 0,
      timeStamp: 0,
      type: 'pointerdown',
      target: null,
      currentTarget: null,
      eventPhase: 0,
      bubbles: true,
      cancelable: true,
      defaultPrevented: false
    };

    const normalized = new PointerEvent(ev);

    expect(normalized.pointerId).toBe(11);
    expect(normalized.pointerType).toBe('mouse');
    expect(normalized.isPrimary).toBe(true);
    expect(normalized.width).toBe(12);
    expect(normalized.height).toBe(13);
    expect(normalized.pressure).toBe(0.5);
  });

  it('registers pointer events in the event map', () => {
    expect(EventMap.pointerdown[0]).toBe(PointerEvent);
    expect(EventMap.pointermove[0]).toBe(PointerEvent);
    expect(EventMap.pointerup[0]).toBe(PointerEvent);
  });
});
