// import ThemeSwitch from '@/shared/components/ThemeSwitch';
import Logo from '../../../public/logo.svg';
import Image from 'next/image';
import BlurText from '@/shared/components/BlurText';
import Link from 'next/link';

const Header = () =>
    (
        <header className='flex flex-col w-full gap-4'>
            <div className='flex gap-4'>
                <Link href='/'>
                    <Image priority src={Logo} alt={'logo'} width={52} height={52} />
                </Link>
                {/*<ThemeSwitch />*/}
            </div>
            <div className='flex justify-center'>
                <BlurText
                    text='Fiscal Hub'
                    delay={100}
                    animateBy='letters'
                    direction='top'
                    className='text-3xl font-bold'
                />
            </div>
            <div className='flex justify-center'>
                <BlurText
                    text='Calculator fiscal complet: salarii, microîntreprinderi,
                    SRL-uri, dividende și contribuții sociale.'
                    delay={100}
                    animateBy='words'
                    direction='top'
                    className='text-lg text-gray-500 font-medium flex justify-center'
                />
            </div>
        </header>
    )
export default Header;