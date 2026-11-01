/* ==================== CONFIG ==================== */
const API_BASE = 'http://localhost:3001/api';

let state = {};
let staticData = {};

/* ==================== API ==================== */
async function apiGet(path){
  try{
    const r = await fetch(`${API_BASE}${path}`);
    if(!r.ok) throw new Error(`Erro ${r.status}`);
    return await r.json();
  }catch(e){
    console.error('API GET error:', path, e);
    alert('Erro ao conectar com o servidor. Verifique se o backend está rodando.');
    throw e;
  }
}

async function apiPost(path, body){
  try{
    const r = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: body ? JSON.stringify(body) : undefined
    });
    if(!r.ok) throw new Error(`Erro ${r.status}`);
    return await r.json();
  }catch(e){
    console.error('API POST error:', path, e);
    alert('Erro ao conectar com o servidor. Verifique se o backend está rodando.');
    throw e;
  }
}

async function loadState(){
  try{
    const data = await apiGet('/state');
    state = data.state;
    staticData = data.static || {};
    render();
  }catch(e){
    console.error('Erro ao carregar estado:', e);
  }
}

/* ==================== RENDER ==================== */
const main = document.getElementById('main');
const statsBar = document.getElementById('statsBar');

function render(){
  try{
    if(state.jogador){
      const aprovClasse = state.aprovacao < 30 ? 'alerta' : state.aprovacao < 60 ? '' : 'ok';
      statsBar.innerHTML = `
        <div class="stat ${state.cargo?'ok':''}">Ano <b>${state.ano}</b></div>
        <div class="stat ${state.cargo?'ok':''}">Cargo <b>${state.cargo||'-'}</b></div>
        <div class="stat ${state.dinheiro<5?'alerta':''}">Caixa <b>R$ ${state.dinheiro.toLocaleString('pt-BR')} mi</b></div>
        <div class="stat ${aprovClasse}">Aprovação <b>${state.aprovacao}%</b></div>
        <div class="stat ${state.selic>12?'alerta':''}">Selic <b>${state.selic.toFixed(1)}%</b></div>
        <div class="stat ${state.inflacao>6?'alerta':''}">Inflação <b>${state.inflacao.toFixed(1)}%</b></div>
        <div class="stat ${state.riscoImpeachment>60?'alerta':''}">Impeachment <b>${state.riscoImpeachment}%</b></div>
      `;
    } else {
      statsBar.innerHTML = '';
    }

    const secao = state.fase === 'menu' ? telaMenu()
      : state.fase === 'criacao' ? telaCriacao()
      : state.fase === 'carreira' ? telaCarreira()
      : state.fase === 'eleicao_prefeito' ? telaCampanhaCargo('prefeito')
      : state.fase === 'eleicao_governador' ? telaCampanhaCargo('governador')
      : state.fase === 'eleicao_senador' ? telaCampanhaCargo('senador')
      : state.fase === 'eleicao_presidente' ? telaCampanhaPresidente()
      : state.fase === 'governo_prefeito' ? telaGovernoPrefeito()
      : state.fase === 'governo_governador' ? telaGovernoGovernador()
      : state.fase === 'governo_senador' ? telaGovernoSenador()
      : state.fase === 'governo_presidente' ? telaGovernoPresidente()
      : state.fase === 'impeachment' ? telaImpeachment()
      : state.fase === 'ranking' ? telaRanking()
      : telaMenu();

    main.innerHTML = secao;
  }catch(e){
    console.error('Erro no render:', e);
    main.innerHTML = `<div class="card" style="max-width:500px;margin:40px auto;text-align:center;">
      <h2 style="color:var(--vermelho);">Erro ao renderizar</h2>
      <p>${e.message}</p>
      <button class="btn" onclick="location.reload()">Recarregar página</button>
    </div>`;
  }
}

/* ==================== MENU ==================== */
function telaMenu(){
  return `
    <div class="card" style="max-width:560px;margin:0 auto;text-align:center;">
      <h2><span class="emoji">&#x1F1E7;&#x1F1F7;</span> Presidente do Brasil</h2>
      <p style="margin-bottom:20px;color:#555;">Simulador da Presidência do Brasil. Campanhas de múltiplas semanas, 513 deputados votam um a um, você escreve medidas com as próprias palavras.</p>
      <div class="row" style="justify-content:center;">
        <button class="btn" onclick="acaoNovoJogo()">Nova Partida</button>
        <button class="btn secondary" onclick="acaoCarregar()">Carregar Salvo</button>
      </div>
      <div style="margin-top:16px;font-size:0.8rem;color:#888;">Baseado no Planalto.fun • Salvamento no servidor</div>
    </div>
  `;
}
async function acaoNovoJogo(){
  try{
    await apiPost('/action/novo-jogo');
    await loadState();
  }catch(e){
    console.error('Erro novo jogo:', e);
  }
}
async function acaoCarregar(){
  try{
    await apiPost('/action/carregar');
    await loadState();
  }catch(e){
    console.error('Erro carregar:', e);
  }
}

