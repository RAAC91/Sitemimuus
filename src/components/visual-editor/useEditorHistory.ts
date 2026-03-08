
import { useState, useEffect, useRef } from 'react';
import { HistoryState } from './constants';

export const useEditorHistory = (currentState: HistoryState) => {
    const [history, setHistory] = useState<HistoryState[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const isTimeTraveling = useRef(false);
    const lastPushedState = useRef<string>('');

    useEffect(() => {
        if (isTimeTraveling.current) return;

        const timer = setTimeout(() => {
            const stateStr = JSON.stringify(currentState);
            if (stateStr === lastPushedState.current) return;

            setHistory(prev => {
                const newHistory = prev.slice(0, historyIndex + 1);
                return [...newHistory, currentState];
            });

            setHistoryIndex(prev => prev + 1);
            lastPushedState.current = stateStr;
        }, 400); // Slightly faster debounce

        return () => clearTimeout(timer);
    }, [currentState, historyIndex]);

    const undo = (applyState: (state: HistoryState) => void) => {
        if (historyIndex > 0) {
            isTimeTraveling.current = true;
            const prevIndex = historyIndex - 1;
            const prevState = history[prevIndex];
            lastPushedState.current = JSON.stringify(prevState);
            applyState(prevState);
            setHistoryIndex(prevIndex);
            setTimeout(() => { isTimeTraveling.current = false; }, 150);
        }
    };

    const redo = (applyState: (state: HistoryState) => void) => {
        if (historyIndex < history.length - 1) {
            isTimeTraveling.current = true;
            const nextIndex = historyIndex + 1;
            const nextState = history[nextIndex];
            lastPushedState.current = JSON.stringify(nextState);
            applyState(nextState);
            setHistoryIndex(nextIndex);
            setTimeout(() => { isTimeTraveling.current = false; }, 150);
        }
    };

    const clearHistory = () => {
        setHistory([]);
        setHistoryIndex(-1);
        lastPushedState.current = '';
    };

    return { undo, redo, clearHistory, canUndo: historyIndex > 0, canRedo: historyIndex < history.length - 1 };
};
