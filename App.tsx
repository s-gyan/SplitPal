import React, { useState, useMemo, useCallback } from 'react';
import { Group, User, Expense, SplitType } from './types';
import Header from './components/Header';
import GroupDashboard from './components/GroupDashboard';
import { useExpenseCalculator } from './hooks/useExpenseCalculator';
import { PlusIcon, UsersIcon } from './components/icons/Icons';

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    { id: 'user-1', name: 'Alice', avatarColor: 'bg-red-400' },
    { id: 'user-2', name: 'Bob', avatarColor: 'bg-blue-400' },
    { id: 'user-3', name: 'Carol', avatarColor: 'bg-green-400' },
    { id: 'user-4', name: 'Dan', avatarColor: 'bg-yellow-400' },
  ]);

  const [groups, setGroups] = useState<Group[]>([
    {
      id: 'group-1',
      name: 'Thailand Trip 2024',
      members: ['user-1', 'user-2', 'user-3'],
      expenses: [
        {
          id: 'exp-1',
          description: 'Dinner at The Oasis',
          amount: 60,
          paidBy: 'user-1',
          date: new Date().toISOString(),
          split: {
            type: SplitType.Equally,
            participants: ['user-1', 'user-2', 'user-3'],
          },
        },
        {
          id: 'exp-2',
          description: 'Snorkeling Gear',
          amount: 40,
          paidBy: 'user-2',
          date: new Date().toISOString(),
          split: {
            type: SplitType.Equally,
            participants: ['user-2', 'user-3'],
          },
        },
      ],
    },
  ]);
  const [activeGroupId, setActiveGroupId] = useState<string | null>('group-1');

  const activeGroup = useMemo(() => groups.find(g => g.id === activeGroupId), [groups, activeGroupId]);

  const groupUsers = useMemo(() => {
    if (!activeGroup) return [];
    return users.filter(u => activeGroup.members.includes(u.id));
  }, [activeGroup, users]);

  const { balances, settlementPlan } = useExpenseCalculator(activeGroup?.expenses || [], groupUsers);

  const handleAddExpense = useCallback((expense: Omit<Expense, 'id'>) => {
    setGroups(prevGroups =>
      prevGroups.map(group =>
        group.id === activeGroupId
          ? {
              ...group,
              expenses: [...group.expenses, { ...expense, id: `exp-${Date.now()}` }],
            }
          : group
      )
    );
  }, [activeGroupId]);

  const handleDeleteExpense = useCallback((expenseId: string) => {
    setGroups(prevGroups =>
      prevGroups.map(group =>
        group.id === activeGroupId
          ? {
              ...group,
              expenses: group.expenses.filter(e => e.id !== expenseId),
            }
          : group
      )
    );
  }, [activeGroupId]);

  const handleSettleDebts = useCallback((payerId: string, payeeId: string, amount: number) => {
     const settlementExpense: Omit<Expense, 'id'> = {
        description: `Settlement: ${users.find(u=>u.id === payerId)?.name} paid ${users.find(u=>u.id === payeeId)?.name}`,
        amount,
        paidBy: payerId,
        date: new Date().toISOString(),
        split: {
            type: SplitType.Unequally,
            participants: [{userId: payeeId, amount: amount}],
        },
        isSettlement: true,
    };
    handleAddExpense(settlementExpense);
  }, [handleAddExpense, users]);
  
  const handleCreateGroup = () => {
    const newGroupName = prompt("Enter new group name:");
    if (newGroupName) {
      const newGroup: Group = {
        id: `group-${Date.now()}`,
        name: newGroupName,
        members: [users[0].id],
        expenses: [],
      };
      setGroups(prev => [...prev, newGroup]);
      setActiveGroupId(newGroup.id);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="col-span-12 lg:col-span-3">
            <div className="bg-gray-800 rounded-lg shadow p-4 sticky top-8">
              <h2 className="text-lg font-bold text-slate-100 mb-4">Groups</h2>
              <ul>
                {groups.map(group => (
                  <li key={group.id}>
                    <button
                      onClick={() => setActiveGroupId(group.id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-3 ${
                        activeGroupId === group.id
                          ? 'bg-blue-900/50 text-blue-300'
                          : 'text-slate-400 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      <UsersIcon className="h-5 w-5"/>
                      {group.name}
                    </button>
                  </li>
                ))}
              </ul>
              <button
                onClick={handleCreateGroup}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="h-5 w-5"/>
                Create Group
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="col-span-12 lg:col-span-9">
            {activeGroup ? (
              <GroupDashboard
                group={activeGroup}
                users={users}
                balances={balances}
                settlementPlan={settlementPlan}
                onAddExpense={handleAddExpense}
                onDeleteExpense={handleDeleteExpense}
                onSettleDebts={handleSettleDebts}
              />
            ) : (
              <div className="text-center py-20 bg-gray-800 rounded-lg shadow">
                <h2 className="text-2xl font-semibold text-slate-200">Welcome to SplitPal!</h2>
                <p className="mt-2 text-slate-400">Select a group or create a new one to start splitting expenses.</p>
                 <button
                    onClick={handleCreateGroup}
                    className="mt-6 inline-flex items-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <PlusIcon className="h-5 w-5"/>
                    Create Your First Group
                  </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;