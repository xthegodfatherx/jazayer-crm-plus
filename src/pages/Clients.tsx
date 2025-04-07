
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Search, Building2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ClientList from '@/components/clients/ClientList';
import ClientGrid from '@/components/clients/ClientGrid';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  logo?: string;
  status: 'active' | 'inactive' | 'lead';
  address: string;
  contactPerson: string;
  tags: string[];
  totalRevenue: number;
  lastActivity: string;
}

const Clients: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const clients: Client[] = [
    {
      id: '1',
      name: 'Sonatrach',
      email: 'contact@sonatrach.dz',
      phone: '+213 21 54 70 00',
      company: 'Sonatrach',
      logo: '',
      status: 'active',
      address: 'Avenue du 1er Novembre, Hydra, Alger',
      contactPerson: 'Mohammed Hakimi',
      tags: ['Energy', 'Oil & Gas'],
      totalRevenue: 250000,
      lastActivity: '2025-04-05',
    },
    {
      id: '2',
      name: 'Djezzy',
      email: 'business@djezzy.dz',
      phone: '+213 21 54 30 00',
      company: 'Djezzy',
      logo: '',
      status: 'active',
      address: 'Lotissement du 11 Décembre 1960, Lot 40, Bab Ezzouar, Alger',
      contactPerson: 'Amina Khelifi',
      tags: ['Telecom', 'Technology'],
      totalRevenue: 180000,
      lastActivity: '2025-04-01',
    },
    {
      id: '3',
      name: 'Air Algérie',
      email: 'commercial@airalgerie.dz',
      phone: '+213 21 98 63 00',
      company: 'Air Algérie',
      logo: '',
      status: 'active',
      address: '1 Place Maurice Audin, Alger',
      contactPerson: 'Karim Belhadj',
      tags: ['Transportation', 'Travel'],
      totalRevenue: 120000,
      lastActivity: '2025-03-28',
    },
    {
      id: '4',
      name: 'Ooredoo Algérie',
      email: 'business@ooredoo.dz',
      phone: '+213 23 04 82 82',
      company: 'Ooredoo Algérie',
      logo: '',
      status: 'active',
      address: 'Lot 07/05, Les Pins, Hydra, Alger',
      contactPerson: 'Leila Benaouda',
      tags: ['Telecom', 'Technology'],
      totalRevenue: 150000,
      lastActivity: '2025-03-25',
    },
    {
      id: '5',
      name: 'Cevital',
      email: 'info@cevital.com',
      phone: '+213 34 81 19 81',
      company: 'Cevital',
      logo: '',
      status: 'lead',
      address: 'Route nationale n° 12, Bejaia',
      contactPerson: 'Salim Othmani',
      tags: ['Food', 'Agriculture'],
      totalRevenue: 0,
      lastActivity: '2025-04-03',
    },
    {
      id: '6',
      name: 'Mobilis',
      email: 'commercial@mobilis.dz',
      phone: '+213 21 82 52 82',
      company: 'Mobilis',
      logo: '',
      status: 'inactive',
      address: 'Quartier d'Affaires d'Alger îlot 05, lots 27, 28, 29 Bab Ezzouar, Alger',
      contactPerson: 'Ahmed Zeroual',
      tags: ['Telecom', 'Technology'],
      totalRevenue: 90000,
      lastActivity: '2025-02-15',
    },
  ];

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Clients</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search clients..." 
            className="pl-8" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="h-5 w-5" />
            <span>{filteredClients.length} clients found</span>
          </div>
          <Tabs defaultValue="list">
            <TabsList>
              <TabsTrigger value="list">List</TabsTrigger>
              <TabsTrigger value="grid">Grid</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </Card>

      <TabsContent value="list" className="mt-0">
        <ClientList clients={filteredClients} />
      </TabsContent>
      
      <TabsContent value="grid" className="mt-0">
        <ClientGrid clients={filteredClients} />
      </TabsContent>
    </div>
  );
};

export default Clients;
