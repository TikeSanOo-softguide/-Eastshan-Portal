import { cx } from '@/lib/cx';
import {
    motionTransition,
    usePrefersReducedMotion,
} from '@/lib/usePrefersReducedMotion';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

function LeaderCard({ leader }) {
    return (
        <article className="w-full max-w-[14rem] border border-border bg-surface p-4 text-center">
            <img
                src={leader.photo}
                alt=""
                width={160}
                height={200}
                loading="lazy"
                decoding="async"
                className="mx-auto aspect-[4/5] w-28 object-cover bg-navy-100"
            />
            <h4 className="mt-3 font-display text-lg text-text">{leader.name}</h4>
            <p className="mt-1 text-sm text-muted">{leader.position}</p>
        </article>
    );
}

function Connector({ reduced }) {
    return (
        <motion.div
            aria-hidden="true"
            className="mx-auto h-8 w-px bg-accent/70"
            initial={reduced ? false : { scaleY: 0, opacity: 0 }}
            whileInView={{ scaleY: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={motionTransition(reduced, 0.45)}
            style={{ originY: 0 }}
        />
    );
}

function GroupBlock({ group, depth = 0 }) {
    const reduced = usePrefersReducedMotion();
    const { t } = useTranslation();

    return (
        <li className="min-w-0">
            <motion.div
                initial={reduced ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={motionTransition(reduced, 0.5)}
                className="border border-border bg-bg p-5 sm:p-6"
            >
                <h3 className="font-display text-2xl text-text">
                    {group.institution.name}
                </h3>
                <span className="mt-3 block h-px w-10 bg-accent" aria-hidden="true" />
                {group.leaders?.length ? (
                    <>
                        {depth === 0 ? <Connector reduced={reduced} /> : null}
                        <ul
                            className={cx(
                                'mt-4 flex flex-wrap justify-center gap-4',
                                depth > 0 && 'mt-6',
                            )}
                        >
                            {group.leaders.map((leader) => (
                                <li key={leader.id}>
                                    <LeaderCard leader={leader} />
                                </li>
                            ))}
                        </ul>
                    </>
                ) : (
                    <p className="mt-4 text-sm text-muted">
                        {t('leadership.emptyLeaders')}
                    </p>
                )}
            </motion.div>

            {group.children?.length ? (
                <>
                    <Connector reduced={reduced} />
                    <ul className="mt-2 grid gap-6 lg:grid-cols-2">
                        {group.children.map((child) => (
                            <GroupBlock
                                key={child.institution.id}
                                group={child}
                                depth={depth + 1}
                            />
                        ))}
                    </ul>
                </>
            ) : null}
        </li>
    );
}

export default function OrgChart({ groups }) {
    if (!groups?.length) {
        return null;
    }

    return (
        <ul data-testid="org-chart" className="space-y-10">
            {groups.map((group) => (
                <GroupBlock key={group.institution.id} group={group} />
            ))}
        </ul>
    );
}
