const API_KEY = '8f2602b0f30dc51fecb57d0f327c2d62';

const imageInput = document.getElementById('imageInput');
const nameInput = document.getElementById('nameInput');
const uploadBtn = document.getElementById('uploadBtn');
const uploadStep = document.getElementById('uploadStep');
const resultStep = document.getElementById('resultStep');
const finalImage = document.getElementById('finalImage');
const displayUserName = document.getElementById('displayUserName');

function validate() {
    uploadBtn.disabled = !(nameInput.value.trim() && imageInput.files[0]);
}
nameInput.oninput = validate;
imageInput.onchange = validate;

uploadBtn.onclick = async () => {
    uploadBtn.innerText = 'Uploading...';
    uploadBtn.disabled = true;

    const formData = new FormData();
    formData.append('image', imageInput.files[0]);

    try {
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        
        if(data.success) {
            // แก้ไข: ใช้ backgroundImage แทน src เพื่อให้ CSS cover ทำงานได้แม่นยำที่สุด
            finalImage.style.backgroundImage = `url('${data.data.url}')`;
            displayUserName.innerText = nameInput.value;
            
            uploadStep.classList.add('d-none');
            resultStep.classList.remove('d-none');
            
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        }
    } catch (e) {
        alert('เกิดข้อผิดพลาด กรุณาลองใหม่');
    } finally {
        uploadBtn.innerText = 'GENERATE CARD ✨';
    }
};

async function downloadCard() {
    const card = document.getElementById('congratsCard');
    const btn = document.querySelector('.btn-luxury-download');
    
    btn.innerText = "Processing...";
    btn.disabled = true;

    // ตั้งค่า html2canvas ให้เสถียรที่สุด
    html2canvas(card, {
        scale: 4, 
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#0a0e17",
        logging: false
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `Grad_2026_${nameInput.value}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
        
        btn.innerText = "📥 DOWNLOAD";
        btn.disabled = false;
    });
}
