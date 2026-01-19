const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 640;
canvas.height = 480;

// Запуск камеры
async function startCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            resolve();
        };
    });
}

// Рисуем ключевые точки
function drawKeypoints(predictions) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    predictions.forEach(pred => {
        const landmarks = pred.landmarks;

        for (let i = 0; i < landmarks.length; i++) {
            const [x, y, z] = landmarks[i];

            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = "red";
            ctx.fill();
        }
    });
}

// Запуск трекинга
async function run() {
    await startCamera();

    const model = await handpose.load();

    async function detect() {
        const predictions = await model.estimateHands(video);

        if (predictions.length > 0) {
            drawKeypoints(predictions);
        }

        requestAnimationFrame(detect);
    }

    detect();
}

run();