/* ==================== CRIAÇÃO ==================== */
function telaCriacao(){
  const partidosHtml = staticData.PARTIDOS.map(p => `
    <label style="display:block;padding:8px 12px;border:2px solid ${p.cor};border-radius:8px;margin:6px 0;cursor:pointer;" onclick="selecionarPartido('${p.sigla}')">
      <strong>${p.sigla}</strong> - ${p.nome} <span style="float:right;font-weight:normal;">${p.ideologia}</span>
    </label>
  `).join('');
  return `
    <div class="card" style="max-width:600px;margin:0 auto;">
      <h2><span class="emoji">&#x1F464;</span> Criar Política</h2>
      <div style="margin:14px 0;">
        <label style="display:block;margin-bottom:6px;color:#555;">Nome completo</label>
        <input type="text" id="inpNome" placeholder="Ex: Ana Silva" style="width:100%;padding:11px;border:2px solid #ddd;border-radius:8px;font-size:0.95rem;">
      </div>
      <div style="margin:14px 0;">
        <label style="display:block;margin-bottom:6px;color:#555;">Partido</label>
        ${partidosHtml}
      </div>
      <div style="margin:14px 0;">
        <label style="display:block;margin-bottom:6px;color:#555;">Estado eleitoral</label>
        <select id="inpEstado" style="width:100%;padding:11px;border:2px solid #ddd;border-radius:8px;font-size:0.95rem;">
          ${staticData.ESTADOS.map(e=>`<option value="${e.sigla}">${e.nome} (${e.sigla})</option>`).join('')}
        </select>
      </div>
      <div style="margin:14px 0;">
        <label style="display:block;margin-bottom:6px;color:#555;">Origem / perfil</label>
        <select id="inpOrigem" style="width:100%;padding:11px;border:2px solid #ddd;border-radius:8px;font-size:0.95rem;">
          <option value="advogado">Advogado</option>
          <option value="economista">Economista</option>
          <option value="militar">Militar</option>
          <option value="sindicalista">Sindicalista</option>
          <option value="tecnocrata">Tecnocrata</option>
        </select>
      </div>
      <div style="margin-top:20px;text-align:right;">
        <button class="btn" onclick="acaoCriarCandidato()">Entrar na Carreira</button>
      </div>
    </div>
  `;
}
let partidoSel = null;
function selecionarPartido(sigla){
  partidoSel = sigla;
  document.querySelectorAll('label').forEach(l=>{ l.style.background='#fff'; });
  event.currentTarget.style.background='#eef4ff';
}
async function acaoCriarCandidato(){
  try{
    const nome = document.getElementById('inpNome').value.trim() || 'Candidato Sem Nome';
    const estado = document.getElementById('inpEstado').value;
    const origem = document.getElementById('inpOrigem').value;
    const partido = partidoSel || staticData.PARTIDOS[0].sigla;
    await apiPost('/action/criar-candidato', { nome, partido, estado, origem });
    await loadState();
  }catch(e){
    console.error('Erro criar candidato:', e);
  }
}

/* ==================== CARREIRA ==================== */
function telaCarreira(){
  const j = state.jogador;
  const podePresid = ['prefeito','governador','senador'].includes(j.cargo);
  return `
    <div class="card" style="max-width:620px;margin:0 auto;">
      <h2><span class="emoji">&#x1F3AD;</span> Carreira Política - ${state.ano}</h2>
      <div class="noticia">
        <strong>${j.nome}</strong> (${j.party||j.partido}) - Estado: ${j.estado} - Idade: ${j.idade}<br>
        Apoiadores: <b>${j.apoio}</b> • Caixa: <b>R$ ${state.dinheiro.toLocaleString('pt-BR')} milhões</b>
      </div>
      <div style="margin-top:14px;">
        ${j.cargo ? `<p style="color:#666;">Cargo atual: <b>${j.cargo}</b> (ano ${state.mandatoAnos||0}/4)</p>` : '<p style="color:#666;">Sem cargo eletivo ainda.</p>'}
      </div>
      <div class="row">
        <button class="btn" onclick="acaoIniciarEleicao('prefeito')">Disputar Prefeitura (6 semanas)</button>
        <button class="btn" onclick="acaoIniciarEleicao('governador')">Disputar Governo Estadual (6 semanas)</button>
      </div>
      <div class="row" style="margin-top:10px;">
        <button class="btn azul" onclick="acaoIniciarEleicao('senador')">Disputar Senado Federal (6 semanas)</button>
        ${podePresid ? `<button class="btn" onclick="acaoIniciarEleicao('presidente')">Disputar Presidência (13 semanas)</button>` : `<button class="btn" disabled>Presidência (exija cargo eletivo)</button>`}
      </div>
      ${j.cargo ? `<div class="row" style="margin-top:14px;"><button class="btn secondary" onclick="acaoAvancarMandato()">Avançar mandato</button></div>` : ''}
      <div style="margin-top:16px;text-align:center;">
        <button class="btn danger" onclick="acaoNovoJogo()">Desistir / Novo jogo</button>
      </div>
    </div>
  `;
}
async function acaoIniciarEleicao(cargo){
  try{
    await apiPost('/action/iniciar-eleicao', { cargo });
    await loadState();
  }catch(e){
    console.error('Erro iniciar eleição:', e);
  }
}

