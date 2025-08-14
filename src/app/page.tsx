'use client';

import Header from '@/shared/components/Header';
import FiscalPanel from '@/shared/components/FiscalPanel';
import CurrencyPanel from '@/shared/components/CurrencyPanel';

const Home = () => {
    return (
        <div
            className='flex flex-col items-center gap-25 m-15 max-w-[1920px]'>
            <Header />
            <main className='flex flex-row gap-5 items-stretch justify-evenly w-full'>
                <FiscalPanel/>
                <CurrencyPanel/>
            </main>
            <footer className='row-start-3 flex gap-[24px] flex-wrap items-center justify-center'>

            </footer>
        </div>
    );
}

export default Home;