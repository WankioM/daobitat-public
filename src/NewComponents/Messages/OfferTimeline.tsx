import React from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { 
  FaCircle, 
  FaCheck, 
  FaRegClock, 
  FaExclamationCircle, 
  FaPencilAlt, 
  FaReply, 
  FaHandshake, 
  FaMoneyBillWave 
} from 'react-icons/fa';

interface TimelineEvent {
  type: string;
  date: Date | string;
  actor: string;
  status: 'completed' | 'pending' | 'failed';
  offerId: string;
  data?: any;
}

interface ImprovedOfferTimelineProps {
  history: TimelineEvent[];
  userId: string;
  isExpanded: boolean;
}

const OfferTimeline: React.FC<ImprovedOfferTimelineProps> = ({ 
  history, 
  userId, 
  isExpanded 
}) => {
  if (!history || history.length === 0 || !isExpanded) {
    return null;
  }

  const getStatusIcon = (event: TimelineEvent) => {
    const baseClass = "flex-shrink-0 w-5 h-5";
    
    switch (event.status) {
      case 'completed':
        return <FaCheck className={`${baseClass} text-green-500`} />;
      case 'pending':
        return <FaRegClock className={`${baseClass} text-yellow-500`} />;
      case 'failed':
        return <FaExclamationCircle className={`${baseClass} text-red-500`} />;
      default:
        return <FaCircle className={`${baseClass} text-gray-300`} />;
    }
  };

  const getEventIcon = (event: TimelineEvent) => {
    const baseClass = "flex-shrink-0 w-5 h-5";
    
    switch (event.type) {
      case 'created':
        return <FaPencilAlt className={`${baseClass} text-blue-500`} />;
      case 'counter-offered':
        return <FaReply className={`${baseClass} text-purple-500`} />;
      case 'tenant-accepted':
      case 'owner-accepted':
        return <FaHandshake className={`${baseClass} text-green-500`} />;
      case 'payment-pending':
      case 'payment-completed':
        return <FaMoneyBillWave className={`${baseClass} text-emerald-500`} />;
      default:
        return <FaCircle className={`${baseClass} text-gray-300`} />;
    }
  };

  const getEventTitle = (event: TimelineEvent) => {
    const isCurrentUser = event.actor === userId;
    const actorText = isCurrentUser ? 'You' : 'Other party';

    switch (event.type) {
      case 'created':
        return `${actorText} created offer`;
      case 'counter-offered':
        return `${actorText} made counter offer`;
      case 'tenant-accepted':
        return isCurrentUser && event.actor === userId ? 'You accepted offer' : 'Tenant accepted offer';
      case 'owner-accepted':
        return isCurrentUser && event.actor === userId ? 'You accepted offer' : 'Owner accepted offer';
      case 'payment-pending':
        return 'Payment pending';
      case 'payment-completed':
        return 'Payment completed';
      default:
        return event.type.replace(/-/g, ' ');
    }
  };

  const getEventDetails = (event: TimelineEvent) => {
    if (!event.data) return null;
    
    switch (event.type) {
      case 'created':
      case 'counter-offered':
        return event.data.amount ? 
          `Amount: $${event.data.amount.toLocaleString()}` : 
          null;
      default:
        return null;
    }
  };

  const formatTimelineDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true });
  };

  return (
    <div className="px-4 pb-3 pt-1">
      <div className="max-h-32 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-lightstone scrollbar-track-transparent">
        <div className="relative pb-2">
          {/* Vertical timeline line */}
          <div
            className="absolute left-2.5 w-0.5 bg-gray-200"
            style={{ 
              height: history.length > 1 ? `calc(100% - 22px)` : '0',
              top: '10px'
            }}
          ></div>

          {/* Timeline events */}
          <div className="space-y-3">
            {history.map((event, index) => (
              <div key={index} className="flex items-start">
                <div className="relative z-10 mr-3 mt-0.5">
                  {getEventIcon(event)}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-graphite">
                        {getEventTitle(event)}
                      </p>
                      
                      {getEventDetails(event) && (
                        <p className="text-xs text-graphite/60 mt-0.5">
                          {getEventDetails(event)}
                        </p>
                      )}
                    </div>
                    
                    <span className="text-xs text-graphite/60 whitespace-nowrap ml-2">
                      {formatTimelineDate(event.date)}
                    </span>
                  </div>
                </div>
                
                <div className="ml-2 mt-0.5">
                  {getStatusIcon(event)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferTimeline;