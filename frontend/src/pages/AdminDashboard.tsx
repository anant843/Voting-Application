import { useEffect, useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { Candidate } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, BarChart3, Users, Vote, Loader2, X, ShieldCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'motion/react';

export default function AdminDashboard() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    party: '',
    symbol: '',
    image: '',
    description: ''
  });

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const data = await api.getCandidates();
        setCandidates(data.sort((a, b) => b.voteCount - a.voteCount));
      } catch (err) {
        console.error("Failed to fetch candidates:", err);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user?.role === 'admin') {
      fetchCandidates();
    }
  }, [authLoading, user]);

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.addCandidate(formData);
      const data = await api.getCandidates();
      setCandidates(data.sort((a, b) => b.voteCount - a.voteCount));
      setShowAddModal(false);
      setFormData({ name: '', party: '', symbol: '', image: '', description: '' });
    } catch (err) {
      console.error("Failed to add candidate:", err);
    }
  };

  const handleDeleteCandidate = async (id: string) => {
    try {
      await api.deleteCandidate(id);
      const data = await api.getCandidates();
      setCandidates(data.sort((a, b) => b.voteCount - a.voteCount));
      setDeleteConfirmId(null);
    } catch (err) {
      console.error("Failed to delete candidate:", err);
    }
  };

  const COLORS = ['#ea580c', '#16a34a', '#2563eb', '#9333ea', '#db2777', '#0891b2'];

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center mesh-bg">
        <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 mesh-bg min-h-screen">
      <div className="mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 font-display">Admin Control Center</h1>
          <p className="mt-2 text-lg text-slate-600">Real-time election monitoring and candidate management.</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} size="lg" className="flex items-center space-x-2 shadow-xl">
          <Plus className="h-5 w-5" />
          <span>Add New Candidate</span>
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Results Chart */}
        <Card className="lg:col-span-2 overflow-hidden border-none shadow-2xl">
          <CardHeader className="bg-slate-950 text-white">
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-6 w-6 text-orange-500" />
              <span>Live Voting Distribution</span>
            </CardTitle>
            <CardDescription className="text-slate-400">Visual representation of current standings</CardDescription>
          </CardHeader>
          <CardContent className="h-[450px] p-8">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={candidates} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }} 
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)', padding: '12px 16px' }}
                />
                <Bar dataKey="voteCount" radius={[10, 10, 0, 0]} barSize={40}>
                  {candidates.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="bg-gradient-to-br from-orange-600 to-amber-500 text-white border-none shadow-xl">
              <CardHeader className="pb-2">
                <CardDescription className="text-orange-100 font-bold uppercase tracking-widest text-xs">Total Candidates</CardDescription>
                <CardTitle className="text-5xl font-black">{candidates.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 text-sm text-orange-50">
                  <Users className="h-5 w-5" />
                  <span>Verified participants</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="bg-gradient-to-br from-green-600 to-emerald-500 text-white border-none shadow-xl">
              <CardHeader className="pb-2">
                <CardDescription className="text-green-100 font-bold uppercase tracking-widest text-xs">Total Votes Cast</CardDescription>
                <CardTitle className="text-5xl font-black">
                  {candidates.reduce((acc, curr) => acc + curr.voteCount, 0)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 text-sm text-green-50">
                  <Vote className="h-5 w-5" />
                  <span>Real-time participation</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <Card className="bg-slate-900 text-white border-none shadow-xl">
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-400 font-bold uppercase tracking-widest text-xs">System Status</CardDescription>
              <CardTitle className="text-2xl font-bold flex items-center space-x-2">
                <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></span>
                <span>Operational</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">All voting nodes are synchronized and secure.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Candidate List Table */}
      <Card className="mt-8 overflow-hidden">
        <CardHeader>
          <CardTitle>Candidate Management</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Candidate</th>
                <th className="px-6 py-4">Party</th>
                <th className="px-6 py-4">Votes</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {candidates.map((candidate) => (
                <tr key={candidate._id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">
                        {candidate.image ? (
                          <img src={candidate.image} alt={candidate.name} className="h-10 w-10 rounded-full" />
                        ) : (
                          <span>{candidate.name.charAt(0)}</span>
                        )}
                      </div>
                      <span className="font-medium text-gray-900">{candidate.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-700">
                      {candidate.party}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono font-semibold">{candidate.voteCount}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-gray-500 hover:text-red-600" 
                        onClick={() => setDeleteConfirmId(candidate._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Candidate Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Add New Candidate</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleAddCandidate} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <input
                    required
                    className="w-full rounded-lg border border-gray-200 p-2 text-sm focus:ring-2 focus:ring-orange-500"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Party</label>
                  <input
                    required
                    className="w-full rounded-lg border border-gray-200 p-2 text-sm focus:ring-2 focus:ring-orange-500"
                    value={formData.party}
                    onChange={(e) => setFormData({ ...formData, party: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Symbol (Emoji or Short Text)</label>
                <input
                  required
                  className="w-full rounded-lg border border-gray-200 p-2 text-sm focus:ring-2 focus:ring-orange-500"
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                  placeholder="e.g. 🪷 or Lotus"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Image URL</label>
                <input
                  className="w-full rounded-lg border border-gray-200 p-2 text-sm focus:ring-2 focus:ring-orange-500"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  className="w-full rounded-lg border border-gray-200 p-2 text-sm focus:ring-2 focus:ring-orange-500"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button type="submit" className="flex-1">Save Candidate</Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl text-center"
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <Trash2 className="h-6 w-6" />
            </div>
            <h2 className="mb-2 text-xl font-bold">Confirm Deletion</h2>
            <p className="mb-6 text-sm text-gray-500">
              Are you sure you want to delete this candidate? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                className="flex-1 bg-red-600 hover:bg-red-700 border-red-600" 
                onClick={() => handleDeleteCandidate(deleteConfirmId)}
              >
                Delete
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
