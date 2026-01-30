import './style.css';

import FamousEngine from 'famous/core/FamousEngine';
import DOMElement from 'famous/dom-renderables/DOMElement';
import Rotation from 'famous/components/Rotation';
import PhysicsEngine from 'famous/physics/PhysicsEngine';
import Particle from 'famous/physics/bodies/Particle';
import Spring from 'famous/physics/forces/Spring';
import Drag from 'famous/physics/forces/Drag';
import Vec3 from 'famous/math/Vec3';

FamousEngine.init();

const scene = FamousEngine.createScene('#app');

const labelNode = scene.addChild();
labelNode.setAlign(0.5, 0.1, 0);
labelNode.setOrigin(0.5, 0.5, 0);
labelNode.setAbsoluteSize(360, 40, 0);

new DOMElement(labelNode, {
  content: 'Physics + animation baseline',
  properties: {
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    border: '1px solid rgba(148, 163, 184, 0.35)',
    borderRadius: '999px',
    color: '#e2e8f0',
    display: 'flex',
    fontSize: '14px',
    fontWeight: '600',
    justifyContent: 'center',
    letterSpacing: '0.04em',
    alignItems: 'center',
    textTransform: 'uppercase',
    boxShadow: '0 12px 30px rgba(15, 23, 42, 0.4)'
  }
});

const physicsNode = scene.addChild();
physicsNode.setAlign(0.5, 0.45, 0);
physicsNode.setOrigin(0.5, 0.5, 0);
physicsNode.setAbsoluteSize(80, 80, 0);

new DOMElement(physicsNode, {
  properties: {
    backgroundColor: '#38bdf8',
    borderRadius: '999px',
    boxShadow: '0 18px 40px rgba(56, 189, 248, 0.45)',
    border: '2px solid rgba(255, 255, 255, 0.35)'
  }
});

const physicsEngine = new PhysicsEngine({
  step: 1000 / 60,
  iterations: 12
});

const particle = new Particle({
  position: new Vec3(180, 0, 0),
  mass: 1
});

particle.setVelocity(0, 140, 0);

const spring = new Spring(null, [particle], {
  anchor: new Vec3(0, 0, 0),
  period: 2.4,
  dampingRatio: 0.2
});

const drag = new Drag([particle], {
  strength: 0.02
});

physicsEngine.add(particle, spring, drag);

const physicsUpdater = {
  onUpdate: (time) => {
    physicsEngine.update(time);
    const transform = physicsEngine.getTransform(particle);
    physicsNode.setPosition(
      transform.position[0],
      transform.position[1],
      transform.position[2]
    );
    FamousEngine.requestUpdateOnNextTick(physicsUpdater);
  }
};

FamousEngine.requestUpdate(physicsUpdater);

const spinnerNode = scene.addChild();
spinnerNode.setAlign(0.5, 0.8, 0);
spinnerNode.setOrigin(0.5, 0.5, 0);
spinnerNode.setAbsoluteSize(120, 120, 0);

new DOMElement(spinnerNode, {
  properties: {
    backgroundColor: '#f97316',
    borderRadius: '24px',
    boxShadow: '0 18px 40px rgba(249, 115, 22, 0.35)'
  }
});

const rotation = new Rotation(spinnerNode);

const spin = () => {
  rotation.setZ(rotation.getZ() + Math.PI * 2, {
    duration: 2800,
    curve: 'linear'
  }, spin);
};

spin();
