import { useState } from 'react';


import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        type: 'rent',
        regularPrice: 50,
        discountPrice: 0,
        offer: false,
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);



    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;

        if (id === 'sale' || id === 'rent') {
            setFormData((prev) => ({
                ...prev,
                type: id,
            }));
        } else if (type === 'checkbox') {
            setFormData((prev) => ({
                ...prev,
                [id]: checked,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [id]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (+formData.regularPrice < +formData.discountPrice) {
            setError('Discount price must be lower than regular price');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/listing/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id,
                }),
            });

            const data = await res.json();
            setLoading(false);

            if (!data.success) {
                setError(data.message);
            } else {
                navigate(`/listing/${data._id}`);
            }
        } catch (err) {
            setError('An error occurred while creating the listing');
            setLoading(false);
        }
    };

    return (
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>
                Create a Listing
            </h1>
            <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
                <div className='flex flex-col gap-4 flex-1'>
                    <input
                        type='text'
                        placeholder='Name'
                        className='border p-3 rounded-lg'
                        id='name'
                        maxLength='62'
                        minLength='10'
                        required
                        onChange={handleChange}
                        value={formData.name}
                    />
                    <textarea
                        placeholder='Description'
                        className='border p-3 rounded-lg'
                        id='description'
                        required
                        onChange={handleChange}
                        value={formData.description}
                    />
                    
                    <div className='flex gap-6 flex-wrap'>
                        <div className='flex gap-2'>
                            <input
                                type='checkbox'
                                id='offer'
                                className='w-5'
                                onChange={handleChange}
                                checked={formData.offer}
                            />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className='flex flex-wrap gap-6'>
                        <div className='flex items-center gap-2'>
                            <input
                                type='number'
                                id='regularPrice'
                                min='50'
                                max='10000000'
                                required
                                className='p-3 border border-gray-300 rounded-lg'
                                onChange={handleChange}
                                value={formData.regularPrice}
                            />
                            <div className='flex flex-col items-center'>
                                <p>Regular price</p>
                                {formData.type === 'rent' && (
                                    <span className='text-xs'>($ / month)</span>
                                )}
                            </div>
                        </div>
                        {formData.offer && (
                            <div className='flex items-center gap-2'>
                                <input
                                    type='number'
                                    id='discountPrice'
                                    min='0'
                                    max='10000000'
                                    required
                                    className='p-3 border border-gray-300 rounded-lg'
                                    onChange={handleChange}
                                    value={formData.discountPrice}
                                />
                                <div className='flex flex-col items-center'>
                                    <p>Discounted price</p>
                                    {formData.type === 'rent' && (
                                        <span className='text-xs'>($ / month)</span>
                                    )}
                                </div>
                            </div>

                        )}
                    </div>
                    <div className='flex flex-col flex-1'>
                        <button
                            className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
                        >
                            {loading ? 'Creating...' : 'Create listing'}
                        </button>
                        {error && <p className='text-red-700 text-sm'>{error}</p>}
                    </div>
                </div>

            </form>
        </main>
    );
}
