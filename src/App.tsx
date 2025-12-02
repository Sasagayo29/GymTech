import React, { useState, useEffect, useRef } from 'react';
import { 
  Dumbbell, Clock, Plus, Trash2, Search,
  ChevronDown, BookOpen, Timer, Medal, Target,
  PlayCircle, History, LayoutDashboard, CalendarDays, 
  Calculator, Flame, CheckCircle2, Zap, Brain,
  Share2, Circle, Award, Trophy, Star, Download, Upload, 
  BarChart2, Palette, Scale, Smartphone, RefreshCw,
  Settings, User, Volume2, VolumeX, Bell, BellOff, X,
  Droplets, Quote, Activity, Utensils, List, FileText,
  StopCircle, Ruler
} from 'lucide-react';

// --- 1. CONFIGURAÇÕES CONSTANTES ---
const APP_VERSION = '9.0 Titanium Ecosystem'; 
const BARRA_PADRAO = 20; 
const SOM_BIP_URL = "https://actions.google.com/sounds/v1/alarms/beep_short.ogg";

const QUOTES = [
  "A dor é temporária, a glória é eterna.",
  "O corpo alcança o que a mente acredita.",
  "Não pare quando estiver cansado, pare quando terminar.",
  "Desculpas não queimam calorias.",
  "Sua única competição é quem você era ontem.",
  "Treine enquanto eles dormem.",
  "Disciplina é liberdade.",
  "O suor é a gordura chorando."
];

const THEMES = {
  red: { primary: 'bg-red-600', hover: 'hover:bg-red-500', text: 'text-red-500', border: 'border-red-600', shadow: 'shadow-red-900/50', gradient: 'from-red-600 to-red-900', label: 'Sith Red' },
  blue: { primary: 'bg-blue-600', hover: 'hover:bg-blue-500', text: 'text-blue-500', border: 'border-blue-600', shadow: 'shadow-blue-900/50', gradient: 'from-blue-600 to-blue-900', label: 'Cyber Blue' },
  emerald: { primary: 'bg-emerald-600', hover: 'hover:bg-emerald-500', text: 'text-emerald-500', border: 'border-emerald-600', shadow: 'shadow-emerald-900/50', gradient: 'from-emerald-600 to-emerald-900', label: 'Matrix Green' },
  purple: { primary: 'bg-purple-600', hover: 'hover:bg-purple-500', text: 'text-purple-500', border: 'border-purple-600', shadow: 'shadow-purple-900/50', gradient: 'from-purple-600 to-purple-900', label: 'Neon Purple' },
  gold: { primary: 'bg-yellow-500', hover: 'hover:bg-yellow-400', text: 'text-yellow-500', border: 'border-yellow-500', shadow: 'shadow-yellow-900/50', gradient: 'from-yellow-500 to-yellow-800', label: 'Gold Olympia' },
  slate: { primary: 'bg-slate-500', hover: 'hover:bg-slate-400', text: 'text-slate-400', border: 'border-slate-500', shadow: 'shadow-slate-900/50', gradient: 'from-slate-700 to-black', label: 'Stealth Black' },
};

type ThemeKey = keyof typeof THEMES;

// --- 2. TIPOS ---
type Nivel = 'Iniciante' | 'Intermediário' | 'Avançado' | 'Cardio' | 'Aquecimento' | 'Especial' | 'CrossFit';
type Aba = 'home' | 'treinos' | 'ferramentas' | 'historico' | 'shape';
type Rank = 'Iniciante' | 'Dedicado' | 'Monstro' | 'Lenda' | 'Mr. Olympia';

interface UserSettings {
  userName: string;
  enableSound: boolean;
  enableVoice: boolean;
  enableVibration: boolean;
  defaultRestTime: number;
}

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

interface DetalheExercicio {
  nome: string;
  carga: string;
  series: number;
}

interface RegistroHistorico {
  id: number;
  treinoNome: string;
  data: string;
  duracaoReal: number;
  volumeEstimado?: number;
  detalhes?: DetalheExercicio[];
  notas?: string; 
}

interface RegistroPeso {
  data: string;
  peso: number;
}

interface MedidasCorporais {
  braco: string;
  peito: string;
  cintura: string;
  perna: string;
}

