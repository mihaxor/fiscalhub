'use client';

import Header from '@/shared/components/Header';
import FiscalPanel from '@/shared/components/FiscalPanel';
import CurrencyPanel from '@/shared/components/CurrencyPanel';
import Footer from '@/shared/components/Footer';
import FiscalOverview from '@/shared/components/FiscalOverview';

const Home = () => {

    return (<>
            <div className='flex flex-col gap-10 sm:gap-20 mt-10 md:mx-10 mb-0 max-w-[1920px] mx-5'>
                <Header />
                <main className='flex flex-col gap-8 items-center w-full min-h-screen'>
                    <div className='flex flex-row flex-wrap gap-8 items-start justify-evenly w-full'>
                        <FiscalPanel />
                        <CurrencyPanel />
                    </div>
                    <FiscalOverview />
                </main>
                <Footer />
            </div>
        </>
    );
}

export default Home;