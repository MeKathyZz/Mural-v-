const SUPABASE_URL = "https://ltkbnyxvdnfwhxjlbosy.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_MXC0U_eup-xDZF4WIgXdhw_eYdcfjrJ";

document.addEventListener("DOMContentLoaded", carregarContador);

function limparTextoParaIA(texto) {
    let textoLimpo = texto;

    const dicionario = {
        "\\bvc\\b": "você", "\\bvcs\\b": "vocês", "\\bpq\\b": "porque",
        "\\btbm\\b": "também", "\\btb\\b": "também", "\\bq\\b": "que",
        "\\bmt\\b": "muito", "\\bmto\\b": "muito", "\\bbjos\\b": "beijos",
        "\\bbjs\\b": "beijos",
        "\\bbj\\b": "beijo", "\\bnd\\b": "nada",
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
        const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        const { data, error } = await supabaseClient
            .from('Mural')
            .select('id'); 

        if (error) throw error;

        contador.innerText = data ? data.length : 0;

    } catch (err) {
        console.error("Erro ao carregar o contador:", err);
    }
}

async function enviarParaMural() {
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

    mensagem = limparTextoParaIA(mensagem);

    const btn = document.getElementById("btn-enviar");
    btn.disabled = true;
    btn.innerText = "Enviando Homenagem...";

    try {
        const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        const { error } = await supabaseClient
            .from('Mural')
            .insert([{ nome: nomeCompleto, mensagem: mensagem }]);

        if (error) throw error;

        alert("Homenagem enviada com sucesso! Obrigado pelo carinho. 🎉");

        nomeInput.value = "";
        mensagemInput.value = "";

        carregarContador(); 

    } catch (err) {
        console.error(err);
        alert("Erro ao salvar no banco de dados. Tente novamente!");
    } finally {
        btn.disabled = false;
        btn.innerText = "Enviar para o Mural ✨";
    }
}