/* ==================== CAMPANHA DE CARGO ==================== */
function telaCampanhaCargo(cargo){
  const j = state.jogador;
  const camp = state.campanha;
  const semanaAtual = camp.semanaAtual || 0;
  const semanasTotais = camp.semanasTotais || 6;
  const fim = semanaAtual >= semanasTotais;

  return `
    <div class="card">
      <h2><span class="emoji">&#x1F3AD;</span> Campanha - ${cargo} - ${j.estado}</h2>
      <div class="noticia">
        <strong>Semana ${semanaAtual} de ${semanasTotais}</strong> • Apoio: <b>${j.apoio}</b> • Caixa: <b>R$ ${state.dinheiro} mi</b> • Gasto esta semana: <b>${camp.gastouSemana||0}/${camp.limiteGastoSemana} mi</b>
      </div>
      <div class="row" style="margin-bottom:12px;">
        <button class="btn" onclick="acaoCampanhaSemana('comicio', '${cargo}', '${j.estado}')">Comício (R$ 2 mi)</button>
        <button class="btn" onclick="acaoCampanhaSemana('debate', '${cargo}')">Debate na TV (R$ 3 mi)</button>
        <button class="btn" onclick="acaoCampanhaSemana('rede', '${cargo}')">Redes sociais (R$ 1 mi)</button>
      </div>
      <div class="row" style="margin-bottom:12px;">
        <button class="btn" onclick="acaoCampanhaSemana('visita', '${cargo}', '${j.estado}')">Visitar estado (R$ 1 mi)</button>
        <button class="btn" onclick="acaoCampanhaSemana('coleta', '${cargo}')">Arrecadar fundos (ganha R$)</button>
      </div>
      ${fim ? `
        <div style="margin-top:14px;">
          <button class="btn azul" onclick="acaoFinalizarEleicaoCargo('${cargo}')">Ir para as urnas</button>
        </div>
      ` : `
        <div style="margin-top:14px;">
          <button class="btn" onclick="acaoAvancarSemana()">Avançar para próxima semana</button>
        </div>
      `}
      ${state.mensagem ? `<div class="noticia ${state.tipoMensagem==='ruim'?'vermelha':'verde'}"><strong>${state.mensagem}</strong></div>` : ''}
    </div>
    <div class="card">
      <h3><span class="emoji">&#x1F4CA;</span> Apoio por estado</h3>
      <div class="estados-grid">
        ${staticData.ESTADOS.map(e=>{
          const sup = camp.apoiosEstado[e.sigla] || j.apoio;
          const classe = sup>50?'selected':'';
          return `<div class="estado-card ${classe}">
            <div class="sigla">${e.sigla}</div>
            <div>${sup}%</div>
            <div class="valor">${e.peso} votos</div>
          </div>`;
        }).join('')}
      </div>
    </div>
  `;
}

async function acaoCampanhaSemana(tipo, cargo, estadoSigla){
  try{
    await apiPost('/action/campanha-semana', { tipo, cargo, estadoSigla });
    await loadState();
  }catch(e){
    console.error('Erro campanha semana:', e);
  }
}
async function acaoAvancarSemana(){
  try{
    await apiPost('/action/avancar-semana-campanha');
    await loadState();
  }catch(e){
    console.error('Erro avançar semana:', e);
  }
}
async function acaoFinalizarEleicaoCargo(cargo){
  try{
    await apiPost('/action/finalizar-eleicao-cargo', { cargo });
    await loadState();
  }catch(e){
    console.error('Erro finalizar eleição:', e);
  }
}

/* ==================== CAMPANHA PRESIDENCIAL ==================== */
function telaCampanhaPresidente(){
  const j = state.jogador;
  const camp = state.campanha;
  const semanaAtual = camp.semanaAtual || 0;
  const semanasTotais = camp.semanasTotais || 13;
  const fim = semanaAtual >= semanasTotais;
  const VIT = staticData.VITORIA_PRESIDENCIAL || 0;
  const TOT = staticData.TOTAL_ELEITORES || 0;

  return `
    <div class="card">
      <h2><span class="emoji">&#x1F6E1;&#xFE0F;</span> Campanha Presidencial - ${state.ano}</h2>
      <div class="noticia">
        <strong>Semana ${semanaAtual} de ${semanasTotais}</strong> • Apoio nacional: <b>${j.apoio}</b> • Caixa: <b>R$ ${state.dinheiro} mi</b> • Gasto esta semana: <b>${camp.gastouSemana||0}/${camp.limiteGastoSemana} mi</b><br>
        Precisa de <b>${VIT}</b> de ${TOT} votos eleitorais para vencer.
      </div>
      <div class="row" style="margin-bottom:12px;">
        <button class="btn" onclick="acaoCampanhaSemana('comicio', 'presidente')">Comício nacional (R$ 2 mi)</button>
        <button class="btn" onclick="acaoCampanhaSemana('debate', 'presidente')">Debate na TV (R$ 3 mi)</button>
        <button class="btn" onclick="acaoCampanhaSemana('rede', 'presidente')">Redes sociais (R$ 1 mi)</button>
      </div>
      <div class="row" style="margin-bottom:12px;">
        <button class="btn" onclick="selecionarEstadoCampanha()">Visitar estado específico (R$ 1 mi)</button>
        <button class="btn" onclick="acaoCampanhaSemana('coleta', 'presidente')">Arrecadar fundos (ganha R$)</button>
      </div>
      ${fim ? `
        <div style="margin-top:14px;">
          <button class="btn azul" onclick="acaoApurarPresidente()">Apurar votos (colégio eleitoral)</button>
        </div>
      ` : `
        <div style="margin-top:14px;">
          <button class="btn" onclick="acaoAvancarSemana()">Avançar para próxima semana</button>
        </div>
      `}
      ${state.mensagem ? `<div class="noticia ${state.tipoMensagem==='ruim'?'vermelha':'verde'}"><strong>${state.mensagem}</strong></div>` : ''}
    </div>
    <div class="card">
      <h3><span class="emoji">&#x1F4CA;</span> Apoio por estado (colégio eleitoral)</h3>
      <div class="estados-grid">
        ${staticData.ESTADOS.map(e=>{
          const sup = camp.apoiosEstado[e.sigla] || j.apoio;
          const classe = sup>50?'selected':'';
          const votosEstimados = Math.floor(sup * (e.peso/100));
          return `<div class="estado-card ${classe}" onclick="selecionarEstadoCampanha('${e.sigla}')">
            <div class="sigla">${e.sigla}</div>
            <div>${sup}%</div>
            <div class="valor">${e.peso} votos (~${votosEstimados})</div>
          </div>`;
        }).join('')}
      </div>
    </div>
  `;
}

