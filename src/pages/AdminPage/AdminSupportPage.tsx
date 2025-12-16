import React, { useState } from 'react';
import { useGetAllTicketsQuery, useUpdateTicketStatusMutation, type Ticket } from '../../features/api/TicketApi';
import { toast } from 'sonner';

const AdminSupportPage = () => {
  const { data: tickets, isLoading, error } = useGetAllTicketsQuery();
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  // --- DERIVED STATE ---
  const filteredTickets = tickets?.filter(t => 
    filterStatus === 'All' ? true : t.status === filterStatus
  ) || [];

  const stats = {
    total: tickets?.length || 0,
    open: tickets?.filter(t => t.status === 'Open').length || 0,
    progress: tickets?.filter(t => t.status === 'In Progress').length || 0,
    resolved: tickets?.filter(t => t.status === 'Resolved').length || 0,
  };

  if (isLoading) return <div className="p-10 text-[#027480] animate-pulse">Loading Admin Console...</div>;
  if (error) return <div className="p-10 text-red-500">Failed to load tickets.</div>;

  return (
    <div className="min-h-screen bg-[#001524] p-6 text-[#E9E6DD]">
      
      {/* HEADER & STATS */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Support Tickets</h1>
        <p className="text-[#C4AD9D] mb-6">Manage and respond to user inquiries.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Tickets" value={stats.total} />
          <StatCard label="Pending" value={stats.open} color="text-yellow-500" border="border-yellow-500/30" />
          <StatCard label="In Progress" value={stats.progress} color="text-[#F57251]" border="border-[#F57251]/30" />
          <StatCard label="Resolved" value={stats.resolved} color="text-green-500" border="border-green-500/30" />
        </div>
      </div>

      {/* FILTERS & TABLE */}
      <div className="bg-[#0f2434] rounded-xl border border-[#445048] overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-[#445048] flex gap-2 overflow-x-auto">
          {['All', 'Open', 'In Progress', 'Resolved', 'Closed'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                filterStatus === status 
                  ? 'bg-[#027480] text-white' 
                  : 'bg-[#001524] text-[#C4AD9D] hover:bg-[#1a3b4b]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#001524] text-[#C4AD9D] text-xs uppercase tracking-wider">
                <th className="p-4">ID</th>
                <th className="p-4">User</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-[#445048]/50">
              {filteredTickets.map(ticket => (
                <tr key={ticket.ticket_id} className="hover:bg-[#152e40] transition-colors group">
                  <td className="p-4 text-[#445048] font-mono">#{ticket.ticket_id}</td>
                  <td className="p-4">
                    <div className="font-bold text-white">{ticket.full_name || 'Guest'}</div>
                    <div className="text-xs text-[#C4AD9D]">{ticket.email}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-[#E9E6DD] truncate max-w-[200px]">{ticket.subject}</div>
                    <div className="text-xs text-[#027480] uppercase tracking-wide">{ticket.category}</div>
                  </td>
                  <td className="p-4">
                    <PriorityBadge priority={ticket.priority} />
                  </td>
                  <td className="p-4">
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td className="p-4 text-[#C4AD9D]">
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => setSelectedTicket(ticket)}
                      className="text-[#027480] hover:text-[#F57251] font-bold text-xs uppercase border border-[#027480] hover:border-[#F57251] px-3 py-1 rounded transition-colors"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTickets.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#C4AD9D]">No tickets found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {selectedTicket && (
        <ResolveTicketModal 
          ticket={selectedTicket} 
          onClose={() => setSelectedTicket(null)} 
        />
      )}
    </div>
  );
};

// --- SUB-COMPONENTS ---

const StatCard = ({ label, value, color = 'text-white', border = 'border-[#445048]' }: any) => (
  <div className={`bg-[#0f2434] p-4 rounded-xl border ${border}`}>
    <p className="text-[#C4AD9D] text-xs uppercase mb-1">{label}</p>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
  </div>
);

const PriorityBadge = ({ priority }: { priority: string }) => {
  const colors = {
    High: 'bg-red-500/20 text-red-400',
    Medium: 'bg-yellow-500/20 text-yellow-400',
    Low: 'bg-gray-500/20 text-gray-400'
  };
  return <span className={`px-2 py-1 rounded text-xs font-bold ${colors[priority as keyof typeof colors]}`}>{priority}</span>;
};

const StatusBadge = ({ status }: { status: string }) => {
  const colors = {
    Open: 'bg-blue-500/20 text-blue-400',
    'In Progress': 'bg-[#F57251]/20 text-[#F57251]',
    Resolved: 'bg-green-500/20 text-green-400',
    Closed: 'bg-gray-500/20 text-gray-400'
  };
  return <span className={`px-2 py-1 rounded text-xs font-bold ${colors[status as keyof typeof colors]}`}>{status}</span>;
};

// --- RESOLVE MODAL COMPONENT ---

const ResolveTicketModal = ({ ticket, onClose }: { ticket: Ticket, onClose: () => void }) => {
  const [updateTicket, { isLoading }] = useUpdateTicketStatusMutation();
  
  const [formState, setFormState] = useState({
    status: ticket.status,
    admin_response: ticket.admin_response || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateTicket({ 
        ticket_id: ticket.ticket_id, 
        status: formState.status, 
        admin_response: formState.admin_response 
      }).unwrap();
      
      toast.success(`Ticket #${ticket.ticket_id} updated successfully`);
      onClose();
    } catch (err) {
      toast.error('Failed to update ticket');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#001524] rounded-2xl w-full max-w-2xl border border-[#445048] shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-[#445048] flex justify-between items-center bg-[#0f2434] rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-[#E9E6DD] flex items-center gap-2">
              Resolve Ticket #{ticket.ticket_id}
              <PriorityBadge priority={ticket.priority} />
            </h2>
            <p className="text-sm text-[#C4AD9D]">User: {ticket.full_name} ({ticket.email})</p>
          </div>
          <button onClick={onClose} className="text-[#C4AD9D] hover:text-[#F57251] text-2xl">×</button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* User Inquiry */}
          <div className="bg-[#445048]/20 p-4 rounded-xl border border-[#445048] mb-6">
             <div className="flex justify-between mb-2">
               <span className="text-[#027480] text-xs font-bold uppercase">{ticket.category}</span>
               <span className="text-[#C4AD9D] text-xs">{new Date(ticket.created_at).toLocaleString()}</span>
             </div>
             <h3 className="font-bold text-[#E9E6DD] text-lg mb-2">{ticket.subject}</h3>
             <p className="text-[#C4AD9D] leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
          </div>

          {/* Admin Action Form */}
          <form id="resolve-form" onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[#C4AD9D] text-sm mb-2 font-bold">Update Status</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Open', 'In Progress', 'Resolved', 'Closed'].map(status => (
                  <label key={status} className={`
                    cursor-pointer border rounded-lg p-3 text-center text-sm font-bold transition-all
                    ${formState.status === status 
                      ? 'bg-[#027480] border-[#027480] text-white shadow-[0_0_10px_rgba(2,116,128,0.4)]' 
                      : 'bg-[#001524] border-[#445048] text-[#C4AD9D] hover:bg-[#0f2434]'}
                  `}>
                    <input 
                      type="radio" 
                      name="status" 
                      value={status} 
                      checked={formState.status === status}
                      onChange={(e) => setFormState({...formState, status: e.target.value as 'Open' | 'In Progress' | 'Resolved' | 'Closed'})}
                      className="hidden" 
                    />
                    {status}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[#C4AD9D] text-sm mb-2 font-bold">
                Admin Response 
                <span className="text-xs font-normal ml-2 text-gray-500">(Visible to user)</span>
              </label>
              <textarea
                required
                rows={5}
                className="w-full bg-[#0f2434] border border-[#445048] rounded-xl p-4 text-[#E9E6DD] focus:border-[#027480] outline-none transition-colors"
                placeholder="Type your response or solution here..."
                value={formState.admin_response}
                onChange={(e) => setFormState({...formState, admin_response: e.target.value})}
              ></textarea>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#445048] bg-[#0f2434] rounded-b-2xl flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-3 rounded-xl border border-[#445048] text-[#C4AD9D] font-bold hover:bg-[#445048]/20">
            Cancel
          </button>
          <button 
            type="submit" 
            form="resolve-form"
            disabled={isLoading}
            className="px-6 py-3 rounded-xl bg-[#F57251] text-white font-bold hover:bg-[#d65f41] disabled:opacity-50 shadow-lg shadow-[#F57251]/20 flex items-center gap-2"
          >
            {isLoading ? 'Updating...' : 'Save Updates'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSupportPage;