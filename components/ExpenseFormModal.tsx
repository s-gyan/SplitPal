import React, { useState } from 'react';
import { User, Expense, SplitType } from '../types';
import { DollarSignIcon } from './icons/Icons';

interface ExpenseFormModalProps {
  users: User[];
  onClose: () => void;
  onSave: (expense: Omit<Expense, 'id'>) => void;
}

const ExpenseFormModal: React.FC<ExpenseFormModalProps> = ({ users, onClose, onSave }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [paidBy, setPaidBy] = useState(users[0]?.id || '');
  const [splitType, setSplitType] = useState<SplitType>(SplitType.Equally);
  const [participants, setParticipants] = useState<string[]>(users.map(u => u.id));

  const handleSave = () => {
    if (!description || !amount || !paidBy || participants.length === 0) {
      alert('Please fill out all required fields.');
      return;
    }
    const expense: Omit<Expense, 'id'> = {
      description,
      amount: Number(amount),
      paidBy,
      date: new Date().toISOString(),
      split: {
        type: splitType,
        participants: participants,
      },
    };
    onSave(expense);
    onClose();
  };
  
  const toggleParticipant = (userId: string) => {
    setParticipants(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md m-4 text-slate-200">
        <h2 className="text-2xl font-bold mb-6 text-slate-100">Add Expense</h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400"
            />
          </div>
          <div className="relative">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-300">Amount</label>
            <div className="absolute inset-y-0 left-0 top-6 pl-3 flex items-center pointer-events-none">
              <DollarSignIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value ? parseFloat(e.target.value) : '')}
              className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 pl-10 pr-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400"
              placeholder="0.00"
            />
          </div>
          <div>
            <label htmlFor="paidBy" className="block text-sm font-medium text-gray-300">Paid by</label>
            <select
              id="paidBy"
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
            >
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>
          <div>
            <p className="block text-sm font-medium text-gray-300 mb-2">Split between</p>
            <div className="grid grid-cols-2 gap-2">
                {users.map(user => (
                    <label key={user.id} className={`flex items-center space-x-2 p-2 rounded-md border cursor-pointer ${participants.includes(user.id) ? 'bg-blue-900/50 border-blue-700' : 'bg-gray-700 border-gray-600'}`}>
                        <input
                            type="checkbox"
                            checked={participants.includes(user.id)}
                            onChange={() => toggleParticipant(user.id)}
                            className="h-4 w-4 text-blue-600 border-gray-500 rounded focus:ring-blue-500 bg-gray-600 focus:ring-offset-gray-800"
                        />
                        <span className="text-slate-200">{user.name}</span>
                    </label>
                ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-600 text-sm font-medium rounded-md shadow-sm text-slate-300 bg-transparent hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Save Expense
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseFormModal;