let estadoSelecionadoCampanha = null;
function selecionarEstadoCampanha(sigla){
  estadoSelecionadoCampanha = sigla;
  document.querySelectorAll('.estado-card').forEach(c=>{ c.style.borderColor='#bbb'; });
  const el = event.currentTarget;
  if(el) el.style.borderColor='#009c3b';
}
async function acaoApurarPresidente(){
  try{
    await apiPost('/action/finalizar-eleicao-cargo', { cargo: 'presidente' });
    await loadState();
  }catch(e){
    console.error('Erro apurar presidente:', e);
  }
}

/* ==================== GOVERNOS MENORES ==================== */
function telaGovernoPrefeito(){ return telaGovernoGeneric('prefeito', 'Prefeitura'); }
function telaGovernoGovernador(){ return telaGovernoGeneric('governador', 'Palácio Estadual'); }
function telaGovernoSenador(){
  return `
    <div class="card">
      <h2><span class="emoji">&#x1F469;&#x1F3FC;&#x200D;&#x1F3EB;</span> Senado Federal - ${state.ano}</h2>
      <div class="noticia">
        Você atua como senador por ${state.jogador.estado}. Aprovação: <b>${state.aprovacao}%</b> • Mês: ${state.mesGoverno||0}/48
      </div>
      <div class="row">
        <button class="btn" onclick="acaoSenador('proposta')">Apresentar proposta</button>
        <button class="btn" onclick="acaoSenador('comissao')">Presidir comissão</button>
      </div>
      <div class="row" style="margin-top:10px;">
        <button class="btn azul" onclick="acaoAvancarMandato()">Avançar ano</button>
      </div>
      ${state.mensagem ? `<div class="noticia ${state.tipoMensagem==='ruim'?'vermelha':'verde'}"><strong>${state.mensagem}</strong></div>` : ''}
    </div>
  `;
}
async function acaoSenador(tipo){
  try{
    state.aprovacao = Math.min(100, state.aprovacao + (tipo==='proposta'?4:3));
    state.mensagem = tipo==='proposta' ? 'Proposta aprovada no Senado: +aprovação.' : 'Comissão presidida com destaque.';
    state.tipoMensagem = 'bom';
    render();
  }catch(e){
    console.error('Erro senador:', e);
  }
}
function telaGovernoGeneric(cargo, nomeLocal){
  const j = state.jogador;
  const aprovClasse = state.aprovacao < 30 ? 'baixa' : state.aprovacao < 60 ? 'media' : '';
  return `
    <div class="card">
      <h2><span class="emoji">&#x1F3EF;</span> ${nomeLocal} - ${j.estado} - ${state.ano}</h2>
      <div style="margin-bottom:8px;"><strong>Cargo:</strong> ${cargo} • <strong>Aprovação:</strong> <b>${state.aprovacao}%</b></div>
      <div class="aprovacao-container"><div class="aprovacao-bar ${aprovClasse}" style="width:${state.aprovacao}%;"></div></div>
      <div class="row" style="margin-top:14px;">
        <button class="btn" onclick="acaoInvestirArea('economia', 2)">Economia</button>
        <button class="btn" onclick="acaoInvestirArea('saude', 2)">Saúde</button>
        <button class="btn" onclick="acaoInvestirArea('educacao', 2)">Educação</button>
      </div>
      <div class="row" style="margin-top:8px;">
        <button class="btn" onclick="acaoInvestirArea('seguranca', 2)">Segurança</button>
        <button class="btn" onclick="acaoInvestirArea('infraestrutura', 2)">Infraestrutura</button>
        <button class="btn" onclick="acaoInvestirArea('meioambiente', 2)">Meio Ambiente</button>
      </div>
      <div style="margin-top:14px;">
        <button class="btn azul" onclick="acaoAvancarMandato()">Avançar ano</button>
      </div>
      ${state.mensagem ? `<div class="noticia ${state.tipoMensagem==='ruim'?'vermelha':'verde'}"><strong>${state.mensagem}</strong></div>` : ''}
    </div>
  `;
}
async function acaoInvestirArea(chave, custo){
  try{
    await apiPost('/action/investir-area', { chave, custo });
    await loadState();
  }catch(e){
    console.error('Erro investir área:', e);
  }
}
async function acaoAvancarMandato(){
  try{
    await apiPost('/action/avancar-mandato');
    await loadState();
  }catch(e){
    console.error('Erro avançar mandato:', e);
  }
}

