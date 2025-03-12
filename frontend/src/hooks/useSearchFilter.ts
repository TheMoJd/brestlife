import {useState, useMemo} from 'react';

/**
 * Hook générique pour gérer la recherche et les filtres
 * @param items Liste des éléments à filtrer
 * @param searchKeys Clés à utiliser pour la recherche textuelle
 * @returns {filteredItems, searchQuery, setSearchQuery}
 */
export function useSearchFilter<T>(items: T[], searchKeys: (keyof T)[]) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredItems = useMemo(() => {
        if (!searchQuery) return items;

        return items.filter((item) =>
            searchKeys.some((key) =>
                item[key]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [items, searchQuery]);

    return {filteredItems, searchQuery, setSearchQuery};
}
