import React, {ChangeEvent, FormEvent} from "react";

interface Props {
    handleGalleryChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: FormEvent) => void;
    gallery: File[];
    loading: boolean;
    error: string | null;
}

export default function GalleryComponent({handleGalleryChange, handleSubmit, gallery, loading, error}: Props) {
    return (
        <div className="flex flex-col gap-4">
            <input type="file" accept="image/*" multiple onChange={handleGalleryChange}/>
            <ul>
                {gallery.map((file, i) => (
                    <li key={i}>{file.name}</li>
                ))}
            </ul>
            {error && <p className="text-red-500">{error}</p>}
            <button onClick={handleSubmit} type="submit" disabled={loading}
                    className="bg-green-500 text-white px-4 py-2 rounded">
                {loading ? "Submitting..." : "Submit Vendor"}
            </button>
        </div>
    );
}
