
import React, { useState } from 'react';
import { Group, User, Expense, Balance, Settlement } from '../types';
import ExpenseFormModal from './ExpenseFormModal';
import SettleUpModal from './SettleUpModal';
import Avatar from './Avatar';
import { PlusIcon, TrashIcon, DollarSignIcon, ArrowRightIcon } from './icons/Icons';

interface GroupDashboardProps {
  group: Group;
  users: User[];
  balances: Balance[];
  settlementPlan: Settlement[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onDeleteExpense: (expenseId: string) => void;
  onSettleDebts: (payerId: string, payeeId: string, amount: number) => void;
}

const GroupDashboard: React.FC<GroupDashboardProps> = ({
  group,
  users,
  balances,
  settlementPlan,
  onAddExpense,
  onDeleteExpense,
  onSettleDebts,
}) => {
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isSettleUpModalOpen, setIsSettleUpModalOpen] = useState(false);

  const groupUsers = users.filter(u => group.members.includes(u.id));

  const getUserById = (id: string) => users.find(u => u.id === id);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">{group.name}</h2>
          <div className="flex items-center space-x-2 mt-2">
            {groupUsers.map(user => <Avatar key={user.id} user={user} />)}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSettleUpModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
          >
            <DollarSignIcon className="h-5 w-5"/>
            Settle Up
          </button>
          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="h-5 w-5"/>
            Add Expense
          </button>
        </div>
      </div>

      {/* Balances */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Balances</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {balances.map(({ userId, amount }) => {
            const user = getUserById(userId);
            if (!user) return null;
            const isOwed = amount > 0;
            return (
              <div key={userId} className="p-4 rounded-md bg-slate-50 border border-slate-200">
                <p className="font-medium text-slate-800">{user.name}</p>
                {amount === 0 ? (
                  <p className="text-slate-500">Settled up</p>
                ) : (
                  <p className={`font-bold ${isOwed ? 'text-green-600' : 'text-red-600'}`}>
                    {isOwed ? 'Is owed' : 'Owes'} ${Math.abs(amount).toFixed(2)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Expenses</h3>
        <ul className="divide-y divide-slate-200">
          {group.expenses.length > 0 ? group.expenses.map(expense => {
            const payer = getUserById(expense.paidBy);
            return (
              <li key={expense.id} className="py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{expense.description}</p>
                  <p className="text-sm text-slate-500">
                    {payer?.name} paid ${expense.amount.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-slate-700">${expense.amount.toFixed(2)}</span>
                  {!expense.isSettlement && <button onClick={() => onDeleteExpense(expense.id)} className="text-slate-400 hover:text-red-600">
                    <TrashIcon className="h-5 w-5" />
                  </button>}
                </div>
              </li>
            );
          }).reverse() : (
            <p className="text-slate-500 text-center py-8">No expenses added yet.</p>
          )}
        </ul>
      </div>

      {isExpenseModalOpen && (
        <ExpenseFormModal
          users={groupUsers}
          onClose={() => setIsExpenseModalOpen(false)}
          onSave={onAddExpense}
        />
      )}

      {isSettleUpModalOpen && (
        <SettleUpModal
          isOpen={isSettleUpModalOpen}
          onClose={() => setIsSettleUpModalOpen(false)}
          settlementPlan={settlementPlan}
          users={users}
          onSettle={onSettleDebts}
        />
      )}
    </div>
  );
};

export default GroupDashboard;