/* ==================== GOVERNO PRESIDENCIAL ==================== */
function telaGovernoPresidente(){
  const aprovClasse = state.aprovacao < 30 ? 'baixa' : state.aprovacao < 60 ? 'media' : '';
  return `
    <div class="card">
      <h2><span class="emoji">&#x1F3EF;</span> Palácio do Planalto - Mês ${state.mesGoverno||0}/48</h2>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px;">
        <div class="stat ${aprovClasse}">Aprovação <b>${state.aprovacao}%</b></div>
        <div class="stat ${state.selic>12?'alerta':''}">Selic <b>${state.selic.toFixed(1)}%</b></div>
        <div class="stat ${state.inflacao>6?'alerta':''}">Inflação <b>${state.inflacao.toFixed(1)}%</b></div>
        <div class="stat ${state.cambial>6?'alerta':''}">Câmbio <b>R$ ${state.cambial.toFixed(2)}</b></div>
        <div class="stat ${state.riscoPais>300?'alerta':''}">Risco-país <b>${state.riscoPais}</b></div>
        <div class="stat ${state.divida>80?'alerta':''}">Dívida <b>${state.divida.toFixed(1)}% PIB</b></div>
        <div class="stat ${state.riscoImpeachment>60?'alerta':''}">Impeachment <b>${state.riscoImpeachment}%</b></div>
        <div class="stat ${state.cpi>50?'alerta':''}">CPI <b>${state.cpi}%</b></div>
      </div>
      <div class="row" style="margin-bottom:12px;">
        <button class="btn" onclick="telaEscreverMedida()">Escrever medida</button>
        <button class="btn" onclick="telaVotacaoCamara()">Câmara (513 deputados)</button>
        <button class="btn" onclick="telaMinistros()">Nomear Ministros</button>
        <button class="btn azul" onclick="acaoCopom()">Copom</button>
      </div>
      <div class="row" style="margin-bottom:12px;">
        <button class="btn" onclick="telaCoalizao()">Coalizão / Emendas</button>
        <button class="btn" onclick="telaGovernadores()">Governadores (27)</button>
        <button class="btn" onclick="telaGruposSociais()">Grupos sociais (32)</button>
        <button class="btn" onclick="telaCPI()">CPI / Impeachment</button>
      </div>
      <div style="margin-top:12px;">
        <button class="btn azul" onclick="acaoAvancarMesGoverno()">Avançar mês</button>
      </div>
      ${state.mensagem ? `<div class="noticia ${state.tipoMensagem==='ruim'?'vermelha':state.tipoMensagem==='bom'?'verde':'amarela'}"><strong>${state.mensagem}</strong></div>` : ''}
    </div>
    <div class="card grid2">
      <div>
        <h3><span class="emoji">&#x1F4CA;</span> Mapa - Apoio por estado</h3>
        <div id="mapaBrasil">${gerarSVGMapa(staticData.ESTADOS||[])}</div>
      </div>
      <div>
        <h3><span class="emoji">&#x1F4DC;</span> Diário Oficial (últimos atos)</h3>
        <div id="diarioList">${renderDiario()}</div>
      </div>
    </div>
  `;
}
function gerarSVGMapa(E){
  const paths = E.map(e=>{
    const r = 16 + e.peso;
    const apoio = state.votosEstado[e.sigla] || (state.campanha.apoiosEstado[e.sigla] || state.jogador.apoio * (0.6+Math.random()*0.6));
    const classe = apoio > 50 ? 'selected' : '';
    return `
      <g onclick="acaoFocarEstadoPresidente('${e.sigla}')" style="cursor:pointer;">
        <circle class="estado-path ${classe}" cx="${e.x}" cy="${e.y}" r="${r}" fill="${e.cor}" opacity="0.75"/>
        <text class="label-estado" x="${e.x}" y="${e.y+4}" text-anchor="middle">${e.sigla}</text>
      </g>
    `;
  }).join('');
  return `<svg viewBox="0 0 800 620" xmlns="http://www.w3.org/2000/svg">${paths}</svg>`;
}
function renderDiario(){
  const ultimos = (state.diarioOficial||[]).slice(0,5);
  if(!ultimos.length) return '<p style="color:#888;font-size:0.85rem;">Sem atos publicados.</p>';
  return ultimos.map(a=>`
    <div class="noticia" style="font-size:0.85rem;padding:8px;margin:4px 0;">
      <strong>${a.tipo}</strong> - ${a.texto}<br>
      <span class="small">${a.ano}/${a.mes}</span>
    </div>`).join('');
}

/* ---- Escrever medida ---- */
function telaEscreverMedida(){
  return `
    <div class="card">
      <h2><span class="emoji">&#x270D;</span> Escrever Medida</h2>
      <p style="color:#666;font-size:0.9rem;">Escreva com as suas palavras. O jogo classifica (decreto, MP ou emenda), calcula o custo e envia para a Câmara.</p>
      <textarea id="inpMedida" rows="4" style="width:100%;padding:10px;border:1px solid #ccc;border-radius:6px;font-family:inherit;" placeholder="Ex: Zerar o imposto de importação do arroz por seis meses e liberar o estoque da Conab."></textarea>
      <div style="margin-top:10px;">
        <button class="btn" onclick="acaoEscreverMedida()">Enviar ao Congresso</button>
        <button class="btn secondary" onclick="render()">Cancelar</button>
      </div>
      ${state.mensagem ? `<div class="noticia ${state.tipoMensagem==='ruim'?'vermelha':'verde'}"><strong>${state.mensagem}</strong></div>` : ''}
    </div>
  `;
}
async function acaoEscreverMedida(){
  try{
    const texto = document.getElementById('inpMedida').value.trim();
    if(!texto){ alert('Escreva algo.'); return; }
    const r = await apiPost('/action/escrever-medida', { texto });
    if(r.erro){ alert(r.erro); return; }
    state = r.state;
    render();
  }catch(e){
    console.error('Erro escrever medida:', e);
  }
}

