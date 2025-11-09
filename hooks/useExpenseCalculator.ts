
import { useMemo } from 'react';
import { Expense, User, Balance, Settlement, SplitType } from '../types';

export const useExpenseCalculator = (expenses: Expense[], users: User[]): { balances: Balance[], settlementPlan: Settlement[] } => {
  const balances = useMemo(() => {
    const userBalances: { [key: string]: number } = {};
    users.forEach(user => {
      userBalances[user.id] = 0;
    });

    expenses.forEach(expense => {
      // Payer gets credited
      userBalances[expense.paidBy] += expense.amount;

      // Participants get debited
      if (expense.split.type === SplitType.Equally) {
        const participants = expense.split.participants as string[];
        const share = expense.amount / participants.length;
        participants.forEach(userId => {
          userBalances[userId] -= share;
        });
      } else if (expense.split.type === SplitType.Unequally) {
        const participants = expense.split.participants as { userId: string, amount: number }[];
        participants.forEach(p => {
            userBalances[p.userId] -= p.amount;
        })
      }
      // Note: Percentage split not implemented in form, but logic could be added here.
    });

    return users.map(user => ({
      userId: user.id,
      amount: userBalances[user.id]
    })).sort((a,b) => b.amount - a.amount);
  }, [expenses, users]);

  const settlementPlan = useMemo(() => {
    const settlements: Settlement[] = [];
    const balancesCopy = JSON.parse(JSON.stringify(balances.filter(b => Math.abs(b.amount) > 0.01)));

    let debtors = balancesCopy.filter((b: Balance) => b.amount < 0).sort((a: Balance, b: Balance) => a.amount - b.amount);
    let creditors = balancesCopy.filter((b: Balance) => b.amount > 0).sort((a: Balance, b: Balance) => b.amount - a.amount);
    
    while (debtors.length > 0 && creditors.length > 0) {
      const debtor = debtors[0];
      const creditor = creditors[0];
      
      const amountToSettle = Math.min(Math.abs(debtor.amount), creditor.amount);

      settlements.push({
        from: debtor.userId,
        to: creditor.userId,
        amount: amountToSettle,
      });

      debtor.amount += amountToSettle;
      creditor.amount -= amountToSettle;

      if (Math.abs(debtor.amount) < 0.01) {
        debtors.shift();
      }
      if (creditor.amount < 0.01) {
        creditors.shift();
      }
    }

    return settlements;
  }, [balances]);

  return { balances, settlementPlan };
};
