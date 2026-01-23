import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { GitHubDataManager } from '../GitHubDataManager';

describe('GitHubDataManager', () => {
  it('should fetch repos when user enters username', async () => {
    const user = userEvent.setup();
    const onDataReady = vi.fn();

    render(<GitHubDataManager onDataReady={onDataReady} />);

    const input = screen.getByPlaceholderText(/username/i);
    const button = screen.getByRole('button', { name: /fetch/i });

    await user.type(input, 'testuser');
    await user.click(button);

    await waitFor(() => {
      expect(onDataReady).toHaveBeenCalled();
    });
  });
});
