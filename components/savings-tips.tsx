export function SavingsTips() {
  const tips = [
    {
      id: 1,
      tip: "You spent 20% more on dining this month compared to last month. Consider cooking at home more often to save money.",
      category: "Dining",
    },
    {
      id: 2,
      tip: "Your utility bills are higher than average. Check for energy-saving opportunities like unplugging devices when not in use.",
      category: "Utilities",
    },
    {
      id: 3,
      tip: "You could save $25 monthly by switching to a different streaming service bundle instead of multiple subscriptions.",
      category: "Entertainment",
    },
    {
      id: 4,
      tip: "Based on your spending patterns, setting up automatic transfers of $100 weekly to savings would help you reach your goals faster.",
      category: "Savings",
    },
  ]

  return (
    <div className="space-y-4">
      {tips.map((tip) => (
        <div key={tip.id} className="rounded-lg border p-3">
          <div className="font-medium text-sm">{tip.category}</div>
          <p className="text-sm mt-1">{tip.tip}</p>
        </div>
      ))}
    </div>
  )
}
