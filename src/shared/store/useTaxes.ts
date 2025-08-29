import {useEffect, useState} from 'react';
import {Taxes} from '@/shared/hooks/fiscal.types';

const useTaxes = () => {
    const [taxes, setTaxes] = useState<Taxes>({
        cas: 0.25,
        cass: 0.10,
        iv: 0.10,
        cam: 0.0225
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isReFetch, setIsReFetch] = useState(false);

    const getTaxes = async () => {
        setIsLoading(true);

        try {
            const response = await fetch('/api/taxes');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const taxes = await response.json();
            setTaxes(taxes);

        } catch (error) {
            console.error('Error fetching taxes:', error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getTaxes();
    }, [isReFetch]);

    return {
        taxes, getTaxes,
        isLoading,
        reFetch: () => setIsReFetch(!isReFetch),
    }
};

export default useTaxes;