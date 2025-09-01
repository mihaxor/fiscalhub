import Header from '@/shared/components/Header';
import FiscalPanel from '@/features/FiscalPanel';
import CurrencyPanel from '@/features/CurrencyPanel';
import Footer from '@/shared/components/Footer';
import {FiscalOverview} from '@/features/FiscalOverview';
import AnimatedContent from '@/shared/components/AnimatedContent';
import React from 'react';
import initTranslations from '@/app/i18n';
import {LanguageType} from '@/config/i18n';

const Home = async ({params}: { params: Promise<{ locale: string }> }) => {
    const {locale} = await params;
    const {t} = await initTranslations(locale as LanguageType);

    return (
        <div className='max-w-[1920px] w-full flex flex-col gap-10 sm:gap-20 mt-5 md:mx-10'>
            <Header t={t} />
            <AnimatedContent>
                <main className='flex flex-col gap-8 items-center w-full min-h-screen'>
                    <div className='flex flex-row flex-wrap gap-6 xl:gap-2 items-start justify-evenly w-full'>
                        <FiscalPanel />
                        <CurrencyPanel />
                    </div>
                    <FiscalOverview />
                </main>
            </AnimatedContent>
            <Footer />
        </div>
    );
}

export default Home;