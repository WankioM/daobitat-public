import React, { useState } from 'react';
import Offers from './Offers';

const Billings = () => {
    const [activeTab, setActiveTab] = useState('Offers');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Offers':
                return <Offers />;
            case 'Payments':
                return <div className="p-4 text-graphite">Payment history will be shown here</div>;
            case 'Invoices':
                return <div className="p-4 text-graphite">Invoice details will be shown here</div>;
            default:
                return <Offers />;
        }
    };

    return (
        <div className="bg-milk min-h-screen p-4">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="border-b border-lightstone">
                    <nav className="flex">
                        {['Offers', 'Payments', 'Invoices'].map((tab) => (
                            <button
                                key={tab}
                                className={`px-6 py-4 font-medium text-sm ${
                                    activeTab === tab
                                        ? 'border-b-2 border-rustyred text-rustyred'
                                        : 'text-graphite hover:text-rustyred'
                                }`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="p-4">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default Billings;