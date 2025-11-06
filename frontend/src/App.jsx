import React from 'react';
import './styles/App.css';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import Summary from './components/Summary';

function App() {
  return (
    <div className="app-container">
      <header>
        <h1>Expense Tracker</h1>
      </header>

      <main>
        <section className="left">
          <TransactionForm />
          <Summary />
        </section>

        <section className="right">
          <TransactionList />
        </section>
      </main>
    </div>
  );
}

export default App;
