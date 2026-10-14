import ApplicationLogo from '@/Components/ApplicationLogo';
import LanguageSwitcher from '@/Components/public/LanguageSwitcher';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col bg-gray-100">
            <header className="bg-navy-900 text-white">
                <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-end px-4 sm:px-6">
                    <LanguageSwitcher tone="inverse" />
                </div>
            </header>

            <div className="flex flex-1 flex-col items-center px-4 pb-6 pt-6 sm:justify-center sm:pt-0">
                <div>
                    <Link href={route('home')}>
                        <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
                    </Link>
                </div>

                <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                    {children}
                </div>
            </div>
        </div>
    );
}