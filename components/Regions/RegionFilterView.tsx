'use client';

import {RegionListItem} from '@/types/region';
import {ChevronRight, Package, ShoppingCart, Store, Users} from 'lucide-react';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/redux/store";
import {fetchCities, fetchCountries, fetchRegions, fetchStates, fetchStreets} from "@/redux/location/locationSlice";
import React, {useEffect, useMemo, useState} from "react";
import {Region3Card} from "@/components/Regions/Region3Card";

// Updated to match actual data structure
type DisplayLevel = 'countries' | 'regions' | 'states' | 'cities' | 'streets';
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
    const [selectedCountry, setSelectedCountry] = useState<RegionListItem | null>(null);
    const [selectedRegion, setSelectedRegion] = useState<RegionListItem | null>(null);
    const [selectedState, setSelectedState] = useState<RegionListItem | null>(null);
    const [selectedCity, setSelectedCity] = useState<RegionListItem | null>(null);

    const dispatch = useDispatch<AppDispatch>();
    const location = useSelector((state: RootState) => state.location);
    const {countries, regions, states, cities, streets, loading} = location;

    const [displayTotalFor, setDisplayTotalFor] = useState<TotalType>('stores');

    useEffect(() => {
        dispatch(fetchCountries());
    }, [dispatch]);

    const {list, level}: { list: RegionListItem[]; level: DisplayLevel } = useMemo(() => {
        // Navigate from most specific to least specific
        if (selectedCity) {
            return {
                list: streets as RegionListItem[],
                level: 'streets' as const,
            };
        }
        if (selectedState) {
            return {
                list: cities as RegionListItem[],
                level: 'cities' as const,
            };
        }
        if (selectedRegion) {
            return {
                list: states as RegionListItem[],
                level: 'states' as const,
            };
        }
        if (selectedCountry) {
            return {
                list: regions as RegionListItem[],
                level: 'regions' as const,
            };
        }
        // Default: show countries
        return {
            list: countries as RegionListItem[],
            level: 'countries' as const
        };
    }, [selectedCountry, selectedRegion, selectedState, selectedCity, countries, regions, states, cities, streets]);

    const handleSelect = (item: RegionListItem) => {
        switch (level) {
            case 'countries':
                setSelectedCountry(item);
                dispatch(fetchRegions(item._id))
                break;
            case 'regions':
                setSelectedRegion(item);
                dispatch(fetchStates(item._id))
                break;
            case 'states':
                setSelectedState(item);
                dispatch(fetchCities(item._id))
                break;
            case 'cities':
                setSelectedCity(item);
                dispatch(fetchStreets(item._id));
                break;
            case 'streets':
                // Streets are terminal - no further navigation
                break;
        }
    };

    const handleViewStores = (region: RegionListItem, type: TotalType) => {
        onShowPreview(type, region);
    };

    const breadcrumbs = [
        {
            name: 'All Countries',
            action: () => {
                setSelectedCountry(null);
                setSelectedRegion(null);
                setSelectedState(null);
                setSelectedCity(null);
            }
        },
        selectedCountry && {
            name: selectedCountry.name,
            action: () => {
                setSelectedRegion(null);
                setSelectedState(null);
                setSelectedCity(null);
            }
        },
        selectedRegion && {
            name: selectedRegion.name,
            action: () => {
                setSelectedState(null);
                setSelectedCity(null);
            }
        },
        selectedState && {
            name: selectedState.name,
            action: () => {
                setSelectedCity(null);
            }
        },
        selectedCity && {
            name: selectedCity.name,
            action: () => {
            }
        },
    ].filter(Boolean) as { name: string, action: () => void }[];

    return (
        <div className="p-4 h-full flex relative flex-col">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center text-sm text-gray-500 mb-4 flex-wrap">
                {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={crumb.name}>
                        <button
                            onClick={crumb.action}
                            className="hover:underline disabled:text-gray-800 disabled:font-semibold disabled:no-underline"
                            disabled={index === breadcrumbs.length - 1}
                        >
                            {crumb.name}
                        </button>
                        {index < breadcrumbs.length - 1 && <ChevronRight className="w-4 h-4 mx-1"/>}
                    </React.Fragment>
                ))}
            </div>

            {/* Data Type Filter */}
            <div
                className="mb-4 flex flex-col bg-white absolute right-3 bottom-4 gap-4 items-center justify-start rounded-lg shadow-lg p-2">
                {tabOptions.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => setDisplayTotalFor(option.value)}
                        className={`rounded-full p-3 text-sm font-medium transition-colors ${
                            displayTotalFor === option.value
                                ? 'bg-orange-800 text-white'
                                : 'text-gray-500 hover:bg-gray-200'
                        }`}
                        title={option.value.charAt(0).toUpperCase() + option.value.slice(1)}
                    >
                        <option.icon className="w-5 h-5 mx-auto"/>
                    </button>
                ))}
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center text-gray-500 py-10">
                    <p>Loading...</p>
                </div>
            )}

            {/* Results Grid */}
            {!loading && list.length > 0 ? (
                <div className="flex flex-col gap-2 flex-1 h-full overflow-y-auto pb-4">
                    {list.map((item) => (
                        <Region3Card
                            displayTotalFor={displayTotalFor}
                            onSelect={handleSelect}
                            onViewStores={handleViewStores}
                            key={item._id}
                            region={item}/>
                    ))}
                </div>
            ) : !loading ? (
                <div className="text-center text-gray-500 py-10">
                    <p>No sub-locations found for this area.</p>
                </div>
            ) : null}
        </div>
    );
};

export default RegionFilterView;
