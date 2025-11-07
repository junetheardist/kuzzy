'use client';
import React, {useMemo, useState} from 'react';
import {communities, lgas, regions, states, streets} from '@/data/Regions';
import {RegionListItem} from '@/types/region'; // Assuming this path is correct
import {RegionCard} from "@/components/Regions/RegionCard";
import {ChevronRight, Package, ShoppingCart, Store, Users} from 'lucide-react';
import LocationManager from "@/components/LocationManager";

type DisplayLevel = 'regions' | 'states' | 'lgas' | 'communities' | 'streets';
type TotalType = 'stores' | 'orders' | 'products' | 'customers';

const tabOptions: { value: TotalType; icon: React.ElementType }[] = [
    {value: 'stores', icon: Store},
    {value: 'orders', icon: ShoppingCart},
    {value: 'products', icon: Package},
    {value: 'customers', icon: Users},
];

interface RegionFilterViewProps {
    onShowPreview: (type: string, data: any) => void;
}

export const RegionFilterView = ({onShowPreview}: RegionFilterViewProps) => {
    const [selectedRegion, setSelectedRegion] = useState<RegionListItem | null>(null);
    const [selectedState, setSelectedState] = useState<RegionListItem | null>(null);
    const [selectedLga, setSelectedLga] = useState<RegionListItem | null>(null);
    const [selectedCommunity, setSelectedCommunity] = useState<RegionListItem | null>(null);

    const [displayTotalFor, setDisplayTotalFor] = useState<TotalType>('stores');

    const {list, level}: { list: RegionListItem[]; level: DisplayLevel } = useMemo(() => {
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
        return {list: regions, level: 'regions'};
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

    const handleViewStores = (region: RegionListItem, type: TotalType) => {
        onShowPreview(type, region);
    };

    const breadcrumbs = [
        {
            name: 'All Regions', action: () => {
                setSelectedRegion(null);
                setSelectedState(null);
                setSelectedLga(null);
                setSelectedCommunity(null);
            }
        },
        selectedRegion && {
            name: selectedRegion.name, action: () => {
                setSelectedState(null);
                setSelectedLga(null);
                setSelectedCommunity(null);
            }
        },
        selectedState && {
            name: selectedState.name, action: () => {
                setSelectedLga(null);
                setSelectedCommunity(null);
            }
        },
        selectedLga && {
            name: selectedLga.name, action: () => {
                setSelectedCommunity(null);
            }
        },
        selectedCommunity && {
            name: selectedCommunity.name, action: () => {
            }
        },
    ].filter(Boolean) as { name: string, action: () => void }[];

    return (
        <div className="p-4 h-full flex relative flex-col">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center text-sm text-gray-500 mb-4 flex-wrap">
                {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={crumb.name}>
                        <button onClick={crumb.action}
                                className="hover:underline disabled:text-gray-800 disabled:font-semibold disabled:no-underline"
                                disabled={index === breadcrumbs.length - 1}>
                            {crumb.name}
                        </button>
                        {index < breadcrumbs.length - 1 && <ChevronRight className="w-4 h-4 mx-1"/>}
                    </React.Fragment>
                ))}
            </div>

            <LocationManager/>

            {/* Data Type Filter */}
            <div
                className="mb-4 flex flex-col bg-white absolute right-3 bottom-4 gap-4 items-center justify-start  rounded-lg ">
                {tabOptions.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => setDisplayTotalFor(option.value)}
                        className={` rounded-full p-3   text-sm font-medium transition-colors ${
                            displayTotalFor === option.value
                                ? 'bg-orange-800 text-white '
                                : 'text-gray-500 hover:bg-gray-200'
                        }`}
                        title={option.value.charAt(0).toUpperCase() + option.value.slice(1)}
                    >
                        <option.icon className="w-5 h-5 mx-auto"/>
                    </button>
                ))}
            </div>

            {/* Results Grid */}
            {list.length > 0 ? (
                <div className="flex flex-col gap-2 flex-1 h-full  overflow-y-auto pb-4">
                    {list.map((item) => (
                        <RegionCard
                            key={item.id}
                            region={item}
                            displayTotalFor={displayTotalFor}
                            onSelect={handleSelect}
                            onViewStores={handleViewStores}
                        />
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
