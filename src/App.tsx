import React, { useState, useEffect, useRef } from 'react';
import { 
  Dumbbell, Clock, Plus, X, Save, Trash2, 
  ChevronDown, ChevronUp, BookOpen, Timer, 
  PlayCircle, History, LayoutDashboard, CalendarDays, 
  Calculator, TrendingUp, Flame, CheckCircle2, 
  Share2, Circle, Award, Trophy, Star
} from 'lucide-react';

// --- 1. CONFIGURAÇÕES ---
const APP_VERSION = '3.2'; // Mudança de versão força limpeza de cache
const SOM_BIP_URL = "https://actions.google.com/sounds/v1/alarms/beep_short.ogg";
const BARRA_PADRAO = 20; 

// --- 2. TIPOS ---
type Nivel = 'Iniciante' | 'Intermediário' | 'Avançado' | 'Cardio' | 'Aquecimento';
type Aba = 'home' | 'treinos' | 'ferramentas' | 'historico';
type Rank = 'Iniciante' | 'Dedicado' | 'Monstro' | 'Lenda' | 'Mr. Olympia';

interface Exercicio {
  id: number;
  nome: string;
  grupo: string; 
  series: number;
  repeticoes: string;
  cargaAlvo: string;
  descanso: string;
  instrucoes: string; 
  dica: string; 
}

interface FichaTreino {
  id: number;
  titulo: string;
  descricao: string;
  nivel: Nivel;
  duracaoMin: number;
  exercicios: Exercicio[];
  imagemCapa: string;
}

interface RegistroHistorico {
  id: number;
  treinoNome: string;
  data: string;
  duracaoReal: number;
}

