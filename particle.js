class Particle {
    constructor(posX, posY, fov) {
        this.pos = createVector(posX, posY);
        this.rays = [];
        this.heading = 0;
        this.fov = fov;

        for(let i = 0; i < sceneW; i+=10) {
            let angle = (this.heading + radians(this.fov / 4)) + (i / sceneW) * radians(this.fov / 2);

            //this.rays.push(new Ray(this.pos, radians(angl)));
            this.rays.push(new Ray(this.pos, angle));
        }
    }

    moveS(amt) {
        const vel = p5.Vector.fromAngle(this.heading - radians(90 - this.fov / 2));
        vel.setMag(amt);

        let newPos = p5.Vector.add(this.pos, vel);

        for(let wall of walls) {
            if(wallColl(wall, newPos)) return;
        }

        this.pos.add(vel);
    }

    moveFB(amt) {
        const vel = p5.Vector.fromAngle(this.heading + radians(this.fov / 2));
        vel.setMag(amt);

        let newPos = p5.Vector.add(this.pos, vel);

        for(let wall of walls) {
            if(wallColl(wall, newPos)) return;
        }

        this.pos.add(vel);
    }

    rotate(angle) {
        this.heading += angle;
        for(let ray of this.rays) {
            
            ray.setAngle(ray.angle + angle);
        }
    }

    update(x, y) {
        this.pos.set(x, y);
    }

    look() {
        const scene = [];

        for(let i = 0; i < this.rays.length; i++) {
            const ray = this.rays[i];

            //let closest = null;
            let record = Infinity;
            let stripeInd = Infinity;

            for(let wall of walls) {
                const pt = ray.cast(wall);

                if(pt) {
                    const a = ray.angle - (this.heading + radians(this.fov/2));
                    const z = p5.Vector.dist(this.pos, pt) * cos(a);

                    if(z < record) {
                        record=z;
                        stripeInd = p5.Vector.dist(pt, wall.a);
                    }
                }
            }

            /* if(closest) {
                stroke(255, 100);
                line(this.pos.x, this.pos.y, closest.x, closest.y);
            } */
            scene[i] = [record, stripeInd];
        }

        return scene;
    }

    show() {
        ellipse(this.pos.x*4, this.pos.y*4, 5);

        let posLn = p5.Vector.add(
            p5.Vector.mult(this.pos, 4),
            p5.Vector.mult(
                p5.Vector.fromAngle(this.heading + radians(this.fov/2)),
                15
            )
        );

        line(this.pos.x*4, this.pos.y*4, posLn.x, posLn.y);
        /* for (let ray of this.rays) {
            ray.show();
        } */
    }
}