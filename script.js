const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

class Fireworks {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height * 0.99;
        this.color = {
            r: Math.random() * 255,
            g: Math.random() * 255,
            b: Math.random() * 255,
        };
        this.velocity = {
            x: (Math.random() - 0.5) * 8,
            y: Math.random() * -20 - 15,
        };
        this.gravity = 0.5;
        this.timer = 50;
        this.explosionRadius = 7;
    }

    draw() {
        if (this.timer > 0) {
            ctx.beginPath();
            ctx.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
            ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
        }
    }

    move() {
        if (this.timer > 0) {
            this.timer--;
            this.velocity.y += this.gravity;
            this.x += this.velocity.x;
            this.y += this.velocity.y;
        }
    }
}

class Particle {
    constructor(x, y, explosionRadius, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = Math.random() * 3;
        this.velocity = {
            x: Math.random() * explosionRadius * 2.5 - explosionRadius,
            y: Math.random() * explosionRadius * 3.5 - explosionRadius,
        };
        this.gravity = 0.5;
        this.opacity = 1;

        this.duration = 15
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    move() {
        this.velocity.y += this.gravity;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.opacity -= 0.05;
        this.duration-= 0.5
    }
}


let fireworks = [];
let particles = [];

canvas.width = innerWidth;
canvas.height = innerHeight;

addEventListener("resize", () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
});

function spawn() {
    setInterval(() => {
        if (fireworks.length < 20) {
            fireworks.push(new Fireworks());
        }
    }, Math.random() * (1000 - 1500) + 500);
}

function init() {
    requestAnimationFrame(init);
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "RGBA(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < fireworks.length; i++) {
        let firework = fireworks[i];
        firework.draw();
        firework.move();

        if (firework.x < 0 || firework.x > canvas.width || firework.y > canvas.height) {
            fireworks.splice(1, i)
        }

        if(firework.timer <= 0) {
            for(let i = 0; i < 20; i++) {
                particles.push(new Particle(firework.x, firework.y, firework.explosionRadius, firework.color))
            }    
        }
        for(let i = 0; i < particles.length; i++) {
            let particle = particles[i]

            particle.draw()
            particle.move()

            if(particle.opacity <= 0 && particle.duration <= 0) {
                particles.splice(1, i)
            }
        }

    }
}




spawn()
init()