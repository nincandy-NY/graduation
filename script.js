const API_KEY = '8f2602b0f30dc51fecb57d0f327c2d62';

const imageInput = document.getElementById('imageInput');
const nameInput = document.getElementById('nameInput');
const uploadBtn = document.getElementById('uploadBtn');
const uploadStep = document.getElementById('uploadStep');
const resultStep = document.getElementById('resultStep');
const finalImage = document.getElementById('finalImage');
const displayUserName = document.getElementById('displayUserName');

function validateForm() {
    uploadBtn.disabled = !(nameInput.value.trim() !== "" && imageInput.files.length > 0);
}

nameInput.addEventListener('input', validateForm);
imageInput.addEventListener('change', validateForm);

// ฟังก์ชันสร้างลูกโป่ง
function createBalloons() {
    const area = document.getElementById('celebration-area');
    for(let i=0; i<15; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.style.left = Math.random() * 100 + 'vw';
        balloon.style.animationDelay = Math.random() * 5 + 's';
        balloon.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
        area.appendChild(balloon);
    }
}

// ฟังก์ชันจุดพลุ
function launchFireworks() {
    var duration = 5 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) { return Math.random() * (max - min) + min; }

    var interval = setInterval(function() {
        var timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);

        var particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}

uploadBtn.addEventListener('click', async () => {
    uploadBtn.innerText = 'กำลังประมวลผล HD... ⏳';
    uploadBtn.disabled = true;

    const formData = new FormData();
    formData.append('image', imageInput.files[0]);

    try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
            method: 'POST',
            body: formData
        });
        const data = await response.json();

        if (data.success) {
            finalImage.src = data.data.url;
            displayUserName.innerText = nameInput.value.trim();
            
            uploadStep.classList.add('d-none');
            resultStep.classList.remove('d-none');
            
            // เริ่มการฉลอง!
            launchFireworks();
            createBalloons();
        }
    } catch (e) {
        alert('เกิดข้อผิดพลาด ลองใหม่อีกครั้ง');
    } finally {
        uploadBtn.innerText = 'GENERATE CARD ✨';
        uploadBtn.disabled = false;
    }
});

function downloadCard() {
    const card = document.getElementById('congratsCard');
    const originalTransform = card.style.transform;
    card.style.transform = "none"; // เอา scale ออกก่อนโหลดเพื่อให้ขนาดตรง 1080x1920

    html2canvas(card, { 
        useCORS: true, 
        width: 1080, height: 1920, scale: 1 
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `Graduation_2026_Premium.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        card.style.transform = originalTransform;
    });
}