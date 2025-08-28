import Logo from '../../../public/logo.png';
import ThemeSwitch from '@/shared/components/ThemeSwitch';
import BlurText from '@/shared/components/BlurText';
import Image from 'next/image';
import Link from 'next/link';

const Header = () =>
    <header className='flex flex-col w-full gap-4'>
        <div className='flex gap-4 justify-between items-center'>
            <Link href='/'>
                <Image priority src={Logo} alt={'logo'} width={49} height={49} />
            </Link>
            <ThemeSwitch type='button' />
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
export default Header;