'use client';

import Header from '@/shared/components/Header';
import FiscalPanel from '@/shared/components/FiscalPanel';
import CurrencyPanel from '@/shared/components/CurrencyPanel';
import Footer from '@/shared/components/Footer';

const Home = () => {

    return (<>
            <div className='min-h-screen flex flex-col gap-10 sm:gap-20 mt-10 md:mx-10 mb-0 max-w-[1920px] mx-5'>
                <Header />
                <main className='flex-1 flex flex-row flex-wrap gap-8 items-start justify-evenly w-full'>
                    <FiscalPanel />
                    <CurrencyPanel />
                </main>
                <Footer />
            </div>
        </>
    );
}

export default Home;