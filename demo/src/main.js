import './style.css';

import * as FamousEngineModule from 'famous/core/FamousEngine';
import * as DOMElementModule from 'famous/dom-renderables/DOMElement';
import * as RotationModule from 'famous/components/Rotation';
import * as PhysicsEngineModule from 'famous/physics/PhysicsEngine';
import * as ParticleModule from 'famous/physics/bodies/Particle';
import * as SpringModule from 'famous/physics/forces/Spring';
import * as DragModule from 'famous/physics/forces/Drag';
import * as Vec3Module from 'famous/math/Vec3';
import * as MeshModule from 'famous/webgl-renderables/Mesh';
import * as AmbientLightModule from 'famous/webgl-renderables/lights/AmbientLight';
import * as PointLightModule from 'famous/webgl-renderables/lights/PointLight';
import * as ColorModule from 'famous/utilities/Color';

const resolveCommonJS = (moduleNamespace) => (
  Object.prototype.hasOwnProperty.call(moduleNamespace, 'default')
    ? moduleNamespace.default
    : moduleNamespace
);

const FamousEngine = resolveCommonJS(FamousEngineModule);
const DOMElement = resolveCommonJS(DOMElementModule);
const Rotation = resolveCommonJS(RotationModule);
const PhysicsEngine = resolveCommonJS(PhysicsEngineModule);
const Particle = resolveCommonJS(ParticleModule);
const Spring = resolveCommonJS(SpringModule);
const Drag = resolveCommonJS(DragModule);
const Vec3 = resolveCommonJS(Vec3Module);
const Mesh = resolveCommonJS(MeshModule);
const AmbientLight = resolveCommonJS(AmbientLightModule);
const PointLight = resolveCommonJS(PointLightModule);
const Color = resolveCommonJS(ColorModule);

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

const webglNode = scene.addChild();
webglNode.setAlign(0.78, 0.5, 0);
webglNode.setMountPoint(0.5, 0.5, 0.5);
webglNode.setOrigin(0.5, 0.5, 0.5);
webglNode.setAbsoluteSize(180, 180, 180);

const mesh = new Mesh(webglNode);
mesh.setGeometry('Box');
mesh.setBaseColor(new Color('#8b5cf6'));
mesh.setGlossiness(new Color('#ffffff'), 18);
mesh.setFlatShading(false);

const meshRotation = new Rotation(webglNode);

const spinMesh = () => {
  meshRotation.setX(meshRotation.getX() + Math.PI * 2, {
    duration: 4200,
    curve: 'linear'
  });
  meshRotation.setY(meshRotation.getY() + Math.PI * 2, {
    duration: 3600,
    curve: 'linear'
  }, spinMesh);
};

spinMesh();

const ambientLightNode = scene.addChild();
const ambientLight = new AmbientLight(ambientLightNode);
ambientLight.setColor(new Color('#3b82f6'));

const pointLightNode = scene.addChild();
pointLightNode.setPosition(120, -180, 240);
const pointLight = new PointLight(pointLightNode);
pointLight.setColor(new Color('#ffffff'));

const stressCount = 24;
const stressNodes = [];

for (let index = 0; index < stressCount; index += 1) {
  const node = scene.addChild();
  node.setAlign(0.22, 0.68, 0);
  node.setOrigin(0.5, 0.5, 0);
  node.setMountPoint(0.5, 0.5, 0);
  node.setAbsoluteSize(22, 22, 0);

  new DOMElement(node, {
    properties: {
      backgroundColor: index % 2 === 0 ? '#22c55e' : '#a855f7',
      borderRadius: '999px',
      boxShadow: '0 8px 18px rgba(15, 23, 42, 0.24)',
      opacity: String(0.45 + (index % 5) * 0.1)
    }
  });

  stressNodes.push(node);
}

const stressOrbit = {
  onUpdate: (time) => {
    stressNodes.forEach((node, index) => {
      const angle = time / 900 + index * 0.32;
      const radius = 110 + (index % 4) * 14;
      node.setPosition(
        Math.cos(angle) * radius,
        Math.sin(angle * 1.35) * 44,
        (index % 6) * 8
      );
    });

    FamousEngine.requestUpdateOnNextTick(stressOrbit);
  }
};

FamousEngine.requestUpdate(stressOrbit);
