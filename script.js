const GITHUB_USERNAME = 'kioshappyio'; // Ganti dengan username GitHub Anda
const REPO_NAME = 'hidden-heart'; // Ganti dengan nama repository Anda
const ACCESS_TOKEN = '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'; // Ganti dengan Personal Access Token Anda

const navbarTitles = document.getElementById('navbar-titles');
const puisiSection = document.getElementById('puisi-section');
const puisiTitleElement = document.getElementById('puisi-title');
const puisiContentElement = document.getElementById('puisi-content');

// Memuat daftar puisi dari GitHub
async function loadFromGitHub() {
    const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/`;
    const response = await fetch(url, {
        headers: { Authorization: `token ${ACCESS_TOKEN}` },
    });

    if (response.ok) {
        const files = await response.json();
        files.forEach((file) => {
            if (file.name.endsWith('.md')) {
                const title = file.name.replace('.md', '').replace(/-/g, ' ');
                const link = document.createElement('a');
                link.href = '#';
                link.textContent = title;
                link.classList.add('text-lg', 'text-blue-500', 'hover:underline');
                link.addEventListener('click', () => loadPuisiDetail(file.path));
                navbarTitles.appendChild(link);
            }
        });
    } else {
        console.error('Gagal memuat puisi:', await response.json());
    }
}

// Memuat puisi detail saat pengguna memilih judul
async function loadPuisiDetail(filePath) {
    const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${filePath}`;
    const response = await fetch(url, {
        headers: { Authorization: `token ${ACCESS_TOKEN}` },
    });

    if (response.ok) {
        const fileData = await response.json();
        const content = atob(fileData.content); // Decode konten base64
        const [title, ...body] = content.split('\n');
        puisiTitleElement.textContent = title.replace('# ', ''); // Ambil judul tanpa "#"
        puisiContentElement.innerHTML = body.join('<br/>'); // Gabungkan isi dengan <br> untuk pemformatan
        puisiSection.classList.remove('hidden');
    } else {
        console.error('Gagal memuat puisi detail:', await response.json());
    }
}

// Inisialisasi
document.addEventListener('DOMContentLoaded', loadFromGitHub);
