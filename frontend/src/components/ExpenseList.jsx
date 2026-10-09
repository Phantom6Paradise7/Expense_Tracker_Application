import ExpenseItem from './ExpenseItem';

function ExpenseList({ expenses, onEdit, onDelete }) {
  if (expenses.length === 0) {
    return <p className="empty-text">No expenses found.</p>;
  }

  return (
    <div className="expense-list">
      {expenses.map((expense) => (
        <ExpenseItem key={expense._id} expense={expense} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}

export default ExpenseList;
