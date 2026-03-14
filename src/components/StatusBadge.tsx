import { TestRun } from '@/types/nova';

export default function StatusBadge({ status }: { status: TestRun['status'] }) {
    const styles = {
        running: 'bg-blue-500/15 text-blue-400',
        completed: 'bg-emerald-500/15 text-emerald-400',
        failed: 'bg-rose-500/15 text-rose-400',
    };

    return (
        <span className={`px-2 py-0.5 rounded text-xs font-mono ${styles[status]}`}>
            {status === 'running' && (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 mr-1.5 animate-pulse" />
            )}
            {status}
        </span>
    );
}