/* ---- Votação Câmara ---- */
function telaVotacaoCamara(){
  const v = state.votacaoAtual;
  if(!v){
    return `
      <div class="card">
        <h2><span class="emoji">&#x1F469;&#x1F3FC;&#x200D;&#x1F3EB;</span> Câmara dos Deputados</h2>
        <p style="color:#666;">Não há votação em andamento. Escreva uma medida para enviar à Câmara.</p>
        <div style="margin-top:14px;text-align:right;"><button class="btn" onclick="render()">Voltar</button></div>
      </div>`;
  }
  const porPartido = {};
  state.deputados.forEach(d=>{
    if(!porPartido[d.partido]) porPartido[d.partido] = {total:0, sim:0, nao:0, abst:0, relacaoMedia:0};
    porPartido[d.partido].total++;
    if(d.voto==='sim') porPartido[d.partido].sim++;
    else if(d.voto==='nao') porPartido[d.partido].nao++;
    else if(d.voto==='abst') porPartido[d.partido].abst++;
    porPartido[d.partido].relacaoMedia += d.relacao;
  });
  Object.keys(porPartido).forEach(p=>{ porPartido[p].relacaoMedia = Math.round(porPartido[p].relacaoMedia/porPartido[p].total); });
  const partidos = staticData.PARTIDOS || [];
  return `
    <div class="card">
      <h2><span class="emoji">&#x1F469;&#x1F3FC;&#x200D;&#x1F3EB;</span> Câmara - ${v.tipo}</h2>
      <div class="noticia">
        <strong>${v.texto}</strong><br>
        <span class="small">Custo: R$ ${v.custo} mi • Necessários: ${v.necessarios} votos • Status: ${v.status}</span>
      </div>
      <div style="margin-top:10px;">
        <div class="stat">SIM <b>${v.votosSim}</b></div>
        <div class="stat">NÃO <b>${v.votosNao}</b></div>
        <div class="stat">ABST. <b>${v.votosAbst}</b></div>
        <div class="stat">Faltam <b>${v.totalDeputados - (v.votosSim+v.votosNao+v.votosAbst)}</b></div>
      </div>
      ${v.status !== 'em_votacao' ? `
        <div style="margin-top:10px;font-weight:700;">${v.status === 'aprovada' ? 'APROVADA' : 'REJEITADA'}</div>
      ` : ''}
      <div style="margin-top:14px;"><strong>Por partido (relação média com o governo):</strong></div>
      <div style="display:flex;flex-direction:column;gap:6px;margin-top:8px;">
        ${partidos.map(p=>{
          const dados = porPartido[p.sigla];
          if(!dados) return '';
          return `<div style="border:1px solid #ddd;border-radius:6px;padding:6px 10px;background:#fff;display:flex;justify-content:space-between;align-items:center;">
            <div><strong>${p.sigla}</strong> <span class="small">(${dados.total} dep.)</span></div>
            <div style="text-align:right;">
              <span style="color:var(--verde);">SIM ${dados.sim}</span> |
              <span style="color:var(--vermelho);">NÃO ${dados.nao}</span> |
              <span class="small">ABST ${dados.abst}</span><br>
              <span class="small">Relação média: ${dados.relacaoMedia}</span>
            </div>
          </div>`;
        }).join('')}
      </div>
      ${v.status === 'em_votacao' ? `
        <div style="margin-top:14px;"><strong>Liberar emenda para bancada (compra votos):</strong></div>
        <div style="display:flex;flex-direction:column;gap:6px;margin-top:8px;">
          ${partidos.map(p=>`
            <div style="display:flex;gap:6px;align-items:center;">
              <strong style="min-width:110px;">${p.sigla} - ${p.nome}</strong>
              <input type="number" id="emenda_${p.sigla}" placeholder="R$ mi" style="width:90px;padding:6px;border:1px solid #ccc;border-radius:4px;">
              <button class="btn secondary" style="padding:6px 12px;font-size:0.8rem;" onclick="acaoLiberarEmenda('${p.sigla}')">Liberar</button>
            </div>`).join('')}
        </div>
        <div style="margin-top:10px;"><strong>Entregar ministério:</strong></div>
        <div style="display:flex;flex-direction:column;gap:6px;margin-top:6px;">
          ${Object.entries(state.areas).map(([chave])=>{
            const m = (staticData.MINISTERIOS||[]).find(x=>x.sigilo===chave);
            const atual = state.ministros[chave];
            if(atual) return '';
            return `<div style="display:flex;gap:6px;align-items:center;">
              <strong style="min-width:150px;">${m.nome}</strong>
              <div style="flex:1;">
                ${partidos.map(p=>`<button class="btn secondary" style="padding:4px 10px;font-size:0.75rem;margin:2px;" onclick="acaoEntregarMinisterio('${chave}','${p.sigla}')">${p.sigla}</button>`).join('')}
              </div>
            </div>`;
          }).join('')}
        </div>
      ` : ''}
      <div style="margin-top:14px;text-align:right;">
        <button class="btn" onclick="render()">Voltar ao Planalto</button>
      </div>
    </div>
  `;
}
async function acaoLiberarEmenda(sigla){
  try{
    const input = document.getElementById(`emenda_${sigla}`);
    const valor = parseInt(input.value) || 0;
    if(valor <= 0){ alert('Informe um valor.'); return; }
    await apiPost('/action/liberar-emenda', { partidoSigla: sigla, valor });
    await loadState();
  }catch(e){
    console.error('Erro liberar emenda:', e);
  }
}
async function acaoEntregarMinisterio(sigilo, sigla){
  try{
    await apiPost('/action/entregar-ministerio', { sigilo, partidoSigla: sigla });
    await loadState();
  }catch(e){
    console.error('Erro entregar ministério:', e);
  }
}

