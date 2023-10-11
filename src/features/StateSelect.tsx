import { toast } from 'react-toastify';
import { Box, Button } from '@mui/material';
import { FC, useEffect, useRef, useState, KeyboardEvent } from 'react';
import Typeahead from '../components/Typeahead';
import { get } from '../utils/api';
import { useClickOutside } from '../hooks/useClickOutside';
import { TypeaheadOption } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import { getLocalStorageData, setLocalStorageData } from '../utils/storage';

const StateSelect: FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [suggestions, setSuggestions] = useState<TypeaheadOption[]>([]);
    const [selected, setSelected] = useState<string[]>([]);
    const [isDropdownOpened, setIsDropdownOpened] = useState<boolean>(false);

    const [input, setInput] = useState<string>('');
    const debouncedInput = useDebounce(input, 300);

    const ref = useRef<HTMLDivElement>(null);
    useClickOutside(ref, isDropdownOpened, () => setIsDropdownOpened(false));

    // Fetch suggestions
    useEffect(() => {
        if (debouncedInput) {
            setIsDropdownOpened(true);
            setLoading(true);
            const localData = getLocalStorageData("states", []);
            if (localData.find(item => item.query === debouncedInput)) {
                setSuggestions(localData.find(item => item.query === debouncedInput)?.states || []);
                setLoading(false);
            } else {
                get<TypeaheadOption>(`states?q=${debouncedInput}&_limit=10`)
                    .then(data => {
                        setSuggestions(data);
                        setLocalStorageData("states", [
                            ...localData,
                            {
                                query: debouncedInput,
                                states: data
                            }
                        ])

                    })
                    .catch(() => toast("Error fetching data...", { type: "error" }))
                    .finally(() => setLoading(false));
            }
        }
    }, [debouncedInput]);

    // Handle suggestion click
    const handleSuggestionClick = (suggestion: TypeaheadOption) => {
        setInput('');
        setSelected((currState) => {
            if (currState.includes(suggestion.name)) {
                return currState.filter(state => state !== suggestion.name);
            }
            return [...currState, suggestion.name];
        });
    };

    // Remove selected state
    const removeSelected = (state: string) => () => {
        setSelected(selected.filter(s => s !== state));
    }

    // Remove all selected states
    const removeAll = () => {
        setSelected([]);
    }

    // Remove last selected state on backspace
    const handleBackspace  = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && input === "") {
            setSelected((currState) => currState.slice(0, currState.length - 1));
        }
    }

    // Submit selected states
    const onSubmit = () => {
        toast(`States selected: ${selected.join(", ")}`, { type: "success" });
    }

  return (
    <div className="App">
      <Box sx={{ width: '100%', height: '100%' }}>
        <Box sx={{ width: '500px', height: '400px', margin: '300px auto 0', display: 'flex', flexDirection: 'column' }}>
          <Typeahead 
            value={input}
            isDropdownOpened={isDropdownOpened}
            selected={selected}
            suggestions={suggestions}
            loading={loading}
            onKeyDown={handleBackspace}
            removeSelected={removeSelected}
            removeAll={removeAll}
            setIsDropdownOpened={setIsDropdownOpened}
            handleItemClick={handleSuggestionClick}
            setInput={setInput}
          />
          <Button disabled={selected.length === 0} onClick={onSubmit} sx={{ width: 150, mt: 3, ml: 'auto' }} variant="contained" color="primary">Submit</Button>
        </Box>
      </Box>
    </div>
  );
}

export default StateSelect;
