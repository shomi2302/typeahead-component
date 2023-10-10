import { Box, Checkbox, Chip, CircularProgress, List, Paper, TextField, Typography } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';
import { get } from '../utils/utils';
import { State } from '../types';
import { useDebounce } from '../utils/useDebounce';
import { toast } from 'react-toastify';
import { useClickOutside } from '../utils/useClickOutside';


type Props = {
    placeholder?: string;
    onSelect?: (selected: string[]) => void;
}
const Typeahead: React.FC<Props> = ({ placeholder = 'Search states...', onSelect }) => {
    const [input, setInput] = useState<string>('');
    const [suggestions, setSuggestions] = useState<State[]>([]);
    const [selected, setSelected] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isOpened, setIsOpened] = useState<boolean>(false);
    const debouncedInput = useDebounce(input, 300);

    const ref = useRef<HTMLDivElement>(null);
    useClickOutside(ref, isOpened, () => setIsOpened(false));

    useEffect(() => {
        if (debouncedInput) {
            setIsOpened(true);
            setLoading(true);
            get<State>(`states?q=${debouncedInput}&_limit=5`)
                .then(data => setSuggestions(data))
                .catch(() => toast("Error fetching data...", { type: "error" }))
                .finally(() => setLoading(false));
        }
    }, [debouncedInput]);

    const handleSuggestionClick = (suggestion: State) => {
        setInput('');
        setSelected((currState) => {
            if (currState.includes(suggestion.name)) {
                return currState.filter(state => state !== suggestion.name);
            }
            return [...currState, suggestion.name];
        });
    };

    const removeSelected = (state: string) => () => {
        setSelected(selected.filter(s => s !== state));
    }

    const removeAll = () => {
        setSelected([]);
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && input === "") {
            setSelected((currState) => currState.slice(0, currState.length - 1));
        }
    }

    useEffect(() => {
        if (onSelect) onSelect(selected);
    }, [onSelect, selected]);

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
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    sx={{ width: '100%' }}
                    variant="standard"
                    InputProps={{ disableUnderline: true }}
                    onKeyDown={onKeyDown}
                />
            </Box>
            {suggestions.length > 0 && isOpened && (
                <Box ref={ref} sx={{ position: 'absolute', top: 80, zIndex: 2 }}>
                    <Paper elevation={3} sx={{ width: 600 }}>
                        <List>
                            {loading ?
                                <Box sx={{ height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <CircularProgress />
                                </Box>
                                : suggestions.map(suggestion => (
                                    <Box key={suggestion.id}
                                        sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                    >
                                        <Checkbox
                                            checked={selected.includes(suggestion.name)}
                                        />
                                        <Typography>
                                            {suggestion.name}
                                        </Typography>
                                    </Box>
                                ))}
                        </List>
                    </Paper>
                </Box>
            )}
        </Box>
    );
}

export default Typeahead;
