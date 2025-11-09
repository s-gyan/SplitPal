
import React, { useState } from 'react';
import { Settlement, User } from '../types';
import { ArrowRightIcon } from './icons/Icons';

interface SettleUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  settlementPlan: Settlement[];
  users: User[];
  onSettle: (payerId: string, payeeId: string, amount: number) => void;
}

const SettleUpModal: React.FC<SettleUpModalProps> = ({
  isOpen,
  onClose,
  settlementPlan,
  users,
  onSettle
}) => {
  if (!isOpen) return null;

  const getUserById = (id: string) => users.find(u => u.id === id);
  
  const handleRecordPayment = (from: string, to: string, amount: number) => {
    onSettle(from, to, amount);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg m-4">
        <h2 className="text-2xl font-bold mb-6">Settle Up</h2>
        
        {settlementPlan.length > 0 ? (
          <div>
            <p className="text-sm text-slate-600 mb-4">Here is the simplest way to settle all debts:</p>
            <ul className="space-y-3">
              {settlementPlan.map((settlement, index) => {
                const fromUser = getUserById(settlement.from);
                const toUser = getUserById(settlement.to);
                if (!fromUser || !toUser) return null;

                return (
                  <li key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-red-600">{fromUser.name}</span>
                      <ArrowRightIcon className="h-5 w-5 text-slate-400"/>
                      <span className="font-medium text-green-600">{toUser.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-slate-800">${settlement.amount.toFixed(2)}</span>
                      <button 
                        onClick={() => handleRecordPayment(settlement.from, settlement.to, settlement.amount)}
                        className="px-3 py-1 text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                        Record Payment
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <p className="text-slate-600 text-center py-8">Everyone is settled up. Nothing to do here!</p>
        )}

        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettleUpModal;
