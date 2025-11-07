"use client";

import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/redux/store";
import {
    createLocation,
    deleteLocation,
    fetchCities,
    fetchCountries,
    fetchRegions,
    fetchStates,
    fetchStreets,
    resetBelowLevel,
    setSelected,
    updateLocation
} from "@/redux/location/locationSlice";

// const levels = ["country", "region", "state", "city", "street"];

const LocationManager = () => {
    const dispatch = useDispatch<AppDispatch>();
    const location = useSelector((state: RootState) => state.location);
    const {countries, regions, states, cities, streets, selected, loading} = location;


    const [name, setName] = useState("");
    const [editing, setEditing] = useState<{ id: string; level: string } | null>(null);

    useEffect(() => {
        dispatch(fetchCountries());
    }, [dispatch]);

    const handleSelect = (level: string, value: string) => {
        dispatch(setSelected({[level]: value}));
        dispatch(resetBelowLevel(level));
        if (level === "countries") dispatch(fetchRegions(value));
        if (level === "regions") dispatch(fetchStates(value));
        if (level === "states") dispatch(fetchCities(value));
        if (level === "cities") dispatch(fetchStreets(value));
    };

    const handleSubmit = async (level: string, parentId?: string, parentId1?: string, parentId2?: string, parentId3?: string) => {
        if (!name.trim()) return alert("Enter name");
        if (editing) {
            await dispatch(updateLocation({level, id: editing.id, name}));
            setEditing(null);
        } else {
            await dispatch(createLocation({level, parentId, name, parentId1, parentId2, parentId3}));
        }
        setName("");
    };

    const handleDelete = async (level: string, id: string) => {
        if (confirm("Delete this item?")) {
            await dispatch(deleteLocation({level, id}));
        }
    };

    const renderLevel = (level: string, data: any[], parentId?: string, parentId1?: string, parentId2?: string, parentId3?: string) => (
        <div key={level} className="border p-3 rounded-lg my-4">
            <h3 className="font-semibold capitalize mb-2">{level}</h3>

            <div className="flex items-center gap-2 mb-3">
                <input
                    className="border p-2 rounded flex-1"
                    placeholder={`Add new ${level}`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button
                    className="bg-blue-600 text-white px-3 py-2 rounded"
                    onClick={() => handleSubmit(level, parentId, parentId1, parentId2, parentId3)}
                    disabled={loading}
                >
                    {editing ? "Update" : "Add"}
                </button>
            </div>

            {data.length === 0 && <p className="text-sm text-gray-500">No {level}s found</p>}

            <ul className="space-y-1">
                {data.map((item: any) => (
                    <li key={item._id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                        <span>{item.name}</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setEditing({id: item._id, level});
                                    setName(item.name);
                                }}
                                className="text-sm bg-yellow-500 text-white px-2 py-1 rounded"
                            >Edit
                            </button>
                            <button
                                onClick={() => handleDelete(level, item._id)}
                                className="text-sm bg-red-600 text-white px-2 py-1 rounded"
                            >Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h2 className="text-xl font-bold mb-4">Location Manager</h2>

            {/* Selections */}
            <div className="space-y-2 mb-4">
                <select className="border p-2 rounded w-full"
                        value={selected.countries || ""}
                        onChange={(e) => handleSelect("countries", e.target.value)}>
                    <option value="">Select Country</option>
                    {countries?.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>

                {regions.length > 0 && (
                    <select className="border p-2 rounded w-full"
                            value={selected.regions || ""}
                            onChange={(e) => handleSelect("regions", e.target.value)}>
                        <option value="">Select Region</option>
                        {regions.map((r) => <option key={r._id} value={r._id}>{r.name}</option>)}
                    </select>
                )}

                {states.length > 0 && (
                    <select className="border p-2 rounded w-full"
                            value={selected.states || ""}
                            onChange={(e) => handleSelect("states", e.target.value)}>
                        <option value="">Select State</option>
                        {states.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
                    </select>
                )}

                {cities.length > 0 && (
                    <select className="border p-2 rounded w-full"
                            value={selected.cities || ""}
                            onChange={(e) => handleSelect("cities", e.target.value)}>
                        <option value="">Select City</option>
                        {cities.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                )}
            </div>

            {/* CRUD Lists */}
            {renderLevel("countries", countries)}
            {selected.countries && renderLevel("regions", regions, selected.countries)}
            {selected.regions && renderLevel("states", states, selected.regions, selected.countries)}
            {selected.states && renderLevel("cities", cities, selected.states, selected.regions, selected.countries)}
            {selected.cities && renderLevel("streets", streets, selected.cities, selected.states, selected.regions, selected.countries)}
        </div>
    );
};

export default LocationManager;
