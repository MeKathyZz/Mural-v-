const SUPABASE_URL = "https://ltkbnyxvdnfwhxjlbosy.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_MXC0U_eup-xDZF4WIgXdhw_eYdcfjrJ";

// Criamos o cliente uma única vez aqui no topo
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener("DOMContentLoaded", carregarContador);

function limparTextoParaIA(texto) {
    let textoLimpo = texto;

    const dicionario = {
        "\\bvc\\b": "você", "\\bvcs\\b": "vocês", "\\bpq\\b": "porque",
        "\\btbm\\b": "também", "\\btb\\b": "também", "\\bq\\b": "que",
        "\\bmt\\b": "muito", "\\bmto\\b": "muito", "\\bbjos\\b": "beijos",
        "\\bbjs\\b": "beijos", "\\bbj\\b": "beijo", "\\bnd\\b": "nada",
        "\\bmsg\\b": "mensagem", "\\bcm\\b": "com",
        "\\bpf\\b": "por favor", "\\bpfv\\b": "por favor", "\\bdnd\\b": "de nada"
    };

    for (const [giria, correcao] of Object.entries(dicionario)) {
        const regex = new RegExp(giria, "gi");
        textoLimpo = textoLimpo.replace(regex, correcao);
    }

    return textoLimpo;
}

async function carregarContador() {
    const contador = document.getElementById("contador-mensagens");
    if (!contador) return;

    try {
        // Usa o count: 'exact' e head: true para não baixar dados desnecessários
        const { count, error } = await supabaseClient
            .from('Mural')
            .select('*', { count: 'exact', head: true });

        if (error) throw error;

        contador.innerText = count !== null ? count : 0;

    } catch (err) {
        console.error("Erro ao carregar o contador:", err);
    }
}

async function enviarParaMural() {
    const btn = document.getElementById("btn-enviar");
    
    // Se o botão já estiver desativado, sai da função (evita cliques múltiplos)
    if (btn.disabled) return; 

    const nomeInput = document.getElementById("nome");
    const mensagemInput = document.getElementById("mensagem");

    const nomeCompleto = nomeInput.value.trim();
    let mensagem = mensagemInput.value.trim();

    const partesDoNome = nomeCompleto.split(/\s+/);
    if (partesDoNome.length < 2 || partesDoNome[1] === "") {
        return alert("Por favor, digite seu Nome e pelo menos um Sobrenome.");
    }

    if (mensagem.length < 5) {
        return alert("Por favor, escreva uma mensagem com carinho para a Maria Amélia!");
    }

    // Desativa o botão IMEDIATAMENTE
    btn.disabled = true;
    btn.innerText = "Enviando Homenagem...";

    mensagem = limparTextoParaIA(mensagem);

    try {
        const { error } = await supabaseClient
            .from('Mural')
            .insert([{ nome: nomeCompleto, mensagem: mensagem }]);

        if (error) throw error;

        alert("Homenagem enviada com sucesso! Obrigado pelo carinho. 🎉");

        nomeInput.value = "";
        mensagemInput.value = "";

        await carregarContador(); 

    } catch (err) {
        console.error(err);
        alert("Erro ao salvar no banco de dados. Tente novamente!");
        // Se deu erro, reativamos o botão para ele tentar de novo
        btn.disabled = false;
        btn.innerText = "Enviar para o Mural ✨";
    } finally {
        // Se deu sucesso, o botão volta ao normal
        if (nomeInput.value === "") { 
            btn.disabled = false;
            btn.innerText = "Enviar para o Mural ✨";
        }
    }
}