// --- 3. DADOS INICIAIS ---
const dadosIniciais: FichaTreino[] = [
  // CROSSFIT
  {
    id: 60, titulo: "WOD: Murph Adaptado", descricao: "O clássico desafio de herói.", nivel: 'CrossFit', duracaoMin: 50,
    imagemCapa: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600",
    exercicios: [
      { id: 1, nome: "Corrida (Run)", grupo: "Cardio", series: 1, repeticoes: "1km", cargaAlvo: "Rápido", descanso: "0", instrucoes: "Início.", dica: "Ritmo constante." },
      { id: 2, nome: "Pull-Ups (Barra)", grupo: "Costas", series: 5, repeticoes: "10", cargaAlvo: "Corpo", descanso: "30", instrucoes: "Queixo acima da barra.", dica: "Use elástico se precisar." },
      { id: 3, nome: "Push-Ups (Flexão)", grupo: "Peito", series: 10, repeticoes: "10", cargaAlvo: "Corpo", descanso: "30", instrucoes: "Peito no chão.", dica: "Trave o abdômen." },
      { id: 4, nome: "Air Squats", grupo: "Pernas", series: 15, repeticoes: "10", cargaAlvo: "Corpo", descanso: "30", instrucoes: "Agachamento livre.", dica: "Quebre a paralela." },
      { id: 5, nome: "Corrida (Run)", grupo: "Cardio", series: 1, repeticoes: "1km", cargaAlvo: "Final", descanso: "0", instrucoes: "Finalização.", dica: "Dê tudo de si." },
    ]
  },
  // CARDIO
  {
    id: 10, titulo: "HIIT Esteira", descricao: "Alta intensidade intervalada.", nivel: 'Cardio', duracaoMin: 20,
    imagemCapa: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?auto=format&fit=crop&q=80&w=600",
    exercicios: [
      { id: 1, nome: "Tiro Velocidade", grupo: "Cardio", series: 10, repeticoes: "30s", cargaAlvo: "Max Vel", descanso: "30", instrucoes: "Corra no máximo.", dica: "Cuidado na esteira." },
      { id: 2, nome: "Caminhada", grupo: "Cardio", series: 10, repeticoes: "30s", cargaAlvo: "Leve", descanso: "0", instrucoes: "Recupere o fôlego.", dica: "Respire fundo." }
    ]
  },
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
  // ESPECIAIS
  {
    id: 50, titulo: "Calistenia (Rua)", descricao: "Treino completo só com o corpo.", nivel: 'Especial', duracaoMin: 45,
    imagemCapa: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&q=80&w=600",
    exercicios: [
      { id: 1, nome: "Flexão de Braço", grupo: "Peito", series: 4, repeticoes: "Falha", cargaAlvo: "Corpo", descanso: "60", instrucoes: "Peito no chão.", dica: "Corpo reto." },
      { id: 2, nome: "Barra Fixa", grupo: "Costas", series: 4, repeticoes: "Falha", cargaAlvo: "Corpo", descanso: "90", instrucoes: "Queixo acima da barra.", dica: "Sem impulso." },
      { id: 3, nome: "Afundo", grupo: "Pernas", series: 3, repeticoes: "15/perna", cargaAlvo: "Corpo", descanso: "45", instrucoes: "Joelho no chão.", dica: "Tronco ereto." }
    ]
  },
  {
    id: 51, titulo: "Tanquinho Express", descricao: "Foco total em abdômen.", nivel: 'Especial', duracaoMin: 15,
    imagemCapa: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=600",
    exercicios: [
      { id: 1, nome: "Crunch Supra", grupo: "Abs", series: 4, repeticoes: "20", cargaAlvo: "Corpo", descanso: "30", instrucoes: "Tire as escápulas do chão.", dica: "Solte o ar subindo." },
      { id: 2, nome: "Elevação de Pernas", grupo: "Abs", series: 4, repeticoes: "15", cargaAlvo: "Corpo", descanso: "30", instrucoes: "Pernas esticadas.", dica: "Não tire a lombar." },
      { id: 3, nome: "Prancha", grupo: "Core", series: 3, repeticoes: "45s", cargaAlvo: "Iso", descanso: "30", instrucoes: "Estático.", dica: "Contraia tudo." }
    ]
  },
  {
    id: 52, titulo: "Yoga Recovery", descricao: "Recuperação ativa e alongamento.", nivel: 'Especial', duracaoMin: 20,
    imagemCapa: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=600",
    exercicios: [
      { id: 1, nome: "Cachorro Olhando Baixo", grupo: "Full", series: 3, repeticoes: "30s", cargaAlvo: "Iso", descanso: "15", instrucoes: "Forme um V invertido.", dica: "Calcanhar no chão." },
      { id: 2, nome: "Posição da Criança", grupo: "Relax", series: 1, repeticoes: "2min", cargaAlvo: "Relax", descanso: "0", instrucoes: "Teste no chão, braços a frente.", dica: "Respire fundo." }
    ]
  },
  // INICIANTE
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
  // INTERMEDIÁRIO
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
    id: 202, titulo: "Glúteos de Aço", descricao: "Foco em posteriores e glúteo.", nivel: 'Intermediário', duracaoMin: 50,
    imagemCapa: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?auto=format&fit=crop&q=80&w=600",
    exercicios: [
      { id: 1, nome: "Elevação Pélvica", grupo: "Glúteo", series: 4, repeticoes: "12", cargaAlvo: "Alta", descanso: "90", instrucoes: "Barra no quadril.", dica: "Contraia no topo." },
      { id: 2, nome: "Cadeira Abdutora", grupo: "Glúteo", series: 3, repeticoes: "20", cargaAlvo: "Mod", descanso: "45", instrucoes: "Tronco a frente.", dica: "Segura a volta." }
    ]
  },
  // AVANÇADO
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
  },
  {
    id: 302, titulo: "Powerlifting SBD", descricao: "Squat, Bench, Deadlift.", nivel: 'Avançado', duracaoMin: 90,
    imagemCapa: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=600",
    exercicios: [
      { id: 1, nome: "Squat (Agachamento)", grupo: "Full", series: 5, repeticoes: "5", cargaAlvo: "80%", descanso: "180", instrucoes: "Profundo.", dica: "Foco total." },
      { id: 2, nome: "Bench (Supino)", grupo: "Peito", series: 5, repeticoes: "5", cargaAlvo: "80%", descanso: "180", instrucoes: "Pausa no peito.", dica: "Leg drive." },
      { id: 3, nome: "Deadlift (Terra)", grupo: "Costas", series: 3, repeticoes: "3", cargaAlvo: "85%", descanso: "240", instrucoes: "Convencional ou Sumo.", dica: "Explosão." }
    ]
  }
];

// --- 4. COMPONENTES EXTRAÍDOS ---

const Toast = ({ msg, type, onClose }: { msg: string, type: 'success' | 'error' | 'info', onClose: () => void }) => {
  useEffect(() => { const timer = setTimeout(onClose, 3000); return () => clearTimeout(timer); }, []);
  const colors = { success: 'bg-emerald-600', error: 'bg-red-600', info: 'bg-blue-600' };
  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 px-4 py-3 rounded-full shadow-2xl ${colors[type]} text-white animate-in slide-in-from-top duration-300`}>
      {type === 'success' ? <CheckCircle2 size={18}/> : <Brain size={18}/>}
      <span className="font-bold text-sm">{msg}</span>
      <button onClick={onClose} className="ml-2 bg-black/20 rounded-full p-1 hover:bg-black/40"><X size={14}/></button>
    </div>
  );
};

// Componente Heatmap
const Heatmap = ({ historico, styles }: any) => {
  const dias = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d;
  });

  return (
    <div className="bg-slate-900 border border-white/5 rounded-2xl p-4">
      <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2"><Activity size={14}/> Consistency Map (30 Days)</h3>
      <div className="grid grid-cols-10 gap-1.5">
        {dias.map((d, i) => {
          const check = historico.some((h:any) => new Date(h.data).toDateString() === d.toDateString());
          return (
            <div key={i} title={d.toLocaleDateString()} className={`w-full aspect-square rounded-sm ${check ? styles.primary : 'bg-slate-800'}`}></div>
          )
        })}
      </div>
    </div>
  );
};

// Componente DASHBOARD 
const DashboardView = ({ streak, rank, styles, userName, installApp, setAbaAtiva, treinosEstaSemana, historico }: any) => {
  const [quote, setQuote] = useState(QUOTES[0]);
  useEffect(() => { setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]); }, []);

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Banner */}
      <div className={`bg-gradient-to-r ${styles.gradient} rounded-2xl p-6 shadow-xl text-white relative overflow-hidden`}>
        <div className="relative z-10">
           <div className="flex justify-between items-start">
             <div><h2 className="text-3xl font-black italic mb-1">TITANIUM 9.0</h2><p className="opacity-80 mb-4 font-medium text-sm">Bem-vindo, {userName}.</p></div>
             <button onClick={installApp} className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition"><Smartphone size={20}/></button>
           </div>
           <div className="flex gap-6 mt-2">
              <div><p className="text-[10px] uppercase font-bold opacity-70">Ofensiva</p><p className="text-3xl font-black flex items-center gap-1"><Flame className="fill-white text-white" size={24}/> {streak}</p></div>
              <div><p className="text-[10px] uppercase font-bold opacity-70">Rank</p><p className="text-xl font-bold flex items-center gap-1">{rank}</p></div>
           </div>
        </div>
        <Dumbbell className="absolute -right-6 -bottom-6 text-black/20 w-48 h-48 rotate-[-20deg]" />
      </div>

      {/* Frequência (Posicionado ACIMA do Heatmap conforme pedido) */}
      <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-slate-400 uppercase mb-4 flex items-center gap-2"><CalendarDays size={16}/> Semana</h3>
        <div className="flex justify-between">
          {treinosEstaSemana.map((item: any, i: number) => (
             <div key={i} className="flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${item.ativo ? `${styles.primary} text-white shadow-lg` : item.isToday ? 'border border-slate-500' : 'bg-slate-800'}`}>{item.ativo && <CheckCircle2 size={16}/>}</div>
                <span className={`text-[10px] font-bold ${item.isToday ? 'text-white' : 'text-slate-600'}`}>{item.dia}</span>
             </div>
          ))}
        </div>
      </div>

      {/* Heatmap */}
      <Heatmap historico={historico} styles={styles} />

      {/* Quote Widget */}
      <div className="bg-slate-900 border border-white/5 rounded-2xl p-4 flex items-center gap-4">
         <Quote className="text-slate-600 rotate-180" size={24}/>
         <p className="text-xs text-slate-300 italic flex-1">"{quote}"</p>
      </div>

      <button onClick={() => setAbaAtiva('treinos')} className={`w-full bg-slate-100 hover:bg-white text-black font-black py-4 rounded-xl shadow-lg transform active:scale-95 transition flex items-center justify-center gap-2`}><PlayCircle size={24} /> COMEÇAR</button>
    </div>
  );
};