/* ---- Ministros ---- */
function telaMinistros(){
  const M = staticData.MINISTERIOS || [];
  return `
    <div class="card">
      <h2><span class="emoji">&#x1F468;&#x1F3FC;&#x200D;&#x1F3ED;</span> Nomear Ministros</h2>
      ${M.map(m=>{
        const atual = state.ministros[m.sigilo];
        const cands = (window.CANDIDATOS_MINISTRO||{})[m.sigilo] || [{nome:'Sem nome', partido:'-'}];
        return `<div style="border:1px solid #ddd;border-radius:8px;padding:12px;margin-bottom:10px;background:#fff;display:flex;justify-content:space-between;align-items:center;">
          <div><strong>${m.nome}</strong><div style="font-size:0.8rem;color:#666;">Ministro(a)</div></div>
          <div style="text-align:right;">
            ${atual ? `<div><strong>${atual.nome}</strong> (${atual.partido})</div><button class="btn danger" style="padding:6px 10px;font-size:0.8rem;" onclick="acaoDemitirMinistro('${m.sigilo}')">Demitir</button>` : '<span style="color:#999;">Vago</span>'} 
            ${!atual ? `<div style="margin-top:6px;">${cands.map(c=>`<button class="btn secondary" style="padding:6px 10px;font-size:0.75rem;margin:2px;" onclick="acaoNomearMinistro('${m.sigilo}','${c.nome}','${c.partido}')">${c.nome}</button>`).join('')}</div>` : ''}
          </div>
        </div>`;
      }).join('')}
      <div style="margin-top:14px;text-align:right;"><button class="btn" onclick="render()">Voltar ao Planalto</button></div>
    </div>
  `;
}
async function acaoNomearMinistro(sigilo, nome, partido){
  try{
    await apiPost('/action/nomear-ministro', { sigilo, nome, partido });
    await loadState();
  }catch(e){
    console.error('Erro nomear ministro:', e);
  }
}
async function acaoDemitirMinistro(sigilo){
  try{
    await apiPost('/action/demitir-ministro', { sigilo });
    await loadState();
  }catch(e){
    console.error('Erro demitir ministro:', e);
  }
}

/* ---- Coalizão ---- */
function telaCoalizao(){
  const P = staticData.PARTIDOS || [];
  return `
    <div class="card">
      <h2><span class="emoji">&#x1F465;</span> Coalizão Partidária</h2>
      <p style="color:#666;font-size:0.9rem;">Ofereça cargos ou emendas para partidos apoiarem seu governo na Câmara.</p>
      <div style="display:flex;flex-direction:column;gap:10px;">
        ${P.map(p=>{
          const ja = !!state.coalizao[p.sigla];
          return `<div style="border:1px solid #ddd;border-radius:8px;padding:12px;background:${ja?'#e6f7ec':'#fff'};display:flex;justify-content:space-between;align-items:center;">
            <div><strong>${p.sigla}</strong> - ${p.nome} <span style="float:right;font-weight:normal;">${p.tamanho} deputados</span></div>
            <div style="text-align:right;">
              ${ja ? `<span style="color:var(--verde);font-weight:700;">Aliado</span> <button class="btn danger" style="padding:6px 10px;font-size:0.8rem;margin-left:6px;" onclick="acaoSairCoalizao('${p.sigla}')">Sair</button>` : `<button class="btn secondary" style="padding:8px 14px;font-size:0.85rem;" onclick="acaoEntrarCoalizao('${p.sigla}')">Cobrar apoio</button>`}
            </div>
          </div>`;
        }).join('')}
      </div>
      <div style="margin-top:14px;text-align:right;"><button class="btn" onclick="render()">Voltar ao Planalto</button></div>
    </div>
  `;
}
async function acaoEntrarCoalizao(sigla){
  try{
    await apiPost('/action/entrar-coalizao', { sigla });
    await loadState();
  }catch(e){
    console.error('Erro entrar coalizão:', e);
  }
}
async function acaoSairCoalizao(sigla){
  try{
    await apiPost('/action/sair-coalizao', { sigla });
    await loadState();
  }catch(e){
    console.error('Erro sair coalizão:', e);
  }
}

/* ---- Governadores (27) ---- */
function telaGovernadores(){
  const E = staticData.ESTADOS || [];
  return `
    <div class="card">
      <h2><span class="emoji">&#x1F468;&#x1F3FC;&#x200D;&#x1F3EB;</span> Governadores (27)</h2>
      <p style="color:#666;font-size:0.9rem;">Cada governador tem humor próprio. Ligue para melhorar a relação.</p>
      <div style="display:flex;flex-direction:column;gap:8px;">
        ${E.map(e=>{
          const humor = state.governadores[e.sigla]||50;
          const classe = humor<40?'alerta':humor<60?'':'ok';
          return `<div class="lista-item">
            <div><strong>${e.sigla}</strong> - ${e.nome}</div>
            <div style="text-align:right;">
              <span class="${classe}">${humor}</span>
              <button class="btn" style="padding:4px 10px;font-size:0.75rem;" onclick="acaoLigarGovernador('${e.sigla}')">Ligar</button>
            </div>
          </div>`;
        }).join('')}
      </div>
      <div style="margin-top:14px;text-align:right;"><button class="btn" onclick="render()">Voltar ao Planalto</button></div>
    </div>
  `;
}
async function acaoLigarGovernador(sigla){
  try{
    await apiPost('/action/ligar-governador', { siglaEstado: sigla });
    await loadState();
  }catch(e){
    console.error('Erro ligar governador:', e);
  }
}

