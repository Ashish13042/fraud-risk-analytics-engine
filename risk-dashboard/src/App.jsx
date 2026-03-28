import { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/transactions');
        const sortedData = response.data.sort((a, b) => new Date(b.createAt) - new Date(a.createAt));
        setTransactions(sortedData)
        setLoading(false);
      } catch (err) {
        setError('Failed to Connect!');
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const total = transactions.length;
  const blocked = transactions.filter(t => t.status === 'BLOCKED').length;
  const flagged = transactions.filter(t => t.status === 'FLAGGED').length;
  const approved = transactions.filter(t => t.status === 'APPROVED').length;

  if (loading) return <div className="flex h-screen items-center justify-center text-xl font-semibold text-gray-600">Loading Risk Data...</div>;
  if (error) return <div className="flex h-screen justify-center text-xl font-semibold text-red-600">{error}</div>;

  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='mx-auto max-w-7xl'>

        {/*HEADER*/}
        <div className='mb-8 flex items-center justify-between'>
          <div>
            <h1>Risk Analytics</h1>
            <p>Real-time transaction monitoring and risk detection</p>
          </div>
          <button onClick={() => window.location.reload()} className='rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition'>
            Refresh Data
          </button>
        </div>
        {/*Stats Overview*/}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
          <StatCard title="Total Transactions" value={total} icon={Activity} color="text-blue-600" />
          <StatCard title="Blocked" value={blocked} icon={ShieldAlert} color="text-red-600" />
          <StatCard title="Flagged" value={flagged} icon={AlertTriangle} color="text-yellow-600" />
          <StatCard title="Approved" value={approved} icon={ShieldCheck} color="text-green-600" />
        </div>

        {/*Data Table*/}
        <div className="overflow-hidden rounded-lg border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Merchant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.id.substring(0, 8)}...</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.userId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.merchantCategory}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`font-bold ${tx.riskScore >= 80 ? 'text-red-600' : tx.riskScore >= 50 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {tx.riskScore}/100
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <StatusBadge status={tx.status} />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {transactions.length === 0 && (
            <div className="px-6 py-12 text-center text-gray-500">
              <Activity className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No Transactions</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding transactions to the system.</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="flex items-center rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mr-4 rounded-full bg-gray-50 p-3">{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

// Reusable Component for Status Badges
function StatusBadge({ status }) {
  const styles = {
    APPROVED: 'bg-green-100 text-green-800',
    FLAGGED: 'bg-yellow-100 text-yellow-800',
    BLOCKED: 'bg-red-100 text-red-800',
    PENDING_REVIEW: 'bg-gray-100 text-gray-800'
  };

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[status] || styles.PENDING_REVIEW}`}>
      {status}
    </span>
  );
}

export default App;