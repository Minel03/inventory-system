import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Unit, type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
    units: Unit[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Units of Measure',
        href: '/units',
    },
];

export default function Index({ units }: Props) {
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this unit? It can only be deleted if it is not used by any items.')) {
            destroy(`/units/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Units of Measure" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <Heading title="Units of Measure" description="Manage the units used for your inventory items (e.g., Boxes, Pieces)." />
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Available Units</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-6 rounded-lg border p-4 bg-muted/20">
                            <h4 className="text-sm font-medium mb-3 text-foreground">Add New Unit</h4>
                            <UnitForm />
                        </div>

                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors">
                                        <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">Name</th>
                                        <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">Abbreviation</th>
                                        <th className="text-muted-foreground h-12 px-4 text-right align-middle font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {units.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="p-4 text-center text-muted-foreground">
                                                No units found. Add your first unit above.
                                            </td>
                                        </tr>
                                    ) : (
                                        units.map((unit) => (
                                            <tr key={unit.id} className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors">
                                                <td className="p-4 align-middle font-medium">{unit.name}</td>
                                                <td className="p-4 align-middle font-mono">{unit.abbreviation}</td>
                                                <td className="p-4 text-right align-middle">
                                                    <div className="flex justify-end gap-2">
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                                                            onClick={() => handleDelete(unit.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

function UnitForm() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        abbreviation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/units', {
            onSuccess: () => reset(),
        });
    };

    return (
        <form onSubmit={submit} className="flex flex-wrap items-end gap-3">
            <div className="grid gap-1.5 flex-1 min-w-[200px]">
                <label htmlFor="unit-name" className="text-xs font-medium">Name (e.g. Box)</label>
                <input
                    id="unit-name"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="e.g. Piece"
                    required
                />
                {errors.name && <p className="text-[10px] text-red-500">{errors.name}</p>}
            </div>
            <div className="grid gap-1.5 w-32">
                <label htmlFor="unit-abbr" className="text-xs font-medium">Abbreviation</label>
                <input
                    id="unit-abbr"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={data.abbreviation}
                    onChange={(e) => setData('abbreviation', e.target.value)}
                    placeholder="e.g. pc"
                    required
                />
                {errors.abbreviation && <p className="text-[10px] text-red-500">{errors.abbreviation}</p>}
            </div>
            <Button type="submit" disabled={processing}>
                <Plus className="mr-2 h-4 w-4" />
                Add Unit
            </Button>
        </form>
    );
}
