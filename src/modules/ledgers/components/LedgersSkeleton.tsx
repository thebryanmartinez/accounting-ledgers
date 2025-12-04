import { Card, CardContent, CardFooter, CardHeader, Skeleton } from '@/modules/shared/components';

export const LedgersSkeleton = () => {
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {Array.from({ length: 8 }).map((_, index) => (
                <Card key={index} className='w-full max-w-sm'>
                    <CardHeader>
                        <Skeleton className='h-6 w-16 mb-2 rounded' />
                        <Skeleton className='h-8 w-3/4' />
                    </CardHeader>

                    <CardContent className='space-y-4'>
                        <div className='flex items-center justify-between'>
                            <Skeleton className='h-4 w-28' />
                            <Skeleton className='h-8 w-24' />
                        </div>

                        <hr />

                        <div className='grid grid-cols-2 gap-4'>
                            <div className='space-y-1'>
                                <Skeleton className='h-4 w-20' />
                                <Skeleton className='h-6 w-24' />
                            </div>

                            <div className='space-y-1'>
                                <Skeleton className='h-4 w-20' />
                                <Skeleton className='h-6 w-24' />
                            </div>
                        </div>

                        <hr />
                    </CardContent>

                    <CardFooter>
                        <Skeleton className='h-4 w-32' />
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
};
