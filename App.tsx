
import React, { useState, useEffect, useCallback } from 'react';
import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { User, BankAccount, Transaction, Category, ViewType } from './types';
import { DEFAULT_CATEGORIES, DEMO_ACCOUNTS, DEMO_TRANSACTIONS } from './constants';
import Auth from './components/Auth';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Accounts from './components/Accounts';
import Transactions from './components/Transactions';
import Reports from './components/Reports';
import FinancialGashapon from './components/FinancialGashapon';
import AIConsultant from './components/AIConsultant';
import Profile from './components/Profile';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewType>('dashboard');
  const [isDemo, setIsDemo] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);

  const storageKey = isDemo ? 'fingemini_demo_data' : `fingemini_${user?.uid}`;

  // 載入資料
  const loadData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);

    if (!isDemo && db) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setAccounts(data.accounts || []);
          setTransactions(data.transactions || []);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.error("Firestore loading error:", err);
      }
    }

    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setAccounts(parsed.accounts || []);
      setTransactions(parsed.transactions || []);
    } else if (isDemo) {
      setAccounts(DEMO_ACCOUNTS);
      setTransactions(DEMO_TRANSACTIONS);
    } else {
      setAccounts([]);
      setTransactions([]);
    }
    setIsLoading(false);
  }, [isDemo, user, storageKey]);

  useEffect(() => { loadData(); }, [loadData]);

  // 自動存檔機制
  useEffect(() => {
    if (!user || isLoading) return;

    const syncData = async () => {
      localStorage.setItem(storageKey, JSON.stringify({ accounts, transactions }));
      
      if (!isDemo && db) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          await setDoc(userDocRef, {
            accounts,
            transactions,
            lastUpdated: new Date().toISOString()
          }, { merge: true });
        } catch (err) {
          console.error("Firestore sync error:", err);
        }
      }
    };

    const timeoutId = setTimeout(syncData, 1000);
    return () => clearTimeout(timeoutId);
  }, [accounts, transactions, user, isDemo, storageKey, isLoading]);

  const handleLogin = (u: User, demo: boolean) => {
    setUser(u);
    setIsDemo(demo);
  };

  const handleLogout = () => {
    setUser(null);
    setView('dashboard');
    localStorage.removeItem('fingemini_demo_data');
  };

  if (!user) return <Auth onLogin={handleLogin} />;

  const renderView = () => {
    if (isLoading) return <div className="h-96 flex items-center justify-center"><i className="fas fa-circle-notch fa-spin text-4xl text-indigo-600"></i></div>;

    switch (view) {
      case 'dashboard':
        return <Dashboard 
          accounts={accounts} 
          transactions={transactions} 
          categories={categories}
          onNavigateToTips={() => setView('tips')}
          onNavigateToAI={() => setView('ai')}
        />;
      case 'accounts':
        return <Accounts accounts={accounts} setAccounts={setAccounts} />;
      case 'transactions':
        return <Transactions transactions={transactions} setTransactions={setTransactions} accounts={accounts} categories={categories} />;
      case 'reports':
        return <Reports accounts={accounts} transactions={transactions} categories={categories} />;
      case 'tips':
        return <FinancialGashapon />;
      case 'ai':
        return <AIConsultant accounts={accounts} transactions={transactions} categories={categories} />;
      case 'profile':
        return <Profile user={user} isDemo={isDemo} onUpdateUser={setUser} />;
      default:
        return <Dashboard accounts={accounts} transactions={transactions} categories={categories} />;
    }
  };

  return (
    <Layout view={view} setView={setView} onLogout={handleLogout} user={user} isDemo={isDemo}>
      {renderView()}
    </Layout>
  );
};

export default App;
