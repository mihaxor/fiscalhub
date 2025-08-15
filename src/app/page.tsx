'use client';

import Header from '@/shared/components/Header';
import FiscalPanel from '@/shared/components/FiscalPanel';
import CurrencyPanel from '@/shared/components/CurrencyPanel';
import Footer from '@/shared/components/Footer';

const Home = () => {

    return (<>
            <div className='flex flex-col items-center gap-25 m-15 max-w-[1920px]'>
                <Header />
                <main className='flex flex-row flex-wrap gap-8 items-start justify-evenly w-full'>
                    <FiscalPanel />
                    <CurrencyPanel />
                </main>
            </div>
            <Footer />
        </>
    );
}

export default Home;