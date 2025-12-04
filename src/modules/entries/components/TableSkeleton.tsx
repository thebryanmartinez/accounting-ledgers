import {
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/modules/shared/components';

export const EntriesTableSkeleton = () => {
    return (
        <div className='space-y-8'>
            {/* Show 2 skeleton month sections */}
            {Array.from({ length: 2 }).map((_, sectionIndex) => (
                <div key={sectionIndex} className='space-y-4'>
                    {/* Month heading skeleton */}
                    <Skeleton className='h-6 w-32' />

                    {/* Table skeleton */}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className='w-[100px]'>
                                    <Skeleton className='h-4 w-16' />
                                </TableHead>
                                <TableHead>
                                    <Skeleton className='h-4 w-20' />
                                </TableHead>
                                <TableHead>
                                    <Skeleton className='h-4 w-16' />
                                </TableHead>
                                <TableHead className='text-right'>
                                    <Skeleton className='h-4 w-16 ml-auto' />
                                </TableHead>
                                <TableHead className='text-right'>
                                    <Skeleton className='h-4 w-16 ml-auto' />
                                </TableHead>
                                <TableHead className='w-[50px]'>
                                    <Skeleton className='h-4 w-8' />
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array.from({ length: 3 }).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Skeleton className='h-4 w-20' />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className='h-4 w-24' />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className='h-4 w-40' />
                                    </TableCell>
                                    <TableCell className='text-right'>
                                        <Skeleton className='h-4 w-20 ml-auto' />
                                    </TableCell>
                                    <TableCell className='text-right'>
                                        <Skeleton className='h-4 w-20 ml-auto' />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className='h-8 w-8 rounded' />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ))}
        </div>
    );
};