/* ---- Grupos sociais (32) ---- */
function telaGruposSociais(){
  const G = staticData.GRUPOS_SOCIAIS || [];
  return `
    <div class="card">
      <h2><span class="emoji">&#x1F465;</span> Grupos Sociais (32)</h2>
      <p style="color:#666;font-size:0.9rem;">Aprovação separada por grupo. Medidas afetam grupos específicos.</p>
      <div style="display:flex;flex-direction:column;gap:8px;">
        ${G.map(g=>{
          const chave = g.toLowerCase().replace(/[^a-z0-9]/g,'_');
          const val = state.gruposSociais[chave]||50;
          const classe = val<40?'alerta':val<60?'':'ok';
          return `<div class="lista-item">
            <div><strong>${g}</strong></div>
            <div style="text-align:right;"><span class="${classe}">${val}</span></div>
          </div>`;
        }).join('')}
      </div>
      <div style="margin-top:14px;text-align:right;"><button class="btn" onclick="render()">Voltar ao Planalto</button></div>
    </div>
  `;
}

/* ---- Copom ---- */
async function acaoCopom(){
  try{
    await apiPost('/action/copom');
    await loadState();
  }catch(e){
    console.error('Erro Copom:', e);
  }
}

/* ---- CPI ---- */
function telaCPI(){
  return `
    <div class="card">
      <h2><span class="emoji">&#x1F527;</span> CPI e Impeachment</h2>
      <div class="row">
        <div class="stat ${state.cpi>50?'alerta':''}">CPI <b>${state.cpi}%</b></div>
        <div class="stat ${state.riscoImpeachment>60?'alerta':''}">Risco impeachment <b>${state.riscoImpeachment}%</b></div>
        <div class="stat">Escândalo <b>${state.scandalo}</b></div>
      </div>
      <div style="margin-top:14px;">
        <button class="btn" onclick="acaoCPI('encerrar')">Tentar encerrar CPI</button>
        <button class="btn" onclick="acaoCPI('acalmar')">Acalmar oposição</button>
      </div>
      <div style="margin-top:10px;">
        <button class="btn danger" onclick="acaoCPI('impeachment')">Iniciar processo de impeachment (oposição)</button>
      </div>
      ${state.mensagem ? `<div class="noticia ${state.tipoMensagem==='ruim'?'vermelha':'verde'}"><strong>${state.mensagem}</strong></div>` : ''}
    </div>
  `;
}
async function acaoCPI(tipo){
  try{
    await apiPost('/action/acao-cpi', { tipo });
    await loadState();
  }catch(e){
    console.error('Erro CPI:', e);
  }
}

/* ---- Avançar mês ---- */
async function acaoAvancarMesGoverno(){
  try{
    await apiPost('/action/avancar-mes-governo');
    await loadState();
  }catch(e){
    console.error('Erro avançar mês:', e);
  }
}

/* ==================== RESULTADOS ==================== */
function telaImpeachment(){
  return `
    <div class="card" style="max-width:600px;margin:0 auto;text-align:center;">
      <h2 style="color:var(--vermelho);"><span class="emoji">&#x1F6AB;</span> Impeachment</h2>
      <div class="noticia vermelha" style="margin:18px 0;"><strong>${state.mensagem}</strong></div>
      <p style="color:#555;">${state.jogador?.nome} - ${state.jogador?.partido} - Ano ${state.ano}</p>
      <div style="margin-top:22px;">
        <button class="btn" onclick="acaoNovoJogo()">Jogar novamente</button>
      </div>
    </div>
  `;
}
function telaRanking(){
  return `
    <div class="card" style="max-width:600px;margin:0 auto;text-align:center;">
      <h2><span class="emoji">&#x1F3C6;</span> Ranking de Mandatos</h2>
      <p style="color:#555;">Mandato concluído em ${state.ano} com aprovação ${state.aprovacao}%.</p>
      <div style="margin-top:16px;">
        <button class="btn" onclick="acaoNovoJogo()">Novo mandato</button>
      </div>
    </div>
  `;
}

/* ==================== INICIALIZA ==================== */
window.CANDIDATOS_MINISTRO = {
  economia: [{nome:'Economista Liberal', partido:'NOVO'},{nome:'Técnico do Banco', partido:'MDB'},{nome:'Desenvolvimentista', partido:'PT'}],
  saude: [{nome:'Gestor SUS', partido:'PT'},{nome:'Médico Clínico', partido:'PSDB'},{nome:'Técnico Saúde', partido:'MDB'}],
  educacao: [{nome:'Reitor Universitário', partido:'PT'},{nome:'Pedagogo', partido:'PDT'},{nome:'Técnico Educação', partido:'NOVO'}],
  seguranca: [{nome:'Delegado Federal', partido:'PL'},{nome:'General', partido:'PL'},{nome:'Secretário Segurança', partido:'PSDB'}],
  infraestrutura: [{nome:'Engenheiro Chefe', partido:'MDB'},{nome:'Técnico Transportes', partido:'PSDB'},{nome:'Empreiteiro', partido:'UNIÃO'}],
  meioambiente: [{nome:'Ambientalista', partido:'REDE'},{nome:'Agrônomo', partido:'PL'},{nome:'Técnico IBAMA', partido:'PT'}],
};

// Inicia o jogo
loadState();
