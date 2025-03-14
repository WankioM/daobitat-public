import React from 'react';
import NewProperties from './NewProperties';
import TrendingProperties from './TrendingProperties';
import { Property } from '../ListerDashBoard/Properties/propertyTypes';

interface RecommendationsProps {
  newProperties: Property[];
  trendingProperties: Property[];
}

const Recommendations: React.FC<RecommendationsProps> = ({ 
  newProperties, 
  trendingProperties 
}) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        
        <NewProperties properties={newProperties} />
      </section>

      <section>
       
        <TrendingProperties properties={trendingProperties} />
      </section>
    </div>
  );
};

export default Recommendations;