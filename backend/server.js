const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');
const SAVE_FILE = path.join(DATA_DIR, 'save.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

/* ==================== DADOS ESTÁTICOS ==================== */

const ESTADOS = [
  {sigla:'SP', nome:'São Paulo', peso:46, x:420,y:390, cor:'#4a90e2', regiao:'Sudeste'},
  {sigla:'MG', nome:'Minas Gerais', peso:21, x:380,y:330, cor:'#50c878', regiao:'Sudeste'},
  {sigla:'RJ', nome:'Rio de Janeiro', peso:17, x:450,y:430, cor:'#f5a623', regiao:'Sudeste'},
  {sigla:'BA', nome:'Bahia', peso:15, x:380,y:480, cor:'#9013fe', regiao:'Nordeste'},
  {sigla:'PR', nome:'Paraná', peso:12, x:400,y:310, cor:'#d0021b', regiao:'Sul'},
  {sigla:'RS', nome:'Rio Grande do Sul', peso:11, x:410,y:250, cor:'#1e90ff', regiao:'Sul'},
  {sigla:'PE', nome:'Pernambuco', peso:10, x:490,y:430, cor:'#ff6b6b', regiao:'Nordeste'},
  {sigla:'CE', nome:'Ceará', peso:9, x:530,y:390, cor:'#4ecdc4', regiao:'Nordeste'},
  {sigla:'PA', nome:'Pará', peso:9, x:580,y:320, cor:'#45b39d', regiao:'Norte'},
  {sigla:'SC', nome:'Santa Catarina', peso:7, x:390,y:320, cor:'#f1c40f', regiao:'Sul'},
  {sigla:'MA', nome:'Maranhão', peso:7, x:540,y:430, cor:'#a06cd5', regiao:'Nordeste'},
  {sigla:'GO', nome:'Goiás', peso:7, x:450,y:370, cor:'#e74c3c', regiao:'Centro-Oeste'},
  {sigla:'AM', nome:'Amazonas', peso:4, x:620,y:300, cor:'#2ecc71', regiao:'Norte'},
  {sigla:'PB', nome:'Paraíba', peso:4, x:550,y:420, cor:'#f39c12', regiao:'Nordeste'},
  {sigla:'ES', nome:'Espírito Santo', peso:4, x:460,y:410, cor:'#9b59b6', regiao:'Sudeste'},
  {sigla:'RN', nome:'Rio Grande do Norte', peso:3, x:570,y:410, cor:'#1abc9c', regiao:'Nordeste'},
  {sigla:'AL', nome:'Alagoas', peso:3, x:550,y:450, cor:'#e67e22', regiao:'Nordeste'},
  {sigla:'PI', nome:'Piauí', peso:3, x:550,y:400, cor:'#34495e', regiao:'Nordeste'},
  {sigla:'MT', nome:'Mato Grosso', peso:3, x:530,y:340, cor:'#16a085', regiao:'Centro-Oeste'},
  {sigla:'MS', nome:'Mato Grosso do Sul', peso:3, x:480,y:350, cor:'#c0392b', regiao:'Centro-Oeste'},
  {sigla:'SE', nome:'Sergipe', peso:2, x:560,y:455, cor:'#7f8c8d', regiao:'Nordeste'},
  {sigla:'TO', nome:'Tocantins', peso:2, x:540,y:370, cor:'#d35400', regiao:'Norte'},
  {sigla:'RO', nome:'Rondônia', peso:2, x:610,y:360, cor:'#7f8c8d', regiao:'Norte'},
  {sigla:'AC', nome:'Acre', peso:1, x:650,y:370, cor:'#95a5a6', regiao:'Norte'},
  {sigla:'AP', nome:'Amapá', peso:1, x:670,y:330, cor:'#95a5a6', regiao:'Norte'},
  {sigla:'RR', nome:'Roraima', peso:1, x:650,y:300, cor:'#95a5a6', regiao:'Norte'},
  {sigla:'DF', nome:'Distrito Federal', peso:3, x:440,y:350, cor:'#3498db', regiao:'Centro-Oeste'},
];
const TOTAL_ELEITORES = ESTADOS.reduce((s,e)=>s+e.peso,0);
const VITORIA_PRESIDENCIAL = Math.floor(TOTAL_ELEITORES/2)+1;

const PARTIDOS = [
  {sigla:'PT', nome:'Partido dos Trabalhadores', cor:'#e6194b', ideologia:'Esquerda', tamanho:90},
  {sigla:'PL', nome:'Partido Liberal', cor:'#3cb44b', ideologia:'Direita', tamanho:85},
  {sigla:'PDT', nome:'Partido Democrático Trabalhista', cor:'#ffe119', ideologia:'Centro-esquerda', tamanho:30},
  {sigla:'PSDB', nome:'Partido da Social Democracia Brasileira', cor:'#4363d8', ideologia:'Centro', tamanho:40},
  {sigla:'MDB', nome:'Movimento Democrático Brasileiro', cor:'#f58231', ideologia:'Centro', tamanho:55},
  {sigla:'UNIÃO', nome:'União Brasil', cor:'#911eb4', ideologia:'Centro-direita', tamanho:45},
  {sigla:'REPUBLICANOS', nome:'Republicanos', cor:'#46f0f0', ideologia:'Direita', tamanho:40},
  {sigla:'NOVO', nome:'Partido Novo', cor:'#000000', ideologia:'Liberal', tamanho:20},
  {sigla:'REDE', nome:'Rede Sustentabilidade', cor:'#00fa9a', ideologia:'Esquerda', tamanho:15},
  {sigla:'PSOL', nome:'Partido Socialismo e Liberdade', cor:'#d62728', ideologia:'Esquerda', tamanho:15},
];

const GRUPOS_SOCIAIS = [
  'Trabalhadores formais', 'Trabalhadores informais', 'Aposentados', 'Estudantes',
  'Produtores rurais', 'Empresários', 'Comerciantes', 'Industriais',
  'Servidores públicos', 'Policiais', 'Movimentos sociais', 'Igrejas evangélicas',
  'Igrejas católicas', 'Jovens', 'Idosos', 'Mulheres',
  'Negros', 'Indígenas', 'LGBTQIA+', 'Deficientes',
  'Moradores de periferia', 'Moradores de classe média', 'Moradores de classe alta',
  'Professores', 'Médicos e saúde', 'Advogados', 'Jornalistas',
  'Artistas e cultura', 'Motoristas e transporte', 'Agricultores familiares',
  'Tecnologia e startups', 'Mineração', 'Petróleo e gás'
];

const FRENTES = [
  'Bancada Ruralista', 'Bancada Evangélica', 'Bancada da Bala (Segurança)',
  'Bancada Ambientalista', 'Bancada dos Servidores', 'Bancada Feminista',
  'Centrão', 'Frente Parlamentar da Educação', 'Frente Parlamentar da Saúde'
];

const FIGURAS_PUBLICAS = [
  {nome:'Comentarista A', lado:'governo', tom:'defensivo'},
  {nome:'Comentarista B', lado:'oposição', tom:'crítico'},
  {nome:'Influenciador C', lado:'neutro', tom:'irônico'},
  {nome:'Jornalista D', lado:'oposição', tom:'investigativo'},
  {nome:'Militante E', lado:'governo', tom:'entusiasta'},
];

const MINISTERIOS = [
  {nome:'Economia', sigilo:'economia'},
  {nome:'Saúde', sigilo:'saude'},
  {nome:'Educação', sigilo:'educacao'},
  {nome:'Segurança Pública', sigilo:'seguranca'},
  {nome:'Infraestrutura', sigilo:'infraestrutura'},
  {nome:'Meio Ambiente', sigilo:'meioambiente'},
];

const CANDIDATOS_MINISTRO = {
  economia: [{nome:'Economista Liberal', partido:'NOVO'},{nome:'Técnico do Banco', partido:'MDB'},{nome:'Desenvolvimentista', partido:'PT'}],
  saude: [{nome:'Gestor SUS', partido:'PT'},{nome:'Médico Clínico', partido:'PSDB'},{nome:'Técnico Saúde', partido:'MDB'}],
  educacao: [{nome:'Reitor Universitário', partido:'PT'},{nome:'Pedagogo', partido:'PDT'},{nome:'Técnico Educação', partido:'NOVO'}],
  seguranca: [{nome:'Delegado Federal', partido:'PL'},{nome:'General', partido:'PL'},{nome:'Secretário Segurança', partido:'PSDB'}],
  infraestrutura: [{nome:'Engenheiro Chefe', partido:'MDB'},{nome:'Técnico Transportes', partido:'PSDB'},{nome:'Empreiteiro', partido:'UNIÃO'}],
  meioambiente: [{nome:'Ambientalista', partido:'REDE'},{nome:'Agrônomo', partido:'PL'},{nome:'Técnico IBAMA', partido:'PT'}],
};

/* ==================== GERAÇÃO DE DEPUTADOS (513) ==================== */
function gerarDeputados(){
  const deputados = [];
  let id = 1;
  PARTIDOS.forEach(p=>{
    let restantes = p.tamanho;
    ESTADOS.forEach(e=>{
      const q = Math.floor((restantes * e.peso) / 100) || (restantes > 0 ? 1 : 0);
      for(let i=0;i<q && restantes>0;i++){
        deputados.push({
          id: id++,
          nome: `Deputado ${id} (${p.sigla})`,
          partido: p.sigla,
          estado: e.sigla,
          regiao: e.regiao,
          relacao: 50,
          voto: null
        });
        restantes--;
      }
    });
  });
  while(deputados.length < 513){
    deputados.push({id: id++, nome: `Deputado ${id}`, partido:'MDB', estado:'SP', regiao:'Sudeste', relacao:50, voto:null});
  }
  return deputados.slice(0, 513);
}

const DEPUTADOS_BASE = gerarDeputados();
const VOTOS_MAIORIA_CAMARA = 308;

/* ==================== ESTADO DO JOGO ==================== */
let state = getDefaultState();

function getDefaultState(){
  return {
    fase: 'menu',
    jogador: null,
    turno: 0,
    ano: 2026,
    etapa: 'campanha',
    semanaCampanha: 0,
    mesGoverno: 0,
    dinheiro: 10,
    orcamento: 100,
    aprovacao: 50,
    selic: 13.75,
    inflacao: 4.5,
    cambial: 5.20,
    divida: 75.0,
    riscoPais: 200,
    pib: 2.5,
    desemprego: 9.0,
    areas: { economia:50, saude:50, educacao:50, seguranca:50, infraestrutura:50, meioambiente:50 },
    gruposSociais: {},
    governadores: {},
    ministros: {},
    deputados: [],
    votacaoAtual: null,
    leisAprovadas: [],
    diarioOficial: [],
    scandalo: 0,
    cpi: 0,
    riscoImpeachment: 0,
    coalizao: {},
    notificacoes: [],
    ranking: [],
    mensagem: '',
    tipoMensagem: '',
    jogoTerminado: false,
    // Nova estrutura de campanha
    campanha: {
      ativa: false,
      semanasTotais: 13,
      semanaAtual: 0,
      apoiosEstado: {}, // sigla -> apoio
      gastouSemana: 0,
      limiteGastoSemana: 5
    },
    eleicoes: {
      cargo: null,
      estado: null,
      venceu: false,
      votos: 0,
      necessarios: 0
    }
  };
}

function inicializarReferencias(s){
  s.gruposSociais = {};
  GRUPOS_SOCIAIS.forEach(g=>{
    const chave = g.toLowerCase().replace(/[^a-z0-9]/g,'_');
    s.gruposSociais[chave] = 50 + Math.floor(Math.random()*20) - 10;
  });
  s.governadores = {};
  ESTADOS.forEach(e=>{
    s.governadores[e.sigla] = 50 + Math.floor(Math.random()*20) - 10;
  });
  s.deputados = DEPUTADOS_BASE.map(d=>({...d, voto:null}));
  if(s.jogador){
    s.deputados.forEach(d=>{
      const afinidade = d.partido === s.jogador.partido ? 15 : (d.partido === 'PL' && s.jogador.partido === 'PT') ? -15 : 0;
      d.relacao = Math.max(0, Math.min(100, 50 + afinidade + Math.floor(Math.random()*20)-10));
    });
  }
  // inicializa apoios por estado
  s.campanha.apoiosEstado = {};
  ESTADOS.forEach(e=>{
    s.campanha.apoiosEstado[e.sigla] = 30 + Math.floor(Math.random()*20);
  });
  return s;
}

function clamp(n){ return Math.max(0, Math.min(100, n)); }
function addNotif(tipo, classe, texto){
  state.notificacoes.unshift({ tipo, classe, texto, turno: state.turno, mes: state.mesGoverno });
  if(state.notificacoes.length > 80) state.notificacoes.pop();
}

function classificarMedida(texto){
  const t = texto.toLowerCase();
  let tipo = 'Decreto';
  let instrumento = 'decreto';
  if(t.includes('provisória') || t.includes('mp ') || t.includes('urgente') || t.includes('emergência')){
    tipo = 'Medida Provisória'; instrumento = 'mp';
  }
  if(t.includes('emenda') || t.includes('constituição') || t.includes('pec')){
    tipo = 'Emenda Constitucional'; instrumento = 'emenda';
  }
  return { tipo, instrumento };
}

function calcularMedida(texto){
  const t = texto.toLowerCase();
  let custo = 0;
  const alvos = [];
  const contraria = [];

  if(t.includes('saúde') || t.includes('sus') || t.includes('hospital')){ custo += 8; alvos.push('Saúde'); }
  if(t.includes('educação') || t.includes('escola') || t.includes('universidade')){ custo += 6; alvos.push('Educação'); }
  if(t.includes('segurança') || t.includes('polícia') || t.includes('prisão')){ custo += 5; alvos.push('Segurança'); }
  if(t.includes('infraestrutura') || t.includes('estrada') || t.includes('ponte')){ custo += 7; alvos.push('Infraestrutura'); }
  if(t.includes('meio ambiente') || t.includes('amazônia') || t.includes('desmatamento')){ custo += 4; alvos.push('Meio Ambiente'); }
  if(t.includes('auxílio') || t.includes('bolsa') || t.includes('renda') || t.includes('pobre')){ custo += 10; alvos.push('Assistência Social'); }
  if(t.includes('imposto') || t.includes('tribut') || t.includes('renúncia')){ custo -= 6; contraria.push('setor produtivo'); }
  if(t.includes('servidor') || t.includes('funcional')){ custo += 5; alvos.push('Servidores'); }

  if(t.includes('rural') || t.includes('agro')){ alvos.push('Produtores rurais'); contraria.push('ambientalistas'); }
  if(t.includes('trabalhador') || t.includes('emprego')){ alvos.push('Trabalhadores formais'); }
  if(t.includes('idoso') || t.includes('aposentado')){ alvos.push('Aposentados'); }
  if(t.includes('estudante') || t.includes('jovem')){ alvos.push('Estudantes'); }
  if(t.includes('evangélico') || t.includes('igreja')){ alvos.push('Igrejas evangélicas'); }
  if(t.includes('indígena') || t.includes('quilombola')){ alvos.push('Indígenas'); contraria.push('ruralistas'); }

  return { custo: Math.max(0, custo), alvos, contraria };
}

/* ==================== ROTAS ==================== */

app.get('/api/state', (req,res)=>{
  res.json({ state, static: { ESTADOS, TOTAL_ELEITORES, VITORIA_PRESIDENCIAL, PARTIDOS, MINISTERIOS, GRUPOS_SOCIAIS, FRENTES, FIGURAS_PUBLICAS, VOTOS_MAIORIA_CAMARA, DEPUTADOS: state.deputados } });
});

app.post('/api/action/novo-jogo', (req,res)=>{
  state = getDefaultState();
  state = inicializarReferencias(state);
  saveSave();
  res.json({ state });
});

app.post('/api/action/carregar', (req,res)=>{
  loadSave();
  res.json({ state });
});

app.post('/api/action/criar-candidato', (req,res)=>{
  const { nome, partido, estado, origem } = req.body;
  state.jogador = { nome, partido, estado, origem, idade: 35 + Math.floor(Math.random()*15), apoio: 30, cargo: null };
  state.areas = origem==='tecnocrata' ? { economia:55, saude:55, educacao:55, seguranca:55, infraestrutura:55, meioambiente:55 } : { economia:50, saude:50, educacao:50, seguranca:50, infraestrutura:50, meioambiente:50 };
  state.dinheiro = 8;
  state.ano = 2026;
  state.turno = 0;
  state.etapa = 'campanha';
  state.fase = 'carreira';
  state.semanaCampanha = 0;
  state.votosEstado = {};
  state = inicializarReferencias(state);
  saveSave();
  res.json({ state });
});

/* ---- CAMPANHA DE CARGO (múltiplas semanas) ---- */
app.post('/api/action/iniciar-eleicao', (req,res)=>{
  const { cargo } = req.body;
  if(cargo === 'presidente'){
    if(!['prefeito','governador','senador'].includes(state.cargo)){
      return res.status(400).json({ erro: 'Modo história: você precisa de um cargo eletivo antes de disputar a presidência.' });
    }
  }
  state.cargo = cargo;
  state.mandatoAnos = 0;
  state.fase = 'eleicao_' + cargo;
  state.etapa = 'campanha';
  state.dinheiro = Math.max(state.dinheiro, 5);

  // Configura campanha por semanas
  const semanasTotais = cargo === 'presidente' ? 13 : 6;
  state.campanha = {
    ativa: true,
    semanasTotais: semanasTotais,
    semanaAtual: 0,
    apoiosEstado: {},
    gastouSemana: 0,
    limiteGastoSemana: cargo === 'presidente' ? 5 : 3
  };
  ESTADOS.forEach(e=>{
    state.campanha.apoiosEstado[e.sigla] = state.jogador.apoio + Math.floor(Math.random()*20) - 10;
  });

  state.eleicoes = {
    cargo: cargo,
    estado: state.jogador.estado,
    venceu: false,
    votos: 0,
    necessarios: cargo === 'presidente' ? VITORIA_PRESIDENCIAL : 45
  };

  saveSave();
  res.json({ state });
});

app.post('/api/action/campanha-semana', (req,res)=>{
  const { tipo, estadoSigla } = req.body;
  if(!state.campanha.ativa){
    return res.status(400).json({ erro: 'Nenhuma campanha ativa.' });
  }

  const j = state.jogador;
  const sem = state.campanha.semanaAtual;
  const custo = tipo === 'coleta' ? -2 : (tipo === 'comicio' ? 2 : tipo === 'debate' ? 3 : 1);

  // Verifica limite de gasto semanal
  if(custo > 0 && state.campanha.gastouSemana + custo > state.campanha.limiteGastoSemana){
    return res.status(400).json({ erro: `Limite de gasto semanal atingido (${state.campanha.limiteGastoSemana} mi). Espere a próxima semana.` });
  }

  if(custo > 0 && state.dinheiro < custo){
    return res.status(400).json({ erro: 'Caixa insuficiente.' });
  }

  // Executa ação
  let texto = '';
  let apoioGanho = 0;

  if(tipo === 'comicio'){
    const estado = estadoSigla || j.estado;
    apoioGanho = 6 + Math.floor(Math.random()*8);
    state.campanha.apoiosEstado[estado] = clamp(state.campanha.apoiosEstado[estado] + apoioGanho);
    j.apoio = clamp(j.apoio + Math.floor(apoioGanho/2));
    texto = `Comício em ${estado}: +${apoioGanho} apoio local.`;
  } else if(tipo === 'debate'){
    apoioGanho = 10 + Math.floor(Math.random()*10);
    j.apoio = clamp(j.apoio + apoioGanho);
    ESTADOS.forEach(e=>{
      state.campanha.apoiosEstado[e.sigla] = clamp(state.campanha.apoiosEstado[e.sigla] + Math.floor(apoioGanho/3));
    });
    texto = `Debate na TV: +${apoioGanho} apoio nacional.`;
  } else if(tipo === 'rede'){
    apoioGanho = 4 + Math.floor(Math.random()*6);
    j.apoio = clamp(j.apoio + apoioGanho);
    texto = `Campanha nas redes: +${apoioGanho} apoio.`;
  } else if(tipo === 'coleta'){
    const grana = 4 + Math.floor(Math.random()*6);
    state.dinheiro += grana;
    texto = `Arrecadou R$ ${grana} milhões de doadores.`;
  } else if(tipo === 'visita'){
    const estado = estadoSigla || j.estado;
    apoioGanho = 3 + Math.floor(Math.random()*5);
    state.campanha.apoiosEstado[estado] = clamp(state.campanha.apoiosEstado[estado] + apoioGanho);
    texto = `Visita a ${estado}: +${apoioGanho} apoio local.`;
  }

  state.dinheiro -= custo;
  state.campanha.gastouSemana += custo;
  state.mensagem = texto;
  state.tipoMensagem = 'bom';
  saveSave();
  res.json({ state });
});

app.post('/api/action/avancar-semana-campanha', (req,res)=>{
  if(!state.campanha.ativa){
    return res.status(400).json({ erro: 'Nenhuma campanha ativa.' });
  }

  state.campanha.semanaAtual++;
  state.campanha.gastouSemana = 0;
  state.turno++;

  // Eventos aleatórios durante campanha
  const EVENTOS_CAMPANHA = [
    {titulo:'Escândalo de campanha', impacto:{apoiador:-10}, chance:0.10},
    {titulo:'Endosso de celebridade', impacto:{apoiador:+8}, chance:0.10},
    {titulo:'Crise econômica afeta campanha', impacto:{apoiador:-5}, chance:0.10},
    {titulo:'Pesquisa favorável', impacto:{apoiador:+6}, chance:0.10},
  ];
  EVENTOS_CAMPANHA.forEach(ev=>{
    if(Math.random() < ev.chance){
      state.jogador.apoio = clamp(state.jogador.apoio + ev.impacto.apoiador);
      addNotif('campanha', ev.impacto.apoiador<0?'vermelha':'verde', ev.titulo);
    }
  });

  // Verifica se acabou a campanha
  if(state.campanha.semanaAtual >= state.campanha.semanasTotais){
    state.campanha.ativa = false;
    state.mensagem = `Campanha de ${state.campanha.semanasTotais} semanas concluída. Hora de ir às urnas!`;
    state.tipoMensagem = 'bom';
    addNotif('eleicao', 'verde', 'Período de campanha encerrado.');
  } else {
    state.mensagem = `Semana ${state.campanha.semanaAtual}/${state.campanha.semanasTotais} concluída.`;
    state.tipoMensagem = 'neutro';
  }

  saveSave();
  res.json({ state });
});

app.post('/api/action/finalizar-eleicao-cargo', (req,res)=>{
  const { cargo } = req.body;
  const j = state.jogador;

  // Calcula votos baseado no apoio acumulado por estado
  let meusVotos = 0;
  if(cargo === 'presidente'){
    ESTADOS.forEach(e=>{
      const apoioLocal = state.campanha.apoiosEstado[e.sigla] || j.apoio;
      const fator = 0.5 + Math.random()*0.6;
      const v = Math.floor(apoioLocal * (e.peso/100) * fator);
      state.votosEstado[e.sigla] = v;
      meusVotos += v;
    });
    const venceu = meusVotos >= VITORIA_PRESIDENCIAL;
    state.eleicoes.venceu = venceu;
    state.eleicoes.votos = meusVotos;
    state.eleicoes.necessarios = VITORIA_PRESIDENCIAL;
  } else {
    const sorteio = j.apoio + Math.random()*40;
    const venceu = sorteio > 45;
    state.eleicoes.venceu = venceu;
    state.eleicoes.votos = Math.floor(sorteio);
    state.eleicoes.necessarios = 45;
  }

  state.eleitos = state.eleicoes.venceu;
  if(state.eleicoes.venceu){
    state.fase = 'governo_'+cargo;
    state.etapa = 'governo';
    state.mesGoverno = 0;
    state.mensagem = `Eleito(a) ${cargo}! ${state.eleicoes.votos} votos.`;
    state.tipoMensagem = 'bom';
  } else {
    state.fase = 'carreira';
    state.mensagem = `Não eleito(a) ${cargo}. ${state.eleicoes.votos}/${state.eleicoes.necessarios} votos.`;
    state.tipoMensagem = 'ruim';
  }

  // Reseta campanha
  state.campanha.ativa = false;
  state.campanha.semanaAtual = 0;
  state.campanha.gastouSemana = 0;

  saveSave();
  res.json({ state });
});

/* ---- ELEIÇÃO PRESIDENCIAL (apuração direta após campanha) ---- */
app.post('/api/action/apurar-presidente', (req,res)=>{
  // Redireciona para finalizar eleição com base na campanha já feita
  return apiPostInterno('/api/action/finalizar-eleicao-cargo', { cargo: 'presidente' }, req, res);
});

function apiPostInterno(path, body, req, res){
  // Simula chamada interna - na prática o frontend já chama finalizar-eleicao-cargo
  res.redirect(307, path);
}

/* ---- GOVERNO PRESIDENCIAL ---- */
app.post('/api/action/escrever-medida', (req,res)=>{
  const { texto } = req.body;
  if(!texto || texto.trim().length < 5){
    return res.status(400).json({ erro: 'Escreva uma medida com pelo menos 5 caracteres.' });
  }
  const classificacao = classificarMedida(texto);
  const calculo = calcularMedida(texto);

  if(calculo.custo > 0 && state.dinheiro < calculo.custo){
    return res.status(400).json({ erro: `Caixa insuficiente. A medida custa R$ ${calculo.custo} milhões.` });
  }

  state.votacaoAtual = {
    id: Date.now(),
    texto,
    tipo: classificacao.tipo,
    instrumento: classificacao.instrumento,
    custo: calculo.custo,
    alvos: calculo.alvos,
    contraria: calculo.contraria,
    status: 'em_votacao',
    votosSim: 0,
    votosNao: 0,
    votosAbst: 0,
    totalDeputados: state.deputados.length,
    necessarios: VOTOS_MAIORIA_CAMARA,
    criadoEm: { ano: state.ano, mes: state.mesGoverno }
  };

  state.deputados.forEach(d=>d.voto=null);
  state.dinheiro -= calculo.custo;
  state.mensagem = `Medida criada: ${classificacao.tipo}. Custo: R$ ${calculo.custo} mi. Enviada à Câmara.`;
  state.tipoMensagem = 'bom';
  addNotif('medida', 'verde', `${classificacao.tipo} enviado ao Congresso.`);
  saveSave();
  res.json({ state });
});

app.post('/api/action/votar-camara', (req,res)=>{
  const { votos } = req.body;
  if(!state.votacaoAtual) return res.status(400).json({ erro: 'Nenhuma votação em andamento.' });

  let sim=0, nao=0, abst=0;
  Object.entries(votos).forEach(([id, voto])=>{
    const d = state.deputados.find(x=>x.id == id);
    if(d) d.voto = voto;
  });
  state.deputados.forEach(d=>{
    if(d.voto==='sim') sim++;
    else if(d.voto==='nao') nao++;
    else if(d.voto==='abst') abst++;
  });
  state.votacaoAtual.votosSim = sim;
  state.votacaoAtual.votosNao = nao;
  state.votacaoAtual.votosAbst = abst;

  const apurado = sim + nao + abst;
  if(apurado >= state.deputados.length){
    const aprovado = sim >= VOTOS_MAIORIA_CAMARA;
    state.votacaoAtual.status = aprovado ? 'aprovada' : 'rejeitada';
    if(aprovado){
      state.leisAprovadas.push({ texto: state.votacaoAtual.texto, tipo: state.votacaoAtual.tipo, mes: state.mesGoverno, ano: state.ano });
      state.aprovacao = clamp(state.aprovacao + 5);
      state.mensagem = `Medida aprovada por ${sim} a ${nao} deputados.`;
      state.tipoMensagem = 'bom';
      addNotif('congresso', 'verde', 'Medida aprovada na Câmara.');
    } else {
      state.aprovacao = clamp(state.aprovacao - 8);
      state.mensagem = `Medida rejeitada por ${nao} a ${sim} deputados.`;
      state.tipoMensagem = 'ruim';
      addNotif('congresso', 'vermelha', 'Medida rejeitada na Câmara.');
    }
    state.votacaoAtual.alvos.forEach(a=>{
      const chave = a.toLowerCase().replace(/[^a-z0-9]/g,'_');
      if(state.gruposSociais[chave]!==undefined) state.gruposSociais[chave] = clamp(state.gruposSociais[chave] + 5);
    });
    state.votacaoAtual.contraria.forEach(c=>{
      const chave = c.toLowerCase().replace(/[^a-z0-9]/g,'_');
      if(state.gruposSociais[chave]!==undefined) state.gruposSociais[chave] = clamp(state.gruposSociais[chave] - 8);
    });
    saveSave();
    return res.json({ state });
  }

  state.mensagem = `Votação em andamento: ${sim} SIM, ${nao} NÃO, ${abst} ABST. Faltam ${state.deputados.length - apurado} deputados.`;
  state.tipoMensagem = 'neutro';
  saveSave();
  res.json({ state });
});

app.post('/api/action/liberar-emenda', (req,res)=>{
  const { partidoSigla, valor } = req.body;
  const p = PARTIDOS.find(x=>x.sigla===partidoSigla);
  if(!p) return res.status(400).json({erro:'Partido inválido'});
  if(state.dinheiro < valor){
    state.mensagem='Caixa insuficiente.'; state.tipoMensagem='ruim'; saveSave(); return res.json({state});
  }
  state.dinheiro -= valor;
  state.deputados.filter(d=>d.partido===partidoSigla).forEach(d=>{
    d.relacao = clamp(d.relacao + 10);
  });
  state.mensagem = `Emenda de R$ ${valor} mi liberada para ${p.sigla}.`;
  state.tipoMensagem='bom';
  addNotif('congresso', 'verde', `Emenda liberada para ${p.sigla}.`);
  saveSave();
  res.json({ state });
});

app.post('/api/action/entregar-ministerio', (req,res)=>{
  const { sigilo, partidoSigla } = req.body;
  const p = PARTIDOS.find(x=>x.sigla===partidoSigla);
  if(!p) return res.status(400).json({erro:'Partido inválido'});
  state.ministros[sigilo] = { nome: `Ministro de ${p.sigla}`, partido: partidoSigla };
  state.deputados.filter(d=>d.partido===partidoSigla).forEach(d=>{
    d.relacao = clamp(d.relacao + 20);
  });
  state.aprovacao = clamp(state.aprovacao + 3);
  state.mensagem = `Ministério entregue a ${p.sigla}. Bancada alinhada.`;
  state.tipoMensagem='bom';
  addNotif('congresso', 'verde', `Ministério entregue a ${p.sigla}.`);
  saveSave();
  res.json({ state });
});

app.post('/api/action/ligar-governador', (req,res)=>{
  const { siglaEstado } = req.body;
  const g = state.governadores[siglaEstado];
  if(g===undefined) return res.status(400).json({erro:'Estado inválido'});
  state.governadores[siglaEstado] = clamp(g + 10);
  state.dinheiro -= 2;
  state.mensagem = `Conversa com o governador de ${siglaEstado}.`;
  state.tipoMensagem='bom';
  saveSave();
  res.json({ state });
});

app.post('/api/action/avancar-mes-governo', (req,res)=>{
  state.mesGoverno++;
  state.turno++;
  if(state.mesGoverno >= 48){
    state.fase = 'ranking';
    state.jogoTerminado = true;
    state.ranking.push({ nome: state.jogador.nome, partido: state.jogador.partido, pontos: Math.floor(state.aprovacao*10), ano: state.ano });
    state.mensagem = 'Mandato de 48 meses concluído.';
    state.tipoMensagem = 'neutro';
    saveSave();
    return res.json({ state });
  }

  const EVENTOS = [
    {titulo:'Greve dos professores', impacto:{aprovacao:-8, educacao:-6}, chance:0.12},
    {titulo:'Surto de dengue', impacto:{aprovacao:-6, saude:-8}, chance:0.10},
    {titulo:'Operação da PF', impacto:{aprovacao:-14, economia:-3}, chance:0.08},
    {titulo:'Boa safra agrícola', impacto:{aprovacao:+6, economia:+5}, chance:0.10},
    {titulo:'Protestos nas ruas', impacto:{aprovacao:-5, seguranca:-4}, chance:0.10},
    {titulo:'Investimento estrangeiro', impacto:{aprovacao:+5, economia:+6}, chance:0.10},
    {titulo:'Queimadas na Amazônia', impacto:{aprovacao:-8, meioambiente:-9}, chance:0.06},
    {titulo:'Alta da Selic', impacto:{aprovacao:-6, economia:-4}, chance:0.10},
  ];
  EVENTOS.forEach(ev=>{
    if(Math.random() < ev.chance){
      state.aprovacao = clamp(state.aprovacao + (ev.impacto.aprovacao||0));
      addNotif('evento', ev.impacto.aprovacao<0?'vermelha':'verde', ev.titulo);
    }
  });

  state.inflacao = Math.max(1, Math.min(20, state.inflacao + (Math.random()-0.5)*0.8));
  state.cambial = Math.max(3, Math.min(8, state.cambial + (Math.random()-0.5)*0.3));
  state.pib = Math.max(-2, Math.min(6, state.pib + (Math.random()-0.5)*0.6));
  state.desemprego = Math.max(3, Math.min(20, state.desemprego + (Math.random()-0.5)*0.8));
  state.riscoPais = Math.max(100, Math.min(500, state.riscoPais + (Math.random()-0.5)*20));

  if(state.scandalo > 0) state.cpi = Math.min(100, state.cpi + state.scandalo*2);
  state.riscoImpeachment = Math.max(0, Math.min(100, state.cpi * 0.6 + (100-state.aprovacao)*0.3));
  if(state.riscoImpeachment >= 85 || state.aprovacao <= 5){
    state.fase = 'impeachment';
    state.mensagem = 'IMPEACHMENT: Você foi afastado da Presidência!';
    state.tipoMensagem = 'ruim';
    saveSave();
    return res.json({ state });
  }

  const media = Object.values(state.areas).reduce((a,b)=>a+b,0)/6;
  if(media < 40) state.aprovacao -= 4;
  if(media > 70) state.aprovacao += 3;
  state.aprovacao = clamp(state.aprovacao);

  saveSave();
  res.json({ state });
});

app.post('/api/action/copom', (req,res)=>{
  const antes = state.selic;
  const mudanca = (Math.random()-0.5)*1.5;
  state.selic = Math.max(2, Math.min(20, state.selic + mudanca));
  if(state.selic > antes){ state.inflacao = Math.max(1, state.inflacao - 0.5); state.pib = Math.max(0, state.pib - 0.3); state.aprovacao = clamp(state.aprovacao - 3); state.mensagem=`Selic subiu para ${state.selic.toFixed(1)}%.`; state.tipoMensagem='ruim'; }
  else { state.inflacao = Math.min(20, state.inflacao + 0.5); state.pib = Math.min(10, state.pib + 0.3); state.aprovacao = clamp(state.aprovacao + 2); state.mensagem=`Selic caiu para ${state.selic.toFixed(1)}%.`; state.tipoMensagem='bom'; }
  state.desemprego = Math.max(3, Math.min(20, state.desemprego + (mudanca>0?0.5:-0.5)));
  saveSave();
  res.json({ state });
});

app.post('/api/action/nomear-ministro', (req,res)=>{
  const { sigilo, nome, partido } = req.body;
  state.ministros[sigilo] = { nome, partido };
  state.aprovacao = clamp(state.aprovacao + 2);
  state.mensagem = `${nome} nomeado(a) ministro(a).`;
  state.tipoMensagem = 'bom';
  saveSave();
  res.json({ state });
});

app.post('/api/action/demitir-ministro', (req,res)=>{
  const { sigilo } = req.body;
  const m = state.ministros[sigilo];
  if(!m) return res.status(400).json({erro:'Sem ministro'});
  delete state.ministros[sigilo];
  state.aprovacao = clamp(state.aprovacao - 5);
  state.mensagem = `${m.nome} demitido.`;
  state.tipoMensagem = 'ruim';
  saveSave();
  res.json({ state });
});

app.post('/api/action/entrar-coalizao', (req,res)=>{
  const { sigla } = req.body;
  const p = PARTIDOS.find(x=>x.sigla===sigla);
  if(!p) return res.status(400).json({erro:'Partido inválido'});
  const custo = Math.ceil(p.tamanho/10);
  if(state.dinheiro < custo){ state.mensagem='Caixa insuficiente.'; state.tipoMensagem='ruim'; saveSave(); return res.json({state}); }
  state.dinheiro -= custo;
  state.coalizao[sigla] = p.tamanho;
  state.aprovacao = clamp(state.aprovacao + 3);
  state.mensagem = `${p.sigla} entrou na base governista.`;
  state.tipoMensagem = 'bom';
  saveSave();
  res.json({ state });
});

app.post('/api/action/sair-coalizao', (req,res)=>{
  const { sigla } = req.body;
  delete state.coalizao[sigla];
  state.aprovacao = clamp(state.aprovacao - 5);
  state.mensagem = `${sigla} saiu da base.`;
  state.tipoMensagem = 'ruim';
  saveSave();
  res.json({ state });
});

app.post('/api/action/acao-cpi', (req,res)=>{
  const { tipo } = req.body;
  if(tipo === 'encerrar'){
    const sucesso = Math.random() < (state.aprovacao/100);
    if(sucesso){ state.cpi = Math.max(0, state.cpi - 30); state.mensagem='CPI encerrada.'; state.tipoMensagem='bom'; }
    else { state.cpi = Math.min(100, state.cpi + 20); state.riscoImpeachment = Math.min(100, state.riscoImpeachment + 10); state.mensagem='Falha ao encerrar CPI.'; state.tipoMensagem='ruim'; }
  } else if(tipo === 'acalmar'){
    state.cpi = Math.max(0, state.cpi - 15);
    state.riscoImpeachment = Math.max(0, state.riscoImpeachment - 10);
    state.mensagem = 'Oposição acalmada.';
    state.tipoMensagem = 'bom';
  } else if(tipo === 'impeachment'){
    state.riscoImpeachment = Math.min(100, state.riscoImpeachment + 25);
    state.cpi = Math.min(100, state.cpi + 30);
    state.mensagem = 'Oposição abriu processo de impeachment!';
    state.tipoMensagem = 'ruim';
  }
  saveSave();
  res.json({ state });
});

app.post('/api/action/avancar-mandato', (req,res)=>{
  state.mandatoAnos++;
  state.turno++;
  state.ano++;
  if(state.mandatoAnos >= 4){
    state.fase = 'carreira';
    state.cargo = null;
    state.mensagem = `Mandato de ${state.cargo} terminou.`;
    state.tipoMensagem = 'neutro';
  }
  saveSave();
  res.json({ state });
});

function loadSave(){
  try{
    if(fs.existsSync(SAVE_FILE)){
      const raw = fs.readFileSync(SAVE_FILE, 'utf8');
      state = JSON.parse(raw);
      if(!state.gruposSociais) state = inicializarReferencias(getDefaultState());
      else state = inicializarReferencias(state);
    } else {
      state = inicializarReferencias(getDefaultState());
    }
  }catch(e){ console.error('Erro ao carregar save', e); state = inicializarReferencias(getDefaultState()); }
}
function saveSave(){
  try{ fs.writeFileSync(SAVE_FILE, JSON.stringify(state, null, 2)); }catch(e){ console.error('Erro ao salvar', e); }
}
loadSave();

const PORT = process.env.PORT || 3001;
app.use(express.static(path.join(__dirname, '../frontend')));
app.get('/', (req,res)=>{ res.sendFile(path.join(__dirname, '../frontend/index.html')); });
app.listen(PORT, ()=>{ console.log(`Backend rodando em http://localhost:${PORT}`); });
