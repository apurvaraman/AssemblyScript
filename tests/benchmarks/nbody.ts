const PI: double = 3.141592653589793;
let SOLAR_MASS: double = 4 * PI * PI;
const DAYS_PER_YEAR: double = 365.24;

class Body {
  constructor(
    public x: double,
    public y: double,
    public z: double,
    public vx: double,
    public vy: double,
    public vz: double,
    public mass: double
  ) { }

  offsetMomentum(px: double, py: double, pz: double): Body {
    this.vx = -px / SOLAR_MASS;
    this.vy = -py / SOLAR_MASS;
    this.vz = -pz / SOLAR_MASS;
    return this;
  }
}

function Jupiter(): Body {
  return new Body(
    4.84143144246472090e+00,
    -1.16032004402742839e+00,
    -1.03622044471123109e-01,
    1.66007664274403694e-03 * DAYS_PER_YEAR,
    7.69901118419740425e-03 * DAYS_PER_YEAR,
    -6.90460016972063023e-05 * DAYS_PER_YEAR,
    9.54791938424326609e-04 * SOLAR_MASS
  );
}

function Saturn(): Body {
  return new Body(
    8.34336671824457987e+00,
    4.12479856412430479e+00,
    -4.03523417114321381e-01,
    -2.76742510726862411e-03 * DAYS_PER_YEAR,
    4.99852801234917238e-03 * DAYS_PER_YEAR,
    2.30417297573763929e-05 * DAYS_PER_YEAR,
    2.85885980666130812e-04 * SOLAR_MASS
  );
}

function Uranus(): Body {
  return new Body(
    1.28943695621391310e+01,
    -1.51111514016986312e+01,
    -2.23307578892655734e-01,
    2.96460137564761618e-03 * DAYS_PER_YEAR,
    2.37847173959480950e-03 * DAYS_PER_YEAR,
    -2.96589568540237556e-05 * DAYS_PER_YEAR,
    4.36624404335156298e-05 * SOLAR_MASS
  );
}

function Neptune(): Body {
  return new Body(
    1.53796971148509165e+01,
    -2.59193146099879641e+01,
    1.79258772950371181e-01,
    2.68067772490389322e-03 * DAYS_PER_YEAR,
    1.62824170038242295e-03 * DAYS_PER_YEAR,
    -9.51592254519715870e-05 * DAYS_PER_YEAR,
    5.15138902046611451e-05 * SOLAR_MASS
  );
}

function Sun(): Body {
  return new Body(
    0.0, 0.0, 0.0, 0.0, 0.0, 0.0, SOLAR_MASS
  );
}

class NBodySystem {
  bodies: Body[];

  constructor(bodies: Body[]) {
    let px: double = 0.0;
    let py: double = 0.0;
    let pz: double = 0.0;
    let size: uint = bodies.length;
    for (let i: uint = 0; i < size; i++) {
      let b: Body   = bodies[i];
      let m: double = b.mass;
      px += b.vx * m;
      py += b.vy * m;
      pz += b.vz * m;
    }
    this.bodies = bodies;
    this.bodies[0].offsetMomentum(px, py, pz);
    // FIXME: this.bodies[0].offsetMomentum does not work
  }

  advance(dt: double): void {
    let dx: double,
        dy: double,
        dz: double,
        ix: double,
        iy: double,
        iz: double,
        bivx: double,
        bivy: double,
        bivz: double,
        distance: double,
        mag: double;

    let bodies: Body[] = this.bodies;
    let size: uint = bodies.length;

    for (let i: uint = 0; i < size; ++i) {
      let bodyi: Body = bodies[i];

      ix = bodyi.x;
      iy = bodyi.y;
      iz = bodyi.z;

      bivx = bodyi.vx;
      bivy = bodyi.vy;
      bivz = bodyi.vz;

      let bodyim: double = bodyi.mass;
      for (let j: uint = i + 1; j < size; ++j) {
        let bodyj: Body = bodies[j];
        dx = ix - bodyj.x;
        dy = iy - bodyj.y;
        dz = iz - bodyj.z;

        let distanceSq: double = dx * dx + dy * dy + dz * dz;
        distance = sqrt(distanceSq);
        mag = dt / (distanceSq * distance);

        let bim: double = bodyim * mag;
        let bjm: double = bodyj.mass * mag;

        bivx -= dx * bjm;
        bivy -= dy * bjm;
        bivz -= dz * bjm;

        bodyj.vx += dx * bim;
        bodyj.vy += dy * bim;
        bodyj.vz += dz * bim;
      }

      bodyi.vx = bivx;
      bodyi.vy = bivy;
      bodyi.vz = bivz;

      bodyi.x += dt * bivx;
      bodyi.y += dt * bivy;
      bodyi.z += dt * bivz;
    }
  }

  energy(): double {
    let dx: double, dy: double, dz: double, distance: double;
    let ix: double, iy: double, iz: double, vx: double, vy: double, vz: double, bim: double;
    let e : double = 0.0;
    let bodies: Body[] = this.bodies;
    let size: uint = bodies.length;

    for (let i: uint = 0; i < size; ++i) {
      let bodyi: Body = bodies[i];

      ix = bodyi.x;
      iy = bodyi.y;
      iz = bodyi.z;

      vx = bodyi.vx;
      vy = bodyi.vy;
      vz = bodyi.vz;

      bim = bodyi.mass;

      e += 0.5 * bim * (vx * vx + vy * vy + vz * vz);

      for (let j: uint = i + 1; j < size; ++j) {
        let bodyj: Body = bodies[j];
        dx = ix - bodyj.x;
        dy = iy - bodyj.y;
        dz = iz - bodyj.z;

        distance = sqrt(dx * dx + dy * dy + dz * dz);
        e -= bim * bodyj.mass / distance;
      }
    }
    return e;
  }
}

export function test(n: uint): double {
  let bodies: Body[] = new Array(5);
  bodies[0] = Sun();
  bodies[1] = Jupiter();
  bodies[2] = Saturn();
  bodies[3] = Uranus();
  bodies[4] = Neptune();
  const system: NBodySystem = new NBodySystem(bodies);
  for (let i: uint = 0; i < n; i++)
    system.advance(0.01);
  return system.energy();
}
