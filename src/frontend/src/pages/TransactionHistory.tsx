import { useGetMyTransactions } from '../hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { History, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '../lib/utils';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import IconDisplay from '../components/IconDisplay';

export default function TransactionHistory() {
  const { data: transactions, isLoading } = useGetMyTransactions();
  const { identity } = useInternetIdentity();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-card/30">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <IconDisplay className="w-12 h-12" />
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gold to-emerald bg-clip-text text-transparent">
              Transaction History
            </h1>
            <p className="text-muted-foreground">View all your purchases and sales</p>
          </div>
        </div>

        <Card className="border-border/40">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : transactions && transactions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Counterparty</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Commission</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => {
                    const isBuyer = identity && transaction.buyer.toString() === identity.getPrincipal().toString();
                    const date = new Date(Number(transaction.timestamp) / 1000000).toLocaleDateString();
                    const counterparty = isBuyer ? transaction.seller.toString() : transaction.buyer.toString();

                    return (
                      <TableRow key={transaction.id.toString()}>
                        <TableCell>
                          <Badge variant={isBuyer ? 'destructive' : 'default'} className="gap-1">
                            {isBuyer ? (
                              <>
                                <ArrowUpRight className="w-3 h-3" />
                                Purchase
                              </>
                            ) : (
                              <>
                                <ArrowDownLeft className="w-3 h-3" />
                                Sale
                              </>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{date}</TableCell>
                        <TableCell className="font-mono text-sm">{counterparty.slice(0, 12)}...</TableCell>
                        <TableCell className="text-right font-semibold">{formatPrice(transaction.amount)}</TableCell>
                        <TableCell className="text-right text-muted-foreground">{formatPrice(transaction.commission)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <History className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No transactions yet</h3>
                <p className="text-muted-foreground">Your transaction history will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
