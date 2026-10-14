import SectionTitle from '@/Components/ui/SectionTitle';

export default function PageHero({ eyebrow, title, children }) {
    return (
        <div className="mb-10 max-w-3xl">
            <SectionTitle eyebrow={eyebrow} title={title}>
                {children}
            </SectionTitle>
        </div>
    );
}