// Componente SHAPE (Inclui Medidas Corporais - NOVO)
const ShapeView = ({ styles, historicoPeso, novoPesoCorporal, setNovoPesoCorporal, adicionarPesoCorporal, alturaIMC, setAlturaIMC, pesoIMC, setPesoIMC, calcularIMC, resultadoIMC, calcPeso, setCalcPeso, calcReps, setCalcReps, calcular1RM, resultado1RM, pesoAlvo, setPesoAlvo, calcularAnilhas, resultadoAnilhas, water, setWater, medidas, setMedidas, salvarMedidas }: any) => {
  const [macros, setMacros] = useState<{tdee:number, p:number, c:number, g:number} | null>(null);

  const calcMacros = () => {
     const p = parseFloat(pesoIMC);
     const a = parseFloat(alturaIMC);
     if(p && a) {
       const tdee = Math.round(p * 24 * 1.35);
       setMacros({ tdee, p: Math.round(p * 2), c: Math.round(p * 3.5), g: Math.round(p * 0.9) });
     }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right">
      <h2 className="text-2xl font-black italic text-white uppercase mb-4">Shape & Metas</h2>
      
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-6 relative overflow-hidden">
         <div className="flex justify-between items-center z-10 relative">
            <div>
               <h3 className="text-lg font-bold text-blue-400 uppercase flex items-center gap-2"><Droplets size={20}/> Hidratação</h3>
               <p className="text-3xl font-black text-white">{water}ml <span className="text-sm font-medium text-slate-400">/ 3000ml</span></p>
            </div>
            <button onClick={() => setWater((p: number) => p + 250)} className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-full shadow-lg transition active:scale-90"><Plus size={24}/></button>
         </div>
         <div className="absolute bottom-0 left-0 h-1.5 bg-blue-500 transition-all duration-500" style={{width: `${Math.min((water/3000)*100, 100)}%`}}></div>
      </div>

      {/* Bio-Dados & Macros */}
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
         <div className="flex items-center gap-2 mb-4 text-emerald-400"><Utensils size={24}/><h3 className="text-lg font-bold uppercase">Bio-Dados</h3></div>
         <div className="grid grid-cols-2 gap-4 mb-4">
            <input type="text" className="bg-black border border-white/10 p-3 rounded text-white text-center font-bold" placeholder="Altura (1.75)" value={alturaIMC} onChange={e=>setAlturaIMC(e.target.value)}/>
            <input type="text" className="bg-black border border-white/10 p-3 rounded text-white text-center font-bold" placeholder="Peso (80)" value={pesoIMC} onChange={e=>setPesoIMC(e.target.value)}/>
         </div>
         <div className="flex gap-2">
            <button onClick={calcularIMC} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 rounded mb-4 text-xs">IMC</button>
            <button onClick={calcMacros} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 rounded mb-4 text-xs">MACROS</button>
         </div>
         
         {resultadoIMC && (
           <div className="bg-emerald-900/30 border border-emerald-500/30 p-3 rounded text-center mb-2 animate-in fade-in">
             <p className="text-3xl font-black text-white">{resultadoIMC.valor}</p>
             <p className="text-xs uppercase font-bold text-emerald-400">IMC: {resultadoIMC.class}</p>
           </div>
         )}
         {macros && (
            <div className="bg-slate-800/50 p-3 rounded border border-white/5 animate-in fade-in">
               <p className="text-center text-xs text-slate-400 mb-2 font-bold uppercase">Meta Diária (TDEE: {macros.tdee}kcal)</p>
               <div className="flex justify-between text-center">
                  <div><p className="text-lg font-bold text-white">{macros.p}g</p><p className="text-[10px] text-slate-500">PROT</p></div>
                  <div><p className="text-lg font-bold text-white">{macros.c}g</p><p className="text-[10px] text-slate-500">CARB</p></div>
                  <div><p className="text-lg font-bold text-white">{macros.g}g</p><p className="text-[10px] text-slate-500">GORD</p></div>
               </div>
            </div>
         )}
      </div>

      {/* Weight Tracker */}
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4 text-slate-400"><Scale size={24}/><h3 className="text-lg font-bold uppercase">Diário de Peso</h3></div>
        <div className="flex gap-2 mb-4">
          <input type="number" className="bg-black border border-white/10 p-3 rounded-lg text-white font-bold w-full" placeholder="Ex: 80.5 kg" value={novoPesoCorporal} onChange={e => setNovoPesoCorporal(e.target.value)}/>
          <button onClick={adicionarPesoCorporal} className={`${styles.primary} text-white font-bold px-6 rounded-lg`}>SALVAR</button>
        </div>
        {historicoPeso.length > 0 && (
          <div className="space-y-2">
             {historicoPeso.slice(0, 5).map((reg: any, i: number) => (
               <div key={i} className="flex justify-between items-center bg-black/40 p-3 rounded-lg border-l-4 border-slate-700">
                 <span className="text-xs text-slate-400">{new Date(reg.data).toLocaleDateString()}</span>
                 <span className="font-bold text-white">{reg.peso} kg</span>
               </div>
             ))}
          </div>
        )}
      </div>

      {/* Body Measurements (Novo Recurso) */}
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
         <div className="flex items-center gap-2 mb-4 text-purple-400"><Ruler size={24}/><h3 className="text-lg font-bold uppercase">Medidas (cm)</h3></div>
         <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-black p-2 rounded border border-white/10"><p className="text-[10px] text-slate-500 uppercase">Braço</p><input className="bg-transparent w-full text-white font-bold" value={medidas.braco} onChange={e => setMedidas({...medidas, braco: e.target.value})}/></div>
            <div className="bg-black p-2 rounded border border-white/10"><p className="text-[10px] text-slate-500 uppercase">Peito</p><input className="bg-transparent w-full text-white font-bold" value={medidas.peito} onChange={e => setMedidas({...medidas, peito: e.target.value})}/></div>
            <div className="bg-black p-2 rounded border border-white/10"><p className="text-[10px] text-slate-500 uppercase">Cintura</p><input className="bg-transparent w-full text-white font-bold" value={medidas.cintura} onChange={e => setMedidas({...medidas, cintura: e.target.value})}/></div>
            <div className="bg-black p-2 rounded border border-white/10"><p className="text-[10px] text-slate-500 uppercase">Perna</p><input className="bg-transparent w-full text-white font-bold" value={medidas.perna} onChange={e => setMedidas({...medidas, perna: e.target.value})}/></div>
         </div>
         <button onClick={salvarMedidas} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 rounded mb-2 text-xs">ATUALIZAR MEDIDAS</button>
      </div>

       {/* 1RM Calculator */}
       <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4 text-blue-500"><Calculator size={24}/><h3 className="text-lg font-bold uppercase">Força Máxima (1RM)</h3></div>
        <div className="grid grid-cols-2 gap-4 mb-4">
           <input type="number" className="bg-black border border-white/10 p-3 rounded text-white font-bold" value={calcPeso} onChange={e => setCalcPeso(e.target.value)} placeholder="Kg"/>
           <input type="number" className="bg-black border border-white/10 p-3 rounded text-white font-bold" value={calcReps} onChange={e => setCalcReps(e.target.value)} placeholder="Reps"/>
        </div>
        <button onClick={calcular1RM} className="w-full bg-blue-600 text-white font-bold py-3 rounded">CALCULAR {resultado1RM ? `: ${resultado1RM}kg` : ''}</button>
      </div>

      {/* Plate Calculator */}
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4 text-emerald-500"><Circle size={24}/><h3 className="text-lg font-bold uppercase">Calc. Anilhas (Lado)</h3></div>
        <div className="flex gap-4 mb-4">
           <input type="number" className="bg-black border border-white/10 p-3 rounded text-white font-bold w-full" value={pesoAlvo} onChange={e => setPesoAlvo(e.target.value)} placeholder="Total (kg)"/>
           <button onClick={calcularAnilhas} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 rounded">GO</button>
        </div>
        {resultadoAnilhas.length > 0 && (<div className="flex flex-wrap gap-2 justify-center">{resultadoAnilhas.map((a: number, i: number) => (<div key={i} className="h-10 w-10 bg-emerald-900 rounded-full flex items-center justify-center border border-emerald-500 text-white text-xs font-bold">{a}</div>))}</div>)}
      </div>
    </div>
  );
};

