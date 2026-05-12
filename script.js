let alunos = [];

const STORAGE_KEY = "alunosDashboard";

document.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) alunos = JSON.parse(saved);
    
    atualizarIndicadores();
    renderizar();
    
    document.querySelectorAll(".menu-item").forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const tab = item.dataset.tab;
            document.querySelectorAll(".menu-item").forEach(m => m.classList.remove("active"));
            document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
            item.classList.add("active");
            document.getElementById(tab).classList.add("active");
        });
    });
    
    document.getElementById("filtroModalidade").addEventListener("change", () => { renderizar(); atualizarIndicadores(); });
    document.getElementById("filtroAluno").addEventListener("input", () => { renderizar(); atualizarIndicadores(); });
    document.getElementById("formAluno").addEventListener("submit", adicionarAluno);
});

function renderizar() {
    const modalidade = document.getElementById("filtroModalidade").value.toLowerCase();
    const nome = document.getElementById("filtroAluno").value.toLowerCase();
    
    const filtrados = alunos.filter(a => 
        (modalidade === "" || a.modalidade.toLowerCase() === modalidade) &&
        (nome === "" || a.nome.toLowerCase().includes(nome))
    );
    
    const container = document.getElementById("recordsContainer");
    container.innerHTML = filtrados.length === 0 ? 
        '<div class="empty-state" style="grid-column: 1 / -1;">Nenhum aluno encontrado</div>' : 
        filtrados.map(a => `
            <div class="aluno-card">
                <div class="aluno-nome">${a.nome}</div>
                <div class="aluno-modalidade">${a.modalidade}</div>
                <div class="modalidade-badge">${a.modalidade}</div>
                <div class="aluno-info">
                    <div><div class="info-label">Frequência</div><div class="info-value">${a.frequencia}x/sem</div></div>
                    <div><div class="info-label">Meses</div><div class="info-value">${a.meses}</div></div>
                </div>
                <button class="btn-delete" onclick="deletar(${a.id})">Remover</button>
            </div>
        `).join("");
}

function atualizarIndicadores() {
    const modalidade = document.getElementById("filtroModalidade")?.value.toLowerCase() || "";
    const nome = document.getElementById("filtroAluno")?.value.toLowerCase() || "";
    
    const filtrados = alunos.filter(a => 
        (modalidade === "" || a.modalidade.toLowerCase() === modalidade) &&
        (nome === "" || a.nome.toLowerCase().includes(nome))
    );
    
    const totalFrequencia = filtrados.reduce((sum, a) => sum + a.frequencia, 0);
    const totalMeses = filtrados.reduce((sum, a) => sum + a.meses, 0);
    const mediaFrequencia = filtrados.length > 0 ? (totalFrequencia / filtrados.length).toFixed(1) : 0;
    const mediaMeses = filtrados.length > 0 ? (totalMeses / filtrados.length).toFixed(1) : 0;
    
    document.getElementById("totalAlunos").textContent = filtrados.length;
    document.getElementById("mediaFrequencia").textContent = mediaFrequencia;
    document.getElementById("totalMeses").textContent = totalMeses;
    document.getElementById("mediaMeses").textContent = mediaMeses;
}

function adicionarAluno(e) {
    e.preventDefault();
    
    const nome = document.getElementById("inputNome").value.trim();
    const modalidade = document.getElementById("inputModalidade").value;
    const frequencia = parseInt(document.getElementById("inputFrequencia").value);
    const meses = parseInt(document.getElementById("inputMeses").value);
    
    if (!nome || !modalidade || !frequencia || !meses) {
        alert("Preencha todos os campos!");
        return;
    }
    
    const novoAluno = {
        id: Math.max(...alunos.map(a => a.id), 0) + 1,
        nome, modalidade, frequencia, meses
    };
    
    alunos.push(novoAluno);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alunos));
    
    document.getElementById("formAluno").reset();
    atualizarIndicadores();
    
    const msg = document.createElement("div");
    msg.className = "message success";
    msg.textContent = "Aluno adicionado com sucesso!";
    document.querySelector(".content").insertBefore(msg, document.querySelector(".content").firstChild);
    setTimeout(() => msg.remove(), 3000);
}

function deletar(id) {
    alunos = alunos.filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alunos));
    renderizar();
    atualizarIndicadores();
}