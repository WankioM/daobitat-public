import React, { useEffect, useState } from 'react';
import { offerService, Offer } from '../../../services/offerService';
import { useUser } from '../../../NewContexts/UserContext';

const Offers: React.FC = () => {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const { user } = useUser();
    
    // Helper function to safely check if an object has properties
    const isValidObject = (obj: any): boolean => {
        return obj !== null && typeof obj === 'object';
    };

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                setLoading(true);
                const userOffers = await offerService.getUserOffers();
                
                // Validate the offers data before setting state
                if (Array.isArray(userOffers)) {
                    // Filter out any potentially invalid offers
                    const validOffers = userOffers.filter(offer => 
                        offer && typeof offer === 'object' && offer._id
                    );
                    setOffers(validOffers);
                    setError(null);
                } else {
                    console.error('Invalid offers data received:', userOffers);
                    setOffers([]);
                    setError('Received invalid data format from server');
                }
            } catch (err: any) {
                setError(err.message || 'Failed to fetch offers');
                console.error('Error fetching offers:', err);
                setOffers([]); // Ensure offers is always an array
            } finally {
                setLoading(false);
            }
        };

        fetchOffers();
    }, []);

    const getStatusColor = (status: Offer['status']) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'accepted':
                return 'bg-green-100 text-green-800';
            case 'rejected':
            case 'expired':
            case 'withdrawn':
                return 'bg-lightstone text-graphite';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString: Date | null | undefined) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            console.error('Invalid date format:', dateString);
            return 'Invalid date';
        }
    };

    // Ensure offers is an array before filtering
    const safeOffers = Array.isArray(offers) ? offers : [];
    
    const filteredOffers = filterStatus === 'all' 
        ? safeOffers 
        : safeOffers.filter(offer => offer && offer.status === filterStatus);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-graphite">Loading offers...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 text-rustyred p-4 rounded-md">
                <p>Error: {error}</p>
                <button 
                    className="mt-2 text-white bg-rustyred px-4 py-2 rounded-md"
                    onClick={() => window.location.reload()}
                >
                    Retry
                </button>
            </div>
        );
    }

    if (offers.length === 0) {
        return (
            <div className="bg-milk p-6 rounded-md text-center">
                <p className="text-graphite text-lg">You don't have any offers yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-medium text-graphite">Your Offers</h2>
                <div className="relative">
                    <select
                        className="appearance-none bg-milk border border-lightstone rounded-md px-4 py-2 pr-8 text-graphite cursor-pointer focus:outline-none focus:ring-1 focus:ring-rustyred"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All Offers</option>
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                        <option value="completed">Completed</option>
                        <option value="expired">Expired</option>
                        <option value="withdrawn">Withdrawn</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-graphite">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white divide-y divide-lightstone">
                    <thead className="bg-milk">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-graphite uppercase tracking-wider">Property</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-graphite uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-graphite uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-graphite uppercase tracking-wider">Move In</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-graphite uppercase tracking-wider">Duration</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-graphite uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-graphite uppercase tracking-wider">Created</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-graphite uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-lightstone">
                        {filteredOffers.map((offer) => {
                            const isOwner = user && isValidObject(user) && isValidObject(offer.owner) ? offer.owner._id === user._id : false;
                            const isTenant = user && isValidObject(user) && isValidObject(offer.tenant) ? offer.tenant._id === user._id : false;
                            
                            return (
                                <tr key={offer._id} className="hover:bg-milk">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {offer.property && offer.property.images && offer.property.images[0] ? (
                                                <img 
                                                    className="h-10 w-10 rounded-md mr-3 object-cover" 
                                                    src={offer.property.images[0]} 
                                                    alt={offer.property?.propertyName || 'Property'} 
                                                />
                                            ) : (
                                                <div className="h-10 w-10 rounded-md mr-3 bg-lightstone"></div>
                                            )}
                                            <div className="text-sm font-medium text-graphite truncate max-w-xs">
                                                {offer.property?.propertyName || 'Unnamed Property'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-graphite">
                                        {offerService.formatAmount(offer.amount, offer.currencySymbol)}
                                        {offer.property.action === 'rent' && <span className="text-xs ml-1">/mo</span>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-graphite">
                                        {offer.property?.action === 'rent' ? 'Rental' : 'Purchase'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-graphite">
                                        {offer.moveInDate ? formatDate(offer.moveInDate) : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-graphite">
                                        {offer.property?.action === 'rent' ? `${offer.duration || 0} months` : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusColor(offer.status)}`}>
                                            {offerService.getStatusLabel(offer.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-graphite">
                                        {formatDate(offer.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {offer.status === 'pending' && isOwner && (
                                            <div className="flex space-x-2">
                                                <button 
                                                    className="text-white bg-rustyred px-3 py-1 rounded-md text-xs"
                                                    onClick={() => offerService.acceptOffer(offer._id).then(() => window.location.reload())}
                                                >
                                                    Accept
                                                </button>
                                                <button 
                                                    className="text-graphite bg-lightstone px-3 py-1 rounded-md text-xs"
                                                    onClick={() => offerService.rejectOffer(offer._id).then(() => window.location.reload())}
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                        
                                        {offer.status === 'pending' && isTenant && (
                                            <button 
                                                className="text-graphite bg-lightstone px-3 py-1 rounded-md text-xs"
                                                onClick={() => offerService.withdrawOffer(offer._id).then(() => window.location.reload())}
                                            >
                                                Withdraw
                                            </button>
                                        )}
                                        
                                        {offer.status === 'accepted' && (
                                            <button className="text-white bg-rustyred px-3 py-1 rounded-md text-xs">
                                                View Details
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            
            {filteredOffers.length === 0 && (
                <div className="text-center py-6 bg-milk rounded-md">
                    <p className="text-graphite">No {filterStatus !== 'all' ? filterStatus : ''} offers found.</p>
                </div>
            )}
        </div>
    );
};

export default Offers;