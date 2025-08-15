import ThemeSwitch from '@/shared/components/ThemeSwitch';
import Logo from '../../../public/logo.svg';
import Image from 'next/image';

const Header = () =>
    (
        <header className='flex flex-col w-full gap-4'>
            <div className='flex gap-4'>
                <Image priority src={Logo} alt={'logo'} width={52} height={52} />
                <ThemeSwitch />
            </div>
            <div>
                <h1 className='text-3xl font-bold text-center'>Fiscal Hub</h1>
                <p className='text-center text-gray-500'>Calculator fiscal complet: salarii, microîntreprinderi,
                    SRL-uri, dividende și contribuții sociale.</p>
            </div>
        </header>
    )
export default Header;