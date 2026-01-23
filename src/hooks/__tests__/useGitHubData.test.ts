import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useGitHubData } from '../useGitHubData';

describe('useGitHubData', () => {
  it('should return 100 repos from mock mode', async () => {
    const { result } = renderHook(() => useGitHubData());

    let data: Awaited<ReturnType<typeof result.current.fetchRepos>>;

    await act(async () => {
      data = await result.current.fetchRepos('testuser', false);
    });

    expect(data).toHaveLength(100);
  });

  it('should cache fetched data', async () => {
    const { result } = renderHook(() => useGitHubData());

    let data1: typeof result.current.fetchRepos;

    await act(async () => {
      data1 = await result.current.fetchRepos('testuser', false);
    });

    expect(data1).toHaveLength(100);

    // Second fetch should return cached data
    let data2: typeof result.current.fetchRepos;

    await act(async () => {
      data2 = await result.current.fetchRepos('testuser', false);
    });

    expect(data2).toEqual(data1);
  });
});