// Componente CONFIGURAÇÕES (Com Tema Movido para cá)
const SettingsView = ({ settings, atualizarSettings, resetarTreinosPadrao, baixarBackup, importarBackup, theme, mudarTema }: any) => (
    <div className="space-y-8 animate-in slide-in-from-right">
      <h2 className="text-2xl font-black italic text-white uppercase mb-4">Configurações</h2>
      
      {/* Tema Selector (Movido para cá) */}
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-2 text-slate-300 mb-4"><Palette size={24}/> <h3 className="text-lg font-bold uppercase">Aura do Sistema</h3></div>
        <div className="flex gap-2">{(Object.keys(THEMES) as ThemeKey[]).map((k) => (<button key={k} onClick={() => mudarTema(k)} className={`w-8 h-8 rounded-full border-2 ${k === theme ? 'border-white scale-110' : 'border-transparent opacity-50'} ${THEMES[k].primary}`}/>))}</div>
      </div>

      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
         <div className="flex items-center gap-2 mb-4 text-slate-300"><User size={24}/><h3 className="text-lg font-bold uppercase">Perfil & Sistema</h3></div>
         <div className="space-y-4">
            <div>
               <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Seu Nome</label>
               <input className="w-full bg-black border border-white/10 rounded p-3 text-white" value={settings.userName} onChange={e => atualizarSettings({userName: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-3">
               <button onClick={() => atualizarSettings({enableSound: !settings.enableSound})} className={`p-3 rounded border flex flex-col items-center gap-2 ${settings.enableSound ? 'bg-emerald-900/30 border-emerald-500/50 text-emerald-400' : 'bg-black border-white/10 text-slate-500'}`}>
                  {settings.enableSound ? <Volume2 size={20}/> : <VolumeX size={20}/>} <span className="text-[10px] font-bold uppercase">Sons</span>
               </button>
               <button onClick={() => atualizarSettings({enableVoice: !settings.enableVoice})} className={`p-3 rounded border flex flex-col items-center gap-2 ${settings.enableVoice ? 'bg-blue-900/30 border-blue-500/50 text-blue-400' : 'bg-black border-white/10 text-slate-500'}`}>
                  {settings.enableVoice ? <User size={20}/> : <User size={20} className="opacity-50"/>} <span className="text-[10px] font-bold uppercase">Voz (TTS)</span>
               </button>
               <button onClick={() => atualizarSettings({enableVibration: !settings.enableVibration})} className={`p-3 rounded border flex flex-col items-center gap-2 ${settings.enableVibration ? 'bg-orange-900/30 border-orange-500/50 text-orange-400' : 'bg-black border-white/10 text-slate-500'}`}>
                  {settings.enableVibration ? <Bell size={20}/> : <BellOff size={20}/>} <span className="text-[10px] font-bold uppercase">Vibração</span>
               </button>
               <button onClick={resetarTreinosPadrao} className="p-3 rounded border border-red-500/30 bg-red-900/10 text-red-500 flex flex-col items-center gap-2 hover:bg-red-900/30">
                  <RefreshCw size={20}/> <span className="text-[10px] font-bold uppercase">Resetar DB</span>
               </button>
            </div>
         </div>
      </div>

      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4 text-purple-500"><Download size={24}/><h3 className="text-lg font-bold uppercase">Backup / Restore</h3></div>
        <div className="flex gap-2">
           <button onClick={baixarBackup} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded text-xs flex items-center justify-center gap-2"><Download size={14}/> BAIXAR</button>
           <label className="flex-1 bg-purple-900/50 hover:bg-purple-900/70 text-white font-bold py-3 rounded text-xs flex items-center justify-center gap-2 cursor-pointer border border-purple-500/30">
             <Upload size={14}/> RESTAURAR <input type="file" onChange={importarBackup} className="hidden" accept=".json"/>
           </label>
        </div>
      </div>
    </div>
);

// Componente HISTÓRICO 
const HistoryView = ({ historico, styles }: any) => {
  const exportarCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,Data,Treino,Duracao,Volume,Detalhes\n";
    historico.forEach((h: any) => {
      const detalhesStr = h.detalhes ? h.detalhes.map((d:any) => `${d.nome}:${d.carga}x${d.series}`).join(" | ") : "";
      csvContent += `${new Date(h.data).toLocaleDateString()},${h.treinoNome},${h.duracaoReal},${h.volumeEstimado},"${detalhesStr}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "gymtech_data_export.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-black italic text-white uppercase">Seu Legado</h2>
         <button onClick={exportarCSV} className="bg-slate-800 border border-white/10 p-2 rounded text-green-500 hover:bg-slate-700 flex items-center gap-2 text-xs font-bold"><FileText size={14}/> EXPORTAR CSV</button>
      </div>
      
      {historico.length > 0 && (
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6">
           <div className="flex items-center gap-2 mb-6 text-slate-400"><BarChart2 size={24}/><h3 className="text-lg font-bold uppercase">Volume de Treino</h3></div>
           <div className="flex items-end justify-between h-32 gap-2">
              {historico.slice(0, 7).reverse().map((h: any, i: number) => {
                 const height = Math.min((h.volumeEstimado || 0) / 100, 100); 
                 return (
                   <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                      <div className={`w-full ${styles.primary} opacity-60 group-hover:opacity-100 rounded-t-sm relative transition-all`} style={{height: `${height}%`}}>
                         <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap z-10">{h.volumeEstimado || 0}kg</div>
                      </div>
                      <span className="text-[10px] text-slate-500">{new Date(h.data).getDate()}</span>
                   </div>
                 )
              })}
           </div>
        </div>
      )}
      {historico.length === 0 ? <p className="text-slate-500 text-center py-10">Sem dados.</p> : 
        <div className="space-y-3">
          {historico.map((h: any) => (
            <div key={h.id} className={`bg-slate-900 border-l-4 ${styles.border} p-4 rounded-r-xl`}>
                <div className="flex justify-between items-center mb-2">
                   <div><h4 className="font-bold text-white">{h.treinoNome}</h4><p className="text-xs text-slate-400">{new Date(h.data).toLocaleDateString()}</p></div>
                   <div className="text-right"><p className="font-bold text-white">{h.duracaoReal} min</p>{h.volumeEstimado ? <p className={`text-[10px] ${styles.text} font-mono`}>{h.volumeEstimado}kg Vol</p> : null}</div>
                </div>
                {h.notas && <div className="text-xs text-yellow-500 italic mb-2">" {h.notas} "</div>}
                {h.detalhes && (
                  <details className="text-xs text-slate-500 mt-2">
                    <summary className="cursor-pointer hover:text-white transition">Ver Detalhes</summary>
                    <div className="mt-2 space-y-1 bg-black/20 p-2 rounded">
                      {h.detalhes.map((d:any, i:number) => (
                        <div key={i} className="flex justify-between"><span>{d.nome}</span><span className="font-mono font-bold text-white">{d.carga} ({d.series} sets)</span></div>
                      ))}
                    </div>
                  </details>
                )}
            </div>
          ))}
        </div>
      }
    </div>
  );
};

// --- MAIN APP ---
function App() {
  const [abaAtiva, setAbaAtiva] = useState<Aba>('home');
  const [theme, setTheme] = useState<ThemeKey>('red'); 
  const [treinos, setTreinos] = useState<FichaTreino[]>(dadosIniciais);
  const [filtroNivel, setFiltroNivel] = useState<Nivel | 'Todos'>('Todos');
  const [busca, setBusca] = useState(''); 
  const [fichaSelecionada, setFichaSelecionada] = useState<FichaTreino | null>(null);
  const [notification, setNotification] = useState<{msg: string, type: 'success'|'error'|'info'} | null>(null);
  const [modalNovoTreinoAberto, setModalNovoTreinoAberto] = useState(false);
  const [notaTreino, setNotaTreino] = useState(''); 
  
  const [settings, setSettings] = useState<UserSettings>({
    userName: 'Atleta',
    enableSound: true,
    enableVoice: true,
    enableVibration: true,
    defaultRestTime: 60
  });

  const [historico, setHistorico] = useState<RegistroHistorico[]>([]);
  const [logCargas, setLogCargas] = useState<Record<number, string>>({});
  const [historicoPeso, setHistoricoPeso] = useState<RegistroPeso[]>([]);
  const [medidas, setMedidas] = useState<MedidasCorporais>({ braco: '', peito: '', cintura: '', perna: '' });
  const [streak, setStreak] = useState(0);
  const [water, setWater] = useState(0);

  const [timerAtivo, setTimerAtivo] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(0);
  const [tempoTotalTimer, setTempoTotalTimer] = useState(60);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // States
  const [calcPeso, setCalcPeso] = useState(''); 
  const [calcReps, setCalcReps] = useState(''); 
  const [resultado1RM, setResultado1RM] = useState<number | null>(null);
  const [pesoAlvo, setPesoAlvo] = useState(''); 
  const [resultadoAnilhas, setResultadoAnilhas] = useState<number[]>([]);
  const [novoPesoCorporal, setNovoPesoCorporal] = useState('');
  const [alturaIMC, setAlturaIMC] = useState('');
  const [pesoIMC, setPesoIMC] = useState('');
  const [resultadoIMC, setResultadoIMC] = useState<{valor: string, class: string} | null>(null);

  const [novoExercicio, setNovoExercicio] = useState({ nome: '', grupo: '', series: 3, repeticoes: '', cargaAlvo: '', descanso: '60', instrucoes: '', dica: '' });
  const [novoTreino, setNovoTreino] = useState<Partial<FichaTreino>>({ titulo: '', descricao: '', nivel: 'Iniciante', duracaoMin: 60, imagemCapa: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600' });

  useEffect(() => {
    try {
      const savedVersion = localStorage.getItem('gymtech_version');
      if (savedVersion !== APP_VERSION) localStorage.setItem('gymtech_version', APP_VERSION);
      
      const logs = localStorage.getItem('gymtech_logs');
      const hist = localStorage.getItem('gymtech_history');
      const strk = localStorage.getItem('gymtech_streak');
      const themeSaved = localStorage.getItem('gymtech_theme');
      const pesoHist = localStorage.getItem('gymtech_weight_history');
      const customTreinos = localStorage.getItem('gymtech_custom_workouts');
      const savedSettings = localStorage.getItem('gymtech_settings');
      const savedWater = localStorage.getItem('gymtech_water');
      const savedMedidas = localStorage.getItem('gymtech_measures');

      if (logs) setLogCargas(JSON.parse(logs));
      if (hist) setHistorico(JSON.parse(hist));
      if (strk) setStreak(Number(strk));
      if (themeSaved) setTheme(themeSaved as ThemeKey);
      if (pesoHist) setHistoricoPeso(JSON.parse(pesoHist));
      if (customTreinos) {
        const salvos = JSON.parse(customTreinos);
        const novos = salvos.filter((s: FichaTreino) => !dadosIniciais.find(d => d.id === s.id));
        setTreinos([...dadosIniciais, ...novos]);
      }
      if (savedSettings) setSettings(JSON.parse(savedSettings));
      if (savedWater) setWater(Number(savedWater));
      if (savedMedidas) setMedidas(JSON.parse(savedMedidas));

    } catch (e) { console.error(e); }
    audioRef.current = new Audio(SOM_BIP_URL); 
  }, []);

  useEffect(() => { localStorage.setItem('gymtech_water', String(water)); }, [water]);

  const showToast = (msg: string, type: 'success'|'error'|'info' = 'success') => { setNotification({ msg, type }); };
  const styles = THEMES[theme];
  const mudarTema = (novoTema: ThemeKey) => { setTheme(novoTema); localStorage.setItem('gymtech_theme', novoTema); };
  const atualizarSettings = (newSettings: Partial<UserSettings>) => { const updated = { ...settings, ...newSettings }; setSettings(updated); localStorage.setItem('gymtech_settings', JSON.stringify(updated)); };

  const falar = (texto: string) => {
    if (!settings.enableVoice) return;
    if ('speechSynthesis' in window) { setTimeout(() => { const msg = new SpeechSynthesisUtterance(texto); msg.lang = 'pt-BR'; msg.rate = 1.2; window.speechSynthesis.speak(msg); }, 500); }
  };

  const resetarTreinosPadrao = () => { if(confirm("Recarregar treinos padrão?")) { const customizados = treinos.filter(t => t.id > 1000); setTreinos([...dadosIniciais, ...customizados]); showToast("Sistema atualizado!", "info"); }};
  const calcularIMC = () => { const a = parseFloat(alturaIMC.replace(',','.')); const p = parseFloat(pesoIMC.replace(',','.')); if (a && p) { const imc = p / (a * a); let c = ''; if (imc < 18.5) c = 'Abaixo do peso'; else if (imc < 24.9) c = 'Peso normal'; else if (imc < 29.9) c = 'Sobrepeso'; else c = 'Obesidade'; setResultadoIMC({ valor: imc.toFixed(1), class: c }); }};
  const adicionarPesoCorporal = () => { if (!novoPesoCorporal) return; const novoReg = { data: new Date().toISOString(), peso: parseFloat(novoPesoCorporal) }; const novoHist = [novoReg, ...historicoPeso]; setHistoricoPeso(novoHist); localStorage.setItem('gymtech_weight_history', JSON.stringify(novoHist)); setNovoPesoCorporal(''); showToast("Peso registrado! ⚖️"); };
  const salvarMedidas = () => { localStorage.setItem('gymtech_measures', JSON.stringify(medidas)); showToast("Medidas salvas!", "success"); };
  
  const getSugestaoCarga = (idExercicio: number): string | null => { const lastLoad = logCargas[idExercicio]; if (!lastLoad) return null; const num = parseFloat(lastLoad.replace(/[^0-9.]/g, '')); if (isNaN(num)) return null; const sugerido = Math.round(num * 1.02); return sugerido > num ? `${sugerido}kg` : `${num + 1}kg`; };
  const calcularRank = (): Rank => { const total = historico?.length || 0; if (total >= 100) return 'Mr. Olympia'; if (total >= 50) return 'Lenda'; if (total >= 20) return 'Monstro'; if (total >= 5) return 'Dedicado'; return 'Iniciante'; };
  const verificarConquistas = () => { return [ { id: 1, nome: "Primeiro Sangue", desc: "Complete 1 treino", icon: <Zap size={16}/>, unlocked: historico.length >= 1 }, { id: 2, nome: "Consistência", desc: "Streak de 3 dias", icon: <Flame size={16}/>, unlocked: streak >= 3 }, { id: 3, nome: "Veterano", desc: "10 treinos totais", icon: <Medal size={16}/>, unlocked: historico.length >= 10 }, { id: 4, nome: "Foco Total", desc: "Streak de 7 dias", icon: <Target size={16}/>, unlocked: streak >= 7 }, { id: 5, nome: "Heavy Lifter", desc: "Treino c/ > 5 ton vol", icon: <Dumbbell size={16}/>, unlocked: historico.some(h => (h.volumeEstimado || 0) > 5000) }, { id: 6, nome: "God Mode", desc: "Rank Mr. Olympia", icon: <Trophy size={16}/>, unlocked: calcularRank() === 'Mr. Olympia' }, ]; };

  useEffect(() => { let intervalo: any; if (timerAtivo) { intervalo = setInterval(() => setTempoRestante((p) => tempoTotalTimer === 0 ? p + 1 : p - 1), 1000); if(tempoTotalTimer > 0 && tempoRestante === 0) { setTimerAtivo(false); if (settings.enableSound && audioRef.current) { audioRef.current.currentTime = 0; audioRef.current.play().catch(()=>{}); } if (settings.enableVibration && navigator.vibrate) navigator.vibrate([200, 100, 200]); falar("Série liberada. Vamos esmagar!"); } } return () => clearInterval(intervalo); }, [timerAtivo, tempoRestante]);
  
  const iniciarDescanso = (segundos: number) => { 
    setTempoTotalTimer(segundos);
    setTempoRestante(segundos > 0 ? segundos : 0);
    setTimerAtivo(true); 
  };
  
  const atualizarCarga = (id: number, valor: string) => { const novo = { ...logCargas, [id]: valor }; setLogCargas(novo); localStorage.setItem('gymtech_logs', JSON.stringify(novo)); };
  
  const finalizarTreino = () => { 
    if (!fichaSelecionada) return; 
    let vol = 0; 
    const detalhes: DetalheExercicio[] = [];
    fichaSelecionada.exercicios.forEach(ex => { 
      const cargaStr = logCargas[ex.id]; 
      if (cargaStr) { 
        detalhes.push({ nome: ex.nome, carga: cargaStr, series: ex.series });
        const num = parseFloat(cargaStr.replace(/[^0-9.]/g, '')); 
        if (!isNaN(num)) vol += (num * ex.series * 10); 
      } 
    }); 
    const novoRegistro: RegistroHistorico = { id: Date.now(), treinoNome: fichaSelecionada.titulo, data: new Date().toISOString(), duracaoReal: fichaSelecionada.duracaoMin, volumeEstimado: vol, detalhes: detalhes, notas: notaTreino }; 
    const novoHistorico = [novoRegistro, ...historico]; setHistorico(novoHistorico); localStorage.setItem('gymtech_history', JSON.stringify(novoHistorico)); const ultimoTreino = historico[0]; const hoje = new Date().toDateString(); if (!ultimoTreino || new Date(ultimoTreino.data).toDateString() !== hoje) { const novoStreak = streak + 1; setStreak(novoStreak); localStorage.setItem('gymtech_streak', String(novoStreak)); } 
    setFichaSelecionada(null); setNotaTreino(''); setAbaAtiva('historico'); setTimeout(() => showToast(`Treino Concluído! +${vol}kg Volume`, "success"), 100); 
  };

  const baixarBackup = () => { const dados = { logs: logCargas, history: historico, streak: streak, weight: historicoPeso, theme: theme, customWorkouts: treinos.filter(t => t.id > 1000), settings: settings, medidas: medidas }; const blob = new Blob([JSON.stringify(dados)], {type: "application/json"}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `gymtech_backup_${new Date().toISOString().slice(0,10)}.json`; a.click(); showToast("Backup baixado!", "success"); };
  const importarBackup = (event: React.ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = (e) => { try { const dados = JSON.parse(e.target?.result as string); if(dados.logs) { setLogCargas(dados.logs); localStorage.setItem('gymtech_logs', JSON.stringify(dados.logs)); } if(dados.history) { setHistorico(dados.history); localStorage.setItem('gymtech_history', JSON.stringify(dados.history)); } if(dados.streak) { setStreak(dados.streak); localStorage.setItem('gymtech_streak', JSON.stringify(dados.streak)); } if(dados.weight) { setHistoricoPeso(dados.weight); localStorage.setItem('gymtech_weight_history', JSON.stringify(dados.weight)); } if(dados.theme) { mudarTema(dados.theme); } if(dados.customWorkouts) { localStorage.setItem('gymtech_custom_workouts', JSON.stringify(dados.customWorkouts)); } if(dados.settings) { setSettings(dados.settings); localStorage.setItem('gymtech_settings', JSON.stringify(dados.settings)); } if(dados.medidas) { setMedidas(dados.medidas); localStorage.setItem('gymtech_measures', JSON.stringify(dados.medidas)); } showToast("Dados restaurados!", "success"); setTimeout(() => window.location.reload(), 1500); } catch (err) { showToast("Erro no arquivo.", "error"); } }; reader.readAsText(file); };
  const calcularAnilhas = () => { const pesoTotal = parseFloat(pesoAlvo); if (!pesoTotal || pesoTotal <= BARRA_PADRAO) { showToast("Peso deve ser > 20kg", "error"); return; } const pesoLado = (pesoTotal - BARRA_PADRAO) / 2; const anilhasDisponiveis = [25, 20, 15, 10, 5, 2.5, 1.25]; let restante = pesoLado; const anilhasUsadas: number[] = []; for (let anilha of anilhasDisponiveis) { while (restante >= anilha) { anilhasUsadas.push(anilha); restante -= anilha; } } setResultadoAnilhas(anilhasUsadas); };
  const calcular1RM = () => { const peso = parseFloat(calcPeso); const reps = parseFloat(calcReps); if (peso && reps) setResultado1RM(Math.round(peso * (1 + reps / 30))); };
  const compartilharWhatsApp = () => { if(!fichaSelecionada) return; const texto = `🔥 GymTech: Treino "${fichaSelecionada.titulo}" destruído por ${settings.userName}!`; window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank'); };
  const instalarApp = () => { showToast("Menu do navegador > Adicionar à Tela Inicial", "info"); };

  const diasDaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const treinosEstaSemana = diasDaSemana.map((dia, index) => { const treinouHoje = historico.some(h => new Date(h.data).getDay() === index && Math.abs(new Date(h.data).getTime() - new Date().getTime()) < 604800000); return { dia, ativo: treinouHoje, isToday: index === new Date().getDay() }; });
  const treinosFiltrados = treinos.filter(treino => { const matchNivel = filtroNivel === 'Todos' ? true : treino.nivel === filtroNivel; const matchBusca = treino.titulo.toLowerCase().includes(busca.toLowerCase()); return matchNivel && matchBusca; });
  const salvarNovoTreino = (e: React.FormEvent) => { e.preventDefault(); const novoId = 1000 + treinos.length; const novaFicha = { ...novoTreino, id: novoId, nivel: novoTreino.nivel as Nivel, exercicios: [] } as FichaTreino; const listaAtualizada = [novaFicha, ...treinos]; setTreinos(listaAtualizada); const custom = listaAtualizada.filter(t => t.id >= 1000); localStorage.setItem('gymtech_custom_workouts', JSON.stringify(custom)); setModalNovoTreinoAberto(false); showToast("Treino Criado!", "success"); };
  const adicionarExercicio = (e: React.FormEvent) => { e.preventDefault(); if (!fichaSelecionada) return; const item: Exercicio = { id: Date.now(), ...novoExercicio, series: Number(novoExercicio.series), instrucoes: novoExercicio.instrucoes || 'Execute com controle.', dica: novoExercicio.dica || 'Foco na técnica.' }; const novosTreinos = treinos.map(t => t.id === fichaSelecionada.id ? { ...t, exercicios: [...t.exercicios, item] } : t); setTreinos(novosTreinos); setFichaSelecionada(novosTreinos.find(t => t.id === fichaSelecionada.id) || null); if (fichaSelecionada.id >= 1000) { const custom = novosTreinos.filter(t => t.id >= 1000); localStorage.setItem('gymtech_custom_workouts', JSON.stringify(custom)); } setNovoExercicio({ nome: '', grupo: '', series: 3, repeticoes: '', cargaAlvo: '', descanso: '60', instrucoes: '', dica: '' }); };
  const removerExercicio = (idEx: number) => { if (!fichaSelecionada) return; const novosTreinos = treinos.map(t => t.id === fichaSelecionada.id ? { ...t, exercicios: t.exercicios.filter(ex => ex.id !== idEx) } : t); setTreinos(novosTreinos); setFichaSelecionada(novosTreinos.find(t => t.id === fichaSelecionada.id) || null); if (fichaSelecionada.id >= 1000) { const custom = novosTreinos.filter(t => t.id >= 1000); localStorage.setItem('gymtech_custom_workouts', JSON.stringify(custom)); } };
  const excluirTreinoCustomizado = (e: React.MouseEvent, id: number) => { e.stopPropagation(); if (confirm("Excluir este treino permanentemente?")) { const novaLista = treinos.filter(t => t.id !== id); setTreinos(novaLista); const custom = novaLista.filter(t => t.id >= 1000); localStorage.setItem('gymtech_custom_workouts', JSON.stringify(custom)); showToast("Treino excluído.", "info"); }};

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-100 font-sans pb-24 selection:bg-white selection:text-black">
      <header className="bg-black/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-30 px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2"><div className={`${styles.primary} w-8 h-8 rounded flex items-center justify-center font-black italic text-white`}>G</div><span className="font-black italic tracking-tighter text-xl">GYM<span className={styles.text}>TECH</span></span></div>
        <div className="flex gap-2">
            <button onClick={() => setAbaAtiva('ferramentas')} className="bg-slate-900 border border-white/10 hover:bg-slate-800 text-slate-300 p-2 rounded-lg transition"><Settings size={16} /></button>
            <button onClick={() => setModalNovoTreinoAberto(true)} className="bg-slate-900 border border-white/10 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-2 transition"><Plus size={14} /> NOVO</button>
        </div>
      </header>

      {notification && <Toast msg={notification.msg} type={notification.type} onClose={() => setNotification(null)} />}

      <main className="max-w-xl mx-auto px-4 py-6">
         {abaAtiva === 'home' && <DashboardView streak={streak} rank={calcularRank()} styles={styles} userName={settings.userName} installApp={instalarApp} setAbaAtiva={setAbaAtiva} theme={theme} mudarTema={mudarTema} treinosEstaSemana={treinosEstaSemana} historico={historico}/>}
         
         {abaAtiva === 'treinos' && (
           <div className="space-y-6 animate-in fade-in">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-white/30" placeholder="Buscar treino..." value={busca} onChange={e => setBusca(e.target.value)} />
             </div>
             
             <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {(['Todos', 'Aquecimento', 'Cardio', 'Iniciante', 'Intermediário', 'Avançado', 'Especial', 'CrossFit'] as const).map((nivel) => (
                  <button key={nivel} onClick={() => setFiltroNivel(nivel)} className={`px-4 py-2 rounded-full text-xs font-bold uppercase whitespace-nowrap transition-all border ${filtroNivel === nivel ? `${styles.primary} ${styles.border} text-white` : 'bg-transparent border-slate-800 text-slate-500'}`}>{nivel}</button>
                ))}
             </div>
             <div className="grid grid-cols-1 gap-4">
               {treinosFiltrados.map((treino) => (
                  <div key={treino.id} onClick={() => setFichaSelecionada(treino)} className="bg-slate-900 h-40 rounded-xl border border-white/5 relative overflow-hidden cursor-pointer active:scale-95 transition group shadow-lg">
                     <img src={treino.imagemCapa} className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 transition duration-500"/>
                     <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-5 flex flex-col justify-end">
                        <div className="flex justify-between items-start">
                           <div className="flex items-center gap-2 mb-1">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${treino.nivel === 'Cardio' ? 'bg-orange-500 text-black' : treino.nivel === 'Aquecimento' ? 'bg-yellow-500 text-black' : `${styles.primary} text-white`}`}>{treino.nivel}</span>
                              <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1"><Clock size={10}/> {treino.duracaoMin} min</span>
                           </div>
                           {treino.id >= 1000 && (
                             <button onClick={(e) => excluirTreinoCustomizado(e, treino.id)} className="bg-red-500/20 text-red-500 p-1.5 rounded-full hover:bg-red-500 hover:text-white transition"><Trash2 size={14}/></button>
                           )}
                        </div>
                        <h3 className="text-2xl font-black italic uppercase leading-none text-white">{treino.titulo}</h3>
                     </div>
                  </div>
               ))}
             </div>
           </div>
         )}

         {abaAtiva === 'shape' && <ShapeView styles={styles} historicoPeso={historicoPeso} novoPesoCorporal={novoPesoCorporal} setNovoPesoCorporal={setNovoPesoCorporal} adicionarPesoCorporal={adicionarPesoCorporal} alturaIMC={alturaIMC} setAlturaIMC={setAlturaIMC} pesoIMC={pesoIMC} setPesoIMC={setPesoIMC} calcularIMC={calcularIMC} resultadoIMC={resultadoIMC} calcPeso={calcPeso} setCalcPeso={setCalcPeso} calcReps={calcReps} setCalcReps={setCalcReps} calcular1RM={calcular1RM} resultado1RM={resultado1RM} pesoAlvo={pesoAlvo} setPesoAlvo={setPesoAlvo} calcularAnilhas={calcularAnilhas} resultadoAnilhas={resultadoAnilhas} water={water} setWater={setWater} medidas={medidas} setMedidas={setMedidas} salvarMedidas={salvarMedidas}/>}
         {abaAtiva === 'ferramentas' && <SettingsView settings={settings} atualizarSettings={atualizarSettings} resetarTreinosPadrao={resetarTreinosPadrao} baixarBackup={baixarBackup} importarBackup={importarBackup} theme={theme} mudarTema={mudarTema} />}
         {abaAtiva === 'historico' && <HistoryView historico={historico} styles={styles} />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur border-t border-white/10 py-2 px-6 z-40 flex justify-between items-center md:justify-center md:gap-10">
         {([{id: 'home', icon: LayoutDashboard, label: 'Home'}, {id: 'treinos', icon: Dumbbell, label: 'Treinar'}, {id: 'shape', icon: Scale, label: 'Shape'}, {id: 'ferramentas', icon: Settings, label: 'Config'}, {id: 'historico', icon: History, label: 'Hist'}] as const).map(item => (
            <button key={item.id} onClick={() => setAbaAtiva(item.id)} className={`flex flex-col items-center gap-1 p-2 ${abaAtiva === item.id ? styles.text : 'text-slate-500'}`}><item.icon size={22} /> <span className="text-[9px] font-bold uppercase">{item.label}</span></button>
         ))}
      </nav>

      {fichaSelecionada && (
        <div className="fixed inset-0 z-50 bg-[#09090b] overflow-y-auto animate-in slide-in-from-bottom duration-300 pb-20">
           <div className="fixed top-0 left-0 right-0 h-1 bg-slate-800 z-50">
              <div className={`h-full ${styles.primary} transition-all duration-300`} style={{ width: `${Math.min((Object.keys(logCargas).length / fichaSelecionada.exercicios.length) * 100, 100)}%` }}></div>
           </div>

           <div className="sticky top-0 bg-black/90 backdrop-blur border-b border-white/10 p-4 flex justify-between items-center z-10 mt-1">
              <div><h2 className="text-lg font-black italic uppercase text-white w-48 truncate">{fichaSelecionada.titulo}</h2><p className="text-xs text-slate-400">{fichaSelecionada.duracaoMin} min</p></div>
              <button onClick={() => setFichaSelecionada(null)} className="bg-slate-800 p-2 rounded-full text-slate-400"><ChevronDown/></button>
           </div>
           <div className="p-4 space-y-4">
              {fichaSelecionada.exercicios.map((exercicio, idx) => {
                 const sugestao = getSugestaoCarga(exercicio.id);
                 return (
                 <div key={exercicio.id} className="bg-slate-900 border border-white/5 rounded-xl overflow-hidden relative group">
                    <button onClick={() => removerExercicio(exercicio.id)} className="absolute top-2 right-2 text-slate-700 hover:text-red-500 p-2"><Trash2 size={16}/></button>
                    <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/20">
                       <h4 className="font-bold text-white uppercase text-sm flex items-center gap-2"><span className={`${styles.primary} text-white w-6 h-6 flex items-center justify-center rounded text-xs`}>{idx + 1}</span> {exercicio.nome}</h4>
                       <button onClick={() => window.open(`https://www.youtube.com/results?search_query=execução ${exercicio.nome}`, '_blank')} className={`${styles.text} mr-8`}><PlayCircle size={20}/></button>
                    </div>
                    <div className="p-4 grid grid-cols-2 gap-4">
                       <div className="bg-black p-3 rounded border border-white/10"><p className="text-[10px] uppercase font-bold text-slate-500">Target</p><p className="text-white font-bold text-sm">{exercicio.cargaAlvo} {sugestao && <span className={`${styles.text} ml-1`}>({sugestao})</span>}</p></div>
                       <div className="bg-black p-3 rounded border border-white/10"><p className="text-[10px] uppercase font-bold text-slate-500">Carga</p><input type="number" step="0.5" className="bg-transparent text-white font-bold w-full outline-none" placeholder="Kg" value={logCargas[exercicio.id] || ''} onChange={(e) => atualizarCarga(exercicio.id, e.target.value)}/></div>
                    </div>
                    <div className="px-4 pb-4 flex gap-2">
                       <button onClick={() => iniciarDescanso(Number(exercicio.descanso))} className="flex-1 bg-slate-800 hover:bg-slate-700 py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition border border-white/5"><Timer size={16} className={styles.text}/> {exercicio.descanso}s</button>
                       <button onClick={() => iniciarDescanso(0)} className="w-12 bg-slate-800 hover:bg-slate-700 py-3 rounded-lg flex items-center justify-center transition border border-white/5" title="Cronômetro Livre"><StopCircle size={16} className="text-blue-400"/></button>
                    </div>
                    <details className="px-4 pb-4 text-xs text-slate-400"><summary className="cursor-pointer font-bold uppercase text-slate-600 list-none flex gap-2 items-center"><BookOpen size={12}/> Instruções</summary><div className={`mt-2 pl-2 border-l-2 ${styles.border.replace('bg-','border-')} opacity-50`}><p>{exercicio.instrucoes}</p><p className="mt-1 text-yellow-500">{exercicio.dica}</p></div></details>
                 </div>
              )})}
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
           
           <div className="p-4 pb-32 space-y-3">
             <div className="bg-slate-900 p-3 rounded-xl border border-white/5">
                <p className="text-[10px] uppercase font-bold text-slate-500 mb-2">Notas do Treino</p>
                <textarea className="w-full bg-black/50 text-white text-sm p-2 rounded border border-white/10 focus:outline-none focus:border-white/30" rows={2} placeholder="Como foi o treino? Alguma dor?" value={notaTreino} onChange={e => setNotaTreino(e.target.value)}></textarea>
             </div>
             <div className="flex gap-2">
                <button onClick={compartilharWhatsApp} className="flex-1 bg-slate-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2"><Share2 size={24}/></button>
                <button onClick={finalizarTreino} className={`flex-[4] ${styles.primary} ${styles.hover} text-white font-black py-4 rounded-xl uppercase flex items-center justify-center gap-2`}><CheckCircle2 size={24}/> Finalizar</button>
             </div>
           </div>
        </div>
      )}

      {timerAtivo && (
        <div className={`fixed bottom-24 left-4 right-4 bg-black/95 backdrop-blur border ${styles.border} rounded-2xl p-4 flex items-center justify-between z-50 shadow-2xl`}>
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 flex items-center justify-center"><span className="font-mono font-bold text-white text-sm">{Math.floor(tempoRestante/60)}:{tempoRestante%60 < 10 ? '0' : ''}{tempoRestante%60}</span></div>
            <div>
               <p className="text-[10px] font-bold text-slate-500 uppercase">{tempoTotalTimer === 0 ? 'Cronômetro' : 'Descanso'}</p>
               <p className={`${styles.text} font-bold text-sm animate-pulse`}>{tempoTotalTimer === 0 ? 'CONTANDO...' : 'RECUPERANDO...'}</p>
            </div>
          </div>
          <button onClick={() => setTimerAtivo(false)} className={`px-3 py-2 bg-slate-800 ${styles.text} rounded text-xs font-bold`}>PARAR</button>
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