import { usePage } from '@inertiajs/react';
import { useId } from 'react';

function errorAt(errors, name) {
    return errors?.[name] ?? name.split('.').reduce((value, key) => value?.[key], errors);
}

export default function FormField({ label, name, as: Component = 'input', error, children, className = '', ...props }) {
    const pageErrors = usePage().props.errors ?? {};
    const message = error ?? errorAt(pageErrors, name);
    const fieldId = useId();
    const errorId = `${fieldId}-error`;
    const Tag = Component;
    return (
        <div className={`block ${className}`}>
            <label htmlFor={fieldId} className="admin-label">{label}</label>
            {children == null
                ? <Tag id={fieldId} name={name} aria-invalid={message ? true : undefined} aria-describedby={message ? errorId : undefined} className="admin-input mt-1" {...props} />
                : <Tag id={fieldId} name={name} aria-invalid={message ? true : undefined} aria-describedby={message ? errorId : undefined} className="admin-input mt-1" {...props}>{children}</Tag>}
            {message ? <span id={errorId} className="mt-1 block text-sm text-red-600 dark:text-red-400">{message}</span> : null}
        </div>
    );
}
