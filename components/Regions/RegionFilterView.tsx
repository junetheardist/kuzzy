'use client';
import React, { useState, useMemo } from 'react';
import { regions, states, lgas, communities, streets } from '@/data/regions';
import { RegionListItem } from '@/types/region'; // Assuming this path is correct
import { RegionCard } from "@/components/Regions/RegionCard"
import { ChevronRight } from 'lucide-react';

type DisplayLevel = 'regions' | 'states' | 'lgas' | 'communities' | 'streets';

export const RegionFilterView = () => {
  const [selectedRegion, setSelectedRegion] = useState<RegionListItem | null>(null);
  const [selectedState, setSelectedState] = useState<RegionListItem | null>(null);
  const [selectedLga, setSelectedLga] = useState<RegionListItem | null>(null);
  const [selectedCommunity, setSelectedCommunity] = useState<RegionListItem | null>(null);

  const [displayTotalFor, setDisplayTotalFor] = useState<'stores' | 'orders' | 'products' | 'users'>('stores');

  const { list, level }: { list: RegionListItem[]; level: DisplayLevel } = useMemo(() => {
    if (selectedCommunity) {
      return {
        list: streets.filter(s => s.communityId === selectedCommunity.id),
        level: 'streets',
      };
    }
    if (selectedLga) {
      return {
        list: communities.filter(c => c.lgaId === selectedLga.id),
        level: 'communities',
      };
    }
    if (selectedState) {
      return {
        list: lgas.filter(l => l.stateId === selectedState.id),
        level: 'lgas',
      };
    }
    if (selectedRegion) {
      return {
        list: states.filter(s => s.regionId === selectedRegion.id),
        level: 'states',
      };
    }
    return { list: regions, level: 'regions' };
  }, [selectedRegion, selectedState, selectedLga, selectedCommunity]);

  const handleSelect = (item: RegionListItem) => {
    switch (level) {
      case 'regions':
        setSelectedRegion(item);
        break;
      case 'states':
        setSelectedState(item);
        break;
      case 'lgas':
        setSelectedLga(item);
        break;
      case 'communities':
        setSelectedCommunity(item);
        break;
    }
  };

  const breadcrumbs = [
    { name: 'All Regions', action: () => { setSelectedRegion(null); setSelectedState(null); setSelectedLga(null); setSelectedCommunity(null); } },
    selectedRegion && { name: selectedRegion.name, action: () => { setSelectedState(null); setSelectedLga(null); setSelectedCommunity(null); } },
    selectedState && { name: selectedState.name, action: () => { setSelectedLga(null); setSelectedCommunity(null); } },
    selectedLga && { name: selectedLga.name, action: () => { setSelectedCommunity(null); } },
    selectedCommunity && { name: selectedCommunity.name, action: () => { } },
  ].filter(Boolean) as { name: string, action: () => void }[];

  return (
    <div className="p-4 h-full flex flex-col">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center text-sm text-gray-500 mb-4 flex-wrap">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.name}>
            <button onClick={crumb.action} className="hover:underline disabled:text-gray-800 disabled:font-semibold disabled:no-underline" disabled={index === breadcrumbs.length - 1}>
              {crumb.name}
            </button>
            {index < breadcrumbs.length - 1 && <ChevronRight className="w-4 h-4 mx-1" />}
          </React.Fragment>
        ))}
      </div>

      {/* Data Type Filter */}
      <div className="mb-4">
        <label htmlFor="total-select" className="text-xs font-medium text-gray-600 mr-2">Show totals for:</label>
        <select
          id="total-select"
          value={displayTotalFor}
          onChange={(e) => setDisplayTotalFor(e.target.value as any)}
          className="text-xs p-1 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="stores">Stores</option>
          <option value="orders">Orders</option>
          <option value="products">Products</option>
          <option value="users">Users</option>
        </select>
      </div>

      {/* Results Grid */}
      {list.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 overflow-y-auto pb-4">
          {list.map((item) => (
            <div key={item.id} onClick={() => handleSelect(item)}>
              <RegionCard region={item} displayTotalFor={displayTotalFor} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-10">
          <p>No sub-locations found for this area.</p>
        </div>
      )}
    </div>
  );
};

export default RegionFilterView;