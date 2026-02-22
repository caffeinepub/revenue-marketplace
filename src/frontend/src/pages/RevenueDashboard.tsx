import { useGetTotalCommission, useGetAllTransactions } from '../hooks/useQueries';
import MetricCard from '../components/MetricCard';
import RevenueChart from '../components/RevenueChart';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, TrendingUp, Users, Activity } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '../lib/utils';

export default function RevenueDashboard() {
  const { data: totalCommission, isLoading: commissionLoading } = useGetTotalCommission();
  const { data: transactions, isLoading: transactionsLoading } = useGetAllTransactions();

  const uniqueBuyers = new Set(transactions?.map((t) => t.buyer.toString())).size;
  const uniqueSellers = new Set(transactions?.map((t) => t.seller.toString())).size;
  const totalUsers = uniqueBuyers + uniqueSellers;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-card/30">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-gold to-emerald bg-clip-text text-transparent">
              Revenue Dashboard
            </span>
          </h1>
          <p className="text-muted-foreground">Track your platform's performance and earnings</p>
        </div>

        {/* Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {commissionLoading ? (
            <Skeleton className="h-32" />
          ) : (
            <MetricCard
              label="Total Revenue"
              value={formatPrice(totalCommission || BigInt(0))}
              icon={DollarSign}
              accentColor="gold"
            />
          )}
          {transactionsLoading ? (
            <Skeleton className="h-32" />
          ) : (
            <MetricCard
              label="Total Transactions"
              value={transactions?.length || 0}
              icon={Activity}
              accentColor="emerald"
            />
          )}
          {transactionsLoading ? (
            <Skeleton className="h-32" />
          ) : (
            <MetricCard
              label="Active Users"
              value={totalUsers}
              icon={Users}
              accentColor="gold"
            />
          )}
          <MetricCard
            label="Growth Rate"
            value="+12.5%"
            icon={TrendingUp}
            trend="vs last month"
            accentColor="emerald"
          />
        </div>

        {/* Chart */}
        {transactionsLoading ? (
          <Skeleton className="h-80 mb-12" />
        ) : transactions && transactions.length > 0 ? (
          <div className="mb-12">
            <RevenueChart transactions={transactions} />
          </div>
        ) : null}

        {/* Recent Transactions */}
        <Card className="border-border/40">
          <CardContent className="p-0">
            <div className="p-6 border-b border-border/40">
              <h2 className="text-xl font-semibold">Recent Transactions</h2>
            </div>
            {transactionsLoading ? (
              <div className="p-6 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : transactions && transactions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Buyer</TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Commission</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.slice(0, 10).map((transaction) => {
                    const date = new Date(Number(transaction.timestamp) / 1000000).toLocaleDateString();
                    return (
                      <TableRow key={transaction.id.toString()}>
                        <TableCell className="font-mono text-sm">#{transaction.id.toString()}</TableCell>
                        <TableCell className="text-muted-foreground">{date}</TableCell>
                        <TableCell className="font-mono text-sm">{transaction.buyer.toString().slice(0, 12)}...</TableCell>
                        <TableCell className="font-mono text-sm">{transaction.seller.toString().slice(0, 12)}...</TableCell>
                        <TableCell className="text-right font-semibold">{formatPrice(transaction.amount)}</TableCell>
                        <TableCell className="text-right text-emerald font-semibold">{formatPrice(transaction.commission)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="p-12 text-center text-muted-foreground">
                No transactions yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
