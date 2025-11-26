import {
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/modules/shared/components';

export const AccountsTableSkeleton = () => {
    return (
        <div className='space-y-4'>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className='w-[100px]'>
                            <Skeleton className='h-4 w-12' />
                        </TableHead>
                        <TableHead>
                            <Skeleton className='h-4 w-20' />
                        </TableHead>
                        <TableHead>
                            <Skeleton className='h-4 w-16' />
                        </TableHead>
                        <TableHead className='text-right'>
                            <Skeleton className='h-4 w-20 ml-auto' />
                        </TableHead>
                        <TableHead className='w-[50px]'>
                            <Skeleton className='h-4 w-8' />
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <Skeleton className='h-4 w-16' />
                            </TableCell>
                            <TableCell>
                                <Skeleton className='h-4 w-32' />
                            </TableCell>
                            <TableCell>
                                <Skeleton className='h-6 w-16 rounded-full' />
                            </TableCell>
                            <TableCell className='text-right'>
                                <Skeleton className='h-4 w-24 ml-auto' />
                            </TableCell>
                            <TableCell>
                                <Skeleton className='h-8 w-8 rounded' />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className='flex items-center justify-between'>
                <Skeleton className='h-4 w-40' />
                <div className='flex items-center gap-1'>
                    <Skeleton className='h-9 w-20' />
                    <Skeleton className='h-9 w-9' />
                    <Skeleton className='h-9 w-9' />
                    <Skeleton className='h-9 w-9' />
                    <Skeleton className='h-9 w-20' />
                </div>
            </div>
        </div>
    );
};