import { Skeleton } from '@/modules/shared/components';

export const SkeletonCard = () => {
    return (
        <div className='flex flex-col space-y-3'>
            <Skeleton className='h-[180px] w-full md:min-w-[350px] rounded-xl' />
        </div>
    );
};
