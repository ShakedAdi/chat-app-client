import { useState, useEffect } from 'react';
import { type UserSummary, searchUsers } from '../api';
import { MIN_USER_SEARCH_LEN, USER_SEARCH_DEBOUNCE_MS } from '../constants';

export function useUserSearch() {
  const [input, setInput] = useState('');
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(false);

  const term = input.trim();
  const enabled = term.length >= MIN_USER_SEARCH_LEN;

  useEffect(() => {
    if (term.length < MIN_USER_SEARCH_LEN) return;

    let cancelled = false;

    const timer = setTimeout(() => {
      setLoading(true);
      void (async () => {
        try {
          const found = await searchUsers(term);
          if (!cancelled) setUsers(found);
        } catch {
          if (!cancelled) setUsers([]);
        } finally {
          if (!cancelled) setLoading(false);
        }
      })();
    }, USER_SEARCH_DEBOUNCE_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [term]);

  return { input, setInput, enabled, users, loading };
}
