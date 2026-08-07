import { useEffect, useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { Candidate } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Vote, CheckCircle2, AlertCircle, Loader2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Candidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [votingId, setVotingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [rules, setRules] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [candidatesData, rulesData] = await Promise.all([
          api.getCandidates(),
          api.getRules()
        ]);
        setCandidates(candidatesData);
        setRules(rulesData.rules);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleVote = async (candidateId: string) => {
    if (!user || user.hasVoted) return;

    setVotingId(candidateId);
    setMessage(null);

    try {
      await api.vote(candidateId);
      await refreshUser();
      setMessage({ type: 'success', text: 'Your vote has been cast successfully!' });
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: err.message || 'Failed to cast vote. Please try again.' });
    } finally {
      setVotingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Official Candidates</h1>
        <p className="mt-4 text-lg text-gray-600">Review the candidates and cast your valuable vote.</p>

        {user?.hasVoted && (
          <div className="mt-6 inline-flex items-center space-x-2 rounded-full bg-green-50 px-4 py-2 text-green-700 border border-green-100">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">You have already cast your vote. Thank you for participating!</span>
          </div>
        )}

        {user && !(user as any).isVerified && (
          <div className="mt-6 inline-flex items-center space-x-2 rounded-full bg-orange-50 px-4 py-2 text-orange-700 border border-orange-100">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Please verify your email to cast your vote. Check your inbox for the verification link.</span>
          </div>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`mb-8 flex items-center space-x-2 rounded-xl p-4 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                  }`}
              >
                {message.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                <span className="font-medium">{message.text}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid gap-6 sm:grid-cols-2">
            {candidates.map((candidate) => (
              <motion.div
                key={candidate._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow border-slate-200">
                  <div className="h-56 w-full bg-slate-100 relative overflow-hidden flex items-center justify-center group">
                    {candidate.image ? (
                      <img
                        src={candidate.image}
                        alt={candidate.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null; // Prevent infinite loop
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}&background=f1f5f9&color=64748b&size=512`;
                        }}
                      />
                    ) : (
                      <div className="text-6xl font-bold text-slate-200 uppercase select-none">
                        {candidate.symbol}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <span className="text-white text-xs font-medium uppercase tracking-wider">
                        Symbol: {candidate.symbol}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-orange-600 shadow-sm backdrop-blur-sm border border-orange-100 z-10">
                      {candidate.party}
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">{candidate.name}</CardTitle>
                    <CardDescription className="font-medium text-slate-500">{candidate.party}</CardDescription>
                  </CardHeader>
                  <CardContent className="grow">
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {candidate.description}
                    </p>
                  </CardContent>
                  <CardFooter className="border-t border-slate-50 bg-slate-50/50 pt-6">
                    <Button
                      className="w-full font-bold"
                      disabled={!!user?.hasVoted || !(user as any)?.isVerified || votingId === candidate._id || !user}
                      onClick={() => handleVote(candidate._id)}
                      variant={user?.hasVoted ? "outline" : "primary"}
                    >
                      {votingId === candidate._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : user?.hasVoted ? (
                        <span className="flex items-center space-x-2">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Voted</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-2">
                          <Vote className="h-4 w-4" />
                          <span>Vote Now</span>
                        </span>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24 border-orange-100 bg-orange-50/30">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg text-orange-800">
                <Info className="h-5 w-5" />
                <span>Voting Rules</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {rules.map((rule, idx) => (
                  <li key={idx} className="flex space-x-3 text-sm text-slate-700">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[10px] font-bold text-orange-600">
                      {idx + 1}
                    </span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {candidates.length === 0 && !loading && (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <Vote className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900">No candidates found</h3>
          <p className="text-gray-500 mt-2">Check back later for the official list.</p>
        </div>
      )}
    </div>
  );
}