// --- 3. DADOS INICIAIS ---
const dadosIniciais: FichaTreino[] = [
  // AQUECIMENTO
  {
    id: 1, titulo: "Mobilidade Superior", descricao: "Soltar ombros e costas.", nivel: 'Aquecimento', duracaoMin: 10,
    imagemCapa: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&q=80&w=600",
    exercicios: [
      { id: 1, nome: "Rotação Ombros", grupo: "Ombros", series: 2, repeticoes: "15", cargaAlvo: "Bastão", descanso: "0", instrucoes: "Gire o bastão para trás da cabeça.", dica: "Cotovelos estendidos." },
      { id: 2, nome: "YTWL", grupo: "Costas", series: 2, repeticoes: "10", cargaAlvo: "Corporal", descanso: "30", instrucoes: "Forme as letras no chão.", dica: "Contraia as escápulas." }
    ]
  },
  {
    id: 2, titulo: "Mobilidade Inferior", descricao: "Preparação agachamento.", nivel: 'Aquecimento', duracaoMin: 12,
    imagemCapa: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?auto=format&fit=crop&q=80&w=600",
    exercicios: [
      { id: 1, nome: "Agachamento Isométrico", grupo: "Quadril", series: 2, repeticoes: "30s", cargaAlvo: "Corporal", descanso: "30", instrucoes: "Segure lá embaixo.", dica: "Joelhos para fora." }
    ]
  },
  // CARDIO
  {
    id: 10, titulo: "HIIT Esteira", descricao: "Alta intensidade intervalada.", nivel: 'Cardio', duracaoMin: 20,
    imagemCapa: "https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&q=80&w=600",
    exercicios: [
      { id: 1, nome: "Tiro Velocidade", grupo: "Cardio", series: 10, repeticoes: "30s", cargaAlvo: "Max Vel", descanso: "30", instrucoes: "Corra no máximo.", dica: "Cuidado na esteira." },
      { id: 2, nome: "Caminhada", grupo: "Cardio", series: 10, repeticoes: "30s", cargaAlvo: "Leve", descanso: "0", instrucoes: "Recupere o fôlego.", dica: "Respire fundo." }
    ]
  },
  {
    id: 11, titulo: "Cardio LISS", descricao: "Caminhada inclinada constante.", nivel: 'Cardio', duracaoMin: 30,
    imagemCapa: "https://images.unsplash.com/photo-1502904550040-7534597429ae?auto=format&fit=crop&q=80&w=600",
    exercicios: [
      { id: 1, nome: "Caminhada Inclinada", grupo: "Cardio", series: 1, repeticoes: "30min", cargaAlvo: "Incl 12", descanso: "0", instrucoes: "Velocidade 5km/h.", dica: "Não segure no apoio." }
    ]
  },
  // FORÇA
  {
    id: 100, titulo: "Adaptação A (Superior)", descricao: "Aprenda a empurrar e puxar.", nivel: 'Iniciante', duracaoMin: 45,
    imagemCapa: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=600",
    exercicios: [
      { id: 1, nome: "Supino Máquina", grupo: "Peito", series: 3, repeticoes: "15", cargaAlvo: "Mod", descanso: "60", instrucoes: "Empurre controlado.", dica: "Ombros baixos." },
      { id: 2, nome: "Puxada Frontal", grupo: "Costas", series: 3, repeticoes: "15", cargaAlvo: "Mod", descanso: "60", instrucoes: "Puxe até o peito.", dica: "Cotovelos para baixo." }
    ]
  },
  {
    id: 101, titulo: "Adaptação B (Inferior)", descricao: "Pernas e Core.", nivel: 'Iniciante', duracaoMin: 45,
    imagemCapa: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600",
    exercicios: [
      { id: 1, nome: "Leg Press", grupo: "Pernas", series: 3, repeticoes: "15", cargaAlvo: "Mod", descanso: "60", instrucoes: "Empurre a plataforma.", dica: "Não trave joelhos." },
      { id: 2, nome: "Prancha", grupo: "Core", series: 3, repeticoes: "30s", cargaAlvo: "Iso", descanso: "45", instrucoes: "Corpo reto.", dica: "Contraia abs." }
    ]
  },
  {
    id: 200, titulo: "Push (Empurrar)", descricao: "Peito, Ombros e Tríceps.", nivel: 'Intermediário', duracaoMin: 60,
    imagemCapa: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=600",
    exercicios: [
      { id: 1, nome: "Supino Inclinado", grupo: "Peito", series: 4, repeticoes: "10", cargaAlvo: "Alta", descanso: "90", instrucoes: "Banco 30 graus.", dica: "Alongue bem." },
      { id: 2, nome: "Elevação Lateral", grupo: "Ombros", series: 4, repeticoes: "15", cargaAlvo: "Mod", descanso: "45", instrucoes: "Até a altura do ombro.", dica: "Sem impulso." }
    ]
  },
  {
    id: 201, titulo: "Pull (Puxar)", descricao: "Costas e Bíceps.", nivel: 'Intermediário', duracaoMin: 60,
    imagemCapa: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&q=80&w=600",
    exercicios: [
      { id: 1, nome: "Puxada Alta", grupo: "Costas", series: 4, repeticoes: "10", cargaAlvo: "Alta", descanso: "90", instrucoes: "Pegada aberta.", dica: "Esmague costas." },
      { id: 2, nome: "Rosca Direta", grupo: "Bíceps", series: 3, repeticoes: "12", cargaAlvo: "Mod", descanso: "60", instrucoes: "Sem balançar.", dica: "Cotovelo fixo." }
    ]
  },
  {
    id: 300, titulo: "Leg Day (Monster)", descricao: "Volume alto para pernas.", nivel: 'Avançado', duracaoMin: 80,
    imagemCapa: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?auto=format&fit=crop&q=80&w=600",
    exercicios: [
      { id: 1, nome: "Agachamento Livre", grupo: "Pernas", series: 5, repeticoes: "6", cargaAlvo: "85% 1RM", descanso: "180", instrucoes: "Quebre a paralela.", dica: "Bracing forte." },
      { id: 2, nome: "Stiff", grupo: "Posterior", series: 4, repeticoes: "10", cargaAlvo: "Alta", descanso: "90", instrucoes: "Coluna neutra.", dica: "Sinta alongar." }
    ]
  },
  {
    id: 301, titulo: "Old School Arms", descricao: "Super-séries de braços.", nivel: 'Avançado', duracaoMin: 50,
    imagemCapa: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=600",
    exercicios: [
      { id: 1, nome: "Rosca Direta + Testa", grupo: "Braços", series: 4, repeticoes: "10+10", cargaAlvo: "Alta", descanso: "60", instrucoes: "Bi-set.", dica: "Pump máximo." }
    ]
  }
];

