import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import {
  Plus, Settings, FileText, Calendar,
  ChevronRight, MoreHorizontal, Download,
  Printer, Eye, Edit2, Trash2, CheckCircle,
  Clock, Search, Filter, ArrowLeft, Upload,
  Layout, Users, BarChart3, Award, X, Bell,
  BookOpen, Layers, Target, Info
} from 'lucide-react';

const Exams = ({ examView, setExamView }) => {
  const [createStep, setCreateStep] = useState(1);
  const [notification, setNotification] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // --- Data State (Mock Database) ---
  const [examData, setExamData] = useState([]);
  const [resultsData, setResultsData] = useState([]);

  // State لمعلومات الامتحان اللي رانا نكرييو فيه
  const [newExam, setNewExam] = useState({
    title: '',
    subject: 'Mathematics',
    class_name: '9 Niaz',
    duration: 60,
    instructions: ''
  });

  const fetchExams = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('exams')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      const mapped = data.map(exam => ({
        id: exam.id,
        title: exam.title,
        sub: exam.subject,
        cls: exam.class_name,
        status: exam.status || 'Draft',
        dur: exam.duration_minutes + 'm',
        part: "35",
        prog: "28/35",
        sColor: exam.status?.toLowerCase() === 'active' ? 'bg-[#0A1128]' :
          exam.status?.toLowerCase() === 'scheduled' ? 'bg-orange-500' :
            exam.status?.toLowerCase() === 'completed' ? 'bg-green-500' : 'bg-gray-400'
      }));
      setExamData(mapped);
    }
    setLoading(false);
  };

  const fetchExamResults = async (examTitle) => {
    try {
      const { data, error } = await supabase
        .from('grades')
        .select('*, students(name, student_id)')
        .eq('exam_title', examTitle);

      if (data && data.length > 0) {
        setResultsData(data);
      }
    } catch (err) {
      console.log("No grades found yet or table missing", err);
    }
  };

  useEffect(() => {
    fetchExams();
    if (examView === 'results') {
      fetchExamResults('Mathematics Mid-Term Exam');
    }
  }, [examView]);

  const handleSaveExam = async () => {
    if (!newExam.title) {
      triggerToast("Please enter the Exam Title!");
      return;
    }

    setLoading(true);
    try {
      const todayDate = new Date().toISOString().split('T')[0];

      const { data: existingExams, error: checkError } = await supabase
        .from('exams')
        .select('*')
        .eq('class_name', newExam.class_name)
        .eq('exam_date', todayDate);

      if (checkError) throw checkError;

      if (existingExams && existingExams.length > 0) {
        triggerToast(`Conflict! The class "${newExam.class_name}" already has an exam scheduled on this date.`);
        setLoading(false);
        return;
      }

      const { error } = await supabase.from('exams').insert([{
        title: newExam.title,
        subject: newExam.subject,
        class_name: newExam.class_name,
        duration_minutes: parseInt(newExam.duration),
        status: 'Active',
        exam_date: todayDate
      }]);

      if (error) throw error;

      triggerToast("✅ Exam Created Successfully!", "system");
      setNewExam({ title: '', subject: 'Mathematics', class_name: '9 Niaz', duration: 60, instructions: '' });
      setCreateStep(1);
      setExamView('manage');
      fetchExams();
    } catch (err) {
      triggerToast("Error: " + err.message, "system");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExam = async (id) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      const { error } = await supabase.from('exams').delete().eq('id', id);
      if (!error) {
        setExamData(examData.filter(exam => exam.id !== id));
        triggerToast("Exam deleted successfully", "system");
      } else {
        triggerToast("Error deleting exam: " + error.message, "system");
      }
    }
  };

  // --- Utility: Show Modern Notification ---
  const triggerToast = (msg, type = 'system') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // =======================================
  // 1. DASHBOARD VIEW
  // =======================================
  const renderHome = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-[#0A1128]">Exam Management</h2>
        {/* Creative Navbar Idea: Mini Dynamic Status */}
        <div className="hidden md:flex bg-white/50 backdrop-blur-md border border-gray-100 rounded-2xl p-2 gap-2 shadow-sm">
          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-xl text-indigo-600 font-bold text-xs">
            <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></div>
            System Live
          </div>
          <div className="px-4 py-2 text-gray-500 font-bold text-xs flex items-center gap-2">
            <Calendar size={14} /> {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Total Exams', val: examData.length, color: 'text-[#0A1128]' },
          { label: 'Active', val: '3', color: 'text-indigo-600' },
          { label: 'Scheduled', val: '5', color: 'text-[#0A1128]' },
          { label: 'Completed', val: '4', color: 'text-green-500' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">{stat.label}</p>
            <p className={`text-4xl font-black ${stat.color}`}>{stat.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-[#0A1128]">Recent Exams</h3>
            <button onClick={() => setExamView('manage')} className="text-sm font-bold text-indigo-600 hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {examData.map((exam, idx) => (
              <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all cursor-pointer flex justify-between items-center group">
                <div className="flex items-center gap-5">
                  <div className="p-4 rounded-xl bg-indigo-50 text-indigo-600"><FileText size={24} /></div>
                  <div>
                    <div className="flex items-center mb-1">
                      <h4 className="font-bold text-[#0A1128] text-lg mr-3 group-hover:text-indigo-600 transition-colors">{exam.title}</h4>
                      <span className="text-[10px] px-2 py-1 rounded-lg bg-gray-100 text-gray-500 font-black uppercase">{exam.status}</span>
                    </div>
                    <p className="text-sm text-gray-400 font-medium">{exam.sub} • {exam.cls} • {exam.prog} students</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-300 group-hover:text-indigo-600 transition-colors" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold text-[#0A1128]">Quick Actions</h3>
          <div className="bg-white rounded-3xl border border-gray-100 p-4 shadow-sm space-y-2">
            {[
              { label: 'Create New Exam', icon: Plus, view: 'create', color: 'bg-indigo-50 text-indigo-600' },
              { label: 'Manage Exams', icon: Settings, view: 'manage', color: 'bg-slate-50 text-slate-600' },
              { label: 'View Exam Results', icon: BarChart3, view: 'results', color: 'bg-green-50 text-green-600' },
              { label: 'Schedule Exam', icon: Calendar, view: 'schedule', color: 'bg-orange-50 text-orange-600' },
            ].map((action, i) => (
              <button key={i} onClick={() => setExamView(action.view)} className="w-full text-left px-4 py-4 rounded-2xl hover:bg-gray-50 transition-all flex items-center group">
                <div className={`mr-4 p-2.5 rounded-xl ${action.color}`}><action.icon size={20} /></div>
                <span className="text-base font-bold text-gray-700 group-hover:text-black">{action.label}</span>
                <ChevronRight size={16} className="ml-auto text-gray-300 group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // =======================================
  // 2. MANAGE EXAMS VIEW (Functioning Actions & Search)
  // =======================================
  const renderManageExams = () => (
    <div className="animate-in slide-in-from-right-8 duration-500 pb-10">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#0A1128] mb-1">Exam Management</h2>
          <p className="text-sm text-gray-500 font-medium">Manage and monitor school-wide exam progress</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setExamView('home')} className="bg-white border border-gray-200 text-[#0A1128] px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center gap-2">
            <ArrowLeft size={18} /> Back
          </button>
          <button onClick={() => setExamView('create')} className="bg-[#0A1128] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-900 transition-all">
            <Plus size={18} /> Create New Exam
          </button>
        </div>
      </div>

      <div className="bg-gray-100/80 rounded-2xl p-3 flex justify-between items-center border border-gray-200/50 mb-8">
        <div className="relative flex-1 max-w-xl">
          <Search size={18} className="absolute inset-y-0 left-4 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search exams by title, subject, or class..."
            className="w-full bg-transparent border-none py-3 pl-12 pr-4 text-sm font-medium outline-none text-gray-600"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-200/50 flex items-center gap-2">
          <Filter size={14} className="text-gray-400" />
          <select className="bg-transparent border-none text-xs font-bold text-gray-600 outline-none"><option>All Status</option></select>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 text-[#0A1128] font-black uppercase text-[10px] tracking-widest border-b border-gray-100">
            <tr>
              <th className="py-5 px-8">Exam Info</th>
              <th className="py-5 px-4">Subject/Class</th>
              <th className="py-5 px-4">Status</th>
              <th className="py-5 px-4">Duration</th>
              <th className="py-5 px-4">Participants</th>
              <th className="py-5 px-4">Progress</th>
              <th className="py-5 px-8 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 font-medium text-sm">
            {filteredExams.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50/50">
                <td className="py-6 px-8 font-bold text-[#0A1128]">{row.title}</td>
                <td className="py-6 px-4">
                  <p className="text-gray-600">{row.sub}</p>
                  <p className="text-[10px] font-black text-indigo-500 uppercase">{row.cls}</p>
                </td>
                <td className="py-6 px-4">
                  <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black text-white uppercase tracking-tight ${row.sColor}`}>{row.status}</span>
                </td>
                <td className="py-6 px-4 text-gray-400 flex items-center gap-2"><Clock size={14} /> {row.dur}</td>
                <td className="py-6 px-4 text-gray-400 flex items-center gap-2"><Users size={14} /> {row.part}</td>
                <td className="py-6 px-4">
                  <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600" style={{ width: '75%' }}></div>
                  </div>
                  <p className="text-[10px] font-black mt-1">{row.prog}</p>
                </td>
                <td className="py-6 px-8 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setExamView('results')} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all"><Eye size={18} /></button>
                    <button onClick={() => triggerToast(`Opening Edit Mode for ${row.title}`)} className="p-2 text-gray-400 hover:text-orange-500 hover:bg-white rounded-lg transition-all"><Edit2 size={18} /></button>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteExam(row.id); }} className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-all"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredExams.length === 0 && (
          <div className="p-20 text-center text-gray-400 font-bold">No exams found matching "{searchQuery}"</div>
        )}
      </div>
    </div>
  );

  // =======================================
  // 3. EXAM RESULTS VIEW
  // =======================================
  const renderResults = () => {
    const dataToDisplay = resultsData.length > 0 ? resultsData.map((s, i) => ({
      rank: `#0${i + 1}`,
      name: s.students?.name || s.name || `Student ${i + 1}`,
      score: s.score || 'N/A',
      grade: s.grade || 'N/A',
      gCol: s.grade === 'F' ? "text-red-500" : "text-green-500",
      status: s.status?.toUpperCase() || (s.grade === 'F' ? 'FAILED' : 'PASSED'),
      sCol: s.grade === 'F' ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"
    })) : [
      { rank: "#01", name: "Fatima Khan", score: "92/100", grade: "A+", gCol: "text-green-500", status: "PASSED", sCol: "bg-green-100 text-green-700" },
      { rank: "#02", name: "Ahmad Ali", score: "85/100", grade: "A", gCol: "text-green-500", status: "PASSED", sCol: "bg-green-100 text-green-700" },
      { rank: "#03", name: "Hassan Ahmed", score: "68/100", grade: "B", gCol: "text-indigo-600", status: "PASSED", sCol: "bg-green-100 text-green-700" },
      { rank: "#04", name: "Aisha Malik", score: "45/100", grade: "F", gCol: "text-red-500", status: "FAILED", sCol: "bg-red-100 text-red-600" },
    ];

    return (
      <div className="animate-in fade-in zoom-in-95 duration-500">
        <div className="flex justify-between items-center border-b border-gray-100 pb-8 mb-8">
          <div>
            <h2 className="text-3xl font-black text-[#0A1128]">Exam Results</h2>
            <p className="text-sm text-gray-500 font-medium">Analyze performance and student rankings</p>
          </div>
          <button onClick={() => setExamView('home')} className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all">
            <ArrowLeft size={18} /> Back to Dashboard
          </button>
        </div>

        <div className="flex justify-between items-center mb-10">
          <div className="bg-white border border-gray-100 rounded-2xl px-6 py-4 shadow-sm flex items-center gap-4">
            <FileText className="text-indigo-600" size={20} />
            <p className="text-[#0A1128] font-black text-lg">Mathematics Mid-Term Exam - 9 Niaz</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => triggerToast("Downloading CSV Report...", "system")} className="bg-white px-5 py-3 rounded-xl shadow-sm border border-gray-100 text-sm font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2">
              <Download size={16} className="text-indigo-600" /> Export CSV
            </button>
            <button onClick={() => triggerToast("Generating PDF Document...", "system")} className="bg-white px-5 py-3 rounded-xl shadow-sm border border-gray-100 text-sm font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2">
              <Printer size={16} className="text-red-500" /> Export PDF
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10">
          <h3 className="text-xl font-bold text-[#0A1128] mb-8">Student Ranking</h3>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="py-4 px-4 w-20">Rank</th>
                <th className="py-4 px-4">Student Name</th>
                <th className="py-4 px-4">Score</th>
                <th className="py-4 px-4">Grade</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {dataToDisplay.map((s, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-all group">
                  <td className="py-6 px-4 font-black text-gray-300 group-hover:text-indigo-600 transition-colors">{s.rank}</td>
                  <td className="py-6 px-4 font-bold text-[#0A1128]">{s.name}</td>
                  <td className="py-6 px-4 font-black text-gray-700">{s.score}</td>
                  <td className={`py-6 px-4 font-black ${s.gCol}`}>{s.grade}</td>
                  <td className="py-6 px-4">
                    <span className={`px-3 py-1 text-[10px] font-black rounded-lg uppercase ${s.sCol}`}>{s.status}</span>
                  </td>
                  <td className="py-6 px-4 text-right">
                    <button onClick={() => triggerToast(`Viewing ${s.name}'s Paper...`)} className="p-2 text-gray-300 hover:text-[#0A1128]"><Eye size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // =======================================
  // 4. CREATE EXAM VIEW (Extra Details Saisir)
  // =======================================
  const renderCreateExam = () => (
    <div className="animate-in slide-in-from-bottom-8 duration-700 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-4xl font-black text-[#0A1128] mb-2">Create New Exam</h2>
          <p className="text-gray-400 font-bold">Configure and deploy a new examination</p>
        </div>
        <button onClick={() => setExamView('home')} className="text-gray-400 hover:text-red-500 font-bold flex items-center gap-2">
          <X size={18} /> Cancel
        </button>
      </div>

      <div className="flex items-center justify-center mb-16 gap-8">
        <div className={`flex items-center gap-3 ${createStep === 1 ? 'text-indigo-600' : 'text-gray-300'}`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all ${createStep === 1 ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-100'}`}>1</div>
          <span className="font-bold text-sm">Exam Details</span>
        </div>
        <div className="w-16 h-0.5 bg-gray-100"></div>
        <div className={`flex items-center gap-3 ${createStep === 2 ? 'text-indigo-600' : 'text-gray-300'}`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all ${createStep === 2 ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-100'}`}>2</div>
          <span className="font-bold text-sm">Deployment</span>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-[32px] p-12 shadow-2xl shadow-slate-200/50">
        {createStep === 1 ? (
          <div className="space-y-10 animate-in fade-in">
            <div className="grid grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-xs font-black text-[#0A1128] uppercase ml-1 flex items-center gap-2"><Target size={14} /> Exam Title *</label>
                <input type="text" value={newExam.title} onChange={e => setNewExam({ ...newExam, title: e.target.value })} placeholder="e.g. Physics Quarter 1" className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 outline-none font-bold text-[#0A1128] focus:ring-2 ring-indigo-100" />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black text-[#0A1128] uppercase ml-1 flex items-center gap-2"><BookOpen size={14} /> Subject</label>
                <select value={newExam.subject} onChange={e => setNewExam({ ...newExam, subject: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 outline-none font-bold text-[#0A1128] appearance-none">
                  <option>Mathematics</option>
                  <option>Physics</option>
                  <option>Computer Science</option>
                  <option>English</option>
                  <option>French</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black text-[#0A1128] uppercase ml-1 flex items-center gap-2"><Layers size={14} /> Target Class</label>
                <select value={newExam.class_name} onChange={e => setNewExam({ ...newExam, class_name: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 outline-none font-bold text-[#0A1128] appearance-none">
                  <option>9 Niaz</option>
                  <option>10 Niaz</option>
                  <option>8 Liaqat</option>
                  <option>A1 Group</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black text-[#0A1128] uppercase ml-1 flex items-center gap-2"><Clock size={14} /> Duration (min)</label>
                <input type="number" value={newExam.duration} onChange={e => setNewExam({ ...newExam, duration: e.target.value })} placeholder="60" className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 outline-none font-bold text-[#0A1128]" />
              </div>
              <div className="col-span-2 space-y-3">
                <label className="text-xs font-black text-[#0A1128] uppercase ml-1 flex items-center gap-2"><Info size={14} /> Exam Instructions</label>
                <textarea value={newExam.instructions} onChange={e => setNewExam({ ...newExam, instructions: e.target.value })} rows="3" placeholder="Enter special rules or instructions for students..." className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 outline-none font-bold text-[#0A1128] resize-none"></textarea>
              </div>
            </div>
            <div className="flex justify-between items-center pt-10 border-t border-gray-50">
              <button onClick={() => setExamView('home')} className="text-gray-400 font-bold">Exit</button>
              <button onClick={() => {
                if (!newExam.title) { triggerToast("Title is required!", "system"); return; }
                setCreateStep(2);
              }} className="bg-[#0A1128] text-white px-10 py-4 rounded-2xl font-black text-sm hover:bg-indigo-950 transition-all shadow-xl shadow-indigo-100">Proceed to Upload</button>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in text-center py-10">
            <div className="border-4 border-dashed border-gray-50 rounded-[40px] p-20 mb-10 hover:border-indigo-100 transition-all cursor-pointer bg-gray-50/30 group">
              <div className="w-20 h-20 bg-white rounded-3xl shadow-xl mx-auto flex items-center justify-center text-gray-200 group-hover:text-indigo-600 transition-all mb-6">
                <Upload size={40} />
              </div>
              <p className="font-black text-[#0A1128] text-xl">Upload Paper Template (PDF)</p>
              <p className="text-gray-400 font-medium mt-2">Maximum file size: 10MB</p>
            </div>
            <div className="flex justify-between items-center pt-10 border-t border-gray-50">
              <button onClick={() => setCreateStep(1)} className="text-gray-400 font-bold">Back to Details</button>
              <button onClick={handleSaveExam} disabled={loading} className="bg-green-600 text-white px-10 py-4 rounded-2xl font-black text-sm shadow-xl shadow-green-100 hover:bg-green-700 transition-all">{loading ? 'Saving...' : 'Finalize & Schedule'}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // =======================================
  // 5. EXAM SCHEDULE VIEW (Synced Navigation)
  // =======================================
  const renderSchedule = () => (
    <div className="animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-4xl font-black text-[#0A1128]">Exam Schedule</h2>
        <div className="flex gap-4">
          <button className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-indigo-600 shadow-sm"><ChevronRight className="rotate-180" size={20} /></button>
          <button className="px-6 py-3 bg-white border border-gray-100 rounded-xl font-bold text-[#0A1128] shadow-sm">October 2026</button>
          <button className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-indigo-600 shadow-sm"><ChevronRight size={20} /></button>
          <button onClick={() => setExamView('home')} className="ml-4 bg-gray-100 p-3 rounded-xl text-gray-500 hover:bg-gray-200 transition-all">
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-[40px] p-12 shadow-xl overflow-x-auto">
        <div className="min-w-[900px]">
          <div className="grid grid-cols-6 gap-8 mb-12 text-center border-b border-gray-50 pb-8">
            <div className="flex items-center justify-center font-black text-gray-200 uppercase text-[10px] tracking-widest">Time Slot</div>
            {['MON 23', 'TUE 24', 'WED 25', 'THU 26', 'FRI 27'].map((d, i) => (
              <div key={i} className="text-[#0A1128] font-black">
                <p className="text-3xl tracking-tighter">{d.split(' ')[1]}</p>
                <p className="text-[10px] opacity-40 uppercase tracking-widest">{d.split(' ')[0]}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-6 gap-8 relative min-h-[400px]">
            <div className="space-y-24 text-gray-300 font-black text-[10px] uppercase text-center pt-6">
              <div>09:00 AM</div>
              <div>11:00 AM</div>
              <div>01:00 PM</div>
            </div>

            <div className="relative border-r border-gray-50 px-2 space-y-6">
              <div onClick={() => triggerToast("Viewing Math Mid-Term Entry")} className="bg-indigo-600 p-6 rounded-[24px] shadow-2xl shadow-indigo-200 text-white transform hover:scale-[1.02] transition-all cursor-pointer">
                <p className="text-[10px] font-black uppercase opacity-60 mb-2">9 NIAZ</p>
                <p className="font-bold text-xl mb-3">Math Mid-Term</p>
                <div className="flex items-center gap-2 text-[10px] font-bold"><Layout size={12} /> Room 12 • Mr. Adil</div>
              </div>
              <div onClick={() => triggerToast("Viewing English Quiz Entry")} className="bg-[#0A1128] p-6 rounded-[24px] text-white transform hover:scale-[1.02] transition-all cursor-pointer">
                <p className="text-[10px] font-black uppercase opacity-40 mb-2">8 LIAQAT</p>
                <p className="font-bold text-xl mb-3 text-white">English Quiz</p>
                <div className="flex items-center gap-2 text-[10px] font-bold opacity-60"><Layout size={12} /> Room 04 • Ms. Sara</div>
              </div>
            </div>

            {[1, 2, 3, 4].map((col) => (
              <div key={col} className="border-r last:border-0 border-gray-50 px-2 flex flex-col justify-center">
                <div className="h-24 w-full border-2 border-dashed border-gray-50 rounded-[24px] flex items-center justify-center text-[10px] font-black text-gray-200 uppercase tracking-widest">No Exams</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-10 h-full overflow-y-auto bg-transparent relative">

      {/* --- MODERN NOTIFICATION COMPONENT --- */}
      {notification && (
        <div className="fixed top-10 right-10 z-[100] animate-in slide-in-from-right duration-500">
          <div className="bg-[#0A1128] border-l-4 border-pink-500 rounded-2xl p-5 shadow-2xl flex items-center gap-4 min-w-[300px]">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-500">
              <Bell size={20} className="animate-pulse" />
            </div>
            <div className="flex-1">
              <p className="text-pink-500 text-[10px] font-black uppercase tracking-widest mb-1">System Notification</p>
              <p className="text-white font-bold italic text-sm">{notification.msg}</p>
            </div>
            <button onClick={() => setNotification(null)} className="text-gray-500 hover:text-white"><X size={16} /></button>
          </div>
        </div>
      )}

      {examView === 'home' && renderHome()}
      {examView === 'manage' && renderManageExams()}
      {examView === 'results' && renderResults()}
      {examView === 'create' && renderCreateExam()}
      {examView === 'schedule' && renderSchedule()}
    </div>
  );
};

export default Exams;