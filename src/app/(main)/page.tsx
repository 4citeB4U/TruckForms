import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, FilePlus2 } from 'lucide-react';
import { ALL_FORMS, QUICK_ACTIONS } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Welcome to TruckForms
        </h1>
        <p className="text-muted-foreground">
          Your central hub for managing logistics and trucking documentation.
        </p>
      </div>

      <section>
        <h2 className="font-headline text-2xl font-semibold tracking-tight mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {QUICK_ACTIONS.map((action) => (
             <Card key={action.title} className="hover:border-primary transition-colors">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">{action.title}</CardTitle>
                <action.icon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{action.description}</p>
                <Button asChild size="sm">
                  <Link href={action.href}>
                    Start Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-headline text-2xl font-semibold tracking-tight mb-4">All Forms</h2>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {ALL_FORMS.map((form, index) => (
                <div key={index} className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <form.icon className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-semibold">{form.title}</h3>
                      <p className="text-sm text-muted-foreground">{form.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {form.role && <Badge variant="secondary">{form.role}</Badge>}
                    <Button asChild variant="outline" size="sm">
                      <Link href={form.href}>
                        Open Form <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
