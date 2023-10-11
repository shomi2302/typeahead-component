import { Box, Checkbox, Chip, CircularProgress, List, Paper, TextField, Typography } from '@mui/material';
import React, { useRef, KeyboardEvent } from 'react';
import { TypeaheadOption } from '../types';
import { useClickOutside } from '../hooks/useClickOutside';


type Props = {
    selected: string[];
    value: string;
    suggestions: TypeaheadOption[];
    loading: boolean;
    setInput: (value: string) => void;
    removeAll: () => void;
    removeSelected: (state: string) => () => void;
    handleItemClick: (suggestion: TypeaheadOption) => void;
    onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
    isDropdownOpened: boolean;
    setIsDropdownOpened: (value: boolean) => void;
    placeholder?: string;
}
const Typeahead: React.FC<Props> = ({ selected,
    isDropdownOpened, value, handleItemClick,
    setInput, setIsDropdownOpened, removeSelected,
    onKeyDown, suggestions, loading,
    removeAll, placeholder = 'Search states...'
}) => {

    const ref = useRef<HTMLDivElement>(null);
    useClickOutside(ref, isDropdownOpened, () => setIsDropdownOpened(false));


    return (
        <Box sx={{ width: "100%", position: 'relative' }}>
            <Typography sx={{ mb: 1 }}>Select state</Typography>
            <Box sx={{
                display: 'flex',
                gap: 1,
                alignItems: 'center',
                border: "1px solid #252525",
                width: '100%',
                padding: '5px 10px',
                borderRadius: 1,
                overflow: 'hidden',
                boxSizing: 'border-box'
            }}>
                {selected.length > 3 ?
                    <Box sx={{ minWidth: "fit-content" }} >
                        <Chip label={`${selected.length} items selected`} variant="outlined" onDelete={removeAll} />
                    </Box>
                    : selected.map(state => (
                        <Chip label={state} variant="outlined" onDelete={removeSelected(state)} />
                    ))}
                <TextField
                    value={value}
                    onChange={e => setInput(e.target.value)}
                    sx={{ width: '100%' }}
                    variant="standard"
                    InputProps={{ disableUnderline: true }}
                    onKeyDown={onKeyDown}
                    placeholder={selected.length === 0 ? placeholder : ''}
                />
            </Box>
            {isDropdownOpened && (
                <Box ref={ref} sx={{ position: 'absolute', top: 80, zIndex: 2 }}>
                    <Paper elevation={3} sx={{ width: 500 }}>
                        {suggestions.length > 0 ? <List>
                            {loading ?
                                <Box sx={{ height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <CircularProgress />
                                </Box>
                                : suggestions.map(suggestion => (
                                    <Box key={suggestion.id}
                                        sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                                        onClick={() => handleItemClick(suggestion)}
                                    >
                                        <Checkbox
                                            checked={selected.includes(suggestion.name)}
                                        />
                                        <Typography>
                                            {suggestion.name}
                                        </Typography>
                                    </Box>
                                ))}
                        </List> :
                            <Box>
                                <Typography sx={{ mt: 1, color: '#252525', padding: '10px' }}>No results found</Typography>
                            </Box>}
                    </Paper>
                </Box>
            )}
        </Box>
    );
}

export default Typeahead;
