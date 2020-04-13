class Boundary {
    constructor(x1, y1, x2, y2) {
        this.a = createVector(x1, y1);
        this.b = createVector(x2, y2);
        this.id = x1 + y1 * 10;
    }
    
    show() {
        stroke(255);
        line(this.a.x*4, this.a.y*4, this.b.x*4, this.b.y*4);
    }
}