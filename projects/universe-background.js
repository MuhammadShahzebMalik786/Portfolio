(() => {
    const existingCanvas = document.getElementById("space-canvas");
    const canvas = existingCanvas || document.createElement("canvas");

    if (!existingCanvas) {
        canvas.id = "space-canvas";
        canvas.className = "space-canvas";
        canvas.setAttribute("aria-hidden", "true");
        document.body.prepend(canvas);
    }

    const styleId = "universe-bg-style";
    if (!document.getElementById(styleId)) {
        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = [
            "body { position: relative; overflow-x: hidden; }",
            ".space-canvas { position: fixed; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; }",
            "body > *:not(.space-canvas) { position: relative; z-index: 1; }"
        ].join("\n");
        document.head.appendChild(style);
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const state = {
        w: window.innerWidth,
        h: window.innerHeight,
        dpr: Math.min(window.devicePixelRatio || 1, 2),
        mouseX: window.innerWidth / 2,
        mouseY: window.innerHeight / 2,
        smoothMouseX: window.innerWidth / 2,
        smoothMouseY: window.innerHeight / 2,
        stars: [],
        dust: [],
        systemBodies: [],
        remoteSystem: [],
        lastTime: performance.now()
    };

    function resize() {
        state.w = window.innerWidth;
        state.h = window.innerHeight;
        state.dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = Math.floor(state.w * state.dpr);
        canvas.height = Math.floor(state.h * state.dpr);
        canvas.style.width = `${state.w}px`;
        canvas.style.height = `${state.h}px`;

        ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);

        if (!state.stars.length) initScene();
    }

    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }

    function resetStar(star, randomZ = true) {
        star.x = rand(-state.w * 0.8, state.w * 0.8);
        star.y = rand(-state.h * 0.8, state.h * 0.8);
        star.z = randomZ ? rand(0.5, 1) : 1;
        star.size = rand(0.45, 1.7);
        star.alpha = rand(0.28, 0.78);
        star.speed = rand(0.005, 0.022);
        star.twinkle = rand(0.3, 1.2);
        star.seed = rand(0, Math.PI * 2);
    }

    function initScene() {
        const area = state.w * state.h;
        const starCount = Math.max(130, Math.floor(area / 7000));
        const dustCount = Math.max(64, Math.floor(area / 16000));

        state.stars = [];
        for (let i = 0; i < starCount; i += 1) {
            const star = {};
            resetStar(star, true);
            state.stars.push(star);
        }

        state.dust = [];
        for (let i = 0; i < dustCount; i += 1) {
            state.dust.push({
                x: rand(0, state.w),
                y: rand(0, state.h),
                r: rand(40, 170),
                alpha: rand(0.035, 0.09),
                hueShift: rand(-25, 20)
            });
        }

        const sunX = state.w * 0.14;
        const sunY = state.h * 0.24;
        const compact = state.w < 900;

        state.systemBodies = [
            { name: "Sun", kind: "sun", x: sunX, y: sunY, radius: compact ? 56 : 76, parallax: 0.028 },
            { name: "Mercury", kind: "mercury", x: state.w * 0.28, y: state.h * 0.2, radius: compact ? 7 : 9, parallax: 0.036 },
            { name: "Venus", kind: "venus", x: state.w * 0.36, y: state.h * 0.27, radius: compact ? 10 : 13, parallax: 0.034 },
            { name: "Earth", kind: "earth", x: state.w * 0.5, y: state.h * 0.25, radius: compact ? 12 : 16, parallax: 0.038 },
            { name: "Moon", kind: "moon", x: state.w * 0.54, y: state.h * 0.215, radius: compact ? 4 : 6, parallax: 0.042 },
            { name: "Mars", kind: "mars", x: state.w * 0.62, y: state.h * 0.315, radius: compact ? 9 : 12, parallax: 0.036 },
            { name: "Jupiter", kind: "jupiter", x: state.w * 0.76, y: state.h * 0.24, radius: compact ? 30 : 42, parallax: 0.03 },
            { name: "Saturn", kind: "saturn", x: state.w * 0.82, y: state.h * 0.46, radius: compact ? 24 : 33, parallax: 0.03 },
            { name: "Uranus", kind: "uranus", x: state.w * 0.66, y: state.h * 0.62, radius: compact ? 16 : 22, parallax: 0.027 },
            { name: "Neptune", kind: "neptune", x: state.w * 0.89, y: state.h * 0.68, radius: compact ? 14 : 20, parallax: 0.027 }
        ];

        state.remoteSystem = [
            { kind: "distant-sun", x: state.w * 0.9, y: state.h * 0.12, radius: compact ? 18 : 26, parallax: 0.012 },
            { kind: "exo-a", x: state.w * 0.84, y: state.h * 0.08, radius: compact ? 5 : 7, parallax: 0.015 },
            { kind: "exo-b", x: state.w * 0.95, y: state.h * 0.19, radius: compact ? 4 : 6, parallax: 0.015 },
            { kind: "exo-c", x: state.w * 0.98, y: state.h * 0.06, radius: compact ? 3 : 5, parallax: 0.015 }
        ];
    }

    function projectStar(star) {
        const perspective = 1.02 / Math.max(star.z, 0.2);
        const driftX = (state.smoothMouseX - state.w / 2) * 0.00008 * (1 / star.z);
        const driftY = (state.smoothMouseY - state.h / 2) * 0.00008 * (1 / star.z);

        const px = state.w / 2 + (star.x + driftX * state.w) * perspective;
        const py = state.h / 2 + (star.y + driftY * state.h) * perspective;
        return { x: px, y: py, p: perspective };
    }

    function updateStars(dt) {
        const mouseRadius = 110;
        const mouseRadiusSq = mouseRadius * mouseRadius;

        for (let i = 0; i < state.stars.length; i += 1) {
            const star = state.stars[i];
            star.z -= star.speed * dt;

            if (star.z <= 0.04) {
                resetStar(star, false);
            }

            const projected = projectStar(star);
            const dx = projected.x - state.smoothMouseX;
            const dy = projected.y - state.smoothMouseY;
            const distSq = dx * dx + dy * dy;

            if (distSq < mouseRadiusSq) {
                const dist = Math.max(Math.sqrt(distSq), 0.001);
                const push = (1 - dist / mouseRadius) * 0.12;
                star.x += (dx / dist) * push * dt * 3.2;
                star.y += (dy / dist) * push * dt * 3.2;
            }

            if (
                projected.x < -120 ||
                projected.x > state.w + 120 ||
                projected.y < -120 ||
                projected.y > state.h + 120
            ) {
                resetStar(star, false);
            }
        }
    }

    function drawNebula() {
        for (let i = 0; i < state.dust.length; i += 1) {
            const d = state.dust[i];
            const mx = (state.smoothMouseX - state.w / 2) * 0.01;
            const my = (state.smoothMouseY - state.h / 2) * 0.01;

            const grad = ctx.createRadialGradient(
                d.x + mx,
                d.y + my,
                0,
                d.x + mx,
                d.y + my,
                d.r
            );

            grad.addColorStop(0, `hsla(${200 + d.hueShift}, 95%, 70%, ${d.alpha})`);
            grad.addColorStop(1, "hsla(200, 95%, 40%, 0)");

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(d.x + mx, d.y + my, d.r, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function drawPlanetBody(x, y, radius, gradStops) {
        const grad = ctx.createRadialGradient(
            x - radius * 0.34,
            y - radius * 0.3,
            radius * 0.15,
            x,
            y,
            radius
        );
        for (let i = 0; i < gradStops.length; i += 1) {
            grad.addColorStop(gradStops[i][0], gradStops[i][1]);
        }
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawSun(x, y, radius, t) {
        const pulse = 1 + Math.sin(t * 0.55) * 0.03;
        const glow = ctx.createRadialGradient(x, y, radius * 0.25, x, y, radius * 2.4);
        glow.addColorStop(0, "rgba(255, 231, 160, 0.45)");
        glow.addColorStop(1, "rgba(255, 160, 60, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, radius * 2.4, 0, Math.PI * 2);
        ctx.fill();

        drawPlanetBody(x, y, radius * pulse, [
            [0, "#fff2ad"],
            [0.5, "#ffb84d"],
            [1, "#f67d18"]
        ]);
    }

    function drawEarth(x, y, radius) {
        drawPlanetBody(x, y, radius, [
            [0, "#9de4ff"],
            [0.58, "#3288d9"],
            [1, "#195ea8"]
        ]);

        ctx.fillStyle = "rgba(87, 175, 95, 0.85)";
        ctx.beginPath();
        ctx.ellipse(x - radius * 0.2, y + radius * 0.04, radius * 0.34, radius * 0.2, -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(x + radius * 0.12, y - radius * 0.12, radius * 0.2, radius * 0.12, 0.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "rgba(255, 255, 255, 0.28)";
        ctx.lineWidth = Math.max(0.8, radius * 0.05);
        ctx.beginPath();
        ctx.arc(x, y, radius * 1.02, 0.22, 2.6);
        ctx.stroke();
    }

    function drawMoon(x, y, radius) {
        drawPlanetBody(x, y, radius, [
            [0, "#f0f2f7"],
            [0.6, "#c7ccd7"],
            [1, "#a1a8b6"]
        ]);

        ctx.fillStyle = "rgba(120, 130, 145, 0.35)";
        ctx.beginPath();
        ctx.arc(x - radius * 0.18, y + radius * 0.08, radius * 0.16, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + radius * 0.14, y - radius * 0.22, radius * 0.12, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawJupiter(x, y, radius) {
        drawPlanetBody(x, y, radius, [
            [0, "#ffe1b7"],
            [0.58, "#c69a72"],
            [1, "#9b714f"]
        ]);

        ctx.strokeStyle = "rgba(122, 83, 56, 0.45)";
        for (let i = -2; i <= 2; i += 1) {
            ctx.lineWidth = Math.max(1, radius * 0.06);
            ctx.beginPath();
            ctx.arc(x, y + i * radius * 0.22, radius * 0.9, Math.PI * 0.1, Math.PI * 0.9);
            ctx.stroke();
        }

        ctx.fillStyle = "rgba(186, 98, 64, 0.5)";
        ctx.beginPath();
        ctx.ellipse(x + radius * 0.3, y + radius * 0.12, radius * 0.18, radius * 0.1, 0.2, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawSaturn(x, y, radius, tilt) {
        drawPlanetBody(x, y, radius, [
            [0, "#f8e5c1"],
            [0.6, "#d2b382"],
            [1, "#a6845c"]
        ]);

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(tilt);
        ctx.strokeStyle = "rgba(233, 214, 165, 0.56)";
        ctx.lineWidth = Math.max(1.2, radius * 0.09);
        ctx.beginPath();
        ctx.ellipse(0, 0, radius * 1.8, radius * 0.5, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }

    function drawBodyByType(kind, x, y, radius, t) {
        if (kind === "sun") {
            drawSun(x, y, radius, t);
            return;
        }
        if (kind === "mercury") {
            drawPlanetBody(x, y, radius, [[0, "#d7d0ca"], [1, "#8f8781"]]);
            return;
        }
        if (kind === "venus") {
            drawPlanetBody(x, y, radius, [[0, "#fbe3a2"], [1, "#c99252"]]);
            return;
        }
        if (kind === "earth") {
            drawEarth(x, y, radius);
            return;
        }
        if (kind === "moon") {
            drawMoon(x, y, radius);
            return;
        }
        if (kind === "mars") {
            drawPlanetBody(x, y, radius, [[0, "#f7b186"], [1, "#b15a3f"]]);
            return;
        }
        if (kind === "jupiter") {
            drawJupiter(x, y, radius);
            return;
        }
        if (kind === "saturn") {
            drawSaturn(x, y, radius, 0.33);
            return;
        }
        if (kind === "uranus") {
            drawPlanetBody(x, y, radius, [[0, "#d7fbff"], [1, "#85cad6"]]);
            return;
        }
        if (kind === "neptune") {
            drawPlanetBody(x, y, radius, [[0, "#9aceff"], [1, "#2f61c0"]]);
            return;
        }
        if (kind === "distant-sun") {
            drawSun(x, y, radius, t * 0.6);
            return;
        }

        const exoPalette = {
            "exo-a": [[0, "#e4b5ff"], [1, "#8f57cb"]],
            "exo-b": [[0, "#b3ffd7"], [1, "#2f9583"]],
            "exo-c": [[0, "#ffd4b7"], [1, "#9b4f40"]]
        };
        drawPlanetBody(x, y, radius, exoPalette[kind] || [[0, "#d8e5f8"], [1, "#617ea9"]]);
    }

    function drawSystems(t) {
        for (let i = 0; i < state.systemBodies.length; i += 1) {
            const b = state.systemBodies[i];
            const wobble = Math.sin(t * 0.12 + i) * 1.6;
            const x = b.x + (state.smoothMouseX - state.w / 2) * b.parallax + wobble;
            const y = b.y + (state.smoothMouseY - state.h / 2) * b.parallax * 0.9 + wobble * 0.6;

            if (b.kind !== "sun") {
                const halo = ctx.createRadialGradient(x, y, b.radius * 0.5, x, y, b.radius * 2.1);
                halo.addColorStop(0, "rgba(175, 220, 255, 0.12)");
                halo.addColorStop(1, "rgba(175, 220, 255, 0)");
                ctx.fillStyle = halo;
                ctx.beginPath();
                ctx.arc(x, y, b.radius * 2.1, 0, Math.PI * 2);
                ctx.fill();
            }

            drawBodyByType(b.kind, x, y, b.radius, t);
        }

        for (let i = 0; i < state.remoteSystem.length; i += 1) {
            const b = state.remoteSystem[i];
            const x = b.x + (state.smoothMouseX - state.w / 2) * b.parallax;
            const y = b.y + (state.smoothMouseY - state.h / 2) * b.parallax;
            drawBodyByType(b.kind, x, y, b.radius, t);
        }
    }

    function drawStars(t) {
        for (let i = 0; i < state.stars.length; i += 1) {
            const star = state.stars[i];
            const projected = projectStar(star);

            const radius = star.size * projected.p;
            if (radius <= 0.01) continue;

            const fade = Math.min(1, (1.05 - star.z) * 1.2);
            const twinkle = 0.85 + Math.sin(t * star.twinkle + star.seed) * 0.12;
            const alpha = star.alpha * Math.max(0.25, fade) * twinkle;

            ctx.fillStyle = `rgba(210, 240, 255, ${alpha})`;
            ctx.beginPath();
            ctx.arc(projected.x, projected.y, radius, 0, Math.PI * 2);
            ctx.fill();

            const trail = Math.max(0.8, radius * 1.8);
            const tx = projected.x - (state.smoothMouseX - state.w / 2) * 0.0018;
            const ty = projected.y - trail;
            ctx.strokeStyle = `rgba(150, 225, 255, ${alpha * 0.14})`;
            ctx.lineWidth = Math.max(0.4, radius * 0.45);
            ctx.beginPath();
            ctx.moveTo(projected.x, projected.y);
            ctx.lineTo(tx, ty);
            ctx.stroke();
        }
    }

    function animate(now) {
        const dt = Math.min((now - state.lastTime) / 16.6667, 2.2);
        state.lastTime = now;

        state.smoothMouseX += (state.mouseX - state.smoothMouseX) * 0.03;
        state.smoothMouseY += (state.mouseY - state.smoothMouseY) * 0.03;

        updateStars(dt);

        ctx.clearRect(0, 0, state.w, state.h);

        const baseGrad = ctx.createLinearGradient(0, 0, 0, state.h);
        baseGrad.addColorStop(0, "rgba(3, 10, 28, 0.25)");
        baseGrad.addColorStop(1, "rgba(2, 7, 18, 0.64)");
        ctx.fillStyle = baseGrad;
        ctx.fillRect(0, 0, state.w, state.h);

        const t = now * 0.001;
        drawNebula();
        drawSystems(t);
        drawStars(t);

        requestAnimationFrame(animate);
    }

    window.addEventListener("mousemove", (ev) => {
        state.mouseX = ev.clientX;
        state.mouseY = ev.clientY;
    });

    window.addEventListener("touchmove", (ev) => {
        if (!ev.touches || ev.touches.length === 0) return;
        state.mouseX = ev.touches[0].clientX;
        state.mouseY = ev.touches[0].clientY;
    }, { passive: true });

    window.addEventListener("resize", () => {
        const prevW = state.w;
        const prevH = state.h;
        resize();

        if (Math.abs(prevW - state.w) > 120 || Math.abs(prevH - state.h) > 120) {
            initScene();
        }
    });

    resize();
    state.lastTime = performance.now();
    requestAnimationFrame(animate);
})();
