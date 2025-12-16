import React, { useState } from 'react';
import { 
  useGetUserTicketsQuery, 
  useCreateTicketMutation, 
  type Ticket 
} from '../../features/api/TicketApi';
import { toast } from 'sonner';

// Get logged-in user from localStorage
const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
const userId = storedUser?.user_id || ""; // safe fallback

const SupportPage = () => {
  // Fetch tickets for logged-in user
  const { data: tickets, isLoading } = useGetUserTicketsQuery(userId);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Status Style Helper
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'In Progress': return 'bg-[#F57251]/20 text-[#F57251] border-[#F57251]/50';
      case 'Resolved': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'Closed': return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-[#001524] flex items-center justify-center text-[#027480] animate-pulse">
        Loading Support Center...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#001524] p-6 md:p-10 text-[#E9E6DD] pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-[#E9E6DD]">Support Center</h1>
          <p className="text-[#C4AD9D] mt-1">Track your issues and get help from our team.</p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#F57251] hover:bg-[#d65f41] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2"
        >
          <span>+</span> Create New Ticket
        </button>
      </div>

      {/* TICKETS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tickets && tickets.length > 0 ? (
          tickets.map((ticket) => (
            <TicketCard 
              key={ticket.ticket_id} 
              ticket={ticket} 
              getStatusColor={getStatusColor} 
            />
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-[#0f2434]/50 rounded-3xl border border-[#445048] border-dashed">
            <div className="text-5xl mb-4">🎫</div>
            <h3 className="text-xl font-bold text-white mb-2">No tickets yet</h3>
            <p className="text-[#C4AD9D]">You haven't raised any support requests.</p>
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      {isModalOpen && (
        <CreateTicketModal 
          onClose={() => setIsModalOpen(false)} 
          userId={userId} 
        />
      )}
    </div>
  );
};


// ------------------------ TICKET CARD ------------------------
const TicketCard = ({
  ticket,
  getStatusColor
}: { ticket: Ticket; getStatusColor: any }) => {

  const stages = ['Open', 'In Progress', 'Resolved'];
  const currentStageIndex =
    stages.indexOf(ticket.status) === -1
      ? 3
      : stages.indexOf(ticket.status);

  return (
    <div className="bg-[#0f2434] rounded-2xl p-6 border border-[#445048] hover:border-[#027480] transition-colors relative overflow-hidden group">

      {/* Priority */}
      <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-xl ${
        ticket.priority === 'High'
          ? 'bg-red-500 text-white'
          : ticket.priority === 'Medium'
          ? 'bg-yellow-500 text-black'
          : 'bg-[#445048] text-[#C4AD9D]'
      }`}>
        {ticket.priority} Priority
      </div>

      {/* Header */}
      <div className="flex justify-between items-start mb-4 mt-2">
        <div>
          <span className="text-[#027480] text-xs font-bold uppercase tracking-wider mb-1 block">
            {ticket.category}
          </span>
          <h3 className="text-xl font-bold text-white">{ticket.subject}</h3>
          <p className="text-[#C4AD9D] text-xs mt-1">
            ID: #{ticket.ticket_id} • {new Date(ticket.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="bg-[#001524] p-4 rounded-xl border border-[#445048]/50 mb-6">
        <p className="text-[#E9E6DD] text-sm leading-relaxed">
          {ticket.description}
        </p>
      </div>

      {/* Progress Visualization */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-[#C4AD9D] mb-2 uppercase tracking-wide">
          <span>Received</span>
          <span>Reviewing</span>
          <span>Resolved</span>
        </div>
        <div className="h-2 bg-[#001524] rounded-full overflow-hidden flex">
          {stages.map((stage, idx) => (
            <div
              key={stage}
              className={`flex-1 transition-all duration-500 border-r border-[#001524] last:border-0 ${
                idx <= currentStageIndex ? 'bg-[#027480]' : 'bg-[#445048]/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto">
        <span
          className={`px-3 py-1 rounded-lg text-xs font-bold border ${getStatusColor(
            ticket.status
          )}`}
        >
          {ticket.status}
        </span>

        {ticket.admin_response && (
          <div className="text-xs text-[#C4AD9D] text-right max-w-[60%]">
            <span className="text-[#F57251] font-bold">Admin Note:</span>{' '}
            {ticket.admin_response}
          </div>
        )}
      </div>
    </div>
  );
};



// ------------------------ CREATE TICKET MODAL ------------------------
const CreateTicketModal = ({
  onClose,
  userId
}: {
  onClose: () => void;
  userId: string;
}) => {

  const [createTicket, { isLoading }] = useCreateTicketMutation();
  
const [formData, setFormData] = useState<{
  subject: string;
  category: string;
  priority: "Low" | "Medium" | "High";
  description: string;
}>({
  subject: "",
  category: "General",
  priority: "Low",
  description: ""
});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTicket({ ...formData, user_id: userId }).unwrap();
      toast.success('Ticket created successfully!');
      onClose();
    } catch {
      toast.error('Failed to create ticket.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#001524] rounded-2xl w-full max-w-lg border border-[#445048] shadow-2xl">

        <div className="p-6 border-b border-[#445048] flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#E9E6DD]">New Support Ticket</h2>
          <button onClick={onClose} className="text-[#C4AD9D] hover:text-[#F57251]">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Subject */}
          <div>
            <label className="block text-[#C4AD9D] text-sm mb-1">
              Subject
            </label>
            <input
              required
              type="text"
              className="w-full bg-[#0f2434] border border-[#445048] rounded-lg p-3 text-white focus:border-[#027480] outline-none"
              placeholder="Brief summary of the issue"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
            />
          </div>

          {/* Category + Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#C4AD9D] text-sm mb-1">
                Category
              </label>
              <select
                className="w-full bg-[#0f2434] border border-[#445048] rounded-lg p-3 text-white focus:border-[#027480] outline-none"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option>General</option>
                <option>Technical Issue</option>
                <option>Billing & Payments</option>
                <option>Vehicle Condition</option>
              </select>
            </div>

            <div>
              <label className="block text-[#C4AD9D] text-sm mb-1">
                Priority
              </label>
              <select
                className="w-full bg-[#0f2434] border border-[#445048] rounded-lg p-3 text-white focus:border-[#027480] outline-none"
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value as "Low" | "Medium" | "High",})
                }
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[#C4AD9D] text-sm mb-1">
              Description
            </label>
            <textarea
              required
              rows={5}
              className="w-full bg-[#0f2434] border border-[#445048] rounded-lg p-3 text-white focus:border-[#027480] outline-none resize-none"
              placeholder="Please provide details..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-[#445048] text-[#C4AD9D] hover:bg-[#445048]/20 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 rounded-xl bg-[#F57251] hover:bg-[#d65f41] text-white font-bold shadow-lg shadow-[#F57251]/20"
            >
              {isLoading ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default SupportPage;
