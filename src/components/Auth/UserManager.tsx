
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

type NameUser = {
  id: string;
  name: string;
  created_at: string;
}

const UserManager = () => {
  const [users, setUsers] = useState<NameUser[]>([]);
  const [newUserName, setNewUserName] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('name_users')
        .select('*')
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      toast.error('Error fetching users');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newUserName.trim().length < 2) {
      toast.error('Name must be at least 2 characters');
      return;
    }
    
    try {
      setLoading(true);
      
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('name_users')
        .select('*')
        .eq('name', newUserName)
        .single();
        
      if (existingUser) {
        toast.error('This name is already taken');
        return;
      }
      
      // Add new user
      const { error } = await supabase
        .from('name_users')
        .insert([{ name: newUserName }]);
        
      if (error) throw error;
      
      toast.success(`User "${newUserName}" added successfully`);
      setNewUserName('');
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || 'Error adding user');
      console.error('Error adding user:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"?`)) {
      return;
    }
    
    try {
      setLoading(true);
      const { error } = await supabase
        .from('name_users')
        .delete()
        .eq('id', userId);
        
      if (error) throw error;
      
      toast.success(`User "${userName}" deleted successfully`);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || 'Error deleting user');
      console.error('Error deleting user:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Users</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddUser} className="flex gap-2 mb-6">
          <Input
            placeholder="Enter user name"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            disabled={loading}
          />
          <Button type="submit" disabled={loading}>Add User</Button>
        </form>
        
        <div className="border rounded-lg">
          {users.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No users found</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Created At</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{new Date(user.created_at).toLocaleDateString()}</td>
                    <td className="p-3 text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        disabled={loading}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserManager;
