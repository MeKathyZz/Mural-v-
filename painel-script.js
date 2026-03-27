const SUPABASE_URL = "https://ltkbnyxvdnfwhxjlbosy.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_MXC0U_eup-xDZF4WIgXdhw_eYdcfjrJ";

document.addEventListener("DOMContentLoaded", carregarMensagens);

async function carregarMensagens() {
    const container = document.getElementById("lista-mensagens");
    if (!container) return;

    container.innerHTML = "<p style='text-align: center; color: #fff; font-size: 20px;'>Carregando homenagens...</p>";

    try {
        const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        const { data, error } = await supabaseClient
            .from('Mural') 
            .select('*'); 

        if (error) throw error;

        if (!data || data.length === 0) {
            container.innerHTML = "<p style='text-align: center; color: #fff; font-size: 20px;'>Nenhuma mensagem enviada ainda! 🌟</p>";
            return;
        }

        container.innerHTML = "";

        data.forEach(item => {
            const nomePessoa = item.nome || item.Nome || "Anônimo";
            const mensagemPessoa = item.mensagem || item.Mensagem || "Sem texto.";

            container.innerHTML += `
                <div class="cartinha">
                    <div class="cartinha-topo" onclick="toggleMensagem(this)">
                        <span class="cartinha-nome">De: ${nomePessoa}</span>
                        <span class="setinha">▼</span>
                    </div>
                    <div class="cartinha-conteudo">
                        <p class="cartinha-texto">"${mensagemPessoa}"</p>
                    </div>
                </div>
            `;
        });

    } catch (err) {
        console.error("Erro real do Supabase:", err);
        container.innerHTML = "<p style='text-align: center; color: #fff; font-size: 20px;'>Erro ao carregar mensagens no banco.</p>";
    }
}

function toggleMensagem(elementoTopo) {
    const cartinha = elementoTopo.parentElement;
    const conteudo = cartinha.querySelector('.cartinha-conteudo');
    const setinha = cartinha.querySelector('.setinha');

    if (!cartinha || !conteudo || !setinha) return;

    const estaAberto = cartinha.classList.contains('aberta');

    document.querySelectorAll('.cartinha.aberta').forEach(outra => {
        if (outra !== cartinha) {
            outra.classList.remove('aberta');
            const outraSetinha = outra.querySelector('.setinha');
            if (outraSetinha) outraSetinha.style.transform = "rotate(0deg)";
        }
    });

    if (estaAberto) {
        cartinha.classList.remove('aberta');
        setinha.style.transform = "rotate(0deg)";
    } else {
        cartinha.classList.add('aberta');
        setinha.style.transform = "rotate(180deg)";
    }
}