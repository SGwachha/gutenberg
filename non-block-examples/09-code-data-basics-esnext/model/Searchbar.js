import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { SearchControl } from '@wordpress/components';

const Searchbar = () => {
    const [searchInput, setSearchInput] = useState('');

    return (
        <SearchControl
            label={__('Search posts')}
            value={searchInput}
            onChange={setSearchInput}
        />
    )
}

export default Searchbar