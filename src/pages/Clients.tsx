
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Search, Building2, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import ClientList from '@/components/clients/ClientList';
import ClientGrid from '@/components/clients/ClientGrid';
import { clientsApi, Client as ApiClient } from '@/services/clients-api';
import { useToast } from '@/hooks/use-toast';
import { handleError } from '@/services/api';

// Extend the API client type with additional fields needed for the UI
export interface Client extends ApiClient {
  contactPerson: string;
  logo?: string;
  tags: string[];
  totalRevenue: number;
  lastActivity: string;
}

const Clients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const { data } = await clientsApi.getAll();
        
        // Transform API data to match the Client interface
        const formattedClients: Client[] = data.map(client => ({
          ...client,
          contactPerson: client.name, // Using name as contact person if not available
          logo: '',  // Default empty logo
          tags: client.status ? [client.status] : [], // Using status as a tag if available
          totalRevenue: 0, // Default value, should be fetched from another API endpoint
          lastActivity: client.updated_at, // Using updated_at as last activity date
        }));
        
        setClients(formattedClients);
      } catch (error) {
        handleError(error);
        toast({
          title: "Error loading clients",
          description: "Failed to load client data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [toast]);

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
            {loading ? (
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                <span>Loading clients...</span>
              </div>
            ) : (
              <span>{filteredClients.length} clients found</span>
            )}
          </div>
          <Tabs defaultValue="list">
            <TabsList>
              <TabsTrigger value="list">List</TabsTrigger>
              <TabsTrigger value="grid">Grid</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </Card>

      {loading ? (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <p>Loading client data...</p>
        </div>
      ) : (
        <Tabs defaultValue="list">
          <TabsContent value="list" className="mt-0">
            <ClientList clients={filteredClients} />
          </TabsContent>
          
          <TabsContent value="grid" className="mt-0">
            <ClientGrid clients={filteredClients} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Clients;
