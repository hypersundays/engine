import Famous = require('famous');
import Channel = require('famous/core/Channel');
import FamousEngine = require('famous/core/FamousEngine');
import Vec3 = require('famous/math/Vec3');
import clamp = require('famous/utilities/clamp');

const engineNamespace = Famous.core.FamousEngine;
const channel: InstanceType<typeof Channel> = new Channel();
const engine = FamousEngine;
const point = new Vec3(1, 2, 3);
const limited = clamp(10, 0, 5);

channel.onmessage = () => {};
point.add(new Vec3(4, 5, 6));

if (limited !== 5) {
  throw new Error('Expected clamp helper types to preserve number return values.');
}

if (!engineNamespace || !engine) {
  throw new Error('Expected deep import typings to resolve.');
}
