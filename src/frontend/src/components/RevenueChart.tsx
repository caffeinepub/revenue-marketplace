import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Transaction } from '../backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RevenueChartProps {
  transactions: Transaction[];
}

export default function RevenueChart({ transactions }: RevenueChartProps) {
  const chartData = transactions
    .sort((a, b) => Number(a.timestamp - b.timestamp))
    .reduce((acc, transaction) => {
      const date = new Date(Number(transaction.timestamp) / 1000000).toLocaleDateString();
      const existing = acc.find((item) => item.date === date);
      const commission = Number(transaction.commission);

      if (existing) {
        existing.revenue += commission;
      } else {
        acc.push({ date, revenue: commission });
      }
      return acc;
    }, [] as { date: string; revenue: number }[]);

  return (
    <Card className="border-border/40">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Revenue Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" />
            <XAxis dataKey="date" stroke="oklch(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="oklch(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'oklch(var(--card))',
                border: '1px solid oklch(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Line type="monotone" dataKey="revenue" stroke="oklch(var(--chart-1))" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