function App() {
  // --- ESTADOS ---
  const [abaAtiva, setAbaAtiva] = useState<Aba>('home');
  const [treinos, setTreinos] = useState<FichaTreino[]>(dadosIniciais);
  const [filtroNivel, setFiltroNivel] = useState<Nivel | 'Todos'>('Todos');
  const [fichaSelecionada, setFichaSelecionada] = useState<FichaTreino | null>(null);
  
  // Persistência
  const [historico, setHistorico] = useState<RegistroHistorico[]>([]);
  const [logCargas, setLogCargas] = useState<Record<number, string>>({});
  const [streak, setStreak] = useState(0);

  // Timer
  const [timerAtivo, setTimerAtivo] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(0);
  const [tempoTotalTimer, setTempoTotalTimer] = useState(60);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Tools
  const [calcPeso, setCalcPeso] = useState(''); 
  const [calcReps, setCalcReps] = useState(''); 
  const [resultado1RM, setResultado1RM] = useState<number | null>(null);
  const [pesoAlvo, setPesoAlvo] = useState(''); 
  const [resultadoAnilhas, setResultadoAnilhas] = useState<number[]>([]);

  // Forms
  const [novoExercicio, setNovoExercicio] = useState({ nome: '', grupo: '', series: 3, repeticoes: '', cargaAlvo: '', descanso: '60', instrucoes: '', dica: '' });
  const [modalNovoTreinoAberto, setModalNovoTreinoAberto] = useState(false);
  const [novoTreino, setNovoTreino] = useState<Partial<FichaTreino>>({ titulo: '', descricao: '', nivel: 'Iniciante', duracaoMin: 60, imagemCapa: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600' });

  // --- INIT COM SEGURANÇA (O Fix do Erro está Aqui) ---
  useEffect(() => {
    try {
      const savedVersion = localStorage.getItem('gymtech_version');
      
      // Se a versão for diferente ou não existir, limpa tudo para evitar conflito
      if (savedVersion !== APP_VERSION) {
        console.log("Versão nova detectada! Limpando dados antigos para evitar erros...");
        localStorage.clear();
        localStorage.setItem('gymtech_version', APP_VERSION);
      } else {
        const logs = localStorage.getItem('gymtech_logs');
        const hist = localStorage.getItem('gymtech_history');
        const strk = localStorage.getItem('gymtech_streak');
        if (logs) setLogCargas(JSON.parse(logs));
        if (hist) setHistorico(JSON.parse(hist));
        if (strk) setStreak(Number(strk));
      }
    } catch (e) {
      console.error("Erro crítico ao carregar dados. Resetando.", e);
      localStorage.clear();
    }
    
    // Audio init
    try {
      audioRef.current = new Audio(SOM_BIP_URL); 
    } catch (e) {
      console.log("Audio init falhou (normal em alguns browsers)");
    }
  }, []);

  // --- TIMER ---
  useEffect(() => {
    let intervalo: any;
    if (timerAtivo && tempoRestante > 0) {
      intervalo = setInterval(() => setTempoRestante((p) => p - 1), 1000);
    } else if (tempoRestante === 0 && timerAtivo) {
      setTimerAtivo(false);
      audioRef.current?.play().catch(e => console.log("Audio block", e));
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    }
    return () => clearInterval(intervalo);
  }, [timerAtivo, tempoRestante]);

  // --- RPG SYSTEM ---
  const calcularRank = (): Rank => {
    const total = historico?.length || 0; // Proteção contra null
    if (total >= 100) return 'Mr. Olympia';
    if (total >= 50) return 'Lenda';
    if (total >= 20) return 'Monstro';
    if (total >= 5) return 'Dedicado';
    return 'Iniciante';
  };

  const getRankIcon = (rank: Rank) => {
    switch(rank) {
      case 'Iniciante': return <CheckCircle2 className="text-slate-400"/>;
      case 'Dedicado': return <Award className="text-blue-400"/>;
      case 'Monstro': return <Dumbbell className="text-red-500 fill-red-500"/>;
      case 'Lenda': return <Star className="text-yellow-400 fill-yellow-400"/>;
      case 'Mr. Olympia': return <Trophy className="text-emerald-400 fill-emerald-400"/>;
      default: return <CheckCircle2 className="text-slate-400"/>;
    }
  };

  // --- TOOLS ---
  const calcularAnilhas = () => {
    const pesoTotal = parseFloat(pesoAlvo);
    if (!pesoTotal || pesoTotal <= BARRA_PADRAO) {
      alert("Peso deve ser maior que a barra (20kg)");
      return;
    }
    const pesoLado = (pesoTotal - BARRA_PADRAO) / 2;
    const anilhasDisponiveis = [25, 20, 15, 10, 5, 2.5, 1.25];
    let restante = pesoLado;
    const anilhasUsadas: number[] = [];

    for (let anilha of anilhasDisponiveis) {
      while (restante >= anilha) {
        anilhasUsadas.push(anilha);
        restante -= anilha;
      }
    }
    setResultadoAnilhas(anilhasUsadas);
  };

  const calcular1RM = () => {
    const peso = parseFloat(calcPeso);
    const reps = parseFloat(calcReps);
    if (peso && reps) setResultado1RM(Math.round(peso * (1 + reps / 30)));
  };

  const compartilharWhatsApp = () => {
    if(!fichaSelecionada) return;
    const texto = `🔥 GymTech: Acabei de destruir no treino "${fichaSelecionada.titulo}"! Nível: ${fichaSelecionada.nivel}. #GymTechApp`;
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank');
  };

  // --- ACTIONS ---
  const iniciarDescanso = (segundos: number) => {
    setTempoTotalTimer(segundos);
    setTempoRestante(segundos);
    setTimerAtivo(true);
  };

  const atualizarCarga = (id: number, valor: string) => {
    const novo = { ...logCargas, [id]: valor };
    setLogCargas(novo);
    localStorage.setItem('gymtech_logs', JSON.stringify(novo));
  };

  const finalizarTreino = () => {
    if (!fichaSelecionada) return;
    const novoRegistro: RegistroHistorico = {
      id: Date.now(),
      treinoNome: fichaSelecionada.titulo,
      data: new Date().toISOString(),
      duracaoReal: fichaSelecionada.duracaoMin
    };
    
    const novoHistorico = [novoRegistro, ...historico];
    setHistorico(novoHistorico);
    localStorage.setItem('gymtech_history', JSON.stringify(novoHistorico));
    
    const ultimoTreino = historico[0];
    const hoje = new Date().toDateString();
    if (!ultimoTreino || new Date(ultimoTreino.data).toDateString() !== hoje) {
       const novoStreak = streak + 1;
       setStreak(novoStreak);
       localStorage.setItem('gymtech_streak', String(novoStreak));
    }

    setFichaSelecionada(null);
    setAbaAtiva('historico');
    setTimeout(() => alert(`TREINO CONCLUÍDO! 🔥\nOfensiva: ${streak + (ultimoTreino?.data !== new Date().toISOString() ? 1 : 0)} dias!`), 100);
  };

  // --- CRUD ---
  const salvarNovoTreino = (e: React.FormEvent) => {
    e.preventDefault();
    const novoId = treinos.length > 0 ? Math.max(...treinos.map(t => t.id)) + 1 : 1;
    setTreinos([{ ...novoTreino, id: novoId, nivel: novoTreino.nivel as Nivel, exercicios: [] } as FichaTreino, ...treinos]);
    setModalNovoTreinoAberto(false);
  };

  const adicionarExercicio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fichaSelecionada) return;
    const item: Exercicio = { id: Date.now(), ...novoExercicio, series: Number(novoExercicio.series), instrucoes: novoExercicio.instrucoes || 'Execute com controle.', dica: novoExercicio.dica || 'Foco na técnica.' };
    const novosTreinos = treinos.map(t => t.id === fichaSelecionada.id ? { ...t, exercicios: [...t.exercicios, item] } : t);
    setTreinos(novosTreinos);
    setFichaSelecionada(novosTreinos.find(t => t.id === fichaSelecionada.id) || null);
    setNovoExercicio({ nome: '', grupo: '', series: 3, repeticoes: '', cargaAlvo: '', descanso: '60', instrucoes: '', dica: '' });
  };

  const removerExercicio = (idEx: number) => {
    if (!fichaSelecionada) return;
    const novosTreinos = treinos.map(t => t.id === fichaSelecionada.id ? { ...t, exercicios: t.exercicios.filter(ex => ex.id !== idEx) } : t);
    setTreinos(novosTreinos);
    setFichaSelecionada(novosTreinos.find(t => t.id === fichaSelecionada.id) || null);
  };

  // --- RENDER HELPERS ---
  const treinosFiltrados = treinos.filter(treino => filtroNivel === 'Todos' ? true : treino.nivel === filtroNivel);
  const diasDaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const treinosEstaSemana = diasDaSemana.map((dia, index) => {
    const treinouHoje = historico.some(h => new Date(h.data).getDay() === index && Math.abs(new Date(h.data).getTime() - new Date().getTime()) < 604800000);
    return { dia, ativo: treinouHoje, isToday: index === new Date().getDay() };
  });

  // --- VIEWS ---
  const RenderDashboard = () => (
    <div className="space-y-6 animate-in fade-in">
      <div className="bg-gradient-to-br from-slate-900 to-black rounded-2xl p-1 shadow-2xl border border-white/10">
        <div className="bg-[#09090b] rounded-xl p-6 relative overflow-hidden">
           <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-xs uppercase font-bold text-slate-500 mb-1">Seu Rank Atual</p>
                <h2 className="text-3xl font-black italic text-white flex items-center gap-2">
                   {getRankIcon(calcularRank())} {calcularRank()}
                </h2>
                <div className="mt-4 flex gap-6">
                    <div>
                        <p className="text-[10px] uppercase font-bold text-slate-500">Treinos</p>
                        <p className="text-xl font-bold text-white">{historico.length}</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-slate-500">Ofensiva</p>
                        <p className="text-xl font-bold text-orange-500 flex items-center gap-1"><Flame size={14}/> {streak}</p>
                    </div>
                </div>
              </div>
              <div className="w-20 h-20 rounded-full bg-red-600/10 flex items-center justify-center border border-red-600/20">
                 <Dumbbell size={32} className="text-red-600"/>
              </div>
           </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-slate-400 uppercase mb-4 flex items-center gap-2"><CalendarDays size={16}/> Frequência</h3>
        <div className="flex justify-between">
          {treinosEstaSemana.map((item, i) => (
             <div key={i} className="flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${item.ativo ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : item.isToday ? 'border border-slate-500' : 'bg-slate-800'}`}>
                  {item.ativo && <CheckCircle2 size={16} className="text-black"/>}
                </div>
                <span className={`text-[10px] font-bold ${item.isToday ? 'text-white' : 'text-slate-600'}`}>{item.dia}</span>
             </div>
          ))}
        </div>
      </div>

      <button onClick={() => setAbaAtiva('treinos')} className="w-full bg-slate-100 hover:bg-white text-black font-black py-4 rounded-xl shadow-lg transform active:scale-95 transition flex items-center justify-center gap-2">
        <PlayCircle size={24} /> COMEÇAR TREINO
      </button>
    </div>
  );

  const RenderFerramentas = () => (
    <div className="space-y-8 animate-in slide-in-from-right">
      <h2 className="text-2xl font-black italic text-white uppercase mb-4">God Mode Tools</h2>
      
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4 text-emerald-500"><Circle size={24}/><h3 className="text-lg font-bold uppercase">Calculadora de Anilhas</h3></div>
        <p className="text-xs text-slate-400 mb-4">Descubra o que colocar na barra (Padrão 20kg).</p>
        <div className="flex gap-4 mb-4">
           <input type="number" className="bg-black border border-white/10 p-3 rounded text-white font-bold w-full" value={pesoAlvo} onChange={e => setPesoAlvo(e.target.value)} placeholder="Peso Total (kg)"/>
           <button onClick={calcularAnilhas} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 rounded">CALCULAR</button>
        </div>
        {resultadoAnilhas.length > 0 && (
          <div className="bg-black/40 p-4 rounded-xl border border-emerald-900/30">
             <p className="text-[10px] uppercase text-slate-500 font-bold mb-2">POR LADO DA BARRA:</p>
             <div className="flex flex-wrap gap-2">
                {resultadoAnilhas.map((anilha, i) => (
                  <div key={i} className="h-12 w-12 bg-emerald-900/80 rounded-full flex items-center justify-center border-2 border-emerald-500 shadow-lg text-white font-bold text-xs">
                     {anilha}
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>

      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4 text-blue-500"><Calculator size={24}/><h3 className="text-lg font-bold uppercase">1RM Estimada</h3></div>
        <div className="grid grid-cols-2 gap-4 mb-4">
           <input type="number" className="bg-black border border-white/10 p-3 rounded text-white font-bold" value={calcPeso} onChange={e => setCalcPeso(e.target.value)} placeholder="Carga (kg)"/>
           <input type="number" className="bg-black border border-white/10 p-3 rounded text-white font-bold" value={calcReps} onChange={e => setCalcReps(e.target.value)} placeholder="Reps"/>
        </div>
        {resultado1RM && <div className="bg-blue-900/20 p-4 rounded mb-4 text-center"><p className="text-sm text-blue-400 font-bold">FORÇA MÁXIMA (TEÓRICA)</p><p className="text-4xl font-black text-white">{resultado1RM} kg</p></div>}
        <button onClick={calcular1RM} className="w-full bg-blue-600 text-white font-bold py-3 rounded">CALCULAR</button>
      </div>
    </div>
  );

  // --- RETURN ---
  return (
    <div className="min-h-screen bg-[#09090b] text-slate-100 font-sans pb-24 selection:bg-red-600 selection:text-white">
      
      <header className="bg-black/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-30 px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <div className="bg-red-600 w-8 h-8 rounded flex items-center justify-center font-black italic text-white">G</div>
           <span className="font-black italic tracking-tighter text-xl">GYM<span className="text-red-600">TECH</span></span>
        </div>
        <button onClick={() => setModalNovoTreinoAberto(true)} className="bg-slate-900 border border-white/10 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-2 transition">
          <Plus size={14} /> NOVO
        </button>
      </header>

      <main className="max-w-xl mx-auto px-4 py-6">
         {abaAtiva === 'home' && <RenderDashboard />}
         
         {abaAtiva === 'treinos' && (
           <div className="space-y-6 animate-in fade-in">
             <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {(['Todos', 'Aquecimento', 'Cardio', 'Iniciante', 'Intermediário', 'Avançado'] as const).map((nivel) => (
                  <button key={nivel} onClick={() => setFiltroNivel(nivel)} className={`px-4 py-2 rounded-full text-xs font-bold uppercase whitespace-nowrap transition-all border ${filtroNivel === nivel ? 'bg-red-600 border-red-600 text-white' : 'bg-transparent border-slate-800 text-slate-500'}`}>{nivel}</button>
                ))}
             </div>
             <div className="grid grid-cols-1 gap-4">
               {treinosFiltrados.map((treino) => (
                  <div key={treino.id} onClick={() => setFichaSelecionada(treino)} className="bg-slate-900 h-40 rounded-xl border border-white/5 relative overflow-hidden cursor-pointer active:scale-95 transition group shadow-lg">
                     <img src={treino.imagemCapa} className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 transition duration-500"/>
                     <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-5 flex flex-col justify-end">
                        <div className="flex items-center gap-2 mb-1">
                           <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${treino.nivel === 'Cardio' ? 'bg-orange-500 text-black' : treino.nivel === 'Aquecimento' ? 'bg-yellow-500 text-black' : 'bg-red-600 text-white'}`}>{treino.nivel}</span>
                           <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1"><Clock size={10}/> {treino.duracaoMin} min</span>
                        </div>
                        <h3 className="text-2xl font-black italic uppercase leading-none text-white">{treino.titulo}</h3>
                     </div>
                  </div>
               ))}
             </div>
           </div>
         )}

         {abaAtiva === 'ferramentas' && <RenderFerramentas />}
         
         {abaAtiva === 'historico' && (
            <div className="space-y-4 animate-in slide-in-from-right">
              <h2 className="text-2xl font-black italic text-white uppercase mb-4">Histórico</h2>
              {historico.length === 0 ? <p className="text-slate-500 text-center py-10">Sem treinos ainda.</p> : 
                historico.map((h) => (
                  <div key={h.id} className="bg-slate-900 border-l-4 border-red-600 p-4 rounded-r-xl flex justify-between items-center">
                     <div><h4 className="font-bold text-white">{h.treinoNome}</h4><p className="text-xs text-slate-400">{new Date(h.data).toLocaleDateString()}</p></div>
                     <p className="font-bold text-white">{h.duracaoReal} min</p>
                  </div>
              ))}
            </div>
         )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur border-t border-white/10 py-2 px-6 z-40 flex justify-between items-center md:justify-center md:gap-12">
         {([
           {id: 'home', icon: LayoutDashboard, label: 'Home'},
           {id: 'treinos', icon: Dumbbell, label: 'Treinar'},
           {id: 'ferramentas', icon: Calculator, label: 'Tools'},
           {id: 'historico', icon: History, label: 'Hist'}
         ] as const).map(item => (
            <button key={item.id} onClick={() => setAbaAtiva(item.id)} className={`flex flex-col items-center gap-1 p-2 ${abaAtiva === item.id ? 'text-red-500' : 'text-slate-500'}`}>
               <item.icon size={24} /> <span className="text-[10px] font-bold uppercase">{item.label}</span>
            </button>
         ))}
      </nav>

      {fichaSelecionada && (
        <div className="fixed inset-0 z-50 bg-[#09090b] overflow-y-auto animate-in slide-in-from-bottom duration-300 pb-20">
           <div className="sticky top-0 bg-black/90 backdrop-blur border-b border-white/10 p-4 flex justify-between items-center z-10">
              <div><h2 className="text-lg font-black italic uppercase text-white w-48 truncate">{fichaSelecionada.titulo}</h2><p className="text-xs text-slate-400">{fichaSelecionada.duracaoMin} min</p></div>
              <button onClick={() => setFichaSelecionada(null)} className="bg-slate-800 p-2 rounded-full text-slate-400"><ChevronDown/></button>
           </div>
           <div className="p-4 space-y-4">
              {fichaSelecionada.exercicios.map((exercicio, idx) => (
                 <div key={exercicio.id} className="bg-slate-900 border border-white/5 rounded-xl overflow-hidden relative group">
                    <button onClick={() => removerExercicio(exercicio.id)} className="absolute top-2 right-2 text-slate-700 hover:text-red-500 p-2"><Trash2 size={16}/></button>
                    <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/20">
                       <h4 className="font-bold text-white uppercase text-sm flex items-center gap-2"><span className="bg-red-600 text-white w-6 h-6 flex items-center justify-center rounded text-xs">{idx + 1}</span> {exercicio.nome}</h4>
                       <button onClick={() => window.open(`https://www.youtube.com/results?search_query=execução ${exercicio.nome}`, '_blank')} className="text-red-500 mr-8"><PlayCircle size={20}/></button>
                    </div>
                    <div className="p-4 grid grid-cols-2 gap-4">
                       <div className="bg-black p-3 rounded border border-white/10"><p className="text-[10px] uppercase font-bold text-slate-500">Alvo</p><p className="text-white font-bold">{exercicio.cargaAlvo}</p></div>
                       <div className="bg-black p-3 rounded border border-white/10"><p className="text-[10px] uppercase font-bold text-slate-500">Carga</p><input type="text" className="bg-transparent text-white font-bold w-full outline-none" placeholder="Add peso" value={logCargas[exercicio.id] || ''} onChange={(e) => atualizarCarga(exercicio.id, e.target.value)}/></div>
                    </div>
                    <div className="px-4 pb-4"><button onClick={() => iniciarDescanso(Number(exercicio.descanso))} className="w-full bg-slate-800 hover:bg-slate-700 py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition border border-white/5"><Timer size={16} className="text-emerald-500"/> DESCANSAR {exercicio.descanso}s</button></div>
                    <details className="px-4 pb-4 text-xs text-slate-400"><summary className="cursor-pointer font-bold uppercase text-slate-600 list-none flex gap-2 items-center"><BookOpen size={12}/> Instruções</summary><div className="mt-2 pl-2 border-l-2 border-red-600/30"><p>{exercicio.instrucoes}</p><p className="mt-1 text-yellow-500">{exercicio.dica}</p></div></details>
                 </div>
              ))}
           </div>
           
           <div className="px-4 pt-4 pb-8 border-t border-white/5">
             <h3 className="text-sm font-bold text-slate-500 uppercase mb-4 flex items-center gap-2"><Plus size={16}/> Adicionar Exercício</h3>
             <form onSubmit={adicionarExercicio} className="space-y-3 bg-slate-900 p-4 rounded-xl">
                <input className="w-full bg-black border border-white/10 rounded p-3 text-white text-sm" placeholder="Nome do Exercício" value={novoExercicio.nome} onChange={e => setNovoExercicio({...novoExercicio, nome: e.target.value})} required/>
                <div className="grid grid-cols-2 gap-3"><input className="bg-black border border-white/10 rounded p-3 text-white text-sm" placeholder="Séries" value={novoExercicio.series} onChange={e => setNovoExercicio({...novoExercicio, series: Number(e.target.value)})}/> <input className="bg-black border border-white/10 rounded p-3 text-white text-sm" placeholder="Reps" value={novoExercicio.repeticoes} onChange={e => setNovoExercicio({...novoExercicio, repeticoes: e.target.value})}/></div>
                <div className="grid grid-cols-2 gap-3"><input className="bg-black border border-white/10 rounded p-3 text-white text-sm" placeholder="Carga Alvo" value={novoExercicio.cargaAlvo} onChange={e => setNovoExercicio({...novoExercicio, cargaAlvo: e.target.value})}/> <input className="bg-black border border-white/10 rounded p-3 text-white text-sm" placeholder="Descanso (s)" value={novoExercicio.descanso} onChange={e => setNovoExercicio({...novoExercicio, descanso: e.target.value})}/></div>
                <button type="submit" className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded">+ Adicionar</button>
             </form>
           </div>
           
           <div className="p-4 pb-32 flex gap-2">
             <button onClick={compartilharWhatsApp} className="flex-1 bg-slate-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2"><Share2 size={24}/></button>
             <button onClick={finalizarTreino} className="flex-[4] bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-xl uppercase flex items-center justify-center gap-2"><CheckCircle2 size={24}/> Finalizar</button>
           </div>
        </div>
      )}

      {timerAtivo && (
        <div className="fixed bottom-24 left-4 right-4 bg-black/95 backdrop-blur border border-red-500/50 rounded-2xl p-4 flex items-center justify-between z-50 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 flex items-center justify-center"><span className="font-mono font-bold text-white text-sm">{Math.floor(tempoRestante/60)}:{tempoRestante%60 < 10 ? '0' : ''}{tempoRestante%60}</span></div>
            <div><p className="text-[10px] font-bold text-slate-500 uppercase">Descanso</p><p className="text-red-500 font-bold text-sm animate-pulse">RECUPERANDO...</p></div>
          </div>
          <button onClick={() => setTimerAtivo(false)} className="px-3 py-2 bg-red-900/20 text-red-500 rounded text-xs font-bold">PARAR</button>
        </div>
      )}

      {modalNovoTreinoAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-slate-900 w-full max-w-md rounded-xl border border-white/10 p-6">
            <h2 className="text-xl font-black text-white uppercase italic mb-4">Nova Ficha</h2>
            <form onSubmit={salvarNovoTreino} className="space-y-3">
              <input className="w-full bg-black border border-white/10 rounded p-3 text-white" placeholder="Nome" required value={novoTreino.titulo} onChange={e => setNovoTreino({...novoTreino, titulo: e.target.value})} />
              <textarea className="w-full bg-black border border-white/10 rounded p-3 text-white h-20" placeholder="Descrição" required value={novoTreino.descricao} onChange={e => setNovoTreino({...novoTreino, descricao: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                  <select className="bg-black border border-white/10 rounded p-3 text-white" value={novoTreino.nivel} onChange={e => setNovoTreino({...novoTreino, nivel: e.target.value as Nivel})}><option value="Iniciante">Iniciante</option><option value="Intermediário">Intermediário</option><option value="Avançado">Avançado</option><option value="Cardio">Cardio</option><option value="Aquecimento">Aquecimento</option></select>
                  <input type="number" className="bg-black border border-white/10 rounded p-3 text-white" placeholder="Min" value={novoTreino.duracaoMin} onChange={e => setNovoTreino({...novoTreino, duracaoMin: Number(e.target.value)})}/>
              </div>
              <button type="submit" className="w-full bg-white text-black font-black py-3 rounded">CRIAR</button>
              <button type="button" onClick={() => setModalNovoTreinoAberto(false)} className="w-full text-slate-500 text-sm py-2">Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;